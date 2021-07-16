import React, { useEffect } from 'react';

const useScreenSize = () => {
  const [screenWidth, setScreenWidth] = React.useState(0);

  const resizeWindow = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    resizeWindow();
    window.addEventListener('resize', resizeWindow);
    return () => window.removeEventListener('resize', resizeWindow);
  }, []);
  return screenWidth;
};

export default useScreenSize;
