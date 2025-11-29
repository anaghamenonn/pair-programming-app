import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const createRoom = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/rooms");
      navigate(`/room/${res.data.roomId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-bold">Pair Programming Prototype</h1>
      <button 
        onClick={createRoom}
        disabled={loading}
        className="px-6 py-3 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        {loading ? "Creating..." : "Create New Room"}
      </button>
    </div>
  );
}
