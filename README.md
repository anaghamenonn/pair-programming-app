# Pair Programming Prototype — Real-Time Collaborative Editor

A lightweight prototype of a live collaborative coding environment featuring:

🔄 Real-time shared editor using WebSockets

🤖 Mock autocomplete AI suggestion system

🧩 Multi-client syncing

🎨 Dynamic UI with light/dark theme

🌐 Fully deployed frontend (Vercel) + backend (Render)

## Tech Stack
| Area | Technology |
|----------|----------|
| Frontend | React, TypeScript, Tailwind CSS, Redux Toolkit |
| Backend | FastAPI, WebSockets, REST API |
| Database | PostgreSQL |
| Deployment | Vercel (Frontend) + Render (Backend) |

## Features
- Create unique rooms
- Share room link with others
- Multi-user live collaboration
- autocomplete suggestions
- Ghost text preview + keyboard acceptance (Enter/Tab)
- Theme toggle
- Connection status indicators

## Live Links

| Component | URL |
|----------|------|
| Frontend | 🔗 [frontend-url](https://pair-programming-app-mu.vercel.app/) |
| Backend API | 🔗 [backend-url](https://pair-programming-app-61e6.onrender.com/) |


## Run Locally
1️. Clone the Repository
```
git clone https://github.com/anaghamenonn/pair-programming-app.git
cd pair-programming-app
```
2️. Backend Setup
```
cd backend
pip install -r requirements.txt
```
Start backend:
```
uvicorn app.main:app --reload
```
Add .env:
```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<db-name>
```
3️. Frontend Setup
```
cd frontend
npm install
```
Create .env.local in /frontend:
```
REACT_APP_API_URL=http://localhost:8000
REACT_APP_WS_URL=ws://localhost:8000
```
Run:
```
npm start
```
✔ Now open:
- http://localhost:3000
- Create a room
- Copy the link into multiple windows to test collaboration

## Author

Anagha P H
anaghamenon7373@gmail.com
