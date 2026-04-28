import "../styles/pages/home.css";
import { useTranslation } from "react-i18next";
import { HomeHero } from "../component/Home/HomeHero";
import { HomeStats } from "../component/Home/HomeStats";
import { HomeCompany } from "../component/Home/HomeCompany";
import { HomeServices } from "../component/Home/HomeServices";
import { HomeCta } from "../component/Home/HomeCta";
import { SeoMeta } from "../component/SEO/SeoMeta";

export const HomePage = () => {
  const { t, i18n } = useTranslation();

  return (
    <section className="home-page">
      <SeoMeta
        title={t("seo.home.title")}
        description={t("seo.home.description")}
        keywords={t("seo.home.keywords")}
        path="/"
        locale={i18n.resolvedLanguage || i18n.language}
        schema={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: t("company.fullName"),
          url: "https://labsoy.com",
          email: t("company.email"),
          telephone: t("company.phone")
        }}
      />
      <HomeHero />
      <HomeStats />
      <HomeCompany />
      <HomeServices />
      <HomeCta />
    </section>
  );
};
