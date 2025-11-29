from sqlalchemy import Column, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Room(Base):
    __tablename__ = "rooms"
    room_id = Column(String(64), primary_key=True, index=True)
    code = Column(Text, nullable=True, default="")
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
