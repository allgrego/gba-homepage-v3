import { UtilityBar } from "@/components/UtilityBar";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Benefits } from "@/components/Benefits";
import { Services } from "@/components/Services";
import { Needs } from "@/components/Needs";
import { Process } from "@/components/Process";
import { About } from "@/components/About";
import { MissionVision } from "@/components/MissionVision";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";

export default function Home() {
  return (
    <>
      <UtilityBar />
      <Header />
      <main>
        <Hero />
        <Benefits />
        <Services />
        <Needs />
        <Process />
        <About />
        <MissionVision />
        <Contact />
      </main>
      <Footer />
      <JsonLd />
    </>
  );
}
