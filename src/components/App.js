import React, { useState, useEffect } from 'react';
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
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme } from "../themes";
import styled from 'styled-components';

function App() {
  const navigate = useNavigate();

   // access this in other places using withTheme()
   const [mode, setMode] = useState(lightTheme);

   // prop func sent down to set new mode in both state and local storage
   const toggleMode = newMode => {
       if (newMode === "Light") {
           setMode(lightTheme);
       }
       if (newMode === "Dark") {
           setMode(darkTheme);
       }
       if (typeof window !== "undefined") {
           localStorage.setItem("mode", newMode);
       }
   };

   // get previous mode (if any) from local storage
   useEffect(() => {
       if (
           typeof window !== "undefined" &&
           localStorage.getItem("mode") !== null
       ) {
           const mode = localStorage.getItem("mode");
           if (mode === "Light") {
               setMode(lightTheme);
           }
           if (mode === "Dark") {
               setMode(darkTheme);
           }
       }
   }, []);

  ipcRenderer.on("ipcTest", () => {
    navigate("/ipcTest");
  })

  return (
    // wherever mode will be set, pass down the toggleMode function!
      <ThemeProvider theme={mode}>
        <GlobalStyles>
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
        </GlobalStyles>
      </ThemeProvider>
  )
}

const GlobalStyles = styled.div`
  color: ${props => props.theme.text};
  font-family: "Cairo";
`;

export default App;
