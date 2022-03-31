import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { ipcRenderer } from 'electron';
import { Input } from "@mui/material";
import searchBlack from "../assets/icons/searchBlack.svg";
import searchWhite from "../assets/icons/searchWhite.svg";
import addBlack from "../assets/icons/addBlack.svg";
import addWhite from "../assets/icons/addWhite.svg";
import play from "../assets/icons/play.svg";

const Search = () => {
  const theme = useTheme();

  // search results
  const [res, setRes] = useState([]);
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
  }

  const handleAdd = (song) => {
    ipcRenderer.send("queue:add", {song});
  }

  const handlePlay = (song) => {
    ipcRenderer.send("currentSong:change", ({song, newTime: 0}));
    ipcRenderer.send("search:start");
  }

  // init ipc listener
  useEffect(() => {
    ipcRenderer.on("search:res", (e, data) => {
      setRes(data.res);
    })
  }, []);

  // send ipc message each time query state is modified
  useEffect(() => {
    if (query !== "") {
      ipcRenderer.send("search", {query});
    }
    else {
      setRes([]);
    }
  }, [query]);

  return (
    <Wrapper>
      <div className="search-bar">
        <Input onChange={handleSearch} placeholder="Search Spotify"/>
        <img draggable={false} src={theme.style === "light" ? searchBlack : searchWhite} alt="Search"/>
      </div>
      <div className="results">
        {/* If songs were found by the search */}
        {res.length !== 0 ? res.map((song) => {
          return (
            <div className="song" key={song.id}>
              {/* use 64x64 album art */}
              <div className="album-art-container" onClick={() => handlePlay(song)}>
                <img className="album-art-play" src={play} alt="Play"/>
                <img draggable={false} className="album-art" src={song.albumArt[1]} alt={song.album}/>
              </div>
              <div className="song-info">
                <span>{song.title}</span>
                <span>{song.artists[0]}</span>
              </div>
              <a className="add" onClick={() => handleAdd(song)}>
                <img draggable={false} src={theme.style === "light" ? addBlack : addWhite} alt="Add"/>
              </a>
            </div>
          )
        }) : (
          /* If no songs were found by the search */
          <div className="no-results">
            <p>No results found for your current search.</p>
          </div>
        )}
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  user-select: none;
  
  .song {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 62px;
    padding: 0 15px;
    transition: 0.15s;

    &:hover {
      background-color: ${props => props.theme.searchQueueItemBkg};
    }

    .song-info {
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column;
      text-align: left;
      width: 75%;
      line-height: 1.5;

      & span {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      & span:last-child {
        opacity: 0.6;
      }
    }

    .album-art {
      height: 48px;
      width: 48px;
    }

    .album-art-container:hover::after {
      opacity: 0.55;
      cursor: pointer;
    }

    .album-art-container:hover > .album-art-play {
        opacity: 1;
    }

    .album-art-container {
      height: 48px;
      width: 48px;
      position: relative;
    }

    .album-art-play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0;
      width: 28px;
      height: 28px;
      transition: 0.15s;
      z-index: 5;
      cursor: pointer;
    }

    .album-art-container::after {
      content: "";
      z-index: 2;
      height: 48px;
      width: 48px;
      left: 0;
      top: 0;
      position: absolute;
      background-color: #000;
      opacity: 0;
      transition: 0.15s;
      cursor: pointer;
    }

    /* plus button */
    .add {
      width: 25px;
      cursor: pointer;
      transform: translateY(3px);
    }

    .add:hover::after {
      opacity: 1;
    }

    .add:hover .album-art-container::after {
      opacity: 0;
    }

    .add:hover .album-art-container > .album-art-play {
      opacity: 0;
    }

    .add::after {
      content: "";
      z-index: -1;
      height: 28px;
      width: 28px;
      left: 0;
      top: 0;
      position: absolute;
      background-color: ${props => props.theme.searchQueueItemBkgHover};
      opacity: 0;
      transition: 0.15s;
      border-radius: 100px;
      transform: translate(-4px, -2px);
    }

    .add img {
      height: 20px;
      width: 20px;
    }
  }

  .no-results {
    text-align: center;
  }

  .search-bar {
    height: 60px;
    padding: 10px 15px 0;
    position: relative;

    img {
      position: absolute;
      right: 18px;
      top: 50%;
      transform: translateY(-50%);
    }

    /* Lots of MUI overrides */
    & .MuiInput-root {
      height: 40px;
      transform: translateY(5px);
      width: 100%;
      border: ${props => props.theme.text};
      color: ${props => props.theme.text};
    }
    
    & .Mui-focused::after {
      border: ${props => props.theme.text};
    }

    & .Mui-focused {
      border: ${props => props.theme.text};
    }

    & .MuiInput-underline::after {
      border: ${props => props.theme.text};
    }

    & .MuiInput-underline::before {
      transition: 0.15s;
    }

    & .MuiInput-underline:hover:not(.Mui-disabled)::before {
      border-bottom: 2px solid ${props => props.theme.text};
      opacity: 0.8;
    }

    & .MuiInput-underline::before {
      border-bottom: 2px solid ${props => props.theme.text};
      opacity: 0.5;
    }
  }
`;

export default Search;
