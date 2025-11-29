from fastapi import APIRouter
from app.schemas import AutocompleteRequest, AutocompleteResponse
from app.services.autocomplete_service import generate_suggestion

router = APIRouter()

@router.post("/autocomplete", response_model=AutocompleteResponse)
async def autocomplete(req: AutocompleteRequest):
    code = req.code or ""
    cursor = req.cursorPosition if req.cursorPosition is not None else len(code)
    suggestion = generate_suggestion(code, cursor)
    return {"suggestion": suggestion}
