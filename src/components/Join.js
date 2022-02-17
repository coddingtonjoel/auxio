import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import AuthCode from 'react-auth-code-input';

const Join = () => {
  const [id, setId] = useState("");
  const navigate = useNavigate();

  // automatically focus the first textbox of the input
  useEffect(() => {
    document.getElementsByClassName("id-char")[0].focus();
  }, []);

  const handleChange = (val) => {
    val = val.toUpperCase();
    console.log(val);
    setId(val);
  }

  const handleJoin = () => {
    if (id.length === 11) {
      // start a loader
      // send IPC message to backend
      // have backend check the session ID against DB to make sure it's valid
      // if it is, get the requested info from the backend with session information
      // stop loader
      // join session
      navigate("/player");
    }
    else {

    }
  }

  return (
    <Wrapper>
      <h2>Enter a Valid Session ID:</h2>
        <div className="id-container">
          <AuthCode
              length={11}
              onChange={handleChange}
              allowedCharacters={"alphanumeric"}
              inputClassName="id-char"
            />
        </div>
      <button onClick={handleJoin}>Join Session</button>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  h2 {
    text-align: center;
    font-size: 36px;
    margin-top: 10%;
  }

  .id-char {
    text-transform: uppercase;
    width: 60px;
    height: 100px;
    font-size: 32px;
    text-align: center;
    box-sizing: border-box;
    box-shadow: inset 0px -5px 0px 0px #c4c4c4;
    border: none;
    background-color: #dfdfdf;
    margin: 0px 3px;
    outline: none;
    font-family: "Cairo", sans-serif;
    font-weight: 600;
    transition: 0.1s;
  }

  /* put gaps between the sections of the session id */
  .id-char:nth-child(3),
  .id-char:nth-child(7) {
    margin-right: 50px !important;
  }

  /* add the colored bottom border to the focused input */
  .id-char:focus {
    box-shadow: inset 0px -5px 0px 0px ${props => props.theme.primary};
  }

  .id-container {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 50px auto;
  }

  button {
    background-color: ${props => props.theme.primary};
    padding: 10px 80px;
    font-family: "Cairo", sans-serif;
    font-weight: 400;
    color: #fff;
    font-size: 18px;
    margin: 80px auto 0;
    display: block;
    border: none;
    border-radius: 8px;
    box-shadow: ${props => props.theme.boxShadow};
    transition: 0.15s;
  }

  button:hover {
    background-color: ${props => props.theme.primaryHover};
    cursor: pointer;
  }

  button:active {
    background-color: ${props => props.theme.primaryActive};
  }
`;

export default Join