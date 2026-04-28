import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHeaderLogic } from "../../hooks/useHeaderLogic";
import { NavLink } from "./NavLink";
import { normalizeLanguage } from "../../i18n/i18n";
import logo from "../../assets/images/logo.png";
import {
  getServiceCategoryPath,
  getServiceSecondaryPath,
  getServiceSectionPath
} from "../../config/servicesNav";
import "../../styles/components/header.css";

const SECONDARY_NAV = [
  { id: "about", key: "header.about", path: "/about" },
  { id: "contact", key: "header.contact", path: "/contact" }
];

const SERVICE_MENU_SECTIONS = [
  { id: "popular", key: "headerMenu.popular", icon: "●" },
  { id: "staffPicks", key: "headerMenu.staffPicks", icon: "◆" },
  { id: "downloadable", key: "headerMenu.downloadable", icon: "↓" },
  { id: "collections", key: "headerMenu.collections", icon: "□" },
  { id: "humanCreated", key: "headerMenu.humanCreated", icon: "◇" },
  { id: "aiGenerated", key: "headerMenu.aiGenerated", icon: "◈" }
];

const SERVICE_MENU_CATEGORIES = [
  { id: "consulting", key: "headerMenu.consulting", icon: "◦" },
  { id: "architecture", key: "headerMenu.architecture", icon: "◦" },
  { id: "design", key: "headerMenu.design", icon: "◦" },
  { id: "engineering", key: "headerMenu.engineering", icon: "◦" },
  { id: "platform", key: "headerMenu.platform", icon: "◦" },
  { id: "automation", key: "headerMenu.automation", icon: "◦" },
  { id: "cloud", key: "headerMenu.cloud", icon: "◦" },
  { id: "security", key: "headerMenu.security", icon: "◦" },
  { id: "mobile", key: "headerMenu.mobile", icon: "◦" },
  { id: "aiSolutions", key: "headerMenu.aiSolutions", icon: "◦" },
  { id: "analytics", key: "headerMenu.analytics", icon: "◦" },
  { id: "support", key: "headerMenu.support", icon: "◦" }
];

const SERVICE_MENU_SECONDARY = [
  { id: "insights", key: "headerMenu.insights", icon: "·" },
  { id: "community", key: "headerMenu.community", icon: "·" },
  { id: "partners", key: "headerMenu.partners", icon: "·" }
];

const MOBILE_SERVICE_GROUPS = [
  {
    id: "software",
    titleKey: "headerMenu.popular",
    items: ["consulting", "architecture", "design", "engineering"]
  },
  {
    id: "ai",
    titleKey: "headerMenu.staffPicks",
    items: ["platform", "aiSolutions", "analytics"]
  },
  {
    id: "automation",
    titleKey: "headerMenu.downloadable",
    items: ["automation", "support"]
  },
  {
    id: "infrastructure",
    titleKey: "headerMenu.collections",
    items: ["cloud", "security", "mobile"]
  },
  {
    id: "insights",
    titleKey: "headerMenu.aiGenerated",
    items: ["insights", "community", "partners"]
  }
];

