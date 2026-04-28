import { useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ServiceIcon = memo(function ServiceIcon({ name, className }) {
  if (name === "brain") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 5a3 3 0 0 0-3 3v1H7a2 2 0 0 0-2 2c0 .74.4 1.39 1 1.73V15a2 2 0 0 0 2 2h1v1a3 3 0 0 0 6 0v-1h1a2 2 0 0 0 2-2v-2.27c.6-.34 1-.99 1-1.73a2 2 0 0 0-2-2h-2V8a3 3 0 0 0-3-3Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (name === "camera") {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 7h4l2-2h4l2 2h4v12H4V7Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 9l3 3-3 3M11 15h5M7 5h10a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

const splitTitle = (title) => {
  const parts = String(title).trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) {
    return { head: "", accent: parts[0] || "" };
  }
  const accent = parts.pop();
  return { head: parts.join(" "), accent: accent.toUpperCase() };
};

export const HomeServices = memo(function HomeServices() {
  const { t } = useTranslation();
  const processSteps = useMemo(() => {
    const raw = t("process.steps", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t]);
  const items = useMemo(() => {
    const raw = t("home.servicesSection.items", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t]);

  return (
    <section id="services" className="home-services">
      <div className="home-services__bg" aria-hidden="true">
        <div className="home-services__bg-ambient home-services__bg-ambient--mesh" />
        <div className="home-services__bg-ambient home-services__bg-ambient--violet" />
        <div className="home-services__bg-rings" aria-hidden="true">
          <span className="home-services__bg-ring" />
          <span className="home-services__bg-ring" />
          <span className="home-services__bg-ring" />
          <span className="home-services__bg-rings-core" />
        </div>
        <div className="home-services__bg-mesh" />
      </div>

      <div className="home-services__inner">
        <header className="home-services__header">
          <p className="home-services__eyebrow">{t("home.servicesSection.eyebrow")}</p>
          <h2 className="home-services__title">
            <span className="home-services__title-plain">{t("home.servicesSection.titleBefore")}</span>{" "}
            <span className="home-services__title-gradient home-services__gradient-text">
              {t("home.servicesSection.titleAccent")}
            </span>
          </h2>
          <p className="home-services__intro">
            <strong>{t("home.valueTeaserTitle")}</strong> {t("home.valueTeaserBody")}
          </p>
          {processSteps[0] ? (
            <p className="home-services__workflow">
              <strong>{t("process.title")}:</strong> {processSteps[0].title} - {processSteps[0].body}
            </p>
          ) : null}
        </header>

        <div className="home-services__list">
          {items.map((service, index) => {
            const { head, accent } = splitTitle(service.title);
            return (
              <article
                key={service.title}
                className={`home-services__row ${index % 2 === 0 ? "home-services__row--even" : "home-services__row--odd"}`}
                data-testid={`service-card-${index}`}
              >
                <div className="home-services__icon-wrap">
                  <ServiceIcon name={service.icon} className="home-services__icon" />
                </div>
                <div className="home-services__body">
                  <h3 className="home-services__name">
                    <span className="home-services__index">{String(index + 1).padStart(2, "0")} -</span>{" "}
                    <span className="home-services__name-head">{head}</span>{" "}
                    <span className="home-services__name-accent home-services__gradient-text">{accent}</span>
                  </h3>
                  <p className="home-services__desc">{service.description}</p>
                  <div className="home-services__features">
                    {(service.features || []).map((feature) => (
                      <span key={feature} className="home-services__feature">
                        {feature}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/contact"
                    className="home-services__link"
                    data-testid={`button-service-${index}`}
                  >
                    {t("home.servicesSection.learnMore")}
                    <svg className="home-services__link-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
});
