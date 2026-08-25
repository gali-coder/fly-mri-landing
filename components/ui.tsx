"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CSSProperties, ReactNode } from "react";

export const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-3xl px-6 ${className}`}>{children}</div>;
}

export function Kicker({ children, tone = "accent" }: { children: ReactNode; tone?: "accent" | "muted" | "onDark" }) {
  const color = tone === "accent" ? "var(--accent)" : tone === "onDark" ? "#A9CDF5" : "var(--text-secondary)";
  return (
    <p className="font-latin text-[0.7rem] font-semibold tracking-[0.08em] mb-1" style={{ color }}>
      {children}
    </p>
  );
}

// Chapter marker — vertical line + dot beside a heading, echoes Prenuvo's editorial rhythm.
export function ChapterMarker({ dotColor = "var(--accent)" }: { dotColor?: string }) {
  return (
    <div className="hidden md:flex flex-col items-center absolute -right-8 top-1 bottom-0" aria-hidden>
      <span className="w-2 h-2 rounded-full mb-2" style={{ background: dotColor }} />
      <span className="w-px flex-1" style={{ background: `linear-gradient(180deg, ${dotColor}55, transparent)` }} />
    </div>
  );
}

// ── Scan Line — נכס גרפי חוזר: קו רך שמרמז סריקה/תנועה/מסלול. לא ECG. ──────
export function ScanLine({
  className = "",
  width = 220,
  stroke = "var(--accent)",
  opacity = 0.55,
}: {
  className?: string;
  width?: number;
  stroke?: string;
  opacity?: number;
}) {
  return (
    <div className={`mx-auto ${className}`} style={{ width: "100%", maxWidth: width, height: 24 }} aria-hidden>
      <svg viewBox="0 0 220 24" width="100%" height="24" fill="none" preserveAspectRatio="none">
        <path
          d="M4 12 C 50 12, 60 4, 90 4 S 130 20, 160 20 S 200 12, 216 12"
          stroke={stroke}
          strokeOpacity={opacity}
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

// ── Focus Ring — גרסה גדולה/זוהרת של Focus Circle, לנכס חזותי מרכזי (הירו). ──
// טבעות מרוכזות רכות עם glow — לא טבעת MRI ליטרלית, לא Target.
export function FocusRing({ size = 460, color = "45,127,249" }: { size?: number; color?: string }) {
  const rings = [1, 0.72, 0.46];
  return (
    <div className="relative" style={{ width: size, height: size }} aria-hidden>
      <div
        className="absolute inset-0 rounded-full"
        style={{ background: `radial-gradient(circle, rgba(${color},0.22) 0%, transparent 68%)`, filter: "blur(6px)" }}
      />
      {rings.map((r, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: size * r,
            height: size * r,
            top: (size * (1 - r)) / 2,
            left: (size * (1 - r)) / 2,
            border: `1px solid rgba(${color},${0.5 - i * 0.12})`,
          }}
        />
      ))}
    </div>
  );
}

// ── Focus Circle — עיגול פוקוס רך (גרסה קטנה, לאקצנטים). לא Target רפואי. ──
export function FocusCircle({
  size = 140,
  top,
  left,
  right,
  bottom,
  filled = false,
  color = "45,127,249",
  className = "",
}: {
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  filled?: boolean;
  color?: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        border: filled ? "none" : `1.5px solid rgba(${color},0.25)`,
        background: filled ? `radial-gradient(circle, rgba(${color},0.16) 0%, transparent 72%)` : undefined,
      }}
    />
  );
}

// ── Chapter — סקשן full-bleed עם רקע (תמונה/גרדיאנט/כהה) וקצה עליון מקומר. ──
// הטכניקה מבוססת על תצפית ב-prenuvo.com: כל "פרק" הוא רקע מלא עם הודעה אחת
// שיושבת ישירות עליו, והמעבר לפרק הבא הוא קימור אליפסה רחב — לא קו ישר.
const BG_PRESETS: Record<string, string> = {
  dark: "var(--text)",
  bg: "var(--bg)",
  bgAlt: "var(--bg-alt)",
  life: "linear-gradient(135deg, #F4E4DC 0%, #FAF9F6 45%, #E9DFD2 100%)",
  journey: "linear-gradient(140deg, #DCEEFF 0%, #EAF3FF 40%, #E9DFD2 100%)",
  clinical: "linear-gradient(160deg, #0C2230 0%, #112B3C 55%, #1B3F53 100%)",
};

export function Chapter({
  bg,
  curveTop = true,
  curveColor,
  children,
  className = "",
  minHeight = "auto",
  id,
  image,
  imageClassName = "object-cover",
  imageOverlay = "linear-gradient(to left, rgba(17,43,60,0.75) 0%, rgba(17,43,60,0.35) 55%, rgba(17,43,60,0.05) 100%)",
}: {
  bg: keyof typeof BG_PRESETS;
  curveTop?: boolean;
  curveColor?: string;
  children: ReactNode;
  className?: string;
  minHeight?: string;
  id?: string;
  image?: string;
  imageClassName?: string;
  imageOverlay?: string;
}) {
  const background = BG_PRESETS[bg];
  const style: CSSProperties = {
    background: image ? undefined : background,
    minHeight,
    borderRadius: curveTop ? "50% 50% 0 0 / clamp(28px, 5vw, 64px) clamp(28px, 5vw, 64px) 0 0" : undefined,
    marginTop: curveTop ? "-1px" : undefined,
  };
  return (
    <section id={id} className={`relative overflow-hidden ${className}`} style={style}>
      {image && (
        <>
          <Image src={image} alt="" fill sizes="100vw" className={`-z-20 ${imageClassName}`} />
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: imageOverlay }} />
        </>
      )}
      {curveTop && curveColor && (
        <div
          aria-hidden
          className="absolute top-0 inset-x-0 h-1"
          style={{ background: `linear-gradient(90deg, transparent, ${curveColor}, transparent)` }}
        />
      )}
      {children}
    </section>
  );
}

export function GlassCard({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`rounded-2xl p-6 sm:p-7 ${className}`}
      style={{
        background: "var(--white)",
        border: "1px solid rgba(17,43,60,0.08)",
        boxShadow: "0 4px 24px rgba(17,43,60,0.06)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Image Placeholder — מקום שמור לתמונת מותג עתידית, כאלמנט קטן/ממוסגר. ──
const PLACEHOLDER_STYLES: Record<string, { gradient: string; label: string }> = {
  LIFE: { gradient: BG_PRESETS.life, label: "LIFE" },
  JOURNEY: { gradient: BG_PRESETS.journey, label: "JOURNEY" },
  CLINICAL: { gradient: BG_PRESETS.clinical, label: "CLINICAL" },
  ABSTRACT: { gradient: "linear-gradient(135deg, #DCEEFF 0%, #FAF9F6 100%)", label: "ABSTRACT" },
};

export function ImagePlaceholder({
  type,
  description,
  aspect = "4 / 5",
  className = "",
}: {
  type: "LIFE" | "JOURNEY" | "CLINICAL" | "ABSTRACT";
  description: string;
  aspect?: string;
  className?: string;
}) {
  const style = PLACEHOLDER_STYLES[type];
  const dark = type === "CLINICAL";
  return (
    <div
      className={`relative overflow-hidden rounded-[28px] flex items-center justify-center ${className}`}
      style={{ aspectRatio: aspect, background: style.gradient }}
    >
      <FocusCircle size={dark ? 160 : 120} top="12%" right="10%" color={dark ? "255,255,255" : "45,127,249"} />
      <ScanLine
        width={140}
        stroke={dark ? "#DCEEFF" : "var(--accent)"}
        opacity={dark ? 0.35 : 0.4}
        className="absolute bottom-16"
      />
      <div
        className="absolute bottom-5 inset-x-5 rounded-xl px-3 py-2 text-center backdrop-blur-sm"
        style={{
          background: dark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.6)",
          border: `1px solid ${dark ? "rgba(255,255,255,0.2)" : "rgba(17,43,60,0.08)"}`,
        }}
      >
        <p className="font-latin text-[0.65rem] font-semibold tracking-[0.1em] mb-0.5" style={{ color: dark ? "#DCEEFF" : "var(--accent)" }}>
          {style.label} · תמונה בהמשך
        </p>
        <p className="text-xs leading-snug" style={{ color: dark ? "rgba(255,255,255,0.85)" : "var(--text-secondary)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

// תגית קטנה לזיהוי placeholder כשהוא *עצמו* משמש כרקע מלא של פרק (לא קונטיינר ממוסגר)
export function PlaceholderBadge({ type, description }: { type: string; description: string }) {
  return (
    <div
      className="inline-flex flex-col gap-0.5 rounded-xl px-3 py-2 backdrop-blur-sm"
      style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.22)" }}
    >
      <span className="font-latin text-[0.62rem] font-semibold tracking-[0.1em]" style={{ color: "#DCEEFF" }}>
        {type} · תמונה בהמשך
      </span>
      <span className="text-xs" style={{ color: "rgba(255,255,255,0.85)" }}>
        {description}
      </span>
    </div>
  );
}

export function CTAButton({
  text,
  href = "#consult",
  full = false,
  variant = "solid",
}: {
  text: string;
  href?: string;
  full?: boolean;
  variant?: "solid" | "outline";
}) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center rounded-full font-body font-bold text-base sm:text-lg px-8 py-4 transition-shadow ${
        full ? "w-full" : ""
      }`}
      style={
        variant === "solid"
          ? { background: "var(--cta)", color: "#fff", boxShadow: "0 8px 22px rgba(244,142,114,0.35)" }
          : { border: "1.5px solid rgba(255,255,255,0.4)", color: "#fff", background: "transparent" }
      }
    >
      {text}
    </motion.a>
  );
}

export function Logo({ variant = "dark", className = "" }: { variant?: "dark" | "white"; className?: string }) {
  const src = variant === "dark" ? "/logo/fly-mri-logo-dark.png" : "/logo/fly-mri-logo-white.png";
  return <Image src={src} alt="Fly MRI" width={220} height={72} className={className} priority />;
}
