import { useCallback, useEffect, useId, useMemo, useRef, useState, memo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { sanitizeField, validateLeadModal, buildMailtoLeadModal } from "../../utils/contactLeadForm";
import "../../styles/components/lead-modal.css";

const OPEN_FIRST_MS = 500;
const REPEAT_EVERY_MS = 4 * 60 * 1000;
const COOLDOWN_SUBMIT_MS = 7 * 24 * 60 * 60 * 1000;
const COOLDOWN_KEY = "labsoy_lead_modal_until";
const FIRST_VISIT_KEY = "labsoy_lead_first_shown";

const IconTarget = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

const shouldSkipScheduling = () => {
  if (typeof window === "undefined") return true;
  try {
    const until = parseInt(window.localStorage.getItem(COOLDOWN_KEY) || "0", 10);
    if (until > Date.now()) return true;
  } catch {
    return true;
  }
  return false;
};

const setSubmitCooldown = (ms) => {
  try {
    window.localStorage.setItem(COOLDOWN_KEY, String(Date.now() + ms));
  } catch {
    void 0;
  }
};

export const LeadCaptureModal = memo(function LeadCaptureModal() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState("");
  const [errors, setErrors] = useState({});
  const openRef = useRef(false);
  const pathRef = useRef(location.pathname);
  const closeAfterSubmitRef = useRef(false);

  const serviceOptions = useMemo(() => {
    const raw = t("leadModal.serviceOptions", { returnObjects: true });
    return Array.isArray(raw) ? raw : [];
  }, [t, i18n.language]);

  const emailTo = t("contactPage.emailValue");
  const phoneValue = t("contactPage.phoneValue");
  const phoneHref = `tel:${phoneValue.replace(/\s+/g, "")}`;

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    pathRef.current = location.pathname;
  }, [location.pathname]);

  const onDismiss = useCallback(() => {
    setOpen(false);
  }, []);

  const openIfAllowed = useCallback(() => {
    if (pathRef.current === "/contact") return;
    if (shouldSkipScheduling()) return;
    if (openRef.current) return;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (location.pathname === "/contact") return undefined;
    if (shouldSkipScheduling()) return undefined;
    try {
      if (window.sessionStorage.getItem(FIRST_VISIT_KEY) === "1") return undefined;
    } catch {
      return undefined;
    }
    if (openRef.current) return undefined;
    const t0 = window.setTimeout(() => {
      if (pathRef.current === "/contact") return;
      if (shouldSkipScheduling()) return;
      if (openRef.current) return;
      setOpen(true);
      try {
        window.sessionStorage.setItem(FIRST_VISIT_KEY, "1");
      } catch {
        void 0;
      }
    }, OPEN_FIRST_MS);
    return () => clearTimeout(t0);
  }, [location.pathname]);

  useEffect(() => {
    if (shouldSkipScheduling()) return undefined;
    const idInterval = window.setInterval(openIfAllowed, REPEAT_EVERY_MS);
    return () => clearInterval(idInterval);
  }, [openIfAllowed]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setErrors({});
      const sn = sanitizeField(name, 100);
      const se = sanitizeField(email, 255);
      const sc = sanitizeField(company, 150);
      const { ok, errors: next } = validateLeadModal({ name: sn, email: se, company: sc, serviceKey: service });
      if (!ok) {
        setErrors(next);
        return;
      }
      const serviceLabel = serviceOptions.find((o) => o.value === service)?.label || service;
      const href = buildMailtoLeadModal({
        to: emailTo,
        name: sn,
        email: se,
        company: sc,
        serviceLabel,
        subject: t("leadModal.subjectLine")
      });
      if (import.meta.env.MODE === "test") {
        onDismiss();
        return;
      }
      setSubmitCooldown(COOLDOWN_SUBMIT_MS);
      closeAfterSubmitRef.current = true;
      setOpen(false);
      window.location.assign(href);
    },
    [name, email, company, service, serviceOptions, emailTo, t, onDismiss]
  );

  if (location.pathname === "/contact") {
    return null;
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          if (closeAfterSubmitRef.current) {
            closeAfterSubmitRef.current = false;
            return;
          }
          onDismiss();
        } else {
          setOpen(v);
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="lead-modal__overlay" />
        <Dialog.Content
          className="lead-modal__content"
          aria-labelledby={`${id}-title`}
          aria-describedby={`${id}-desc`}
        >
          <Dialog.Title className="lead-modal__sr-only" id={`${id}-title`}>
            {t("leadModal.formTitle")}
          </Dialog.Title>
          <Dialog.Description className="lead-modal__sr-only" id={`${id}-desc`}>
            {t("leadModal.sub")}
          </Dialog.Description>
          <div className="lead-modal__ribbon">
            {t("leadModal.ribbon")}
            <Dialog.Close asChild>
              <button type="button" className="lead-modal__close" aria-label={t("leadModal.closeAria")}>
                <span aria-hidden="true">×</span>
              </button>
            </Dialog.Close>
          </div>
          <div className="lead-modal__grid">
            <div className="lead-modal__side" aria-hidden={false}>
              <div className="lead-modal__side-inner">
                <p className="lead-modal__kicker">{t("leadModal.leftKicker")}</p>
                <p className="lead-modal__side-title">{t("leadModal.leftTitle")}</p>
                <p className="lead-modal__side-text">{t("leadModal.leftBody")}</p>
                <ul className="lead-modal__side-list">
                  <li>{t("leadModal.leftBullet1")}</li>
                  <li>{t("leadModal.leftBullet2")}</li>
                </ul>
                <div className="lead-modal__contact">
                  <div>
                    <span>{t("leadModal.leftEmailLabel")}</span>
                    <a href={`mailto:${emailTo}`}>{emailTo}</a>
                  </div>
                  <div>
                    <span>{t("leadModal.leftPhoneLabel")}</span>
                    <a href={phoneHref}>{phoneValue}</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="lead-modal__form-wrap">
              <div className="lead-modal__icon-row">
                <IconTarget className="lead-modal__target" />
                <div>
                  <p className="lead-modal__form-title" aria-hidden="true">
                    {t("leadModal.formTitle")}
                  </p>
                  <p className="lead-modal__headline">{t("leadModal.headline")}</p>
                </div>
              </div>
              <p className="lead-modal__sub" aria-hidden="true">
                {t("leadModal.sub")}
              </p>
              <form className="lead-modal__form" onSubmit={handleSubmit} noValidate>
                {Object.keys(errors).length > 0 ? (
                  <p className="lead-modal__form-error" role="alert">
                    {errors.email ? t("leadModal.errorEmail") : t("leadModal.errorGeneric")}
                  </p>
                ) : null}
                <div className="lead-modal__field">
                  <label className="lead-modal__label" htmlFor={`${id}-n`}>
                    {t("leadModal.fieldName")} *
                  </label>
                  <input
                    id={`${id}-n`}
                    className="lead-modal__input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    maxLength={100}
                    required
                  />
                </div>
                <div className="lead-modal__field">
                  <label className="lead-modal__label" htmlFor={`${id}-c`}>
                    {t("leadModal.fieldCompany")} *
                  </label>
                  <input
                    id={`${id}-c`}
                    className="lead-modal__input"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    autoComplete="organization"
                    maxLength={150}
                    required
                  />
                </div>
                <div className="lead-modal__field">
                  <label className="lead-modal__label" htmlFor={`${id}-e`}>
                    {t("leadModal.fieldEmail")} *
                  </label>
                  <input
                    id={`${id}-e`}
                    className="lead-modal__input"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    maxLength={255}
                    required
                  />
                </div>
                <div className="lead-modal__field">
                  <label className="lead-modal__label" htmlFor={`${id}-s`}>
                    {t("leadModal.fieldService")} *
                  </label>
                  <select
                    id={`${id}-s`}
                    className="lead-modal__select"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    required
                  >
                    <option value="">{t("leadModal.fieldServicePlaceholder")}</option>
                    {serviceOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="lead-modal__row-actions">
                  <button type="submit" className="lead-modal__btn-primary">
                    {t("leadModal.primaryCta")}
                  </button>
                  <button
                    type="button"
                    className="lead-modal__btn-secondary"
                    onClick={() => {
                      onDismiss();
                      navigate("/services");
                    }}
                  >
                    {t("leadModal.secondaryCta")}
                  </button>
                </div>
              </form>
              <p className="lead-modal__trust">
                <span>
                  <mark>✓</mark> {t("leadModal.trust1")}
                </span>
                <span>
                  <mark>✓</mark> {t("leadModal.trust2")}
                </span>
              </p>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
});
