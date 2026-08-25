import { copy } from "@/lib/copy";
import { Chapter, ChapterMarker, Container, CTAButton, FocusCircle, Kicker, Reveal } from "../ui";

export default function Knowledge() {
  const c = copy.knowledge;
  return (
    <>
      {/* Chapter: Access — full-bleed JOURNEY background, pillars overlaid as a checklist */}
      <Chapter bg="journey" className="flex items-center min-h-[520px] sm:min-h-[640px] pt-14 pb-16 sm:pt-16 sm:pb-20">
        <FocusCircle size={180} filled top="-8%" left="-6%" className="sm:hidden" />
        <FocusCircle size={260} filled top="-8%" left="-6%" className="hidden sm:block" />
        <FocusCircle size={120} top="60%" right="4%" className="hidden sm:block" />
        <Container className="max-w-lg relative">
          <div className="relative">
            <ChapterMarker />
            <Kicker>WHAT YOU ACTUALLY GET</Kicker>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text mb-3 leading-snug">
              מה זה נותן לכם, בפועל
            </h2>
          </div>
          <p className="text-text-secondary mb-8 leading-relaxed">
            שישה עקרונות שמנחים כל שלב בדרך שלכם אלינו — לא סיסמאות, אלא איך זה עובד בפועל.
          </p>

          <ul className="space-y-3 mb-9">
            {c.pillars.map((p) => (
              <li key={p.name} className="flex items-start gap-3 rounded-2xl px-4 py-3" style={{ background: "rgba(255,255,255,0.55)", backdropFilter: "blur(6px)" }}>
                <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "var(--accent)" }} />
                <div>
                  <span className="font-heading font-semibold text-text">{p.nameHe}</span>
                  <span className="text-text-secondary text-sm"> — {p.description}</span>
                </div>
              </li>
            ))}
          </ul>

          <CTAButton text={copy.hero.ctaText} />
        </Container>
      </Chapter>

      {/* Chapter: Clinical — full-bleed real photo (חדר MRI פרימיום), טקסט על גבי scrim כהה */}
      <Chapter
        bg="clinical"
        image="/images/clinical-suite.png"
        imageClassName="object-cover object-[38%_center] sm:object-[center]"
        className="flex items-center min-h-[560px] sm:min-h-[720px] pt-16 pb-20 sm:pt-20 sm:pb-24"
      >
        <FocusCircle size={200} top="10%" right="8%" color="255,255,255" className="hidden lg:block" />
        <Container className="max-w-lg relative">
          <h2 className="font-heading font-bold text-2xl sm:text-3xl text-white mb-8 leading-snug">
            {c.techProof.headline}
          </h2>
          <dl className="space-y-5">
            <div>
              <Kicker tone="onDark" as="dt">WHAT IT IS</Kicker>
              <dd className="text-white">{c.techProof.whatItIs}</dd>
            </div>
            <div>
              <Kicker tone="onDark" as="dt">TECHNOLOGY</Kicker>
              <dd className="text-white">{c.techProof.technology}</dd>
            </div>
            <div>
              <Kicker tone="onDark" as="dt">WHAT IT CAN SHOW</Kicker>
              <dd className="text-white">{c.techProof.whatItCanShow}</dd>
            </div>
            <div className="pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
              <dt className="font-latin text-[0.7rem] font-semibold tracking-[0.08em] mb-1" style={{ color: "rgba(255,255,255,0.7)" }}>
                WHAT TO KNOW
              </dt>
              <dd className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>
                {c.techProof.whatToKnow}
              </dd>
            </div>
          </dl>
        </Container>
      </Chapter>

      {/* Quiet section: journey timeline — light, calm, informational (50% KNOWLEDGE stays quiet) */}
      <Chapter bg="bgAlt" curveTop className="py-16 sm:py-20">
        <Container className="max-w-3xl">
          <Reveal>
            <h2 className="text-center font-heading font-semibold text-xl text-text mb-10">מסע הבדיקה, שלב אחר שלב</h2>
          </Reveal>
          <Reveal>
            <div className="relative grid sm:grid-cols-3 gap-8 sm:gap-4">
              <div
                className="hidden sm:block absolute top-[9px] h-px"
                style={{ insetInlineStart: "16.5%", insetInlineEnd: "16.5%", background: "rgba(45,127,249,0.25)" }}
                aria-hidden
              />
              {c.journey.map((step) => (
                <div key={step.phase} className="relative text-center px-2">
                  <div className="mx-auto mb-4 rounded-full" style={{ width: 18, height: 18, background: "var(--white)", border: "2px solid var(--accent)" }} aria-hidden />
                  <p className="font-heading font-semibold text-text mb-2">{step.phase}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.includes}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </Container>
      </Chapter>
    </>
  );
}
