import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const HomeCompany = memo(function HomeCompany() {
  const { t } = useTranslation();
  const highlights = useMemo(() => {
    const raw = t("home.companySection.highlights", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t]);
  const tags = useMemo(() => {
    const raw = t("home.companySection.tags", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t]);
  const stats = useMemo(() => {
    const raw = t("home.statsItems", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t]);

  return (
    <section
      className="home-company"
      id="company"
      aria-labelledby="home-company-heading"
    >
      <div className="home-company__mesh" aria-hidden="true" />
      <div className="home-company__glow home-company__glow--a" aria-hidden="true" />
      <div className="home-company__glow home-company__glow--b" aria-hidden="true" />
      <div className="home-company__inner">
        <div className="home-company__grid">
          <div className="home-company__copy">
            <p className="home-company__eyebrow">{t("home.companySection.eyebrow")}</p>
            <h2 id="home-company-heading" className="home-company__title">
              <span className="home-company__title-plain">{t("home.companySection.titleBefore")}</span>{" "}
              <span className="home-company__title-accent home-services__gradient-text">
                {t("home.companySection.titleAccent")}
              </span>
            </h2>
            <p className="home-company__lead">{t("home.companySection.lead")}</p>
            {tags[0] ? (
              <div className="home-company__tags" aria-hidden="true">
                {tags.map((tag) => (
                  <span key={tag} className="home-company__tag">
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            {highlights[0] ? (
              <ul className="home-company__highlights">
                {highlights.map((line) => (
                  <li key={line} className="home-company__highlight">
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="home-company__actions">
              <Link
                to="/about"
                className="home-company__link home-company__link--primary"
                data-testid="home-company-link-about"
              >
                {t("home.companySection.aboutCta")}
                <svg className="home-company__link-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>
            </div>
          </div>

          {stats[0] ? (
            <div className="home-company__aside">
              <div className="home-company__visual">
                <div className="home-company__orbit" aria-hidden="true" />
                <div className="home-company__card">
                  <p className="home-company__card-kicker">{t("home.companySection.cardKicker")}</p>
                  <ul className="home-company__stat-grid">
                    {stats.map((item, i) => (
                      <li
                        key={item.label}
                        className="home-company__stat"
                        style={{ "--home-company-stat-i": i }}
                      >
                        <span className="home-company__stat-value" aria-label={`${item.value}${item.suffix} ${item.label}`}>
                          <span className="home-company__stat-num">{item.value}</span>
                          {item.suffix ? (
                            <span className="home-company__stat-suf">{item.suffix}</span>
                          ) : null}
                        </span>
                        <span className="home-company__stat-label">{item.label}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
});
