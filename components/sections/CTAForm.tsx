"use client";

import { FormEvent, useState } from "react";
import { copy } from "@/lib/copy";
import { Chapter, Container, FocusCircle, Reveal } from "../ui";

// הערה: אין עדיין חיבור ל-CRM/Backend אמיתי (נושא פתוח לפי CLAUDE.md סעיף 22, 43).
// הטופס מדמה שליחה מוצלחת בצד הלקוח בלבד — יש לחבר endpoint אמיתי לפני השקה.
export default function CTAForm() {
  const c = copy.ctaForm;
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
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
            <div className="mt-8 rounded-2xl bg-white/10 border border-white/20 p-8 text-center">
              <p className="text-xl font-semibold mb-2">תודה, {name.split(" ")[0] || ""}!</p>
              <p className="opacity-90 leading-relaxed">
                קיבלנו את הפרטים. ניצור קשר בקרוב לתיאום שיחת הייעוץ.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm mb-1.5 opacity-90">
                  שם מלא
                </label>
                <input
                  id="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl px-4 py-3.5 text-base text-text bg-white/95 outline-none focus:ring-2 focus:ring-cta"
                  dir="rtl"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm mb-1.5 opacity-90">
                  טלפון
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl px-4 py-3.5 text-base text-text bg-white/95 outline-none focus:ring-2 focus:ring-cta"
                  dir="ltr"
                  style={{ textAlign: "right" }}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm mb-1.5 opacity-90">
                  אימייל (לא חובה)
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-3.5 text-base text-text bg-white/95 outline-none focus:ring-2 focus:ring-cta"
                  dir="ltr"
                  style={{ textAlign: "right" }}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-xl font-bold text-white text-lg px-8 py-4 mt-2"
                style={{
                  background: "var(--cta)",
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
