"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustedBrands from "@/components/TrustedBrands";
import Services from "@/components/Services";
import FeaturedWork from "@/components/FeaturedWork";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Insights from "@/components/Insights";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import IntroAnimation from "@/components/IntroAnimation";

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      <Navbar />
      <main>
        <Hero onReplayIntro={() => setShowIntro(true)} />
        <TrustedBrands />
        <Services />
        <FeaturedWork />
        <Experience />
        <About />
        <Insights />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
