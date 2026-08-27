// הסכמת עוגיות (נפרד מהסכמת הדיוור בטופס — ראו lib/consent.ts).
// "הכרחיות" פועלות תמיד. "שיווק/מדידה" — רק לאחר אישור מפורש בבאנר.
// שמירת הבחירה ב-localStorage; יישום מיידי מול Google Consent Mode v2 ו-Meta.

export type CookieConsent = {
  necessary: true;
  marketing: boolean;
  decidedAt: string;
};

export const CONSENT_STORAGE_KEY = "flymri_consent";
export const CONSENT_EVENT = "flymri:consent";
export const OPEN_CONSENT_EVENT = "flymri:open-consent";

const GRANTED = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
} as const;

const DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

export function readConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<CookieConsent>;
    if (parsed && typeof parsed.marketing === "boolean") {
      return { necessary: true, marketing: parsed.marketing, decidedAt: parsed.decidedAt ?? "" };
    }
  } catch {
    // התעלמות — נתייחס כאילו לא הוכרעה בחירה
  }
  return null;
}

/** מיישם את הבחירה על תגיות שכבר רצות (Consent Mode + Meta). */
export function applyConsent(marketing: boolean): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  };
  try {
    w.gtag?.("consent", "update", marketing ? GRANTED : DENIED);
  } catch {
    /* gtag לא מוגדר */
  }
  try {
    w.fbq?.("consent", marketing ? "grant" : "revoke");
  } catch {
    /* fbq לא מוגדר */
  }
}

/** שומר בחירה, מיישם אותה, ומודיע לשאר הרכיבים שיטענו/יעצרו תגיות. */
export function saveConsent(marketing: boolean): CookieConsent {
  const value: CookieConsent = {
    necessary: true,
    marketing,
    decidedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(value));
  } catch {
    /* אחסון חסום */
  }
  applyConsent(marketing);
  try {
    window.dispatchEvent(new Event(CONSENT_EVENT));
  } catch {
    /* אין window.dispatchEvent */
  }
  return value;
}

/** פותח מחדש את באנר ההסכמה (קישור "הגדרות עוגיות" בפוטר). */
export function openConsentSettings(): void {
  try {
    window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
  } catch {
    /* noop */
  }
}
