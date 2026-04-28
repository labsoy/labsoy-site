import { useEffect } from "react";

const siteOrigin = () =>
  (import.meta.env.VITE_PUBLIC_SITE_URL && String(import.meta.env.VITE_PUBLIC_SITE_URL).replace(/\/$/, "")) ||
  (typeof window !== "undefined" ? window.location.origin : "https://labsoy.com");

const publicBasePath = () => import.meta.env.BASE_URL.replace(/\/$/, "");

const upsertMeta = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value) {
      element.setAttribute(key, value);
    }
  });
};

const upsertLink = (selector, attributes) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    if (value) {
      element.setAttribute(key, value);
    }
  });
};

const upsertJsonLd = (id, payload) => {
  let element = document.head.querySelector(`#${id}`);
  if (!element) {
    element = document.createElement("script");
    element.id = id;
    element.type = "application/ld+json";
    document.head.appendChild(element);
  }
  element.textContent = JSON.stringify(payload);
};

export const SeoMeta = ({
  title,
  description,
  keywords,
  path = "/",
  locale = "en",
  schema = null
}) => {
  useEffect(() => {
    const origin = siteOrigin();
    const base = publicBasePath();
    const pathNorm = path.startsWith("/") ? path : `/${path}`;
    const url = base ? `${origin}${base}${pathNorm}` : `${origin}${pathNorm}`;
    document.title = "Labsoy Technologies";

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="keywords"]', { name: "keywords", content: keywords });
    upsertMeta('meta[name="robots"]', { name: "robots", content: "index, follow, max-image-preview:large" });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: "website" });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: "Labsoy" });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: url });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: locale === "tr" ? "tr_TR" : "en_US" });
    upsertMeta('meta[name="twitter:card"]', { name: "twitter:card", content: "summary_large_image" });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertLink('link[rel="canonical"]', { rel: "canonical", href: url });

    if (schema) {
      upsertJsonLd("labsoy-page-schema", schema);
    }
  }, [title, description, keywords, path, locale, schema]);

  return null;
};
