import React from 'react';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import shareIcon from "../assets/icons/share.svg";
import headphonesIcon from "../assets/icons/headphones.svg";

const Connect = () => {
  return (
    <Wrapper>
        <h2>Let's get you connected to a server!</h2>
        <div className="button-container">
          <Link draggable={false} to="/player">
              <img src={shareIcon} alt="Share"/>
              <span>Host a Session</span>
          </Link>
          <Link draggable={false} to="/join">
              <img src={headphonesIcon} alt="Share"/>
              <span>Join a Session</span>
          </Link>
        </div>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .button-container {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
  }

  h2 {
    font-size: 40px;
    margin: 8% 0 90px;
    text-align: center;
  }

  a {
    background-color: ${props => props.theme.primary};
    padding: 50px 40px;
    font-size: 20px;
    font-weight: 400;
    font-family: "Cairo", sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 30%;
    border-radius: 8px;
    transition: 0.15s;
    box-shadow: ${props => props.theme.boxShadow};
  }

  a:hover {
        background-color: ${props => props.theme.primaryHover};
    }

    a:active {
        background-color: ${props => props.theme.primaryActive};
    }

  a:link, a:visited {
    text-decoration: none;
    color: #fff;
  }

  img {
    height: 80px;
    margin-bottom: 10px;
  }
`;

export default Connect;
