import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SeoMeta } from "../component/SEO/SeoMeta";

const SERVICE_GROUP_MAP = {
  software: [
    "softwareSolutions",
    "webDesign",
    "gameSystems",
    "saas",
    "apiIntegration"
  ],
  ai: [
    "aiSmartSystems",
    "aiAgentDevelopment",
    "aiEmployee",
    "enterpriseAiPlatform",
    "aiDecisionSupport",
    "personalizedChatbot",
    "salesMarketingAutomation"
  ],
  automation: ["automationN8n", "erp", "digitalTransformation", "simulationEducation"],
  infrastructure: ["hostingSsl", "cyberSecurity", "iot", "bigData"],
  growth: ["socialMedia", "digitalAds", "brandManagement", "seo", "mediaAutomation", "ecommerceAi", "animation"]
};

export const ServicesPage = () => {
  const { t, i18n } = useTranslation();
  const processSteps = t("process.steps", { returnObjects: true });
  const serviceGroups = Object.entries(SERVICE_GROUP_MAP);
  const pillars = t("servicesPage.pillars", { returnObjects: true });

  return (
    <section className="company-page company-page--services subpage-atmosphere">
      <SeoMeta
        title={t("seo.services.title")}
        description={t("seo.services.description")}
        keywords={t("seo.services.keywords")}
        path="/services"
        locale={i18n.resolvedLanguage || i18n.language}
        schema={{
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: t("servicesPage.title"),
          provider: {
            "@type": "Organization",
            name: t("company.fullName")
          },
          areaServed: "Global"
        }}
      />

      <section className="services-spotlight" aria-label={t("servicesPage.title")}>
        <div className="services-spotlight__inner">
          <p className="services-spotlight__eyebrow">{t("servicesPage.title")}</p>
          <h1 className="services-spotlight__title">
            <span className="services-spotlight__title-plain">{t("servicesPage.heroTitleBefore")}</span>{" "}
            <span className="services-spotlight__title-accent home-services__gradient-text">
              {t("servicesPage.heroTitleAccent")}
            </span>
          </h1>
          <p className="services-spotlight__lead">{t("servicesPage.intro")}</p>
          <nav className="services-anchor-nav" aria-label={t("servicesPage.catalogSectionTitle")}>
            {serviceGroups.map(([group, items]) => (
              <a key={group} href={`#svc-${group}`} className="services-anchor-nav__link">
                <span className="services-anchor-nav__label">{t(`servicesPage.groups.${group}`)}</span>
                <span className="services-anchor-nav__count">{items.length}</span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="company-page__inner company-page__inner--services">
        <section className="services-catalog-head" aria-labelledby="services-catalog-heading">
          <h2 id="services-catalog-heading" className="services-catalog-head__title">
            {t("servicesPage.catalogSectionTitle")}
          </h2>
          <p className="services-catalog-head__lead">{t("servicesPage.catalogSectionLead")}</p>
        </section>

        <div className="services-strip-stack">
          {serviceGroups.map(([group, items], index) => (
            <section
              className={`services-strip ${index % 2 === 1 ? "services-strip--alt" : ""}`}
              id={`svc-${group}`}
              key={group}
              aria-labelledby={`svc-heading-${group}`}
            >
              <div className="services-strip__grid">
                <div className="services-strip__intro">
                  <p className="services-strip__kicker">{t("servicesPage.title")}</p>
                  <h2 id={`svc-heading-${group}`} className="services-strip__heading">
                    {t(`servicesPage.groups.${group}`)}
                  </h2>
                  <p className="services-strip__meta">{t(`servicesPage.groupLead.${group}`)}</p>
                </div>
                <ul className="services-strip__list">
                  {items.map((item) => (
                    <li key={item} id={`svc-line-${item}`} className="services-strip__line">
                      {t(`servicesPage.catalog.${item}`)}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>

        <section className="services-pillars" aria-labelledby="services-pillars-heading">
          <div className="services-pillars__head">
            <h2 id="services-pillars-heading" className="services-pillars__title">
              {t("servicesPage.pillarsTitle")}
            </h2>
            <p className="services-pillars__lead">{t("servicesPage.pillarsLead")}</p>
          </div>
          <ul className="services-pillars__grid">
            {(Array.isArray(pillars) ? pillars : []).map((pillar) => (
              <li key={pillar.title} className="services-pillars__item">
                <h3 className="services-pillars__item-title">{pillar.title}</h3>
                <p className="services-pillars__item-body">{pillar.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="services-process" aria-labelledby="services-process-heading">
          <h2 id="services-process-heading" className="services-process__title">
            {t("process.title")}
          </h2>
          <ol className="services-process__steps">
            {(Array.isArray(processSteps) ? processSteps : []).map((step, idx) => (
              <li key={step.title} className="services-process__step">
                <span className="services-process__index" aria-hidden>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="services-process__step-body">
                  <strong className="services-process__step-title">{step.title}</strong>
                  <span className="services-process__step-text">{step.body}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="services-final-cta" id="services-final-cta" aria-label={t("cta.actions.requestDemo")}>
          <h2 className="services-final-cta__title">
            <span className="services-final-cta__title-plain">{t("servicesPage.ctaTitleBefore")}</span>{" "}
            <span className="services-final-cta__title-accent home-services__gradient-text">
              {t("servicesPage.ctaTitleAccent")}
            </span>
          </h2>
          <p className="services-final-cta__lead">{t("servicesPage.ctaLead")}</p>
          <div className="services-final-cta__actions">
            <Link to="/contact" className="company-btn company-btn--primary company-btn--pill">
              {t("cta.actions.requestDemo")}
            </Link>
            <Link to="/contact" className="company-btn company-btn--secondary company-btn--pill">
              {t("cta.actions.getQuote")}
            </Link>
          </div>
        </section>
      </div>
    </section>
  );
};
