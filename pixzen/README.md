# PIXZEN

An ultra-clean, monochrome editorial site for an AI-native digital agency, built with Next.js 15 (App Router), Tailwind CSS v4, GSAP, Framer Motion, and Lenis smooth scrolling.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To build for production:

```bash
npm run build
npm run start
```

## Notes on assets

- **Hero background video**: the hero references `/public/hero_bg_animation_hand.mp4`, which is not included (binary video assets aren't generated here). Drop your own hand/motion-graphics clip at that path — the hero falls back to a plain background if it's missing. A poster image path (`/public/textures/hero-poster.jpg`) is also referenced for the loading frame; add one or remove the `poster` prop in `components/Hero.tsx`.
- **Project & service imagery**: currently pulled from Unsplash via `next/image` remote patterns (configured in `next.config.ts`) as placeholders. Swap the URLs in `lib/data.ts` for your own imagery, and add any new remote host to `images.remotePatterns`.
- **Typeface**: Satoshi is loaded from the Fontshare CDN in `app/layout.tsx`. If you have a licensed local copy, swap it for a self-hosted `@font-face` for better performance.

## Structure

```
app/
  layout.tsx        Root layout — fonts, grain overlay, Lenis provider
  page.tsx           Assembles all sections
  globals.css        Tailwind v4 theme tokens + custom keyframes
components/
  Navbar.tsx          Fixed nav, scroll-aware blur, mobile overlay menu
  Hero.tsx            Typing effect, video + halftone background
  TrustedBrands.tsx   Infinite marquee of client logos
  Services.tsx        Sticky media reveal on hover (expertise list)
  FeaturedWork.tsx     Sticky stacking project cards + case study modal
  Testimonials.tsx     Client quote grid
  About.tsx            GSAP ScrollTrigger word-reveal manifesto + marquee
  Insights.tsx         Editorial list with cursor-follow image reveal
  Contact.tsx          Magnetic CTA button, animated background blobs
  Footer.tsx           Directory footer
  SmoothScroll.tsx     Lenis smooth-scroll provider
  Noise.tsx            Fixed SVG film-grain overlay
lib/
  data.ts             All site copy/content (services, projects, insights)
  utils.ts             `cn` class-merging helper
```

## Design system

- Background `#0A0A0A`, soft background `#141414`, foreground `#F5F3EF`, muted `#8E8E8E` — defined as Tailwind v4 `@theme` tokens in `globals.css` (no `tailwind.config.ts` needed).
- Typeface: Satoshi throughout, tight tracking on display type, wide tracking (`0.2em`–`0.3em`) on small labels.
- Motion: all custom eases lean on `power4.out` / `power3.out` (GSAP) or cubic-bezier equivalents (Framer Motion) for a buttery, premium feel.
- Reduced motion: the Lenis scroll, GSAP word-reveal, and marquees all respect `prefers-reduced-motion`.
