import { createPortal } from "react-dom";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const IconClose = memo(function IconClose({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
});

const IconExternal = memo(function IconExternal({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

const portfolioHeroVideoModules = import.meta.glob("../../assets/videos/*.{mp4,webm,ogg,mov,m4v}", {
  eager: true,
  import: "default"
});

export const HomePortfolio = memo(function HomePortfolio() {
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showOnlyNew, setShowOnlyNew] = useState(false);
  const [sortMode, setSortMode] = useState("newest");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [isHeaderAnimating, setIsHeaderAnimating] = useState(false);
  const headerRef = useRef(null);

  const categories = useMemo(() => {
    const raw = t("home.portfolioSection.categories", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t]);

  const projects = useMemo(() => {
    const raw = t("home.portfolioSection.projects", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t]);

  const portfolioHeroVideo = useMemo(() => {
    const entries = Object.entries(portfolioHeroVideoModules);
    if (entries.length === 0) return "";
    entries.sort(([pathA], [pathB]) => {
      const score = (path) => {
        const lower = path.toLowerCase();
        if (lower.includes("showcase")) return 0;
        if (lower.includes("portfolio")) return 1;
        if (lower.includes("hero")) return 2;
        return 3;
      };
      const scoreA = score(pathA);
      const scoreB = score(pathB);
      if (scoreA !== scoreB) return scoreA - scoreB;
      return pathA.localeCompare(pathB);
    });
    return typeof entries[0][1] === "string" ? entries[0][1] : "";
  }, []);

  useEffect(() => {
    setSelectedCategory("all");
    setShowOnlyNew(false);
    setSortMode("newest");
    setSearchTerm("");
    setSelectedId(null);
  }, [i18n.language]);

  const visibleProjects = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLocaleLowerCase(i18n.language);
    const withIndex = projects.map((project, index) => ({ ...project, _order: index }));
    const byCategory =
      selectedCategory === "all" ? withIndex : withIndex.filter((project) => project.category === selectedCategory);
    const withSearch =
      normalizedSearch.length === 0
        ? byCategory
        : byCategory.filter((project) => {
            const haystack = [project.title, project.description, project.details, ...(project.tags || [])]
              .join(" ")
              .toLocaleLowerCase(i18n.language);
            return haystack.includes(normalizedSearch);
          });
    const withNewFilter = showOnlyNew ? withSearch.filter((project) => project._order < 3) : withSearch;

    const sorted = [...withNewFilter];
    if (sortMode === "name-asc") {
      sorted.sort((a, b) => a.title.localeCompare(b.title, i18n.language));
    } else if (sortMode === "name-desc") {
      sorted.sort((a, b) => b.title.localeCompare(a.title, i18n.language));
    } else {
      sorted.sort((a, b) => a._order - b._order);
    }

    return sorted;
  }, [projects, selectedCategory, showOnlyNew, sortMode, searchTerm, i18n.language]);

  const selectedProject = useMemo(
    () => (selectedId == null ? null : projects.find((p) => p.id === selectedId) ?? null),
    [projects, selectedId]
  );

  const featuredProject = useMemo(() => visibleProjects[0] ?? null, [visibleProjects]);
  const projectCards = useMemo(() => visibleProjects.slice(1), [visibleProjects]);

  const categoryLabel = useCallback(
    (categoryId) => categories.find((c) => c.id === categoryId)?.label ?? categoryId,
    [categories]
  );

  useEffect(() => {
    if (!selectedProject) return undefined;
    const onKey = (ev) => {
      if (ev.key === "Escape") setSelectedId(null);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [selectedProject]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const headerNode = headerRef.current;
    if (!headerNode) return undefined;
    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (prefersReducedMotion) {
      setIsHeaderAnimating(false);
      return undefined;
    }

    let timeoutId;
    const triggerAnimation = () => {
      setIsHeaderAnimating(false);
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => setIsHeaderAnimating(true), 24);
    };

    triggerAnimation();

    if (typeof window.IntersectionObserver !== "function") {
      return () => {
        if (timeoutId) window.clearTimeout(timeoutId);
      };
    }

    const observer = new window.IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting) {
          triggerAnimation();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(headerNode);

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [i18n.language]);

  const modal =
    selectedProject && typeof document !== "undefined"
      ? createPortal(
          <div className="home-portfolio__overlay" role="presentation" onClick={() => setSelectedId(null)}>
            <div
              className="home-portfolio__modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="home-portfolio-modal-title"
              onClick={(e) => e.stopPropagation()}
            >
              <figure className="home-portfolio__modal-figure">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="home-portfolio__modal-img"
                />
                <button
                  type="button"
                  className="home-portfolio__modal-close"
                  data-testid="button-close-modal"
                  aria-label={t("home.portfolioSection.modalCloseAria")}
                  onClick={() => setSelectedId(null)}
                >
                  <IconClose className="home-portfolio__modal-close-icon" />
                </button>
              </figure>
              <article className="home-portfolio__modal-body">
                <span className="home-portfolio__modal-badge">{categoryLabel(selectedProject.category)}</span>
                <h2 id="home-portfolio-modal-title" className="home-portfolio__modal-title">
                  {selectedProject.title}
                </h2>
                <p className="home-portfolio__modal-details">{selectedProject.details}</p>
                <div className="home-portfolio__modal-tags">
                  {(selectedProject.tags || []).map((tag) => (
                    <span key={tag} className="home-portfolio__modal-tag">
                      {tag}
                    </span>
                  ))}
                </div>
                <Link to="/contact" className="home-portfolio__modal-cta">
                  <IconExternal className="home-portfolio__modal-cta-icon" />
                  {t("home.portfolioSection.modalCta")}
                </Link>
              </article>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <section id="portfolio" className="home-portfolio" aria-label={t("home.portfolioSection.sectionAria")}>
      <div className="home-portfolio__bg" aria-hidden="true">
        <div className="home-portfolio__bg-orb" />
        <div className="home-portfolio__bg-mesh" />
      </div>
      <div className="home-portfolio__inner">
        <div className="home-portfolio__masthead">
          <header
            ref={headerRef}
            className={`home-portfolio__header home-portfolio__header--animated ${
              isHeaderAnimating ? "is-animating" : ""
            }`.trim()}
          >
            {portfolioHeroVideo ? (
              <video
                className="home-portfolio__hero-video"
                src={portfolioHeroVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-hidden="true"
              />
            ) : null}
            <div className="home-portfolio__hero-overlay" aria-hidden="true" />
          </header>

          <div className="home-portfolio__controls" role="region" aria-label={t("home.portfolioSection.filterAria")}>
            <div className="home-portfolio__filters" role="toolbar" aria-label={t("home.portfolioSection.filterAria")}>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`home-portfolio__chip ${selectedCategory === cat.id ? "home-portfolio__chip--active" : ""}`}
                  data-testid={`button-category-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            <div className="home-portfolio__meta">
              <label className="home-portfolio__search-wrap">
                <span className="home-portfolio__search-label">
                  {t("home.portfolioSection.searchLabel", { defaultValue: "Proje ara" })}
                </span>
                <input
                  type="search"
                  className="home-portfolio__search-input"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={t("home.portfolioSection.searchPlaceholder", { defaultValue: "Baslik, etiket, teknoloji" })}
                />
              </label>
              <button
                type="button"
                className={`home-portfolio__toggle ${showOnlyNew ? "home-portfolio__toggle--active" : ""}`}
                onClick={() => setShowOnlyNew((prev) => !prev)}
              >
                {t("home.portfolioSection.onlyNewLabel", { defaultValue: "Yeni eklenenler" })}
              </button>
              <label className="home-portfolio__sort-wrap">
                <span className="home-portfolio__sort-label">
                  {t("home.portfolioSection.sortLabel", { defaultValue: "Siralama" })}
                </span>
                <select
                  className="home-portfolio__sort-select"
                  value={sortMode}
                  onChange={(event) => setSortMode(event.target.value)}
                >
                  <option value="newest">{t("home.portfolioSection.sortNewest", { defaultValue: "En yeni" })}</option>
                  <option value="name-asc">{t("home.portfolioSection.sortNameAsc", { defaultValue: "A-Z" })}</option>
                  <option value="name-desc">{t("home.portfolioSection.sortNameDesc", { defaultValue: "Z-A" })}</option>
                </select>
              </label>
              <p className="home-portfolio__result-count">
                {t("home.portfolioSection.resultCountLabel", {
                  defaultValue: "{{count}} proje",
                  count: visibleProjects.length
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="home-portfolio__content">
          {featuredProject ? (
            <article className="home-portfolio__featured" data-testid="portfolio-featured-case">
              <figure className="home-portfolio__featured-figure">
                <img
                  src={featuredProject.image}
                  alt={featuredProject.title}
                  width={1200}
                  height={800}
                  loading="lazy"
                  className="home-portfolio__featured-img"
                />
              </figure>
              <div className="home-portfolio__featured-body">
                <span className="home-portfolio__featured-kicker">{t("home.portfolioSection.featuredKicker")}</span>
                <h3 className="home-portfolio__featured-title">{featuredProject.title}</h3>
                <p className="home-portfolio__featured-desc">{featuredProject.details}</p>
                <div className="home-portfolio__featured-actions">
                  <button
                    type="button"
                    className="home-portfolio__featured-btn home-portfolio__featured-btn--primary"
                    onClick={() => setSelectedId(featuredProject.id)}
                  >
                    {t("home.portfolioSection.viewDetails")}
                  </button>
                  <Link to="/contact" className="home-portfolio__featured-btn home-portfolio__featured-btn--secondary">
                    {t("home.portfolioSection.modalCta")}
                  </Link>
                </div>
              </div>
            </article>
          ) : null}

          {projectCards.length > 0 ? (
            <div className="home-portfolio__grid">
              {projectCards.map((project) => (
                <button
                  key={project.id}
                  type="button"
                  className="home-portfolio__card"
                  data-testid={`project-card-${project.id}`}
                  aria-label={`${project.title}. ${project.description}`}
                  onClick={() => setSelectedId(project.id)}
                >
                  <figure className="home-portfolio__card-figure">
                    <img
                      src={project.image}
                      alt=""
                      width={800}
                      height={600}
                      loading="lazy"
                      className="home-portfolio__card-img"
                    />
                    <span className="home-portfolio__card-badge">{categoryLabel(project.category)}</span>
                  </figure>
                  <div className="home-portfolio__card-body">
                    <h3 className="home-portfolio__card-title">{project.title}</h3>
                    <p className="home-portfolio__card-desc">{project.description}</p>
                    <div className="home-portfolio__card-tags">
                      {(project.tags || []).slice(0, 2).map((tag) => (
                        <span key={tag} className="home-portfolio__card-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="home-portfolio__empty">
              <p className="home-portfolio__empty-title">
                {t("home.portfolioSection.emptyTitle", { defaultValue: "Bu filtreye uygun proje bulunamadi." })}
              </p>
              <p className="home-portfolio__empty-text">
                {t("home.portfolioSection.emptyText", { defaultValue: "Filtreleri sifirlayarak tekrar deneyebilirsiniz." })}
              </p>
            </div>
          )}
        </div>
      </div>
      {modal}
    </section>
  );
});
