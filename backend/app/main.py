from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import rooms, autocomplete

app = FastAPI(title="PairProgramming Prototype")

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

allow_origins=["*"]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,      
    allow_credentials=True,
    allow_methods=["*"],        
    allow_headers=["*"],     
)

app.include_router(rooms.router)
app.include_router(autocomplete.router)
