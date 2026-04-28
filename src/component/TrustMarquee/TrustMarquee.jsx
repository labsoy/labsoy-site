import { useTranslation } from "react-i18next";
import { useCallback, useLayoutEffect, useRef } from "react";
import "../../styles/components/trust-marquee.css";

const brandList = (t) => {
  const raw = t("home.trustMarquee.brands", { returnObjects: true });
  return Array.isArray(raw) ? raw.filter(Boolean) : [];
};

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export const TrustMarquee = ({ embedded = false }) => {
  const { t } = useTranslation();
  const brands = brandList(t);
  const trackRef = useRef(null);
  const stripARef = useRef(null);
  const animRef = useRef(null);
  const debounceRef = useRef(0);

  const clearMarqueeAnimation = useCallback(() => {
    animRef.current?.cancel();
    animRef.current = null;
    const track = trackRef.current;
    if (track) {
      track.classList.remove("trust-marquee__track--css");
      track.style.removeProperty("--marquee-shift");
      track.style.removeProperty("--marquee-duration");
    }
  }, []);

  const installMarquee = useCallback(() => {
    const track = trackRef.current;
    const stripA = stripARef.current;
    if (!track || !stripA) return;

    if (prefersReducedMotion()) {
      clearMarqueeAnimation();
      return;
    }

    const gapRaw = getComputedStyle(track).gap || getComputedStyle(track).columnGap || "0";
    const gapPx = Number.parseFloat(gapRaw) || 0;
    const segmentPx = stripA.offsetWidth + gapPx;
    if (segmentPx <= 0) return;

    if (typeof track.animate === "function") {
      animRef.current?.cancel();
      track.classList.remove("trust-marquee__track--css");
      const durationMs = Math.min(88000, Math.max(12000, (segmentPx / 50) * 1000));
      animRef.current = track.animate(
        [
          { transform: "translate3d(0,0,0)" },
          { transform: `translate3d(-${segmentPx}px,0,0)` },
        ],
        { duration: durationMs, iterations: Infinity, easing: "linear" }
      );
      return;
    }

    animRef.current?.cancel();
    animRef.current = null;
    track.classList.add("trust-marquee__track--css");
    track.style.setProperty("--marquee-shift", `${segmentPx}px`);
    const durationSec = Math.min(85, Math.max(18, Math.round((segmentPx / 42) * 10) / 10));
    track.style.setProperty("--marquee-duration", `${durationSec}s`);
  }, [clearMarqueeAnimation]);

  const scheduleInstall = useCallback(() => {
    window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      installMarquee();
    }, 100);
  }, [installMarquee]);

  useLayoutEffect(() => {
    if (brands.length === 0) return undefined;

    installMarquee();
    const raf = requestAnimationFrame(() => installMarquee());

    const stripA = stripARef.current;
    const ro =
      typeof ResizeObserver === "function" ? new ResizeObserver(() => scheduleInstall()) : null;
    if (stripA && ro) ro.observe(stripA);

    window.addEventListener("resize", scheduleInstall);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(debounceRef.current);
      if (ro) ro.disconnect();
      window.removeEventListener("resize", scheduleInstall);
      clearMarqueeAnimation();
    };
  }, [brands, installMarquee, scheduleInstall, clearMarqueeAnimation]);

  const pause = useCallback(() => {
    const a = animRef.current;
    if (a) a.pause();
  }, []);

  const play = useCallback(() => {
    if (prefersReducedMotion()) return;
    const a = animRef.current;
    if (a) a.play();
  }, []);

  if (brands.length === 0) {
    return null;
  }

  const rootClass = embedded ? "trust-marquee trust-marquee--embedded" : "trust-marquee";

  return (
    <div
      className={rootClass}
      role="region"
      aria-labelledby="trust-marquee-heading"
    >
      <div className="trust-marquee__head">
        <h2 id="trust-marquee-heading" className="trust-marquee__title">
          {t("home.trustMarquee.title")}
        </h2>
      </div>
      <div className="trust-marquee__viewport" onMouseEnter={pause} onMouseLeave={play}>
        <div ref={trackRef} className="trust-marquee__track">
          <ul ref={stripARef} className="trust-marquee__strip" role="list">
            {brands.map((name, index) => (
              <li key={`marquee-0-${index}`} className="trust-marquee__item">
                <span className="trust-marquee__brand">{name}</span>
              </li>
            ))}
          </ul>
          <ul
            className="trust-marquee__strip trust-marquee__strip--clone"
            aria-hidden="true"
            role="presentation"
          >
            {brands.map((name, index) => (
              <li key={`marquee-1-${index}`} className="trust-marquee__item">
                <span className="trust-marquee__brand">{name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
