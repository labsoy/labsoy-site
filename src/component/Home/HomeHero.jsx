import { useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getHeroSlideUrls } from "../../utils/heroSlideImages";
import { HeroFrameCanvas } from "./HeroFrameCanvas";

const SLIDE_COUNT = 4;

const ArrowRightIcon = ({ className }) => (
  <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M5 12h14M13 6l6 6-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const HeroBackdrop = memo(function HeroBackdrop() {
  return (
    <div className="home-hero__bgfx" aria-hidden="true">
      <div className="home-hero__bgfx-blob" />
      <div className="home-hero__bgfx-mesh" />
      <div className="home-hero__bgfx-orb home-hero__bgfx-orb--teal" />
      <div className="home-hero__bgfx-orb home-hero__bgfx-orb--pink" />
    </div>
  );
});

export const HomeHero = memo(function HomeHero() {
  const { t, i18n } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const slideUrls = useMemo(() => {
    const urls = getHeroSlideUrls(SLIDE_COUNT);
    if (urls.length === 0) return [];
    while (urls.length < SLIDE_COUNT) {
      urls.push(urls[urls.length % urls.length]);
    }
    return urls.slice(0, SLIDE_COUNT);
  }, []);

  const slides = useMemo(() => {
    const raw = t("home.heroSlides", { returnObjects: true });
    const list = Array.isArray(raw) ? raw : [];
    if (list.length >= SLIDE_COUNT) return list.slice(0, SLIDE_COUNT);
    const pad = list[0] || {
      title: t("home.hero.line1"),
      subtitle: t("home.hero.line2"),
      description: t("home.lead")
    };
    return Array.from({ length: SLIDE_COUNT }, (_, i) => list[i] || pad);
  }, [t, i18n.language]);

  const content = slides[currentIndex] ?? slides[0];
  const serviceNames = useMemo(() => {
    const raw = t("home.heroServiceNames", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, i18n.language]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return undefined;
    const id = setInterval(nextSlide, 5000);
    return () => clearInterval(id);
  }, [isAutoPlaying, nextSlide]);

  const onMouseEnter = useCallback(() => setIsAutoPlaying(false), []);
  const onMouseLeave = useCallback(() => setIsAutoPlaying(true), []);

  const slideImage = slideUrls[currentIndex] ?? slideUrls[0];

  return (
    <section id="home" className="home-hero" onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <div className="home-hero__stage">
        <HeroBackdrop />

        <figure
          key={currentIndex === 0 ? "slide-seq" : `slide-${currentIndex}-${slideImage}`}
          className={`home-hero__figure ${currentIndex === 0 ? "home-hero__figure--sequence" : "home-hero__figure--enter"}`}
        >
          {currentIndex === 0 ? (
            <HeroFrameCanvas isPaused={!isAutoPlaying} />
          ) : slideImage ? (
            <img
              src={slideImage}
              alt=""
              className="home-hero__slide-img"
              loading="lazy"
              fetchPriority="auto"
              width="1920"
              height="1080"
            />
          ) : null}
          <div className="home-hero__slide-grad home-hero__slide-grad--primary" aria-hidden="true" />
          <div className="home-hero__slide-grad home-hero__slide-grad--fade" aria-hidden="true" />
        </figure>

        <div className="home-hero__overlay">
          <div className="home-hero__overlay-inner">
            <h1 className="home-hero__sr-only">{t("home.hero.srTitle")}</h1>
            <div key={currentIndex} className="home-hero__copy-block home-hero__copy-block--enter">
              <p className="home-hero__eyebrow">{t("home.heroGreeting")}</p>
              <h2 className="home-hero__display">
                <span className="home-hero__display-line">{content.title}</span>
                <span className="home-hero__display-line home-hero__display-line--gradient">{content.subtitle}</span>
              </h2>
              <p className="home-hero__lead">{content.description}</p>
              <Link className="home-hero__cta-primary" to="/portfolio" data-testid="button-hero-primary">
                <span className="home-hero__cta-primary-inner">
                  {t("home.heroPrimaryCta")}
                  <ArrowRightIcon className="home-hero__cta-icon" />
                </span>
              </Link>
            </div>
          </div>
        </div>

        <nav className="home-hero__dots" aria-label={t("home.heroDotsAria")}>
          {Array.from({ length: SLIDE_COUNT }, (_, index) => (
            <button
              key={index}
              type="button"
              className={`home-hero__dot ${index === currentIndex ? "is-active" : ""}`}
              aria-label={t("home.heroDotLabel", { n: String(index + 1) })}
              aria-current={index === currentIndex ? "true" : undefined}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </nav>
      </div>

      <aside className="home-hero__rail">
        <div className="home-hero__rail-glow" aria-hidden="true" />
        <div className="home-hero__rail-glow home-hero__rail-glow--slow" aria-hidden="true" />
        <div className="home-hero__rail-inner">
          <h3 className="home-hero__rail-title">
            {t("home.heroSidebarTitle")}
            <span className="home-hero__rail-title-bar" aria-hidden="true" />
          </h3>
          <ul className="home-hero__rail-list" role="list">
            {serviceNames.slice(0, 4).map((name) => (
              <li key={name} className="home-hero__rail-item" role="listitem">
                <Link to="/services" className="home-hero__rail-link">
                  <span>{name}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="home-hero__rail-footer">
            <Link to="/contact" className="home-hero__rail-chat">
              <span>{t("home.heroLetsTalk")}</span>
              <ArrowRightIcon className="home-hero__rail-chat-icon" />
            </Link>
            <p className="home-hero__rail-note">{t("home.heroSidebarFootnote")}</p>
          </div>
        </div>
      </aside>
    </section>
  );
});
