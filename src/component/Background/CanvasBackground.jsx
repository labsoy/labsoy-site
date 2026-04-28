import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useImagePreloader } from "../../hooks/useImagePreloader";
import "../../styles/components/background.css";

const CanvasBackground = () => {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(0);
  const sequence = useRef({ frame: 0 });
  const { textures, isLoading } = useImagePreloader(60);

  useEffect(() => {
    if (!canvasRef.current || !wrapperRef.current || isLoading || textures.length === 0) {
      return undefined;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });

    const resizeRenderer = () => {
      const host = wrapperRef.current;
      if (!host) return;
      const width = Math.max(1, Math.floor(host.clientWidth));
      const height = Math.max(1, Math.floor(host.clientHeight));
      renderer.setSize(width, height, false);
    };

    resizeRenderer();
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.MeshBasicMaterial({
      map: textures[0],
      transparent: true
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const timeline = gsap.to(sequence.current, {
      frame: textures.length - 1,
      duration: 3,
      repeat: 0,
      ease: "none",
      onUpdate: () => {
        const frameIndex = Math.round(sequence.current.frame);
        if (textures[frameIndex]) {
          material.map = textures[frameIndex];
          material.needsUpdate = true;
        }
      },
      onComplete: () => {
        const lastTexture = textures[textures.length - 1];
        if (lastTexture) {
          material.map = lastTexture;
          material.needsUpdate = true;
        }
      }
    });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            resizeRenderer();
          })
        : null;

    resizeObserver?.observe(wrapperRef.current);
    window.addEventListener("resize", resizeRenderer);

    const animate = () => {
      renderer.render(scene, camera);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resizeRenderer);
      cancelAnimationFrame(animationFrameRef.current);
      timeline.kill();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isLoading, textures]);

  return (
    <div ref={wrapperRef} className="canvas-background" aria-hidden="true">
      <canvas ref={canvasRef} id="bg-canvas" />
    </div>
  );
};

export default CanvasBackground;