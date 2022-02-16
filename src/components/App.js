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
import GlobalStyle from "../globalStyles";
import { Helmet } from "react-helmet";

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

        // change color scheme via app menu
        ipcRenderer.on("colorScheme", () => {
            console.log("Yay")
            if (mode.style === "light") {
                toggleMode("Dark");
            }
            else {
                toggleMode("Light");
            }
        });

        // go to IPC test page via app menu
        ipcRenderer.on("ipcTest", () => {
            navigate("/ipcTest");
        })
   }, []);

  return (
    // wherever mode will be set, pass down the toggleMode function!
      <ThemeProvider theme={mode}>
          <GlobalStyle/>
          <Helmet>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
            <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Source+Sans+Pro:wght@400;600;700&display=fallback" rel="stylesheet"/>
          </Helmet>
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
      </ThemeProvider>
  )
}

export default App;
