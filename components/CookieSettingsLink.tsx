"use client";

import { openConsentSettings } from "@/lib/cookieConsent";

// קישור בפוטר שפותח מחדש את באנר ההסכמה (נדרש לפי מדיניות העוגיות §2.4).
export default function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentSettings} className={className}>
      הגדרות עוגיות
    </button>
  );
}
