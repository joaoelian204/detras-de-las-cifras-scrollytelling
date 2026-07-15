import { useState, useEffect } from 'react';

export function useResponsiveChartHeight(desktopHeight, mobileHeight = 240) {
  const [height, setHeight] = useState(desktopHeight);

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerWidth <= 899 ? mobileHeight : desktopHeight);
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, [desktopHeight, mobileHeight]);

  return height;
}

export function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth);
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return width;
}
