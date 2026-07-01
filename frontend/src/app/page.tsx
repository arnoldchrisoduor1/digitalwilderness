import { Capabilities } from "@/components/Capabilities";
import { CtaBand } from "@/components/CtaBand";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { Navbar } from "@/components/Navbar";
import { Pipeline } from "@/components/Pipeline";
import { Research } from "@/components/Research";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Showcase } from "@/components/Showcase";
import { Stack } from "@/components/Stack";
import { ToTop } from "@/components/ToTop";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <div className="grain" aria-hidden />
      <Navbar />
      <Hero />
      <main>
        <Capabilities />
        <Showcase />
        <Pipeline />
        <Research />
        <Stack />
        <CtaBand />
      </main>
      <Footer />
      <ToTop />
    </>
  );
}
