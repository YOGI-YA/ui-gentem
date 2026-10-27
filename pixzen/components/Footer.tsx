import { personalInfo } from "@/lib/data";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

type FooterColumn = {
  heading: string;
  links: FooterLink[];
};

const navColumns: FooterColumn[] = [
  {
    heading: "Navigation",
    links: [
      { label: "Selected Work", href: "#work" },
      { label: "Core Expertise", href: "#expertise" },
      { label: "About & Philosophy", href: "#about" },
      { label: "Technical Insights", href: "#insights" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    heading: "Connect",
    links: [
      { label: "GitHub", href: personalInfo.github, external: true },
      { label: "LinkedIn", href: personalInfo.linkedin, external: true },
      { label: "X (Twitter)", href: personalInfo.twitter, external: true },
      { label: "Personal Site", href: personalInfo.portfolio, external: true },
    ],
  },
  {
    heading: "Focus Areas",
    links: [
      { label: "Next.js & React 19", href: "#expertise" },
      { label: "Autonomous AI Agents", href: "#expertise" },
      { label: "RAG & Vector Search", href: "#expertise" },
      { label: "Design Systems & Motion", href: "#expertise" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="py-16 border-t border-border bg-background">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid grid-cols-2 gap-10 border-b border-border pb-16 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm font-semibold tracking-[0.2em] uppercase">
              {personalInfo.name}
            </p>
            <p className="mt-4 max-w-[240px] text-xs text-muted leading-relaxed">
              {personalInfo.bio}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 text-xs text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Available for engineering opportunities</span>
            </div>
          </div>

          {navColumns.map((column) => (
            <div key={column.heading}>
              <p className="mb-4 text-xs tracking-[0.2em] text-muted uppercase">
                {column.heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="text-xs text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
          <a
            href={`mailto:${personalInfo.email}`}
            className="transition-colors hover:text-foreground"
          >
            {personalInfo.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
