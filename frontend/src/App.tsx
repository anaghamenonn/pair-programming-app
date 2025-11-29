import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateRoom from "./pages/CreateRoom";
import RoomPage from "./pages/RoomPage";
import { Provider } from "react-redux";
import { store } from "./store";

function App(){
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CreateRoom/>} />
          <Route path="/room/:roomId" element={<RoomPage/>} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
