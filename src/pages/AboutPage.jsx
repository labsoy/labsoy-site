import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { SeoMeta } from "../component/SEO/SeoMeta";
import "../styles/pages/about-page.css";

export const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const storyParagraphs = t("aboutPage.story.paragraphs", { returnObjects: true });
  const storyMilestones = t("aboutPage.story.milestones", { returnObjects: true });
  const values = t("aboutPage.values.items", { returnObjects: true });
  const differentiators = t("aboutPage.differentiators.items", { returnObjects: true });
  const teamPoints = t("aboutPage.team.points", { returnObjects: true });
  const trustStats = t("aboutPage.trust.stats", { returnObjects: true });

  return (
    <section className="home-page about-page subpage-atmosphere">
      <SeoMeta
        title={t("seo.about.title")}
        description={t("seo.about.description")}
        keywords={t("seo.about.keywords")}
        path="/about"
        locale={i18n.resolvedLanguage || i18n.language}
        schema={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: t("aboutPage.title"),
          description: t("seo.about.description"),
          publisher: {
            "@type": "Organization",
            name: t("company.fullName")
          }
        }}
      />

      <header className="about-hero" aria-labelledby="about-hero-heading">
        <div className="about-hero__noise" aria-hidden />
        <div className="about-hero__orb about-hero__orb--a" aria-hidden />
        <div className="about-hero__orb about-hero__orb--b" aria-hidden />
        <div className="about-hero__frame">
          <div className="about-hero__grid">
            <div className="about-hero__copy">
              <p className="about-hero__eyebrow">{t("aboutPage.hero.eyebrow")}</p>
              <h1 id="about-hero-heading" className="about-hero__title">
                {t("aboutPage.hero.title")}
              </h1>
              <p className="about-hero__lead">{t("aboutPage.hero.lead")}</p>
              <div className="about-hero__actions">
                <Link to="/contact" className="about-hero__btn about-hero__btn--primary">
                  {t("aboutPage.hero.primaryCta")}
                </Link>
                <Link to="/services" className="about-hero__btn about-hero__btn--ghost">
                  {t("aboutPage.hero.secondaryCta")}
                </Link>
              </div>
            </div>
            <div className="about-hero__panel" aria-hidden>
              <div className="about-hero__deco" />
              <span className="about-hero__corner about-hero__corner--tl" />
              <span className="about-hero__corner about-hero__corner--br" />
            </div>
          </div>
        </div>
      </header>

      <section className="about-band about-band--story" aria-labelledby="about-story-heading">
        <div className="about-shell">
          <div className="about-story__head">
            <p className="about-tag">{t("aboutPage.story.kicker")}</p>
            <h2 id="about-story-heading" className="about-story__title">
              {t("aboutPage.story.title")}
            </h2>
          </div>
          <div className="about-story__body">
            <div className="about-story__text">
              {(Array.isArray(storyParagraphs) ? storyParagraphs : []).map((paragraph) => (
                <p key={paragraph} className="about-story__para">
                  {paragraph}
                </p>
              ))}
            </div>
            <ol className="about-timeline">
              {(Array.isArray(storyMilestones) ? storyMilestones : []).map((milestone) => (
                <li key={milestone.year} className="about-timeline__item">
                  <span className="about-timeline__year">{milestone.year}</span>
                  <p className="about-timeline__text">{milestone.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="about-band" aria-labelledby="about-vision-heading">
        <div className="about-shell about-vision-grid">
          <article className="about-glass about-glass--vision">
            <p className="about-tag">{t("aboutPage.vision.kicker")}</p>
            <h2 id="about-vision-heading">{t("aboutPage.vision.title")}</h2>
            <p>{t("aboutPage.vision.body")}</p>
          </article>
          <article className="about-glass about-glass--mission">
            <p className="about-tag">{t("aboutPage.mission.kicker")}</p>
            <h2>{t("aboutPage.mission.title")}</h2>
            <p>{t("aboutPage.mission.body")}</p>
          </article>
        </div>
      </section>

      <section className="about-band about-band--values" aria-labelledby="about-values-heading">
        <div className="about-shell">
          <div className="about-values__intro">
            <p className="about-tag">{t("aboutPage.values.kicker")}</p>
            <h2 id="about-values-heading">{t("aboutPage.values.title")}</h2>
          </div>
          <ul className="about-bento">
            {(Array.isArray(values) ? values : []).map((item, index) => (
              <li key={item.title} className="about-bento__item">
                <span className="about-bento__index" aria-hidden>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-band" aria-labelledby="about-diff-heading">
        <div className="about-shell about-diff">
          <div className="about-diff__intro">
            <p className="about-tag">{t("aboutPage.differentiators.kicker")}</p>
            <h2 id="about-diff-heading">{t("aboutPage.differentiators.title")}</h2>
          </div>
          <ul className="about-diff__list">
            {(Array.isArray(differentiators) ? differentiators : []).map((item, index) => (
              <li key={item} className="about-diff__item">
                <span className="about-diff__mark" aria-hidden>
                  {index + 1}
                </span>
                <p className="about-diff__text">{item}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="about-band about-band--dual" aria-labelledby="about-team-heading">
        <div className="about-shell about-dual-grid">
          <article className="about-card-dark">
            <p className="about-tag">{t("aboutPage.team.kicker")}</p>
            <h2 id="about-team-heading">{t("aboutPage.team.title")}</h2>
            <p>{t("aboutPage.team.body")}</p>
            <ul className="about-rail">
              {(Array.isArray(teamPoints) ? teamPoints : []).map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </article>
          <aside className="about-stats-board" aria-labelledby="about-trust-heading">
            <p className="about-tag">{t("aboutPage.trust.kicker")}</p>
            <h2 id="about-trust-heading">{t("aboutPage.trust.title")}</h2>
            <p>{t("aboutPage.trust.body")}</p>
            <ul className="about-stats-board__grid">
              {(Array.isArray(trustStats) ? trustStats : []).map((stat) => (
                <li key={stat.label} className="about-stat">
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <footer className="about-cta">
        <div className="about-cta__inner about-shell">
          <p className="about-cta__marquee">{t("company.slogan")}</p>
          <div className="about-cta__actions">
            <Link to="/contact" className="about-cta__btn about-cta__btn--primary">
              {t("aboutPage.finalCta.primary")}
            </Link>
            <Link to="/services" className="about-cta__btn about-cta__btn--ghost">
              {t("aboutPage.finalCta.secondary")}
            </Link>
          </div>
        </div>
      </footer>
    </section>
  );
};
