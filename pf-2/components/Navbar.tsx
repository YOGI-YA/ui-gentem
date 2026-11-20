"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, personalInfo } from "@/lib/data";
import { cn } from "@/lib/utils";

const CAL_URL = "https://cal.com/yogender/30min";

// Keep the desktop bar short; the mobile menu still shows every link.
const DESKTOP_LABELS = ["about me", "work", "experience", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      setMenuOpen(false);
      document.body.style.overflow = "";

      const targetId = href.replace("#", "");
      if (!targetId) {
        const lenis = (
          window as unknown as {
            lenis?: { scrollTo: (target: number, options?: Record<string, unknown>) => void };
          }
        ).lenis;
        if (lenis) {
          lenis.scrollTo(0, { duration: 1.2 });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
        return;
      }

      setTimeout(() => {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
          const lenis = (
            window as unknown as {
              lenis?: { scrollTo: (target: HTMLElement | string, options?: Record<string, unknown>) => void };
            }
          ).lenis;

          if (lenis) {
            lenis.scrollTo(targetEl, { offset: -70, duration: 1.2 });
          } else {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }

          if (typeof window !== "undefined" && window.history?.pushState) {
            window.history.pushState(null, "", href);
          }
        }
      }, 80);
    }
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-3 md:px-6">
        <nav
          className={cn(
            "mx-auto flex items-center justify-between transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            scrolled
              ? "mt-3 max-w-4xl rounded-full border border-border bg-background/70 px-5 py-2.5 backdrop-blur-xl"
              : "mt-0 max-w-[1440px] border border-transparent px-3 py-5 md:px-6"
          )}
        >
          <a
            href="#"
            onClick={(e) => handleNavClick(e, "#")}
            className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.2em]"
          >
            {personalInfo.name}
          </a>

          <ul
            className="hidden items-center gap-1 md:flex"
            onMouseLeave={() => setHovered(null)}
          >
            {navLinks
              .filter((l) => DESKTOP_LABELS.includes(l.label.toLowerCase()))
              .map((link) => (
              <li key={link.href} className="relative">
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  onMouseEnter={() => setHovered(link.href)}
                  className={cn(
                    "relative z-10 block whitespace-nowrap px-4 py-2 text-xs uppercase tracking-[0.15em] transition-colors duration-300",
                    hovered === link.href
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {link.label}
                </a>
                {hovered === link.href && (
                  <motion.span
                    layoutId="nav-hover"
                    className="absolute inset-0 rounded-full bg-foreground/[0.06]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <a
              href={CAL_URL}
              className="hidden whitespace-nowrap rounded-full bg-foreground px-5 py-2 text-xs font-medium tracking-[0.15em] text-background transition-opacity hover:opacity-80 md:inline-block"
            >
              LET&apos;S TALK
            </a>
            <button
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center md:hidden"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-background md:hidden"
          >
            {navLinks.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                className="text-3xl font-medium tracking-tight"
              >
                {link.label}
              </motion.a>
            ))}
            <motion.a
              href={CAL_URL}
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + navLinks.length * 0.06, duration: 0.4 }}
              className="mt-4 rounded-full bg-foreground px-6 py-3 text-xs font-medium tracking-[0.15em] text-background"
            >
              LET&apos;S TALK
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
