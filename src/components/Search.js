import React, { useState, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import { ipcRenderer } from 'electron';
import { Input } from "@mui/material";
import searchBlack from "../assets/icons/searchBlack.svg";
import searchWhite from "../assets/icons/searchWhite.svg";
import addBlack from "../assets/icons/addBlack.svg";
import addWhite from "../assets/icons/addWhite.svg";

const Search = () => {
  const theme = useTheme();

  // search results
  const [res, setRes] = useState([]);
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    setQuery(e.target.value);
  }

  const handleAdd = (song) => {
    ipcRenderer.send("queue", {song});
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
        <img src={theme.style === "light" ? searchBlack : searchWhite} alt="Search"/>
      </div>
      <div className="results">
        {/* If songs were found by the search */}
        {res.length !== 0 ? res.map((song) => {
          return (
            <div className="song" key={song.id}>
              <img className="album-art" src={song.albumArt} alt={song.album}/>
              <div className="song-info">
                <span>{song.title}</span>
                <span>{song.artists[0]}</span>
              </div>
              <a onClick={() => handleAdd(song)}>
                <img src={theme.style === "light" ? addBlack : addWhite} alt="Add"/>
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
  .song {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 58px;
    padding: 0 15px;

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
      height: 45px;
      width: 45px;
    }

    /* plus button */
    a {
      width: 20px;
      cursor: pointer;
    }

    a img {
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
