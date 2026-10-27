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

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
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
