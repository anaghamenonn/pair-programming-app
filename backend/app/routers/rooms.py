from fastapi import APIRouter, status, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
import uuid
from app.services.room_manager import room_manager
from app.core import engine
from app.models import Base, Room

router = APIRouter()

Base.metadata.create_all(bind=engine)

class CreateRoomResponse(BaseModel):
    roomId: str

@router.post("/rooms", response_model=CreateRoomResponse)
async def create_room():
    room_id = uuid.uuid4().hex[:8]
    room_manager.create_room_in_db(room_id)
    return {"roomId": room_id}

@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await room_manager.connect(room_id, websocket)
    room = room_manager.get_room_from_db(room_id)
    if room and room.code:
        await websocket.send_json({"type":"init", "code": room.code})
    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type")
            if msg_type == "code_update":
                code = data.get("code", "")
                room_manager.save_code_to_db(room_id, code)
                await room_manager.broadcast(room_id, {"type":"code_update","code":code}, sender=websocket)
            else:
                await websocket.send_json({"type":"error","detail":"unknown message type"})
    except WebSocketDisconnect:
        room_manager.disconnect(room_id, websocket)
