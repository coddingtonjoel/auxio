import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from 'styled-components';
import openin from "../assets/icons/openin.svg";
import authInProg from "../assets/icons/auth-inprog.svg";
import check from "../assets/icons/auth-complete.svg";
import Tooltip from "@mui/material/Tooltip";

const Welcome = () => {
    const navigate = useNavigate();
    let googleAuthenticated = true;
    let spotifyAuthenticated = false;

    // run some tests in here to check if user is authenticated with spotify and google. If so, navigate them to /connect by default in a useEffect() hook
    return (
        <React.Fragment>
            <Wrapper>
                <div>
                    <h1>Welcome to Auxio!</h1>
                    <p>We're excited you're here. Before you can start listening, you'll need to sign in to our related services.</p>
                </div>
                <div className="buttons">
                    <a draggable={false} href="#">
                        <span>1.</span>
                        <span>Sign into Google <img src={openin} alt="open in"/></span>
                        <Tooltip placement="left" title={googleAuthenticated ? "Logged In" : "Awaiting Login"}>
                            <img draggable={false} className="status" src={googleAuthenticated ? check : authInProg} alt="Incomplete"/>
                        </Tooltip>
                    </a>
                    <a draggable={false} href="#">
                        <span>2.</span>
                        <span>Sign into Spotify <img src={openin} alt="open in"/></span>
                        <Tooltip placement="left" title={spotifyAuthenticated ? "Logged In" : "Awaiting Login"}>
                            <img draggable={false} className="status" src={spotifyAuthenticated ? check : authInProg} alt="Incomplete"/>
                        </Tooltip>
                    </a>
                </div>
            </Wrapper>
            {/* Temporary bypass; the progression to /connect will be handled by a navigation call upon completion of google/spotify logins */}
            <Link to="/connect">Temporary Bypass to /connect</Link>
        </React.Fragment>
        
    );
};

const Wrapper = styled.div`
    font-family: "Source Sans Pro";

    h1 {
        margin-top: 60px;
        font-size: 54px;
        text-align: center;
        font-family: "Cairo";
    }

    p {
        text-align: center;
        font-size: 22px;
        width: 75%;
        margin: -10px auto 60px;
        line-height: 1.3;
    }

    a {
        background-color: ${props => props.theme.primary};
        padding: 20px;
        border-radius: 8px;
        height: 30px;
        width: 80%;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: "Source Sans Pro";
        font-weight: 600;
        outline: none;
        transition: 0.15s;
        box-shadow: ${props => props.theme.boxShadow};

        span {
            font-size: 22px;

            img {
                transform: translateY(6px);
                margin-left: 8px; 
            }
        }
    }

    a:hover {
        background-color: ${props => props.theme.primaryHover};
    }

    a:active {
        background-color: ${props => props.theme.primaryActive};
    }

    .status {
        height: 34px;
    }

    a:link, a:visited {
        color: #fff;
        text-decoration: none;
    }

    .buttons {
        margin: auto;
    }
`;
export default Welcome;
