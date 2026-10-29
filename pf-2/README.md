# Yogender Verma — Portfolio

Modern, high-performance portfolio for **Yogender Verma**, Full-Stack Developer & AI Systems Engineer. Built with Next.js 15 (App Router), Tailwind CSS v4, GSAP, Framer Motion, and Lenis smooth scrolling.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

To build for production:

```bash
npm run build
npm run start
```

## Structure

```
app/
  layout.tsx          Root layout — metadata, SEO, fonts, grain overlay, Lenis
  page.tsx            Portfolio page assembly
  not-found.tsx       Custom 404 page
  globals.css         Tailwind v4 theme tokens + custom animations
components/
  Navbar.tsx          Fixed navigation, scroll-aware blur, mobile menu
  Hero.tsx            Dynamic typewriter headline, video backdrop, call to action
  TrustedBrands.tsx   Infinite tech-stack marquee + production philosophy
  Services.tsx        Core expertise with interactive hover preview
  FeaturedWork.tsx    Interactive sticky stacking project cards + case study modal
  Testimonials.tsx    Endorsements & engineering collaboration highlights
  About.tsx           GSAP ScrollTrigger word-reveal statement + stats + marquee
  Insights.tsx        Technical articles with cursor-following image reveal
  Contact.tsx         Magnetic interactive button, contact methods, social links
  Footer.tsx          Footer navigation & live links
  SmoothScroll.tsx    Lenis smooth-scroll provider
  Noise.tsx           SVG film-grain texture
lib/
  data.ts             Portfolio data (personal info, projects, skills, insights)
  utils.ts            `cn` class merging utility
```

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components)
- **Styling**: Tailwind CSS v4 with custom dark aesthetic tokens
- **Animations**: GSAP (ScrollTrigger, SplitType) & Framer Motion
- **Smooth Scroll**: Lenis
- **Icons**: Lucide React
