"use client";

import { FormEvent, useState } from "react";
import { copy } from "@/lib/copy";
import { Chapter, Container, FocusCircle, Reveal } from "../ui";

// הערה: אין עדיין חיבור ל-CRM/Backend אמיתי (נושא פתוח לפי CLAUDE.md סעיף 22, 43).
// הטופס מדמה שליחה מוצלחת בצד הלקוח בלבד — יש לחבר endpoint אמיתי לפני השקה.

const PHONE_RE = /^0\d{1,2}-?\d{7}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CTAForm() {
  const c = copy.ctaForm;
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});

  function computeErrors() {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "נא למלא שם מלא";
    if (!phone.trim()) next.phone = "נא למלא מספר טלפון";
    else if (!PHONE_RE.test(phone.trim())) next.phone = "מספר הטלפון לא תקין";
    if (email.trim() && !EMAIL_RE.test(email.trim())) next.email = "כתובת האימייל לא תקינה";
    return next;
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const next = computeErrors();
    setErrors(next);
    const firstInvalid = (["name", "phone", "email"] as const).find((k) => next[k]);
    if (firstInvalid) {
      // Move keyboard focus to the first field with an error so the message is announced.
      document.getElementById(firstInvalid)?.focus();
      return;
    }
    setSubmitted(true);
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
                  אימייל <span className="opacity-70">(לא חובה)</span>
                </label>
                <input
                  id="email"
                  type="email"
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
              <button
                type="submit"
                className="w-full rounded-xl font-bold text-lg px-8 py-4 mt-2"
                style={{
                  background: "var(--cta)",
                  color: "var(--text)",
                  boxShadow: "0 8px 24px rgba(244,142,114,0.35)",
                }}
              >
                {c.ctaText}
              </button>
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
