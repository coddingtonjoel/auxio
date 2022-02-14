import React from "react";
import { useNavigate, Link } from "react-router-dom";
import styled from 'styled-components';

const Welcome = () => {
    const navigate = useNavigate();

    // run some tests in here to check if user is authenticated with spotify and google. If so, navigate them to /connect by default in a useEffect() hook
    return (
        <div>
            <div>
                <h1>Welcome to Auxio!</h1>
                <p>We're excited you're here. Before you can start listening, you'll need to sign in to our related services.</p>
                <Link to="/player">Player</Link>
            </div>
        </div>
        
    );
};

export default Welcome;
