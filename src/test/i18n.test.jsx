import i18n, { normalizeLanguage } from "../i18n/i18n";

describe("i18n bootstrap", () => {
  test("normalizes languages and falls back to english", () => {
    expect(normalizeLanguage("tr-TR")).toBe("tr");
    expect(normalizeLanguage("en-US")).toBe("en");
    expect(normalizeLanguage("de-DE")).toBe("en");
    expect(normalizeLanguage()).toBe("en");
  });

  test("resolves known translation keys", () => {
    expect(i18n.t("home.title", { lng: "en" })).toBe("Labsoy Technologies");
    expect(i18n.t("header.services", { lng: "tr" })).toBe("Hizmetler");
  });

  test("changes language safely", async () => {
    await i18n.changeLanguage("tr");
    expect(i18n.language).toBe("tr");
    await i18n.changeLanguage("en");
    expect(i18n.language).toBe("en");
  });
});
