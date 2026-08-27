"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { copy } from "@/lib/copy";
import { MARKETING_CONSENT_TEXT } from "@/lib/consent";
import { getAttribution, trackLead } from "@/lib/tracking";
import { Chapter, Container, FocusCircle, Reveal } from "../ui";

const PHONE_RE = /^0\d{1,2}-?\d{7}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = { name?: string; phone?: string; email?: string };

export default function CTAForm() {
  const c = copy.ctaForm;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const errorRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (submitError) errorRef.current?.focus();
  }, [submitError]);

  function computeErrors(): FieldErrors {
    const next: FieldErrors = {};
    if (!name.trim()) next.name = "נא למלא שם מלא";
    if (!phone.trim()) next.phone = "נא למלא מספר טלפון";
    else if (!PHONE_RE.test(phone.trim())) next.phone = "מספר הטלפון לא תקין";
    if (!email.trim()) next.email = "נא למלא כתובת אימייל";
    else if (!EMAIL_RE.test(email.trim())) next.email = "כתובת האימייל לא תקינה";
    return next;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitError(null);

    const next = computeErrors();
    setErrors(next);
    const firstInvalid = (["name", "phone", "email"] as const).find((k) => next[k]);
    if (firstInvalid) {
      document.getElementById(firstInvalid)?.focus();
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          marketingConsent,
          company, // honeypot
          ...getAttribution(),
        }),
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: FieldErrors;
      };

      if (res.ok && body.ok) {
        trackLead(); // אירוע המרה — רק אחרי שהשרת אישר שהליד נשמר
        setSubmitted(true);
        return;
      }

      if (res.status === 400 && body.fieldErrors) {
        setErrors(body.fieldErrors);
        const f = (["name", "phone", "email"] as const).find((k) => body.fieldErrors?.[k]);
        if (f) document.getElementById(f)?.focus();
        return;
      }

      setSubmitError(
        res.status === 429
          ? "נשלחה כבר פנייה מהמכשיר הזה. אפשר לנסות שוב בעוד רגע."
          : "אירעה תקלה בשליחת הטופס. אפשר לנסות שוב, או ליצור קשר בטלפון 09-7747905 או במייל info@flymri.com.",
      );
    } catch {
      setSubmitError(
        "אירעה תקלה בשליחת הטופס. בדקו את החיבור לאינטרנט ונסו שוב, או צרו קשר בטלפון 09-7747905 או במייל info@flymri.com.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Chapter id="consult" bg="dark" curveTop className="py-24 sm:py-28 text-white">
      <FocusCircle size={280} top="-10%" left="-8%" filled color="45,127,249" />
      <FocusCircle size={200} bottom="-5%" right="-3%" />
      <FocusCircle size={90} top="12%" right="12%" className="hidden sm:block" />
      <Container className="relative max-w-lg">
        <Reveal>
          <p className="font-latin text-sm font-semibold text-center mb-3" style={{ color: "#DCEEFF" }}>
            {c.headline}
          </p>
          <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-center mb-3 leading-snug">
            {c.formIntro}
          </h2>
        </Reveal>

        <Reveal>
          {submitted ? (
            <div role="status" className="mt-8 rounded-2xl bg-white/10 border border-white/20 p-8 text-center">
              <p className="text-xl font-semibold mb-2">תודה, {name.split(" ")[0] || ""}!</p>
              <p className="opacity-90 leading-relaxed">
                קיבלנו את הפרטים. ניצור קשר בקרוב לתיאום שיחת הייעוץ.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
              {submitError && (
                <p
                  ref={errorRef}
                  role="alert"
                  tabIndex={-1}
                  className="rounded-xl px-4 py-3 text-sm font-semibold outline-none"
                  style={{ background: "rgba(255,180,160,0.15)", color: "#FFB4A0" }}
                >
                  {submitError}
                </p>
              )}

              {/* honeypot — נסתר ממשתמשים ומטכנולוגיה מסייעת, נועד לתפוס בוטים */}
              <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", width: 1, height: 1, overflow: "hidden" }}>
                <label htmlFor="company">אל תמלאו שדה זה</label>
                <input
                  id="company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="name" className="block text-sm mb-1.5 opacity-90">
                  שם מלא <span className="opacity-70">(חובה)</span>
                </label>
                <input
                  id="name"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="w-full rounded-xl px-4 py-3.5 text-base text-text bg-white/95 outline-none focus:ring-2 focus:ring-cta"
                  dir="rtl"
                />
                {errors.name && (
                  <p id="name-error" role="alert" className="mt-1.5 text-sm font-semibold" style={{ color: "#FFB4A0" }}>
                    {errors.name}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm mb-1.5 opacity-90">
                  טלפון <span className="opacity-70">(חובה)</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  aria-invalid={errors.phone ? true : undefined}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                  className="w-full rounded-xl px-4 py-3.5 text-base text-text bg-white/95 outline-none focus:ring-2 focus:ring-cta"
                  dir="ltr"
                  style={{ textAlign: "right" }}
                />
                {errors.phone && (
                  <p id="phone-error" role="alert" className="mt-1.5 text-sm font-semibold" style={{ color: "#FFB4A0" }}>
                    {errors.phone}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm mb-1.5 opacity-90">
                  אימייל <span className="opacity-70">(חובה)</span>
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="w-full rounded-xl px-4 py-3.5 text-base text-text bg-white/95 outline-none focus:ring-2 focus:ring-cta"
                  dir="ltr"
                  style={{ textAlign: "right" }}
                />
                {errors.email && (
                  <p id="email-error" role="alert" className="mt-1.5 text-sm font-semibold" style={{ color: "#FFB4A0" }}>
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-2.5 pt-1">
                <input
                  type="checkbox"
                  id="marketing-consent"
                  checked={marketingConsent}
                  onChange={(e) => setMarketingConsent(e.target.checked)}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded bg-white accent-accent"
                />
                <label htmlFor="marketing-consent" className="text-xs opacity-90 leading-relaxed">
                  {MARKETING_CONSENT_TEXT}
                </label>
              </div>

              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="w-full rounded-xl font-bold text-lg px-8 py-4 mt-2 disabled:opacity-70"
                style={{
                  background: "var(--cta)",
                  color: "var(--text)",
                  boxShadow: "0 8px 24px rgba(244,142,114,0.35)",
                }}
              >
                {submitting ? "שולח…" : c.ctaText}
              </button>

              <p className="text-xs opacity-70 leading-relaxed">
                בשליחת הטופס אני מאשר/ת ש-Fly MRI תיצור עמי קשר בנוגע לפנייה,{" "}
                <a href="/privacy" className="underline underline-offset-2">
                  בהתאם למדיניות הפרטיות
                </a>
                .
              </p>
            </form>
          )}
        </Reveal>

        <Reveal>
          <p className="text-xs opacity-70 leading-relaxed mt-6 text-center max-w-md mx-auto">
            {c.disclaimer}
          </p>
        </Reveal>
      </Container>
    </Chapter>
  );
}
