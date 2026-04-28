import { useEffect, useState } from "react";
import { loadTextures } from "../utils/ImagePreloader";

export const useImagePreloader = (frameCount = 60) => {
  const [textures, setTextures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const preload = async () => {
      try {
        const loadedTextures = await loadTextures(frameCount);
        if (isMounted) {
          setTextures(loadedTextures);
          setError(null);
        }
      } catch (preloadError) {
        if (isMounted) {
          setError(preloadError);
          setTextures([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    preload();

    return () => {
      isMounted = false;
    };
  }, [frameCount]);

  return { textures, isLoading, error };
};
