import { useEffect, useRef, useMemo, memo } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { useImagePreloader } from "../../hooks/useImagePreloader";
import { getComputerBgFrameUrls } from "../../utils/heroSlideImages";

const LOOP_SEC = 3.8;

const HeroFrameCanvas = memo(function HeroFrameCanvas({ isPaused }) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(0);
  const timelineRef = useRef(null);
  const { textures, isLoading } = useImagePreloader(60);
  const fallbackUrl = useMemo(() => {
    const u = getComputerBgFrameUrls(1);
    return u[0] ?? "";
  }, []);

  useEffect(() => {
    if (isLoading || !canvasRef.current || !wrapperRef.current || textures.length === 0) {
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

    const lastIndex = textures.length - 1;
    const applyMap = (i) => {
      const idx = Math.min(lastIndex, Math.max(0, i));
      const tex = textures[idx];
      if (!tex) return;
      if (material.map === tex) return;
      material.map = tex;
      material.needsUpdate = true;
    };
    applyMap(0);
    const timeline = gsap.timeline();
    if (lastIndex > 0) {
      const step = LOOP_SEC / lastIndex;
      for (let i = 0; i <= lastIndex; i += 1) {
        timeline.call(applyMap, [i], i * step);
      }
    }
    timelineRef.current = timeline;

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
      timelineRef.current = null;
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [isLoading, textures.length]);

  useEffect(() => {
    const tl = timelineRef.current;
    if (!tl) return;
    if (isPaused) {
      tl.pause();
      return;
    }
    if (tl.progress() < 1) {
      tl.play();
    }
  }, [isPaused, isLoading, textures.length]);

  if (isLoading && fallbackUrl) {
    return (
      <img
        src={fallbackUrl}
        alt=""
        className="home-hero__slide-img"
        width="1920"
        height="1080"
      />
    );
  }

  if (isLoading) {
    return null;
  }

  if (textures.length === 0) {
    return (
      <img
        src={fallbackUrl}
        alt=""
        className="home-hero__slide-img"
        width="1920"
        height="1080"
      />
    );
  }

  return (
    <div ref={wrapperRef} className="home-hero__sequence-host" aria-hidden="true">
      <canvas ref={canvasRef} className="home-hero__sequence-canvas" />
    </div>
  );
});

export { HeroFrameCanvas };
