"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ContactMessageModal from "@/components/ContactMessageModal";
import PhilosophySection from "@/components/PhilosophySection";
import TrustedBrands from "@/components/TrustedBrands";
import Services from "@/components/Services";
import FeaturedWork from "@/components/FeaturedWork";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Insights from "@/components/Insights";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import IntroAnimation from "@/components/IntroAnimation";
import CyberSpider from "@/components/CyberSpider";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [showContactMessage, setShowContactMessage] = useState(false);

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <Navbar />
      <main>
        <Hero onSayHello={() => setShowContactMessage(true)} />
        <PhilosophySection />
        <TrustedBrands />
        <Services />
        <FeaturedWork />
        <Experience />
        <About />
        <Insights />
        <Contact onSayHello={() => setShowContactMessage(true)} />
      </main>
      <CyberSpider />
      <Footer />
      {showContactMessage && (
        <ContactMessageModal
          isOpen={showContactMessage}
          onClose={() => setShowContactMessage(false)}
        />
      )}
    </>
  );
}
