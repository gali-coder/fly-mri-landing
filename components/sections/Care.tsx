import { copy } from "@/lib/copy";
import { Chapter, Container, Reveal } from "../ui";

export default function Care() {
  const c = copy.care;
  return (
    <Chapter
      bg="life"
      image="/images/care-still-life.png"
      imageClassName="object-cover object-[15%_center] sm:object-[center]"
      imageOverlay="linear-gradient(to left, rgba(250,249,246,0.94) 0%, rgba(250,249,246,0.62) 45%, rgba(250,249,246,0.12) 100%)"
      curveTop
      className="pt-16 pb-24 sm:pt-20 sm:pb-28 flex items-center min-h-[560px] sm:min-h-[720px]"
    >
      <Container className="max-w-5xl relative">
        <div className="ml-auto max-w-lg text-right">
          <Reveal>
            <h2 className="font-heading font-bold text-2xl sm:text-3xl text-text mb-10 leading-snug">
              {c.transitionHeadline}
            </h2>
          </Reveal>

          <ul className="space-y-5 mb-12">
            {c.confidencePoints.map((p) => (
              <Reveal
                key={p.label}
                as="li"
                className="block rounded-2xl px-5 py-4"
                style={{ background: "rgba(255,255,255,0.65)", backdropFilter: "blur(6px)" }}
              >
                <p className="font-heading font-semibold text-text mb-1">{p.label}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{p.text}</p>
              </Reveal>
            ))}
          </ul>

          <Reveal>
            <div className="rounded-[24px] p-6" style={{ background: "rgba(255,255,255,0.7)", backdropFilter: "blur(6px)" }}>
              <h3 className="font-heading font-semibold text-lg text-text mb-2">{c.reassurance.hook}</h3>
              <p className="text-text-secondary leading-relaxed text-sm">{c.reassurance.body}</p>
            </div>
          </Reveal>
        </div>
      </Container>
    </Chapter>
  );
}
