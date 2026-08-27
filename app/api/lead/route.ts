import type { NextRequest } from "next/server";
import { CONTACT_CONSENT_TEXT, MARKETING_CONSENT_TEXT } from "@/lib/consent";

// ── יעד 1: Supabase (טבלת leads) ────────────────────────────────────────────
// ה-URL אינו סוד. המפתח כן — יש להגדיר SUPABASE_SERVICE_ROLE_KEY במשתני הסביבה
// של Vercel (Project → Settings → Environment Variables). service_role עוקף RLS.
const SUPABASE_URL = process.env.SUPABASE_URL ?? "https://zkcqsaqlngvxwrjuxyit.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_KEY ?? "";

// ── יעד 2: Google Sheet דרך Apps Script Web App ────────────────────────────
// אופציונלי. כתובת ה-/exec של פריסת ה-Web App (הרשאה: Anyone).
const SHEETS_WEBAPP_URL = process.env.SHEETS_WEBAPP_URL ?? "";

const PHONE_RE = /^0\d{1,2}-?\d{7}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// הגבלת קצב בסיסית (best-effort; בסביבת serverless זה per-instance).
// להגנה אמיתית מומלץ Upstash/Vercel KV.
const RATE_LIMIT_MS = 15_000;
const lastSeen = new Map<string, number>();

type Payload = {
  name?: string;
  phone?: string;
  email?: string;
  marketingConsent?: boolean;
  page?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  company?: string; // honeypot — אמור להישאר ריק
};

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

async function insertSupabase(row: Record<string, unknown>) {
  return fetch(`${SUPABASE_URL}/rest/v1/leads`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
}

async function sendToSupabase(rich: Record<string, unknown>, minimal: Record<string, unknown>) {
  if (!SUPABASE_KEY) return { ok: false, skipped: true, error: "no SUPABASE key configured" };
  try {
    let res = await insertSupabase(rich);
    if (!res.ok) {
      const body = await res.text();
      // עמודה חסרה / schema cache — ננסה שוב עם המבנה המינימלי המוכר
      if (/PGRST204|42703|does not exist|Could not find the/i.test(body)) {
        res = await insertSupabase(minimal);
        if (!res.ok) return { ok: false, error: `supabase ${res.status}: ${await res.text()}` };
        return { ok: true, degraded: true };
      }
      return { ok: false, error: `supabase ${res.status}: ${body}` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: `supabase fetch failed: ${(e as Error).message}` };
  }
}

async function sendToSheet(fields: Record<string, string>) {
  if (!SHEETS_WEBAPP_URL) return { ok: false, skipped: true };
  try {
    const res = await fetch(SHEETS_WEBAPP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(fields).toString(),
      redirect: "follow",
    });
    return { ok: res.ok, error: res.ok ? undefined : `sheet ${res.status}` };
  } catch (e) {
    return { ok: false, error: `sheet fetch failed: ${(e as Error).message}` };
  }
}

export async function POST(request: NextRequest) {
  let data: Payload;
  try {
    data = (await request.json()) as Payload;
  } catch {
    return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Honeypot — בוט מילא שדה נסתר. מחזירים הצלחה שקטה ולא שומרים.
  if (data.company && data.company.trim() !== "") {
    return Response.json({ ok: true });
  }

  const name = (data.name ?? "").trim();
  const phone = (data.phone ?? "").trim();
  const email = (data.email ?? "").trim();

  const fieldErrors: Record<string, string> = {};
  if (!name) fieldErrors.name = "נא למלא שם מלא";
  if (!phone) fieldErrors.phone = "נא למלא מספר טלפון";
  else if (!PHONE_RE.test(phone)) fieldErrors.phone = "מספר הטלפון לא תקין";
  if (!email) fieldErrors.email = "נא למלא כתובת אימייל";
  else if (!EMAIL_RE.test(email)) fieldErrors.email = "כתובת האימייל לא תקינה";
  if (Object.keys(fieldErrors).length > 0) {
    return Response.json({ ok: false, error: "validation", fieldErrors }, { status: 400 });
  }

  const ip = clientIp(request);
  const now = Date.now();
  const prev = lastSeen.get(ip) ?? 0;
  if (now - prev < RATE_LIMIT_MS) {
    return Response.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }
  lastSeen.set(ip, now);

  const marketingConsent = data.marketingConsent === true;
  const consentAt = new Date().toISOString();
  const userAgent = request.headers.get("user-agent") ?? "";
  const page = (data.page ?? "").slice(0, 500);
  const referrer = (data.referrer ?? "").slice(0, 500);
  const utmSource = (data.utmSource ?? "").slice(0, 200);
  const utmMedium = (data.utmMedium ?? "").slice(0, 200);
  const utmCampaign = (data.utmCampaign ?? "").slice(0, 200);

  // מבנה עשיר — יעבוד אם הוספתם את העמודות לטבלה. אחרת נופלים אוטומטית למינימלי.
  const richRow = {
    name,
    phone,
    email: email || null,
    page,
    referrer: referrer || null,
    utm_source: utmSource || null,
    utm_medium: utmMedium || null,
    utm_campaign: utmCampaign || null,
    marketing_consent: marketingConsent,
    marketing_consent_text: marketingConsent ? MARKETING_CONSENT_TEXT : null,
    consent_text: CONTACT_CONSENT_TEXT,
    consent_at: consentAt,
    ip,
    user_agent: userAgent,
  };
  const minimalRow = { name, phone, email: email || null, page };

  const sheetFields: Record<string, string> = {
    name,
    phone,
    email,
    page,
    referrer,
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    marketing_consent: marketingConsent ? "כן" : "לא",
    consent_at: consentAt,
    ip,
    user_agent: userAgent,
  };

  const [supa, sheet] = await Promise.all([
    sendToSupabase(richRow, minimalRow),
    sendToSheet(sheetFields),
  ]);

  const anyStored = supa.ok || sheet.ok;
  const allConfigured = !supa.skipped || !sheet.skipped;

  if (!anyStored) {
    // אף יעד לא קלט את הליד — מחזירים שגיאה אמיתית כדי שהטופס יציג הודעת כשל.
    console.error("[lead] not stored", { supa, sheet, configured: allConfigured });
    return Response.json(
      { ok: false, error: allConfigured ? "storage_failed" : "backend_not_configured" },
      { status: 502 },
    );
  }

  if (!supa.ok || !sheet.ok) {
    // יעד אחד הצליח, השני לא — הליד לא אבד. לוג לתחקור.
    console.warn("[lead] partial delivery", { supa, sheet });
  }

  return Response.json({ ok: true });
}

export function GET() {
  return Response.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}
