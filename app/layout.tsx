import type { Metadata } from "next";
import { Manrope, Noto_Sans_Hebrew } from "next/font/google";
import Script from "next/script";
import MotionProvider from "@/components/MotionProvider";
import Analytics from "@/components/Analytics";
import ConsentBanner from "@/components/ConsentBanner";
import "./globals.css";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const hasTags = Boolean(GTM_ID || META_PIXEL_ID);

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

const siteUrl = "https://flymri.com";
const ogTitle = "FlyMRI | Know more. Live better.";
const ogDescription =
  "A clearer picture of your health, with a simple, carefully coordinated MRI experience abroad.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Fly MRI — בדיקת MRI גוף מלא לבריאות מונעת",
  description:
    "הדרך הברורה לדעת יותר על הבריאות שלכם. בדיקת MRI גוף מלא לבריאות מונעת, בליווי מתואם מקצה לקצה אצל ספק רפואי נבחר בחו״ל. Know more. Live better.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: ogTitle,
    description: ogDescription,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "he_IL",
  },
  twitter: {
    card: "summary_large_image",
    title: ogTitle,
    description: ogDescription,
    images: ["/og-image.jpg"],
  },
  verification: {
    other: {
      // אימות בעלות על הדומיין ל-Meta Business (Meta Pixel / דומיינים)
      // מספר קודים כי יש כמה Business Manager שצריכים לאמת את הדומיין בנפרד
      "facebook-domain-verification": [
        "ryhv8zjkcehfpdfvoszuck1eigsifk",
        "tzhhqw1otu2zu0d1opesv60s0ym010", // BM: Ymri (9370010225384174)
      ],
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`${notoSansHebrew.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-text font-body">
        {hasTags && (
          <Script id="consent-mode-default" strategy="beforeInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=window.gtag||gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});try{var c=JSON.parse(localStorage.getItem('flymri_consent')||'null');if(c&&c.marketing===true){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'});}}catch(e){}gtag('js',new Date());`}
          </Script>
        )}
        <a href="#main-content" className="skip-link">
          דלגו לתוכן הראשי
        </a>
        <MotionProvider>{children}</MotionProvider>
        <Analytics />
        <ConsentBanner />
      </body>
    </html>
  );
}
