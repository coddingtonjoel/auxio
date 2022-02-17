import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import RICIBs from 'react-individual-character-input-boxes';

const Join = () => {
  const [id, setId] = useState("");
  const navigate = useNavigate();
  const mask = "/^([A-Z0-9]{3})([-]+)([A-Z0-9]{4})([-]+)([A-Z0-9]{4})$/";

  const handleChange = (val) => {
    val = val.toUpperCase();
    console.log(val);
    setId(val);
  }

  const handleJoin = () => {
    // start a loader
    // send IPC message to backend
    // have backend check the session ID against DB to make sure it's valid
    // if it is, get the requested info from the backend with session information
    // stop loader
    // join session
    navigate("/player");
  }

  return (
    <Wrapper>
      <h2>Enter Session ID:</h2>
      <RICIBs
          amount={11}
          autoFocus
          handleOutputString={handleChange}
          inputProps={[
            { className: "first-box" },
            { style: { "color": "black" } },
          ]}
          inputRegExp={/^[a-z0-9]$/}
        />
      <button onClick={handleJoin}>Join Session</button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  
`;

export default Join