import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import { useNavigate } from "react-router-dom";
import AuthCode from 'react-auth-code-input';
import { ipcRenderer } from 'electron';
import { SessionContext } from '../SessionContext';

const Join = () => {
  const [inputID, setInputID] = useState("");
  const [error, setError] = useState(null);

  // session id info for player usage
  const [ID, setID] = useContext(SessionContext);
  const navigate = useNavigate();

  // automatically focus the first textbox of the input
  useEffect(() => {
    document.getElementsByClassName("id-char")[0].focus();

    ipcRenderer.on("joinSession:success", () => {
      setID(inputID);
      navigate("/player");
    })

    ipcRenderer.on("joinSession:failure", () => {
      setError(
        <p className="error">Invalid Session ID</p>
      );
      setTimeout(() => {
        setError(null);
      }, 4000)
    })
  }, []);

  const handleChange = (val) => {
    val = val.toUpperCase();
    console.log(val);
    setInputID(val);
  }

  const handleJoin = () => {
    // add dashes to code
    let formattedCode = inputID;
    formattedCode = formattedCode.slice(0, 3) + "-" + formattedCode.slice(3);
    formattedCode = formattedCode.slice(0, 7) + "-" + formattedCode.slice(7);

    if (inputID.length === 13) {
      ipcRenderer.send("joinSession", {id: formattedCode});
    }
    else {
      setError(
        <p className="error">Invalid Session ID</p>
      );
      setTimeout(() => {
        setError(null);
      }, 4000)
    }
  }

  return (
    <Wrapper>
      <h2>Enter a Valid Session ID:</h2>
        <div className="id-container">
          <AuthCode
              length={10}
              onChange={handleChange}
              allowedCharacters={"alphanumeric"}
              inputClassName="id-char"
            />
        </div>
        {error}
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
  .id-char:nth-child(6) {
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

  .error {
    position: absolute;
    color: red;
    text-align: center;
    font-weight: 700;
    width: 100vw;
    transform: translateY(-38px);
  }
`;

export default Join