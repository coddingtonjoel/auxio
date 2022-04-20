import React, { useRef, useEffect } from "react";

// Custom hook: https://stackoverflow.com/questions/53179075/with-useeffect-how-can-i-skip-applying-an-effect-upon-the-initial-render
// Skips useEffect first render
export const useIsMount = () => {
    const isMountRef = useRef(true);
    useEffect(() => {
      isMountRef.current = false;
    }, []);
    return isMountRef.current;
  };