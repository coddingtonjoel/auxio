import React, { useState, useEffect, useRef } from 'react';
import styled, { useTheme } from 'styled-components';
import { ipcRenderer } from 'electron';
import closeBlack from "../assets/icons/closeBlack.svg";
import closeWhite from "../assets/icons/closeWhite.svg";
import menuBlack from "../assets/icons/menuBlack.svg";
import menuWhite from "../assets/icons/menuWhite.svg";
import { ReactSortable } from "react-sortablejs";

// Custom hook: https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
// Skips useEffect first render
export const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};

const Queue = () => {
  const theme = useTheme();
  const isMount = useIsMount();

  // search results
  const [sessionQueue, setSessionQueue] = useState([]);

  const handleRemove = (song) => {
    console.log("Song to remove: ", song);
    ipcRenderer.send("queue:delete", {song});
    const filteredQueue = sessionQueue.filter(x => x !== song);
    setSessionQueue(filteredQueue);
  }

  useEffect(() => {
    // fetch queue request from backend
    ipcRenderer.send("queue:fetch");

    // upon receiving queue, set the queue on the frontend
    ipcRenderer.on("queue:return", (e, data) => {
      setSessionQueue(data.queue);
    })
  }, []);

  useEffect(() => {
    if (!isMount) {
      // not in progress of reordering from sortablejs (ex. picked up but not set down)
      let isFullyReordered = true;
      sessionQueue.forEach(song => {
        if (song.chosen) {
          isFullyReordered = false;
        }
      })
      if (isFullyReordered) {
        console.log(sessionQueue);
        ipcRenderer.send("queue:update", {queue: sessionQueue});
      }
    }
  }, [sessionQueue]);

  const showQueueItems = () => {
    return (
      sessionQueue.map((song, i) => {
        return (
          <div className="song" key={song.id + i}>
            <a onClick={() => handleRemove(song)}>
              <img draggable={false} src={theme.style === "light" ? closeBlack : closeWhite} alt="Delete"/>
            </a>
            <img draggable={false} className="album-art" src={song.albumArt[1]} alt={song.album}/>
            <div className="song-info">
              <span>{song.title}</span>
              <span>{song.artists[0]}</span>
            </div>
            <a className="reorder">
              <img draggable={false} src={theme.style === "light" ? menuBlack : menuWhite} alt="Reorder"/>
            </a>
          </div>
        )
      })
    )
  }

  return (
    <Wrapper>
      <p className="title">Session Queue</p>
      {sessionQueue.length !== 0 ? (
          <ReactSortable 
          scroll={true}
          animation={200}
          delayOnTouchStart={true}
          delay={2} 
          list={sessionQueue} 
          setList={setSessionQueue}
          className="queue">
            {showQueueItems()}
          </ReactSortable>
        ) : (
          <div className="empty">
            <p>Your session queue is empty. Try adding something!</p>
          </div>
        )} 
    </Wrapper>
  );
};

const Wrapper = styled.div`
  user-select: none;
  height: 100%;
  position: relative;

  .title {
    font-weight: 700;
    font-size: 24px;
    text-align: center;
  }

  .song {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    height: 58px;
    padding: 0 15px;
    transition: 0.15s;

    &:hover {
      background-color: ${props => props.theme.searchQueueItemBkg};
    }

    &:active {
      background-color: ${props => props.theme.background};
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
        width: 230px;
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
      margin: 0 15px;
    }

    a {
      width: 20px;
      cursor: pointer;
      transform: translateY(3px);
    }

    a img {
      height: 20px;
      width: 20px;
    }
  }

  .reorder {
    transform: translateX(-10px);

    img {
      transform: translateX(-10px);
    }
  }

  .empty {
    text-align: center;
  }

  .queue {
    overflow-y: scroll;
    height: 485px;
    position: relative;
    padding-bottom: 41px;
  }
`;

export default Queue;
