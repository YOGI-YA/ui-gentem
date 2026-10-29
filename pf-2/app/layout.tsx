import type { Metadata, Viewport } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Noise from "@/components/Noise";

export const metadata: Metadata = {
  title: "Yogender Verma — Full-Stack Developer & AI Systems Engineer",
  description:
    "Full-Stack Developer building modern web applications and AI-powered experiences with Next.js, React, and scalable product thinking.",
  keywords: [
    "Yogender Verma",
    "Full-Stack Developer",
    "Next.js Developer",
    "React Developer",
    "AI Systems Engineer",
    "TypeScript",
    "AI Agents",
    "RAG",
    "Software Engineer Portfolio",
  ],
  authors: [{ name: "Yogender Verma", url: "https://yogender.me" }],
  creator: "Yogender Verma",
  openGraph: {
    title: "Yogender Verma — Full-Stack Developer & AI Systems Engineer",
    description:
      "Full-Stack Developer building modern web applications and AI-powered experiences with Next.js, React, and scalable product thinking.",
    url: "https://yogender.me",
    siteName: "Yogender Verma",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yogender Verma — Full-Stack Developer & AI Systems Engineer",
    description:
      "Full-Stack Developer building modern web applications and AI-powered experiences with Next.js, React, and scalable product thinking.",
    creator: "@yogendervermaa",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap"
        />
      </head>
      <body>
        <Noise />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
