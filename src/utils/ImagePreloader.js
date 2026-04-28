import * as THREE from "three";
import { getComputerBgFrameUrls } from "./heroSlideImages.js";

export const getFrameUrls = (count) => getComputerBgFrameUrls(count);

export const loadTextures = async (count) => {
  const loader = new THREE.TextureLoader();
  const frameUrls = getFrameUrls(count);
  const textures = await Promise.all(
    frameUrls.map(async (url) => {
      const texture = await loader.loadAsync(url);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    })
  );

  return textures;
};
