import React, { useState, createContext } from "react";

export const SessionContext = createContext();

export const IDProvider = (props) => {
  const [ID, setID] = useState("");

  return (
    <SessionContext.Provider value={[ID, setID]}>
      {props.children}
    </SessionContext.Provider>
  );
};
