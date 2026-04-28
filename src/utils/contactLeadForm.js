const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const sanitizeField = (input, maxLen) => {
  if (typeof input !== "string") return "";
  return input.trim().replace(/[<>]/g, "").slice(0, maxLen);
};

export const validatePhoneOptional = (phone) => {
  if (!phone) return true;
  if (typeof phone !== "string") return false;
  const okChars = /^[\d\s+().-]+$/u.test(phone);
  const digits = phone.replace(/\D/g, "").length;
  return okChars && digits >= 7 && digits <= 20;
};

export const validateContactLead = ({ name, email, phone, message }) => {
  const errors = {};
  if (!name) errors.name = "required";
  if (!email) errors.email = "required";
  else if (!EMAIL_RE.test(email)) errors.email = "email";
  if (!message) errors.message = "required";
  if (!validatePhoneOptional(phone)) errors.phone = "phone";
  return { ok: Object.keys(errors).length === 0, errors };
};

export const buildMailtoHref = ({ to, name, email, phone, message, subject }) => {
  const lines = [`Name: ${name}`, `Email: ${email}`, phone ? `Phone: ${phone}` : "", "", message].filter(Boolean);
  const body = lines.join("\n").slice(0, 1800);
  const params = new URLSearchParams();
  params.set("subject", subject.slice(0, 200));
  params.set("body", body);
  return `mailto:${to}?${params.toString()}`;
};

export const validateLeadModal = ({ name, email, company, serviceKey }) => {
  const errors = {};
  if (!name) errors.name = "required";
  if (!email) errors.email = "required";
  else if (!EMAIL_RE.test(email)) errors.email = "email";
  if (!company) errors.company = "required";
  if (!serviceKey) errors.service = "required";
  return { ok: Object.keys(errors).length === 0, errors };
};

export const buildMailtoLeadModal = ({ to, name, email, company, serviceLabel, subject }) => {
  const lines = [
    `Name: ${name}`,
    `Company: ${company}`,
    `Email: ${email}`,
    `Service interest: ${serviceLabel}`,
    "",
    "Request submitted from labsoy.com lead form."
  ];
  const body = lines.join("\n").slice(0, 1800);
  const params = new URLSearchParams();
  params.set("subject", subject.slice(0, 200));
  params.set("body", body);
  return `mailto:${to}?${params.toString()}`;
};
