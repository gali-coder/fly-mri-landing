import Link from "next/link";
import { Logo } from "./ui";

const legalLinks = [
  { href: "/terms", label: "תקנון ותנאי שימוש" },
  { href: "/privacy", label: "מדיניות פרטיות" },
  { href: "/cookies", label: "מדיניות עוגיות" },
  { href: "/accessibility", label: "הצהרת נגישות" },
];

export default function Footer() {
  return (
    <footer className="bg-bg py-10 border-t border-black/5">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <Logo variant="dark" className="h-7 w-auto mx-auto mb-4 opacity-80" />
        <p className="text-xs text-text-secondary leading-relaxed">
          Fly MRI מתאמת גישה לבדיקות MRI גוף מלא לבריאות מונעת אצל ספקים רפואיים נבחרים בחו&quot;ל.
          Fly MRI אינה גוף רפואי, אינה מבצעת את הבדיקה ואינה מפענחת אותה — הבדיקה, הפענוח וההמלצות
          הקליניות הן באחריות הספק הרפואי ואנשי המקצוע המוסמכים מטעמו בלבד. המידע באתר זה אינו מהווה
          ייעוץ רפואי ואינו מחליף התייעצות עם רופא.
        </p>

        <nav aria-label="קישורים משפטיים" className="flex flex-wrap justify-center gap-x-5 gap-y-2 mt-6">
          {legalLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-xs font-semibold text-text-secondary hover:text-accent underline underline-offset-2"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs text-text-secondary mt-6">
          פליי אם אר איי בע&quot;מ · ח.פ. 515702637 · © {new Date().getFullYear()} Fly MRI
        </p>
      </div>
    </footer>
  );
}
