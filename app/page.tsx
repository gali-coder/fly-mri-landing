import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import Knowledge from "@/components/sections/Knowledge";
import Care from "@/components/sections/Care";
import CTAForm from "@/components/sections/CTAForm";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Knowledge />
        <Care />
        <CTAForm />
      </main>
      <Footer />
    </>
  );
}
