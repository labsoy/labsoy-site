import { memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const IconArrow = memo(function IconArrow({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const HomeCta = memo(function HomeCta() {
  const { t } = useTranslation();

  return (
    <section className="home-cta-band" aria-label={t("home.ctaBand.sectionAria")}>
      <div className="home-cta-band__glow" aria-hidden="true" />
      <div className="home-cta-band__inner">
        <h2 className="home-cta-band__title">{t("home.ctaBand.title")}</h2>
        <p className="home-cta-band__line">{t("home.ctaBand.line")}</p>
        <div className="home-cta-band__actions">
          <Link to="/contact" className="home-cta-band__btn home-cta-band__btn--primary" data-testid="button-cta-primary">
            <span>{t("home.ctaBand.primary")}</span>
            <IconArrow className="home-cta-band__btn-icon" />
          </Link>
          <a href="#services" className="home-cta-band__btn home-cta-band__btn--secondary" data-testid="button-cta-secondary">
            {t("home.ctaBand.secondary")}
          </a>
        </div>
      </div>
    </section>
  );
});
