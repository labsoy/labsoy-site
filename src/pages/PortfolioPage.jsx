import "../styles/pages/home.css";
import "../styles/pages/portfolio-page.css";
import { useTranslation } from "react-i18next";
import { HomePortfolio } from "../component/Home/HomePortfolio";
import { SeoMeta } from "../component/SEO/SeoMeta";

export const PortfolioPage = () => {
  const { t, i18n } = useTranslation();

  return (
    <section className="home-page portfolio-page subpage-atmosphere">
      <SeoMeta
        title={t("seo.portfolio.title")}
        description={t("seo.portfolio.description")}
        keywords={t("seo.portfolio.keywords")}
        path="/portfolio"
        locale={i18n.resolvedLanguage || i18n.language}
        schema={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: t("header.portfolio"),
          description: t("seo.portfolio.description"),
          isPartOf: {
            "@type": "WebSite",
            name: t("company.fullName"),
            url: "https://labsoy.com"
          }
        }}
      />
      <HomePortfolio />
    </section>
  );
};
