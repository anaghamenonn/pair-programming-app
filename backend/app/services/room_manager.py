import asyncio
from typing import Dict, Set
from fastapi import WebSocket
from sqlalchemy.orm import Session
from app.models import Room
from app.core import SessionLocal
from concurrent.futures import ThreadPoolExecutor
import uuid

executor = ThreadPoolExecutor(max_workers=5)

class RoomManager:
    def __init__(self):
        self.rooms: Dict[str, Set[WebSocket]] = {}

    async def connect(self, room_id: str, websocket: WebSocket):
        await websocket.accept()
        conns = self.rooms.setdefault(room_id, set())
        conns.add(websocket)

    def disconnect(self, room_id: str, websocket: WebSocket):
        if room_id in self.rooms and websocket in self.rooms[room_id]:
            self.rooms[room_id].remove(websocket)
            if not self.rooms[room_id]:
                del self.rooms[room_id]

    async def broadcast(self, room_id: str, message: dict, sender: WebSocket = None):
        conns = list(self.rooms.get(room_id, []))
        for conn in conns:
            try:
                await conn.send_json(message)
            except Exception:
                self.disconnect(room_id, conn)

    def get_room_from_db(self, room_id: str):
        db: Session = SessionLocal()
        try:
            return db.query(Room).filter(Room.room_id == room_id).first()
        finally:
            db.close()

    def create_room_in_db(self, room_id: str):
        db: Session = SessionLocal()
        try:
            room = Room(room_id=room_id, code="")
            db.add(room)
            db.commit()
            return room
        finally:
            db.close()

    def save_code_to_db(self, room_id: str, code: str):
        db: Session = SessionLocal()
        try:
            room = db.query(Room).filter(Room.room_id == room_id).first()
            if room:
                room.code = code
                db.commit()
            else:
                room = Room(room_id=room_id, code=code)
                db.add(room)
                db.commit()
        finally:
            db.close()

room_manager = RoomManager()
