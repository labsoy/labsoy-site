import { useTranslation } from "react-i18next";
import { SeoMeta } from "../component/SEO/SeoMeta";
import { HomeContact } from "../component/Home/HomeContact";
import "../styles/pages/contact-page.css";
export const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const emailValue = t("contactPage.emailValue");
  const phoneValue = t("contactPage.phoneValue");
  const phoneHref = `tel:${phoneValue.replace(/\s+/g, "")}`;

  return (
    <section className="home-page contact-page subpage-atmosphere">
      <SeoMeta
        title={t("seo.contact.title")}
        description={t("seo.contact.description")}
        keywords={t("seo.contact.keywords")}
        path="/contact"
        locale={i18n.resolvedLanguage || i18n.language}
        schema={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: t("contactPage.title"),
          description: t("seo.contact.description"),
          mainEntity: {
            "@type": "Organization",
            name: t("company.fullName"),
            email: t("contactPage.emailValue"),
            telephone: t("contactPage.phoneValue")
          }
        }}
      />
      <header className="contact-modern__hero" aria-labelledby="contact-hero-heading">
        <div className="contact-modern__noise" aria-hidden />
        <div className="contact-modern__orb contact-modern__orb--a" aria-hidden />
        <div className="contact-modern__orb contact-modern__orb--b" aria-hidden />
        <div className="contact-modern__shell">
          <div className="contact-modern__hero-grid">
            <div>
              <p className="contact-modern__eyebrow">{t("home.contactSection.eyebrow")}</p>
              <h1 id="contact-hero-heading" className="contact-modern__title">
                {t("contactPage.title")}
              </h1>
              <p className="contact-modern__lead">{t("contactPage.intro")}</p>
              <div className="contact-modern__actions">
                <a href={`mailto:${emailValue}`} className="contact-modern__btn contact-modern__btn--primary">
                  {emailValue}
                </a>
                <a href={phoneHref} className="contact-modern__btn contact-modern__btn--ghost">
                  {phoneValue}
                </a>
              </div>
            </div>
            <aside className="contact-modern__cards" aria-label={t("contactPage.detailsTitle")}>
              <article className="contact-modern__card">
                <p>{t("home.contactSection.emailLabel")}</p>
                <a href={`mailto:${emailValue}`}>{emailValue}</a>
              </article>
              <article className="contact-modern__card">
                <p>{t("home.contactSection.phoneLabel")}</p>
                <a href={phoneHref}>{phoneValue}</a>
              </article>
              <article className="contact-modern__card">
                <p>{t("home.contactSection.locationLabel")}</p>
                <span>{t("home.contactSection.locationValue")}</span>
              </article>
            </aside>
          </div>
        </div>
      </header>
      <section className="contact-modern__form-band">
        <div className="contact-modern__shell">
          <HomeContact />
        </div>
      </section>
    </section>
  );
};
