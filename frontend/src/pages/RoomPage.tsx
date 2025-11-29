import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCode, toggleTheme, setTypingUser } from "../features/room/roomSlice";
import { RootState } from "../store";
import CodeEditor from "../components/Editor";
import { 
  FiMoon, FiSun, FiCopy, FiCheckCircle, FiWifi, FiWifiOff 
} from "react-icons/fi";

export default function RoomPage() {
  const { roomId } = useParams<{ roomId: string }>();
  const dispatch = useDispatch();
  const { isDarkTheme, typingUsers } = useSelector((s: RootState) => s.room);
  
  const wsRef = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!roomId) return;
    const ws = new WebSocket(`ws://localhost:8000/ws/${roomId}`);
    
    ws.onopen = () => setConnected(true);
    ws.onclose = () => setConnected(false);
    
    ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (data.type === "init" || data.type === "code_update") {
          dispatch(setCode(data.code || ""));
        } else if (data.type === "typing") {
          dispatch(setTypingUser({ user: "Collaborator", isTyping: true }));
          setTimeout(() => {
             dispatch(setTypingUser({ user: "Collaborator", isTyping: false }));
          }, 2000);
        }
      } catch (e) { console.error(e); }
    };

    wsRef.current = ws;
    return () => { ws.close(); };
  }, [roomId, dispatch]);

  const handleTyping = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
       const currentState = require("../store").store.getState().room.code; 
       wsRef.current.send(JSON.stringify({ type: "code_update", code: currentState }));
       wsRef.current.send(JSON.stringify({ type: "typing" }));
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex flex-col h-screen w-screen transition-colors duration-300 ${isDarkTheme ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'}`}>
      
      <header className={`h-16 flex items-center justify-between px-6 border-b ${isDarkTheme ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'} shadow-sm z-10`}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <h1 className="font-bold text-lg tracking-tight">CodeRoom</h1>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-mono border ${isDarkTheme ? 'bg-gray-700 border-gray-600' : 'bg-gray-200 border-gray-300'}`}>
            ID: {roomId}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {typingUsers.length > 0 && (
             <span className="text-xs text-blue-400 italic animate-pulse mr-4">
               Collaborator is typing...
             </span>
          )}

          <button 
            onClick={copyToClipboard}
            className={`p-2 rounded-md hover:bg-opacity-80 transition flex items-center gap-2 text-sm ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
            title="Copy Room Link"
          >
            {copied ? <FiCheckCircle className="text-green-500" /> : <FiCopy />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
          </button>

          <div className={`h-6 w-px ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-300'}`}></div>

          <button 
            onClick={() => dispatch(toggleTheme())}
            className={`p-2 rounded-full transition ${isDarkTheme ? 'hover:bg-gray-700 text-yellow-400' : 'hover:bg-gray-200 text-gray-600'}`}
          >
            {isDarkTheme ? <FiSun /> : <FiMoon />}
          </button>
          
          <div title={connected ? "Connected" : "Disconnected"}>
             {connected ? <FiWifi className="text-green-500" /> : <FiWifiOff className="text-red-500" />}
          </div>
        </div>
      </header>

      <main className="flex flex-col flex-1 overflow-hidden">
  <div className="flex-1 overflow-auto">
      <CodeEditor onType={handleTyping} />
  </div>
</main>

      
      <footer className={`h-6 text-[10px] flex items-center px-4 justify-between select-none ${isDarkTheme ? 'bg-blue-600 text-white' : 'bg-blue-500 text-white'}`}>
        <span>Python 3.10</span>
        <span>Spaces: 4</span>
      </footer>
    </div>
  );
}