import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ipcRenderer } from "electron";

const Player = () => {
  useEffect(() => {
    ipcRenderer.send("windowSize:player");
  }, []);

  return <div>Player</div>;
};

export default Player;
