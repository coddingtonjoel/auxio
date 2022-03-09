import React, { useEffect, useState } from "react";
import styled, { useTheme } from "styled-components";
import { ipcRenderer } from "electron";
import roomPreferences from "../assets/icons/room-preferences.svg";
import queueIcon from "../assets/icons/queue.svg";
import volumeIcon from "../assets/icons/volume-up.svg";
import searchIcon from "../assets/icons/search.svg";
import albumArtPlaceholder from "../assets/images/album-art-placeholder.png";
import spotifyIcon from "../assets/icons/spotify.svg";
import playIcon from "../assets/icons/play.svg";
import pauseIcon from "../assets/icons/pause.svg";
import prevIcon from "../assets/icons/previous.svg";
import nextIcon from "../assets/icons/skip.svg";
import songIcon from "../assets/icons/song.svg";
import artistIcon from "../assets/icons/person.svg";
import albumIcon from "../assets/icons/album.svg";
import Slider from "@mui/material/Slider";

// turn song from seconds into minutes
const formatDuration = (value) => {
  const minute = Math.floor(value / 60);
  const secondLeft = value - minute * 60;
  return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
}

const Player = () => {
  const theme = useTheme();

  useEffect(() => {
    ipcRenderer.send("windowSize:player");
  }, []);

  let isHost = true;

  const [slider, setSlider] = useState(0);
  const songLength = 200;

  // include React context for sessionDetails upon connecting to a session. Upon leaving, clear that context
  // Context is needed because Join.js and Player.js both use it and they're sibling components
  /* sessionDetails context obj:
    {
      sessionID: "SES-SION-CODE",
      isHost: false 
      currentSong: {
        // set default title, artist, and album to "-----" while loading?
        title: ...
        artist: ...
        album: ...
        albumArt: "",
        isPlaying: true,
        songLength: "4:22",
        placeInSong: "2:45",
        liked: false,
        disliked: false
      }
    }
  */

  return (
    <Wrapper>
      <span className="session-id">SES-SSION-CODE</span>
      <div className="control-buttons">
        {/* host panel is only available as a session host */}
        {isHost ? (
          <button>
            <img
              draggable={false}
              src={roomPreferences}
              alt="Room Preferences"
            />
          </button>
        ) : null}
        <button>
          <img draggable={false} src={queueIcon} alt="Queue" />
        </button>
        <button>
          <img draggable={false} src={searchIcon} alt="Search" />
        </button>
        <button>
          <img draggable={false} src={volumeIcon} alt="Volume" />
        </button>
      </div>
      <div className="content">
        {/* album art, song info, like/dislike buttons, prev/pause/next */}
        <div className="content-upper">
          <div className="album-art">
            {/* show album art placeholder while fetching art from backend --> API */}
            {/* show placeholder art if albumArt === "" <-- AKA it hasn't been fetched yet. Upon IPC message, set albumArt to the image link */}
            <img
              className="art"
              draggable={false}
              src={albumArtPlaceholder}
              alt="Placeholder Album Art"
            />
            <img
              className="spotify-icon"
              draggable={false}
              src={spotifyIcon}
              alt="Spotify Logo"
            />
          </div>
          <div className="info-control-container">
            <div className="song-info">
              <h3 className="title">
                <img draggable={false} src={songIcon} alt="Song" />
                Placeholder Title
              </h3>
              <h5 className="artist">
                <img draggable={false} src={artistIcon} alt="Artist" />
                Artist Name
              </h5>
              <p className="album">
                <img draggable={false} src={albumIcon} alt="Album" />
                Album Title
              </p>
            </div>
            <div className="song-controls">
              <button>
                <img draggable={false} src={prevIcon} alt="Previous" />
              </button>
              {/* conditionally change icon based on isPlaying state */}
              <button>
                <img draggable={false} src={playIcon} alt="Play" />
              </button>
              <button>
                <img draggable={false} src={nextIcon} alt="Next" />
              </button>
            </div>
          </div>
        </div>
        {/* volume slider and song length info */}
        <div className="content-lower">
          <Slider
            className="slider"
            size="small"
            min={0}
            step={1}
            value={slider}
            max={songLength}
            aria-label="Small"
            valueLabelDisplay="off"
            onChange={(_, val) => setSlider(val)}
            // MUI slider style overrides
            sx={{
              color: `${theme.style === "light" ? "#322f3d" : "#fff"}`,
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
          <span className="time-in">{formatDuration(slider)}</span>
          <span className="time-left">{formatDuration(songLength - slider)}</span>
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;

  .MuiSlider-thumb.Mui-focusVisible, .MuiSlider-thumb:hover {
    box-shadow:none !important;
  }

  .album-art {
    user-select: none;
  }

  .session-id {
    font-family: "Source Sans Pro";
    opacity: 0.2;
    font-weight: 700;
    user-select: none;
    position: absolute;
    top: 0;
    left: 0;
    font-size: 14px;
  }

  .control-buttons {
    position: absolute;
    top: 5px;
    right: 0px;

    button {
      height: 40px;
      width: 40px;
      outline: none;
      background-color: ${(props) => props.theme.primary};
      border: none;
      box-shadow: ${(props) => props.theme.boxShadow};
      margin: 0 4px;
      border-radius: 100%; 
      cursor: pointer;
      transition: 0.15s;
    }

    button:hover {
      background-color: ${(props) => props.theme.primaryHover};
    }

    button:active {
      background-color: ${(props) => props.theme.primaryActive};
    }

    img {
      user-select: none;
    }
  }

  .content {
    padding: 40px 20px 0;
  }
  .content-upper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 250px;

    .album-art {
      position: relative;
      height: 250px;
      width: 250px;

      .art {
        height: 250px;
        width: 250px;
        position: absolute;
        top: 0;
        left: 0;
        box-shadow: ${(props) => props.theme.boxShadow};
      }

      .spotify-icon {
        height: 25px;
        width: 25px;
        opacity: 0.7;
        position: absolute;
        bottom: 7px;
        left: 7px;
      }
    }

    .info-control-container {
      width: 310px;
      height: 100%;
      text-align: left;

      .song-info {
          .title, .artist, .album {
            height: 50px;
            user-select: none;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 300px;
            margin-bottom: -5px;

            img {
              margin-right: 8px;
            }
          }
            
          .title {
            font-size: 33px;
            
            img {
              transform: translateY(3px);
            }
          }

          .artist {
            font-size: 20px;
            font-weight: 400;
            transform: translateY(-10px);

            img {
              transform: translateY(5px);
            }
          }

          .album {
            font-size: 16px;
            margin-top: 20px;
            transform: translateY(-25px);

            img {
              transform: translateY(6px);
            }
          }
        }      
      }
    }

    .song-controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 310px;
      transform: translateY(-8px);

      button {
        width: 95px;
        height: 38px;
        background-color: #000;
        outline: none;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        transition: 0.15s;

        img {
          user-select: none;
        }

        &:hover {
          background-color: #222;
        }

        &:active {
          filter: brightness(2);
        }
      }
    }
    
    .content-lower {
      position: relative;
      user-select: none;
      margin-top: 35px;
      font-size: 14px;

      /* time in song */
      .time-in {
        position: absolute;
        left: -10px;
        top: 20px;
        opacity: 0.7;
      }

      /* time remaining in song */
      .time-left {
        position: absolute;
        right: -10px;
        top: 20px;
        opacity: 0.7;
      }
    }
  }
`;

export default Player;
