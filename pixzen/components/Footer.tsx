const columns = [
  {
    heading: "Studio",
    links: ["Work", "Expertise", "About", "Careers"],
  },
  {
    heading: "Connect",
    links: ["Instagram", "LinkedIn", "Dribbble", "X"],
  },
  {
    heading: "Legal",
    links: ["Privacy", "Terms"],
  },
];

export default function Footer() {
  return (
    <footer className="py-16">
      <div className="mx-auto max-w-[1440px] px-6 md:px-10">
        <div className="grid grid-cols-2 gap-10 border-b border-border pb-16 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-sm tracking-[0.2em]">PIXZEN</p>
            <p className="mt-4 max-w-[220px] text-sm text-muted">
              An AI-native digital agency building brand, product, and
              intelligent systems.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <p className="mb-4 text-xs tracking-[0.2em] text-muted">
                {column.heading}
              </p>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start justify-between gap-4 pt-8 text-xs text-muted sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} PIXZEN Studio. All rights reserved.</p>
          <a
            href="mailto:hello@pixzen.ai"
            className="transition-colors hover:text-foreground"
          >
            hello@pixzen.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
