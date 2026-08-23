import { CtaBand } from "@/components/CtaBand";
import { Hero } from "@/components/Hero";
import { Programs } from "@/components/Programs";
import { Research } from "@/components/Research";
import { Software } from "@/components/Software";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <Research />
      <Programs />
      <Software />
      <CtaBand />
    </main>
  );
}
