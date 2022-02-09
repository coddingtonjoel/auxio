import React from 'react';
import { ipcRenderer } from "electron";

const IPCTest = () => {
    const testWithParam = () => {
        ipcRenderer.send("test:withParam", {message: "This is a message sent via parameter in IPCTest.js."});
    }

    const testWithoutParam = () => {
        ipcRenderer.send("test:withoutParam");
    }

    return (
        <div>
            <button onClick={testWithParam}>IPC Event: "test:withParam"</button>
            <br/>
            <button onClick={testWithoutParam}>IPC Event: "test:withoutParam"</button>
        </div>
    );
};

export default IPCTest;
