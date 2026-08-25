import { Logo } from "./ui";

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
        <p className="text-xs text-text-secondary/70 mt-4">
          © {new Date().getFullYear()} Fly MRI
        </p>
      </div>
    </footer>
  );
}
