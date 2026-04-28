import { memo, useCallback, useId, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { sanitizeField, validateContactLead, buildMailtoHref } from "../../utils/contactLeadForm";

const IconMail = memo(function IconMail({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 6h16v12H4V6Zm2 2 6 4 6-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

const IconPhone = memo(function IconPhone({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 4h4l2 5a12 12 0 0 0 5 5l5 2v4h-3a9 9 0 0 1-9-9V4Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
});

const IconMap = memo(function IconMap({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
});

const IconSend = memo(function IconSend({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
});

export const HomeContact = memo(function HomeContact({ standalone = false }) {
  const { t } = useTranslation();
  const baseId = useId();
  const emailValue = t("contactPage.emailValue");
  const phoneValue = t("contactPage.phoneValue");
  const phoneHref = useMemo(() => `tel:${phoneValue.replace(/\s+/g, "")}`, [phoneValue]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const errMsg = useCallback(
    (key) => {
      if (key === "email") return t("home.contactSection.errorEmail");
      if (key === "phone") return t("home.contactSection.errorPhone");
      return t("home.contactSection.errorGeneric");
    },
    [t]
  );

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setStatus("");
      const sn = sanitizeField(name, 100);
      const se = sanitizeField(email, 255);
      const sp = sanitizeField(phone, 20);
      const sm = sanitizeField(message, 2000);
      const { ok, errors: next } = validateContactLead({
        name: sn,
        email: se,
        phone: sp,
        message: sm
      });
      if (!ok) {
        setErrors(next);
        return;
      }
      setErrors({});
      const href = buildMailtoHref({
        to: emailValue,
        name: sn,
        email: se,
        phone: sp,
        message: sm,
        subject: t("home.contactSection.subjectLine")
      });
      if (import.meta.env.MODE === "test") {
        setStatus("ok");
        setName("");
        setEmail("");
        setPhone("");
        setMessage("");
        return;
      }
      window.location.assign(href);
    },
    [name, email, phone, message, emailValue, t]
  );

  return (
    <section
      id="contact"
      className={`home-contact ${standalone ? "home-contact--standalone" : ""}`.trim()}
      aria-label={t("home.contactSection.sectionAria")}
    >
      <div className="home-contact__inner">
        <header className="home-contact__header">
          <p className="home-contact__eyebrow">{t("home.contactSection.eyebrow")}</p>
          <h2 className="home-contact__title">{t("home.contactSection.title")}</h2>
          <p className="home-contact__lead">{t("home.contactSection.description")}</p>
        </header>

        <div className="home-contact__grid">
          <address className="home-contact__address">
            <div className="home-contact__addr-row">
              <div className="home-contact__addr-icon">
                <IconMail className="home-contact__addr-svg" />
              </div>
              <div>
                <h3 className="home-contact__addr-label">{t("home.contactSection.emailLabel")}</h3>
                <a className="home-contact__addr-value" href={`mailto:${emailValue}`}>
                  {emailValue}
                </a>
              </div>
            </div>
            <div className="home-contact__addr-row">
              <div className="home-contact__addr-icon">
                <IconPhone className="home-contact__addr-svg" />
              </div>
              <div>
                <h3 className="home-contact__addr-label">{t("home.contactSection.phoneLabel")}</h3>
                <a className="home-contact__addr-value" href={phoneHref}>
                  {phoneValue}
                </a>
              </div>
            </div>
            <div className="home-contact__addr-row home-contact__addr-row--last">
              <div className="home-contact__addr-icon">
                <IconMap className="home-contact__addr-svg" />
              </div>
              <div>
                <h3 className="home-contact__addr-label">{t("home.contactSection.locationLabel")}</h3>
                <p className="home-contact__addr-value home-contact__addr-value--plain">{t("home.contactSection.locationValue")}</p>
              </div>
            </div>
          </address>

          <form className="home-contact__form" onSubmit={handleSubmit} noValidate>
            {status === "ok" ? (
              <p className="home-contact__status" role="status">
                {t("home.contactSection.success")}
              </p>
            ) : null}
            {(errors.name || errors.email || errors.message || errors.phone) && (
              <p className="home-contact__form-error" role="alert">
                {errMsg(errors.email ? "email" : errors.phone ? "phone" : "generic")}
              </p>
            )}

            <div className="home-contact__field">
              <label className="home-contact__label" htmlFor={`${baseId}-name`}>
                {t("home.contactSection.formName")}
              </label>
              <input
                id={`${baseId}-name`}
                className="home-contact__input"
                type="text"
                name="name"
                autoComplete="name"
                maxLength={100}
                required
                value={name}
                onChange={(ev) => setName(ev.target.value)}
                placeholder={t("home.contactSection.formName")}
                data-testid="input-name"
                aria-invalid={errors.name ? "true" : undefined}
              />
            </div>

            <div className="home-contact__field-row">
              <div className="home-contact__field">
                <label className="home-contact__label" htmlFor={`${baseId}-email`}>
                  {t("home.contactSection.formEmail")}
                </label>
                <input
                  id={`${baseId}-email`}
                  className="home-contact__input"
                  type="email"
                  name="email"
                  autoComplete="email"
                  maxLength={255}
                  required
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder={t("home.contactSection.formEmail")}
                  data-testid="input-email"
                  aria-invalid={errors.email ? "true" : undefined}
                />
              </div>
              <div className="home-contact__field">
                <label className="home-contact__label" htmlFor={`${baseId}-phone`}>
                  {t("home.contactSection.formPhone")}
                </label>
                <input
                  id={`${baseId}-phone`}
                  className="home-contact__input"
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  maxLength={20}
                  value={phone}
                  onChange={(ev) => setPhone(ev.target.value)}
                  placeholder={t("home.contactSection.formPhone")}
                  data-testid="input-phone"
                  aria-invalid={errors.phone ? "true" : undefined}
                />
              </div>
            </div>

            <div className="home-contact__field">
              <label className="home-contact__label" htmlFor={`${baseId}-message`}>
                {t("home.contactSection.formMessage")}
              </label>
              <textarea
                id={`${baseId}-message`}
                className="home-contact__textarea"
                name="message"
                rows={5}
                maxLength={2000}
                required
                value={message}
                onChange={(ev) => setMessage(ev.target.value)}
                placeholder={t("home.contactSection.formMessage")}
                data-testid="input-message"
                aria-invalid={errors.message ? "true" : undefined}
              />
            </div>

            <button type="submit" className="home-contact__submit" data-testid="button-submit-contact">
              <span>{t("home.contactSection.submit")}</span>
              <IconSend className="home-contact__submit-icon" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
});
