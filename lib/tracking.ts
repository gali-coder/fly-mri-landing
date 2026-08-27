// לכידת מקור-הגעה (UTM + מזהי-קליק של פלטפורמות פרסום) ושליחת אירועי המרה.
// הכול פועל בצד לקוח בלבד. המקור נשמר ב-localStorage כדי שיישרד רענון,
// ניווט לעמודים משפטיים וחזרה, וכניסה חוזרת ללא פרמטרים.

const STORAGE_KEY = "flymri_attribution";

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

// מזהי-קליק: Google (gclid/gbraid/wbraid), Meta (fbclid), Microsoft (msclkid), TikTok (ttclid)
const CLICK_IDS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid", "ttclid"] as const;

type Stored = Record<string, string>;

function read(): Stored {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as unknown;
    return parsed && typeof parsed === "object" ? (parsed as Stored) : {};
  } catch {
    return {};
  }
}

function write(value: Stored): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // אחסון חסום (מצב פרטי / הגדרת דפדפן) — ממשיכים בלי התמדה
  }
}

/**
 * נקרא פעם אחת בטעינת האתר. שומר את המקור הראשון (first-touch) אם עדיין אין,
 * ומעדכן מקור אחרון (last-touch) + מזהי-קליק טריים בכל כניסה עם פרמטרי קמפיין.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const stored = read();
  const now = new Date().toISOString();
  const hasCampaignParams =
    UTM_KEYS.some((k) => params.get(k)) || CLICK_IDS.some((k) => params.get(k));

  const next: Stored = { ...stored };

  // ── first-touch — נכתב פעם אחת בלבד ──────────────────────────────────
  if (!stored.firstSeenAt) {
    next.firstSeenAt = now;
    next.landingPage = window.location.href.slice(0, 500);
    next.referrer = (document.referrer || "").slice(0, 500);
    for (const k of UTM_KEYS) next[k] = params.get(k) ?? "";
    for (const k of CLICK_IDS) next[k] = params.get(k) ?? "";
  } else if (hasCampaignParams) {
    // כניסה חוזרת עם פרמטרים חדשים — נרענן מזהי-קליק (חשוב לייחוס המרות),
    // אבל שומרים על ה-UTM המקוריים כ-first-touch.
    for (const k of CLICK_IDS) {
      const v = params.get(k);
      if (v) next[k] = v;
    }
  }

  // ── last-touch — מתעדכן בכל כניסה עם קמפיין ──────────────────────────
  if (hasCampaignParams) {
    next.lastUtmSource = params.get("utm_source") ?? "";
    next.lastUtmMedium = params.get("utm_medium") ?? "";
    next.lastUtmCampaign = params.get("utm_campaign") ?? "";
    next.lastSeenAt = now;
  }

  write(next);
}

/**
 * המקור להצמדה לפניית ליד. עדיפות למה שנשמר (first-touch); אם אין —
 * נופלים ל-URL הנוכחי כדי לא לאבד כניסה ישירה עם פרמטרים לפני ש-capture רץ.
 */
export function getAttribution(): Stored {
  if (typeof window === "undefined") return {};
  const a = read();
  const params = new URLSearchParams(window.location.search);
  const pick = (key: string) => (a[key]?.length ? a[key] : params.get(key) ?? "");

  return {
    page: window.location.href.slice(0, 500),
    landingPage: a.landingPage ?? "",
    referrer: (a.referrer || document.referrer || "").slice(0, 500),
    utmSource: pick("utm_source"),
    utmMedium: pick("utm_medium"),
    utmCampaign: pick("utm_campaign"),
    utmTerm: pick("utm_term"),
    utmContent: pick("utm_content"),
    gclid: pick("gclid"),
    gbraid: pick("gbraid"),
    wbraid: pick("wbraid"),
    fbclid: pick("fbclid"),
    msclkid: pick("msclkid"),
    ttclid: pick("ttclid"),
    lastUtmSource: a.lastUtmSource ?? "",
    lastUtmMedium: a.lastUtmMedium ?? "",
    lastUtmCampaign: a.lastUtmCampaign ?? "",
  };
}

type LeadDetail = { value?: number; currency?: string };

/**
 * אירוע המרה. נקרא רק אחרי ששרת ה-lead אישר קליטה — כדי שספירת ההמרות
 * תשקף לידים אמיתיים שנשמרו, לא ניסיונות שליחה.
 */
export function trackLead(detail: LeadDetail = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  };

  const money =
    detail.value != null ? { value: detail.value, currency: detail.currency ?? "ILS" } : {};

  try {
    // Meta — אירוע Lead סטנדרטי. שם התוכן ניטרלי (אין רמז למצב בריאותי).
    w.fbq?.("track", "Lead", { content_name: "consult_form", ...money });
  } catch {
    // הפיקסל לא נטען (אין הסכמה / חסימה) — לא קריטי
  }

  try {
    // GTM — טריגר גנרי שממנו מגדירים המרות של כל פלטפורמה בלי שינוי קוד.
    (w.dataLayer = w.dataLayer || []).push({
      event: "lead_submit",
      form_id: "consult_form",
      ...money,
      ...getAttribution(),
    });
  } catch {
    // אין dataLayer
  }
}
