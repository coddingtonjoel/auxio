import React, { useState, useEffect, useCallback } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import "../App.css";
import { ipcRenderer } from "electron";
import IPCTest from "./IPCTest";
import Welcome from "./Welcome";
import Connect from "./Connect";
import Join from "./Join";
import Player from "./Player";
import HostPanel from "./HostPanel";
import Volume from "./Volume";
import Queue from "./Queue";
import Search from "./Search";
import styled, { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "../themes";
import GlobalStyle from "../globalStyles";
import { Helmet } from "react-helmet";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { WebPlaybackSDK } from "react-spotify-web-playback-sdk";
import { useIsMount } from "./useIsMount";

function App() {
  const navigate = useNavigate();
  const isMount = useIsMount();
  const location = useLocation();

  // access this in other places using withTheme()
  const [mode, setMode] = useState(lightTheme);
  const [token, setToken] = useState(null);
  
  const Temp = (props) => {
    console.log("TOKEN from Temp:" + props.token)
    const getOAuthToken = useCallback(callback => callback(props.token), []);
    if (props.token === null || typeof props.token === undefined) {
      return null;
    }
    useEffect(() => {
      console.log("TEMP: Token changed: ", props.token);
    }, props.token)
    return (
      <WebPlaybackSDK initialDeviceName="Auxio Player" getOAuthToken={getOAuthToken} volume={0.5} connectOnInitialized={false}>
        <Player token={props.token}/>
      </WebPlaybackSDK>
    )
  }

  // prop func sent down to set new mode in both state and local storage
  const toggleMode = (newMode) => {
    if (newMode === "Light") {
      setMode(lightTheme);
    }
    if (newMode === "Dark") {
      setMode(darkTheme);
    }
  };

  // get previous mode (if any) from local storage
  useEffect(() => {
    // TODO implement this in electron preferences, not in react
    // change color scheme via app menu
    ipcRenderer.on("colorScheme", (data, msg) => {
      console.log(msg.message);
      toggleMode(msg.message);
    });

    ipcRenderer.send("getSpotifyToken");

    ipcRenderer.on("getSpotifyToken:return", (e, data) => {
      console.log("Token received: " + data.token)
      setToken(data.token);
    })

    ipcRenderer.on("session:leave", () => {
      navigate("/connect");
      ipcRenderer.send("windowSize:welcome");
    })
  }, []);

  // go to IPC test page via app menu
  ipcRenderer.once("ipcTest", () => {
    navigate("/ipcTest");
  });

  return (
    // wherever mode will be set, pass down the toggleMode function!
    <ThemeProvider theme={mode}>
      <GlobalStyle />
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Source+Sans+Pro:wght@400;600;700&display=fallback"
          rel="stylesheet"
        />
      </Helmet>
      <TransitionGroup component={null}>
        <CSSTransition key={location.key} classNames="fade" timeout={300}>
          <Routes key={location}>
            <Route exact path="/" element={<Welcome />} />
            {/* <Route exact path="/" element={<Queue />} /> */}
            <Route exact path="/connect" element={<Connect />} />
            <Route exact path="/player" element={<div>{token !== null ? <Temp token={token}/> : null}</div>}/>
            <Route exact path="/join" element={<Join />} />
            <Route exact path="/host" element={<HostPanel />} />
            <Route exact path="/volume" element={<Volume />} />
            <Route exact path="/queue" element={<Queue />} />
            <Route exact path="/search" element={<Search />} />
            <Route exact path="/ipcTest" element={<IPCTest />} />
          </Routes>
        </CSSTransition>
      </TransitionGroup>
      <BottomBorder />
    </ThemeProvider>
  );
}

const BottomBorder = styled.div`
  background-color: ${(props) => props.theme.primary};
  width: 100vw;
  height: 12px;
  position: absolute;
  bottom: 0;
  left: 0;
`;

export default App;
