import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "הצהרת נגישות — Fly MRI",
};

export default function AccessibilityPage() {
  const markdown = fs.readFileSync(path.join(process.cwd(), "content/legal/accessibility.md"), "utf-8");
  return <LegalLayout markdown={markdown} />;
}
