"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logo.svg";
import { cx } from "lib/cx";

export const TopNavBar = () => {
  const pathName = usePathname();
  const isHomePage = pathName === "/";

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "relative flex min-h-[calc(var(--top-nav-bar-height)+12px)] items-center px-3 py-2 lg:px-12",
        isHomePage && "bg-dot"
      )}
    >
      <div className="pointer-events-none absolute bottom-1 left-1/2 h-[3px] w-[min(100%-2rem,1200px)] -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-200/90 to-transparent" />
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between">
        <Link href="/" className="flex items-center">
          <span className="sr-only">OpenResume</span>
          <Image
            src={logoSrc}
            alt="OpenResume Logo"
            className="h-9 w-auto"
            priority
          />
        </Link>
        <nav
          aria-label="Site Nav Bar"
          className="flex items-center gap-3 text-sm font-semibold"
        >
          {[
            ["/resume-builder", "Builder"],
            ["/resume-parser", "ATS Scoring"],
          ].map(([href, text]) => (
            <Link
              key={text}
              className="inline-flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:border-gray-300 hover:bg-gray-50 focus-visible:border-gray-300 focus-visible:bg-gray-50 lg:px-5"
              href={href}
            >
              {text}
            </Link>
          ))}
          <div className="ml-2 flex items-center">
            <iframe
              src="https://ghbtns.com/github-btn.html?user=alteixeira20&repo=open-resume&type=star&count=true"
              width="100"
              height="20"
              className="overflow-hidden border-none"
              title="GitHub"
            />
          </div>
        </nav>
      </div>
    </header>
  );
};
