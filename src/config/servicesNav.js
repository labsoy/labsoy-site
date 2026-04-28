/**
 * Header mega menu targets. Paths align with `ServicesPage` section / line element ids
 * and secondary site routes.
 */

const SERVICE_SECTION_PATHS = {
  popular: "/services#svc-software",
  staffPicks: "/services#svc-ai",
  downloadable: "/services#svc-automation",
  collections: "/services#svc-infrastructure",
  humanCreated: "/services#services-process-heading",
  aiGenerated: "/services#svc-growth"
};

/* headerMenu id → servicesPage.service catalog key (svc-line-*) or final CTA id */
const CATEGORY_CATALOG_ID = {
  consulting: "digitalTransformation",
  architecture: "apiIntegration",
  design: "webDesign",
  engineering: "softwareSolutions",
  platform: "enterpriseAiPlatform",
  automation: "automationN8n",
  cloud: "hostingSsl",
  security: "cyberSecurity",
  mobile: "ecommerceAi",
  aiSolutions: "personalizedChatbot",
  analytics: "bigData",
  support: "services-final-cta"
};

const SECONDARY_PATHS = {
  insights: "/about#about-story-heading",
  community: "/portfolio",
  partners: "/contact"
};

export const getServiceSectionPath = (sectionId) => SERVICE_SECTION_PATHS[sectionId] ?? "/services";

export const getServiceCategoryPath = (categoryId) => {
  const key = CATEGORY_CATALOG_ID[categoryId];
  if (!key) return "/services";
  if (key === "services-final-cta") return "/services#services-final-cta";
  return `/services#svc-line-${key}`;
};

export const getServiceSecondaryPath = (secondaryId) => SECONDARY_PATHS[secondaryId] ?? "/services";
