import { useState, useEffect, useCallback, useRef } from "react";

export const useHeaderLogic = (threshold = 40) => {
  const [state, setState] = useState({
    scrolled: false,
    hidden: false,
  });

  const lastY = useRef(0);
  const ticking = useRef(false);

  const update = useCallback(() => {
    const y = window.scrollY;
    const isScrolled = y > threshold;
    const isHidden = y > lastY.current && y > 200;

    setState((prev) => {
      if (prev.scrolled === isScrolled && prev.hidden === isHidden) return prev;
      return { scrolled: isScrolled, hidden: isHidden };
    });

    lastY.current = y;
    ticking.current = false;
  }, [threshold]);

  const onScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(update);
      ticking.current = true;
    }
  }, [update]);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  return state;
};