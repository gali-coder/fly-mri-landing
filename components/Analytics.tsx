"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { captureAttribution } from "@/lib/tracking";
import { CONSENT_EVENT, readConsent } from "@/lib/cookieConsent";

// מזהים מוגדרים כמשתני סביבה ב-Vercel. מה שלא הוגדר — פשוט לא נטען.
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

/**
 * טוען GTM ו-Meta Pixel — אך ורק לאחר שהמשתמש אישר עוגיות שיווק/מדידה.
 * לפני אישור: שום בקשת רשת לגוגל/מטא ושום עוגיית צד-שלישי (תואם למדיניות העוגיות).
 * לכידת ה-UTM רצה תמיד — היא צד-ראשון, ללא עוגיות, ומוגדרת כ"הכרחית".
 */
export default function Analytics() {
  const [marketingOk, setMarketingOk] = useState(false);

  useEffect(() => {
    captureAttribution();
    const sync = () => setMarketingOk(readConsent()?.marketing === true);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!marketingOk) return null;

  return (
    <>
      {GTM_ID && (
        <Script id="gtm-loader" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
        </Script>
      )}

      {META_PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('consent','grant');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
    </>
  );
}
