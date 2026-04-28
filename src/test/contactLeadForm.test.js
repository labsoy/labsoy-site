import { describe, it, expect } from "vitest";
import { sanitizeField, validateContactLead, validatePhoneOptional, buildMailtoHref } from "../utils/contactLeadForm";

describe("contactLeadForm", () => {
  it("sanitizeField strips angle brackets and respects max", () => {
    expect(sanitizeField("  a<b>  ", 10)).toBe("ab");
    expect(sanitizeField("x".repeat(50), 5)).toBe("xxxxx");
  });

  it("validatePhoneOptional", () => {
    expect(validatePhoneOptional("")).toBe(true);
    expect(validatePhoneOptional("+90 552 404 4224")).toBe(true);
    expect(validatePhoneOptional("abc")).toBe(false);
    expect(validatePhoneOptional("123")).toBe(false);
  });

  it("validateContactLead", () => {
    expect(validateContactLead({ name: "", email: "", phone: "", message: "" }).ok).toBe(false);
    expect(validateContactLead({ name: "A", email: "bad", phone: "", message: "Hi" }).ok).toBe(false);
    expect(validateContactLead({ name: "A", email: "a@b.co", phone: "", message: "Hi" }).ok).toBe(true);
  });

  it("buildMailtoHref", () => {
    const href = buildMailtoHref({
      to: "info@labsoy.com",
      name: "N",
      email: "e@e.com",
      phone: "",
      message: "Body",
      subject: "Subj"
    });
    expect(href.startsWith("mailto:info@labsoy.com?")).toBe(true);
    expect(href).toContain("subject=Subj");
    expect(decodeURIComponent(href)).toContain("Body");
  });
});
