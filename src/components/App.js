import React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import '../App.css'
import { ipcRenderer } from "electron";
import IPCTest from "./IPCTest";
import Welcome from "./Welcome";
import Connect from "./Connect";
import Player from "./Player";
import HostPanel from "./HostPanel";
import Volume from "./Volume";
import Queue from "./Queue";
import Search from "./Search";

function App() {
  const navigate = useNavigate();

  ipcRenderer.on("ipcTest", () => {
    navigate("/ipcTest");
  })

  return (
      <Routes>
        <Route exact path="/" element={<Welcome/>}/>
        <Route exact path="/connect" element={<Connect/>}/>
        <Route exact path="/player" element={<Player/>}/>
        <Route exact path="/host" element={<HostPanel/>}/>
        <Route exact path="/volume" element={<Volume/>}/>
        <Route exact path="/queue" element={<Queue/>}/>
        <Route exact path="/search" element={<Search/>}/>
        <Route exact path="/ipcTest" element={<IPCTest/>}/>
      </Routes>
  )
}

export default App
