import { useState, useEffect } from 'react';

export function useResponsiveChartHeight(desktopHeight, mobileHeight = 240) {
  const [height, setHeight] = useState(desktopHeight);

  useEffect(() => {
    const updateHeight = () => {
      if (window.innerWidth <= 899) {
        setHeight(mobileHeight);
        return;
      }
      const scaled = Math.round(window.innerHeight * 0.42);
      const clamped = Math.min(Math.max(scaled, desktopHeight), desktopHeight * 1.8);
      setHeight(clamped);
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
