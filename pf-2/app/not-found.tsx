import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-xs tracking-[0.3em] text-muted">ERROR 404</p>
      <h1 className="mt-4 text-5xl font-medium tracking-tight sm:text-7xl">
        Page Not Found
      </h1>
      <p className="mt-4 max-w-md text-base text-muted">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 rounded-full border border-foreground px-6 py-3 text-xs tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background"
      >
        <ArrowLeft size={14} />
        RETURN HOME
      </Link>
    </main>
  );
}
