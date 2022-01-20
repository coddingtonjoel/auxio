import React from 'react';
import { Route, Routes, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import '../App.css'
import { ipcRenderer } from "electron";
import IPCTest from "./IPCTest";

function App() {
  const navigate = useNavigate();

  ipcRenderer.on("ipcTest", () => {
    navigate("/ipcTest");
  })

  return (
      <Routes>
        <Route exact path="/" element={
          <div>
            <h1>Welcome to Auxio!</h1>
            <p>I hope you enjoy using basic-electron-react-boilerplate to start your dev off right!</p>
          </div>
        }>
        </Route>
        <Route exact path="/ipcTest" element={<IPCTest/>}/>
      </Routes>
  )
}

export default App
