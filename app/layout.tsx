import type { Metadata } from "next";
import { Manrope, Noto_Sans_Hebrew } from "next/font/google";
import "./globals.css";

const notoSansHebrew = Noto_Sans_Hebrew({
  variable: "--font-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "600", "700"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Fly MRI — בדיקת MRI גוף מלא לבריאות מונעת",
  description:
    "הדרך הברורה לדעת יותר על הבריאות שלכם. בדיקת MRI גוף מלא לבריאות מונעת, בליווי מתואם מקצה לקצה אצל ספק רפואי נבחר בחו״ל. Know more. Live better.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${notoSansHebrew.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text font-body">
        {children}
      </body>
    </html>
  );
}
