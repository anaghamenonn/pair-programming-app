from pydantic import BaseModel
from typing import Optional

class CreateRoomResponse(BaseModel):
    roomId: str

class AutocompleteRequest(BaseModel):
    code: str
    cursorPosition: int
    language: str

class AutocompleteResponse(BaseModel):
    suggestion: str

class CodeUpdateMessage(BaseModel):
    type: str   # "code_update"
    code: str
    origin: Optional[str] = None
