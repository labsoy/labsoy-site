import { useCallback, useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES, normalizeLanguage } from "../../i18n/i18n";
import logo from "../../assets/images/logo.png";
import { FooterSocialIcon } from "./FooterSocialIcon";
import "../../styles/components/footer.css";

const SOCIAL_LINKS = [
  { id: "instagram", href: "#" },
  { id: "pinterest", href: "#" },
  { id: "x", href: "#" },
  { id: "youtube", href: "#" },
  { id: "tiktok", href: "#" },
  { id: "facebook", href: "#" },
  { id: "linkedin", href: "#" },
  { id: "whatsapp", href: "#" }
];

const PLATFORM_LINKS = [
  { id: "ai", key: "footer.services.ai", path: "/services" },
  { id: "cloud", key: "footer.services.cloud", path: "/services" },
  { id: "security", key: "footer.services.security", path: "/services" },
  { id: "platform", key: "footer.services.platform", path: "/services" },
  { id: "mobile", key: "footer.services.mobile", path: "/services" },
  { id: "analytics", key: "footer.services.analytics", path: "/services" }
];

const SOLUTIONS_LINKS = [
  { id: "consulting", key: "headerMenu.consulting", path: "/services" },
  { id: "architecture", key: "headerMenu.architecture", path: "/services" },
  { id: "design", key: "headerMenu.design", path: "/services" },
  { id: "engineering", key: "headerMenu.engineering", path: "/services" },
  { id: "automation", key: "headerMenu.automation", path: "/services" },
  { id: "aiSolutions", key: "headerMenu.aiSolutions", path: "/services" },
  { id: "support", key: "headerMenu.support", path: "/services" },
  { id: "partners", key: "headerMenu.partners", path: "/services" }
];

const RESOURCES_LINKS = [
  { id: "home", key: "footer.links.home", path: "/" },
  { id: "services", key: "footer.links.services", path: "/services" },
  { id: "portfolio", key: "header.portfolio", path: "/portfolio" },
  { id: "about", key: "footer.links.about", path: "/about" },
  { id: "contact", key: "footer.links.contact", path: "/contact" }
];

const COMPANY_LINKS = [
  { id: "about", key: "header.about", path: "/about" },
  { id: "services", key: "header.services", path: "/services" },
  { id: "portfolio", key: "header.portfolio", path: "/portfolio" },
  { id: "contact", key: "header.contact", path: "/contact" }
];

const LANG_LABEL_KEYS = {
  en: "footer.langEnglish",
  tr: "footer.langTurkish"
};

const FooterNavColumn = ({ id, titleKey, links, t }) => (
  <nav className="site-footer__nav-column" aria-labelledby={id}>
    <h3 className="site-footer__col-heading" id={id}>
      {t(titleKey)}
    </h3>
    <ul className="site-footer__link-list">
      {links.map((item) => (
        <li key={item.id}>
          <Link className="site-footer__col-link" to={item.path}>
            {t(item.key)}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

export const Footer = () => {
  const { t, i18n } = useTranslation();
  const uid = useId();
  const [lang, setLang] = useState(() => normalizeLanguage(i18n.resolvedLanguage || i18n.language));

  const handleLangChange = useCallback(
    (e) => {
      const selectedLanguage = normalizeLanguage(e.target.value);
      setLang(selectedLanguage);
      void i18n.changeLanguage(selectedLanguage);
    },
    [i18n]
  );

  useEffect(() => {
    setLang(normalizeLanguage(i18n.resolvedLanguage || i18n.language));
  }, [i18n, i18n.language, i18n.resolvedLanguage]);

  const headingId = (suffix) => `${uid}${suffix}`;

  return (
    <footer className="site-footer safe-area-inset" role="contentinfo">
      <h2 className="site-footer__sr-only">{t("footer.srTitle")}</h2>

      <div className="site-footer__primary">
        <div className="site-footer__primary-inner">
          <div className="site-footer__primary-row">
            <section className="site-footer__brand-col" aria-labelledby={headingId("-newsletter")}>
              <Link to="/" className="site-footer__logo-link" aria-label={t("header.homeAria")}>
                <img src={logo} alt="" className="site-footer__logo" loading="lazy" />
              </Link>
              <div className="site-footer__cta">
                <h3 className="site-footer__cta-title" id={headingId("-newsletter")}>
                  {t("footer.newsletterTitle")}
                </h3>
                <p className="site-footer__cta-body">{t("footer.newsletterBody")}</p>
              </div>
            </section>

            <FooterNavColumn
              id={headingId("-col-platform")}
              titleKey="footer.colPlatform"
              links={PLATFORM_LINKS}
              t={t}
            />
            <FooterNavColumn
              id={headingId("-col-solutions")}
              titleKey="footer.colSolutions"
              links={SOLUTIONS_LINKS}
              t={t}
            />
            <FooterNavColumn
              id={headingId("-col-resources")}
              titleKey="footer.colResources"
              links={RESOURCES_LINKS}
              t={t}
            />
            <FooterNavColumn
              id={headingId("-col-company")}
              titleKey="footer.colCompany"
              links={COMPANY_LINKS}
              t={t}
            />
          </div>
        </div>
      </div>

      <div className="site-footer__sub">
        <div className="site-footer__sub-inner">
          <nav className="site-footer__meta-nav" aria-label={t("footer.legalNavAria")}>
            <ul className="site-footer__meta-list">
              <li className="site-footer__meta-item site-footer__meta-item--copy">
                <span className="site-footer__meta-copy">
                  © {new Date().getFullYear()} {t("home.title")}. {t("footer.rights")}
                </span>
              </li>
            </ul>
          </nav>
          <div className="site-footer__sub-right">
            <div className="site-footer__social">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="site-footer__social-link"
                  aria-label={t(`footer.socialAria.${item.id}`)}
                  onClick={(e) => e.preventDefault()}
                >
                  <FooterSocialIcon id={item.id} />
                </a>
              ))}
            </div>
            <label className="site-footer__lang">
              <span className="site-footer__lang-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="6.25" stroke="currentColor" strokeWidth="1.2" />
                  <path
                    d="M2 8h12M8 2.2c1.6 1.9 1.6 11.7 0 13.6M8 2.2C6.4 4.1 6.4 13.9 8 15.8"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  />
                </svg>
              </span>
              <span className="site-footer__sr-only">{t("header.languageSelectAria")}</span>
              <select
                className="site-footer__lang-select"
                value={lang}
                onChange={handleLangChange}
              >
                {SUPPORTED_LANGUAGES.map((languageCode) => (
                  <option value={languageCode} key={languageCode}>
                    {t(LANG_LABEL_KEYS[languageCode])}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>
    </footer>
  );
};
