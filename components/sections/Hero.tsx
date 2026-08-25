"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { copy } from "@/lib/copy";
import { CTAButton, FocusCircle, ScanLine, fadeUp, staggerContainer } from "../ui";

export default function Hero() {
  const c = copy.hero;
  return (
    <section className="relative overflow-hidden min-h-[560px] sm:min-h-[680px] flex items-end sm:items-center">
      <Image
        src="/images/hero-life.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[30%_18%] sm:object-[center_30%] -z-20"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(to top, rgba(17,43,60,0.92) 0%, rgba(17,43,60,0.75) 35%, rgba(17,43,60,0.35) 65%, rgba(17,43,60,0.12) 100%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 hidden sm:block"
        style={{
          background:
            "linear-gradient(to left, rgba(17,43,60,0.88) 0%, rgba(17,43,60,0.6) 45%, rgba(17,43,60,0.18) 100%)",
        }}
      />

      {/* Focus Circle accent — echoes prenuvo's ring-on-subject touch, placed over the face */}
      <FocusCircle size={130} top="12%" left="19%" color="255,255,255" className="hidden sm:block" />

      <div className="relative w-full mx-auto max-w-5xl px-6 pt-20 pb-10 sm:pt-36 sm:pb-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="sm:ml-auto max-w-lg text-right"
        >
          <motion.p variants={fadeUp} className="font-latin text-sm sm:text-base font-semibold mb-4 sm:mb-6" style={{ color: "#8FC1FF" }}>
            {c.eyebrow}
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-heading font-bold text-3xl sm:text-4xl md:text-[2.6rem] leading-[1.2] text-white mb-5 sm:mb-6"
          >
            {c.headline}
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg sm:text-xl mb-6 sm:mb-8 leading-relaxed" style={{ color: "rgba(255,255,255,0.92)" }}>
            {c.subheadline}
          </motion.p>

          <motion.div variants={fadeUp}>
            <ScanLine className="mb-6 sm:mb-8" stroke="#8FC1FF" opacity={0.6} />
          </motion.div>

          <motion.p variants={fadeUp} className="text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            {c.insightLine}
          </motion.p>

          <motion.div variants={fadeUp}>
            <CTAButton text={c.ctaText} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
