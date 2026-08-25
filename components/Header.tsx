import { Logo } from "./ui";
import { copy } from "@/lib/copy";

export default function Header() {
  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md"
      style={{ background: "rgba(17,43,60,0.92)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <div className="mx-auto max-w-5xl px-6 py-3 flex items-center justify-between">
        <Logo variant="white" className="h-8 w-auto" />
        <div className="hidden sm:block">
          <a
            href="#consult"
            className="text-sm font-semibold rounded-full px-5 py-2.5"
            style={{ background: "var(--cta)", color: "var(--text)" }}
          >
            {copy.hero.ctaText}
          </a>
        </div>
      </div>
    </header>
  );
}
