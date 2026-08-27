"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { OPEN_CONSENT_EVENT, readConsent, saveConsent } from "@/lib/cookieConsent";

// באנר הסכמה קליל. מופיע בכניסה ראשונה (עד שהוכרעה בחירה) וניתן לפתוח מחדש
// מקישור "הגדרות עוגיות" בפוטר. לא חוסם את המסך (non-modal).
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const reopenedRef = useRef(false);
  const acceptRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // קריאה חד-פעמית מ-localStorage בטעינה כדי להחליט אם להציג את הבאנר.
    // eslint-disable-next-line react-hooks/set-state-in-effect -- סנכרון עם מצב חיצוני (הסכמה שמורה) פעם אחת ב-mount
    if (!readConsent()) setOpen(true);
    const reopen = () => {
      reopenedRef.current = true;
      setOpen(true);
    };
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  useEffect(() => {
    // בפתיחה יזומה מהפוטר — מעבירים פוקוס לבאנר כדי שמשתמש מקלדת ימצא אותו.
    if (open && reopenedRef.current) acceptRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  function decide(marketing: boolean) {
    saveConsent(marketing);
    setOpen(false);
  }

  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
    >
      <div
        className="mx-auto flex max-w-3xl flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:gap-4 sm:p-5"
        style={{
          background: "var(--white)",
          border: "1px solid rgba(17,43,60,0.12)",
          boxShadow: "0 8px 32px rgba(17,43,60,0.18)",
        }}
      >
        <div className="flex-1">
          <p id="consent-title" className="text-sm font-bold" style={{ color: "var(--text)" }}>
            עוגיות באתר
          </p>
          <p
            id="consent-desc"
            className="mt-1 text-xs leading-relaxed"
            style={{ color: "var(--text-secondary)" }}
          >
            אנחנו משתמשים בעוגיות הכרחיות לתפעול האתר. באישורך נשתמש גם בעוגיות למדידת ביצועי
            פרסום וייחוס פניות למקור ההגעה (Google Tag Manager, Meta Pixel). דחייה אינה פוגעת
            בשימוש באתר.{" "}
            <Link
              href="/cookies"
              className="font-semibold underline underline-offset-2"
              style={{ color: "#1857B8" }}
            >
              מדיניות העוגיות
            </Link>
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => decide(false)}
            className="rounded-full px-4 py-2.5 text-sm font-semibold"
            style={{ border: "1.5px solid rgba(17,43,60,0.25)", color: "var(--text)" }}
          >
            דחייה
          </button>
          <button
            ref={acceptRef}
            type="button"
            onClick={() => decide(true)}
            className="rounded-full px-5 py-2.5 text-sm font-bold"
            style={{ background: "var(--cta)", color: "var(--text)" }}
          >
            אישור
          </button>
        </div>
      </div>
    </div>
  );
}
