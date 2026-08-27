"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode } from "react";

// כיבוד הגדרת "הפחתת תנועה" של מערכת ההפעלה עבור כל אנימציות Framer Motion.
// בלוק ה-CSS של prefers-reduced-motion מכסה רק אנימציות/מעברים של CSS —
// תנועה שמונעת ב-JS צריכה את זה. (WCAG 2.3.3 / 2.2.2)
export default function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
