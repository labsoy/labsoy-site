import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * When the route includes a hash, scroll the matching element into view after render.
 * Used on the layout so any page with matching element ids (services, about, etc.) works.
 */
export const useHashScroll = () => {
  const { pathname, hash, key } = useLocation();
  useLayoutEffect(() => {
    if (!hash) return;
    const id = hash.replace("#", "");
    if (!id) return;
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [pathname, hash, key]);
};
