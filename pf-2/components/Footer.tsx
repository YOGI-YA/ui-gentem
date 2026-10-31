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
      { label: "About Me", href: "#about" },
      { label: "Manifesto", href: "#manifesto" },
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
    <footer className="mb-2   bg-background">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