export const Header = () => {
  const { t, i18n } = useTranslation();
  const { pathname } = useLocation();
  const { scrolled, hidden } = useHeaderLogic();
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const servicesMenuRef = useRef(null);

  const headerClass = useMemo(() => {
    return `site-header ${scrolled ? "is-scrolled" : ""} ${hidden ? "is-hidden" : ""}`.trim();
  }, [scrolled, hidden]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsServicesMenuOpen(false);
  }, [pathname]);

  const openServicesMenu = useCallback(() => {
    setIsServicesMenuOpen(true);
  }, []);

  const closeServicesMenu = useCallback(() => {
    setIsServicesMenuOpen(false);
  }, []);

  const handleServicesNavClick = useCallback(
    (event) => {
      // New tab / window / download: do not hijack the native link behavior
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      if (!isServicesMenuOpen) {
        event.preventDefault();
        setIsServicesMenuOpen(true);
        return;
      }
      closeServicesMenu();
    },
    [isServicesMenuOpen, closeServicesMenu]
  );

  const handleServicesMenuBlur = useCallback((event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsServicesMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    if (!isServicesMenuOpen) return undefined;

    const onDocPointerDown = (event) => {
      const el = servicesMenuRef.current;
      if (el && !el.contains(event.target)) {
        setIsServicesMenuOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsServicesMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", onDocPointerDown, true);
    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown, true);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [isServicesMenuOpen]);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const toggleLanguage = useCallback(() => {
    const current = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
    void i18n.changeLanguage(current === "tr" ? "en" : "tr");
  }, [i18n]);

  const langToggleAria = useMemo(() => {
    const current = normalizeLanguage(i18n.resolvedLanguage || i18n.language);
    return current === "tr" ? t("header.languageToggleToEnAria") : t("header.languageToggleToTrAria");
  }, [i18n.resolvedLanguage, i18n.language, t]);

  const isPortfolioActive = pathname === "/portfolio";

  return (
    <header className={headerClass} role="banner">
      <div className="site-header__shell">
        <div className="site-header__bar">
          <div className="site-header__left">
            <Link to="/" className="site-header__brand hover-elevate" aria-label={t("header.homeAria")}>
              <img
                src={logo}
                alt=""
                className="site-header__logo"
                width={100}
                height={40}
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
            </Link>
          </div>

          <div className="site-header__end">
            <nav className="site-header__nav" aria-label={t("header.navAria")}>
              <ul className="site-header__nav-list" role="list">
                <li className="site-header__nav-item" role="listitem">
                  <NavLink to="/" label={t("header.home")} isActive={pathname === "/"} />
                </li>
                <li
                  ref={servicesMenuRef}
                  className="site-header__nav-item site-header__menu-item"
                  role="listitem"
                  onMouseEnter={openServicesMenu}
                  onMouseLeave={closeServicesMenu}
                  onFocus={openServicesMenu}
                  onBlur={handleServicesMenuBlur}
                >
                  <NavLink
                    to="/services"
                    label={t("header.services")}
                    isActive={pathname === "/services"}
                    aria-expanded={isServicesMenuOpen}
                    aria-controls="desktop-services-mega-menu"
                    aria-haspopup="menu"
                    onClick={handleServicesNavClick}
                  />

                  <div
                    id="desktop-services-mega-menu"
                    className={`services-mega-menu ${isServicesMenuOpen ? "is-open" : ""}`}
                    role="region"
                    aria-label={t("header.services")}
                    hidden={!isServicesMenuOpen}
                  >
                    <div className="services-mega-menu__left">
                      {SERVICE_MENU_SECTIONS.map((section) => (
                        <Link
                          key={section.id}
                          to={getServiceSectionPath(section.id)}
                          className="services-mega-menu__left-item"
                          onClick={closeServicesMenu}
                        >
                          <span className="services-mega-menu__emoji" aria-hidden="true">
                            {section.icon}
                          </span>
                          {t(section.key)}
                        </Link>
                      ))}
                    </div>

                    <div className="services-mega-menu__content">
                      <div className="services-mega-menu__grid">
                        {SERVICE_MENU_CATEGORIES.map((category) => (
                          <Link
                            key={category.id}
                            to={getServiceCategoryPath(category.id)}
                            className="services-mega-menu__category"
                            onClick={closeServicesMenu}
                          >
                            <span className="services-mega-menu__emoji" aria-hidden="true">{category.icon}</span>
                            {t(category.key)}
                          </Link>
                        ))}
                      </div>

                      <div className="services-mega-menu__secondary">
                        {SERVICE_MENU_SECONDARY.map((item) => (
                          <Link
                            key={item.id}
                            to={getServiceSecondaryPath(item.id)}
                            className="services-mega-menu__secondary-link"
                            onClick={closeServicesMenu}
                          >
                            <span className="services-mega-menu__emoji" aria-hidden="true">{item.icon}</span>
                            {t(item.key)}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
                <li className="site-header__nav-item" role="listitem">
                  <NavLink
                    to="/portfolio"
                    label={t("header.portfolio")}
                    isActive={isPortfolioActive}
                  />
                </li>
                {SECONDARY_NAV.map((item) => (
                  <li key={item.id} className="site-header__nav-item" role="listitem">
                    <NavLink to={item.path} label={t(item.key)} isActive={pathname === item.path} />
                  </li>
                ))}
              </ul>
            </nav>

            <button
              type="button"
              className="site-header__lang-toggle hover-elevate"
              aria-label={langToggleAria}
              data-testid="button-header-language-toggle"
              onClick={toggleLanguage}
            >
              <svg className="site-header__lang-svg" viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
                <path
                  d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button
              type="button"
              className="site-header__mobile-toggle"
              aria-label={isMobileMenuOpen ? t("header.closeMenuAria") : t("header.openMenuAria")}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={toggleMobileMenu}
            >
              <span className="site-header__mobile-toggle-line" />
              <span className="site-header__mobile-toggle-line" />
              <span className="site-header__mobile-toggle-line" />
            </button>
          </div>
        </div>
      </div>

      <div id="mobile-navigation" className={`site-header__mobile-panel ${isMobileMenuOpen ? "is-open" : ""}`}>
        <div className="site-header__mobile-links">
          <NavLink
            to="/"
            label={t("header.home")}
            isActive={pathname === "/"}
            onClick={closeMobileMenu}
          />
          <NavLink
            to="/services"
            label={t("header.services")}
            isActive={pathname === "/services"}
            onClick={closeMobileMenu}
          />
          <NavLink
            to="/portfolio"
            label={t("header.portfolio")}
            isActive={isPortfolioActive}
            onClick={closeMobileMenu}
          />
          {SECONDARY_NAV.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              label={t(item.key)}
              isActive={pathname === item.path}
              onClick={closeMobileMenu}
            />
          ))}
        </div>

        <div className="site-header__mobile-services">
          {MOBILE_SERVICE_GROUPS.map((group) => (
            <section key={group.id} className="site-header__mobile-service-group">
              <h3 className="site-header__mobile-service-title">{t(group.titleKey)}</h3>
              <div className="site-header__mobile-service-links">
                {group.items.map((itemId) => {
                  const item =
                    SERVICE_MENU_CATEGORIES.find((category) => category.id === itemId) ||
                    SERVICE_MENU_SECONDARY.find((secondaryItem) => secondaryItem.id === itemId);
                  if (!item) return null;
                  const toPath = SERVICE_MENU_SECONDARY.some((s) => s.id === itemId)
                    ? getServiceSecondaryPath(itemId)
                    : getServiceCategoryPath(itemId);
                  return (
                    <Link
                      key={item.id}
                      to={toPath}
                      className="site-header__mobile-service-link"
                      onClick={closeMobileMenu}
                    >
                      <span className="services-mega-menu__emoji" aria-hidden="true">{item.icon}</span>
                      {t(item.key)}
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </header>
  );
};