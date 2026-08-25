import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "תקנון ותנאי שימוש — Fly MRI",
};

export default function TermsPage() {
  const markdown = fs.readFileSync(path.join(process.cwd(), "content/legal/terms.md"), "utf-8");
  return <LegalLayout markdown={markdown} />;
}
