import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import LegalLayout from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "מדיניות עוגיות — Fly MRI",
};

export default function CookiesPage() {
  const markdown = fs.readFileSync(path.join(process.cwd(), "content/legal/cookies.md"), "utf-8");
  return <LegalLayout markdown={markdown} />;
}
