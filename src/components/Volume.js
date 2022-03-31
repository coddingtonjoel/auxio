import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Slider from "@mui/material/Slider";
import volumeDown from "../assets/icons/volume-down.svg";
import volumeUp from "../assets/icons/volume-up.svg";
import { ipcRenderer } from 'electron';

const Volume = () => {
  const [volume, setVolume] = useState(50);

  useEffect(() => {
    
  }, [volume])

  useEffect(() => {
    ipcRenderer.once("volume:fetch", (e, data) => {
      setVolume(data.volume);
    })
  })

  const sendVolume = (val) => {
    ipcRenderer.send("volume:change", {volume: val});
  }

  return (
    <Wrapper>
      <Slider
            className="slider"
            size="small"
            min={0}
            step={1}
            value={volume}
            max={100}
            aria-label="Small"
            valueLabelDisplay="off"
            onChange={(_, val) => {setVolume(val)}}
            onChangeCommitted={(_, val) =>  {sendVolume(val)}}
            // MUI slider style overrides
            sx={{
              color: "#fff",
              height: 4,
              "& .MuiSlider-thumb": {
                width: 8,
                height: 8,
                transition: "0.3s cubic-bezier(.47,1.64,.41,.8)",
                "&:before": {
                  boxShadow: "0 2px 12px 0 rgba(0,0,0,0.4)",
                },
                "&:hover, &.Mui-focusVisible": {
                  boxShadow: "rgb(255 255 255 / 16%)",
                },
                "&.Mui-active": {
                  width: 20,
                  height: 20,
                },
              },
              "& .MuiSlider-rail": {
                opacity: 0.28,
              },
            }}
          />
          <span className="volume-down"><img draggable={false} src={volumeDown} alt="Volume Down"/></span>
          <span className="volume-up"><img draggable={false} src={volumeUp} alt="Volume Up"/></span>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  background-color: ${props => props.theme.primary};
  height: 100vh;
  width: 100vw;
  user-select: none;

  .slider {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60vw;
  }

  .volume-down {
    position: absolute;
    left: 10px;
    top: 55%;
    transform: translateY(-50%);
  }

  .volume-up {
    position: absolute;
    right: 10px;
    top: 55%;
    transform: translateY(-50%);
  }
`;

export default Volume;
