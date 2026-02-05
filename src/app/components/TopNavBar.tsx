"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logoSrc from "public/logo.svg";
import { cx } from "lib/cx";

export const TopNavBar = () => {
  const pathName = usePathname();

  return (
    <header
      aria-label="Site Header"
      className={cx(
        "sticky top-0 z-40 flex h-[var(--top-nav-bar-height)] w-full items-center border-b border-gray-200/80 bg-white/80 px-3 py-0 backdrop-blur lg:px-12"
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
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
          className="flex items-center gap-4 text-sm font-semibold"
        >
          {[
            ["/resume-builder", "Builder"],
            ["/resume-parser", "ATS Scoring"],
          ].map(([href, text]) => (
            <Link
              key={text}
              className={cx(
                "inline-flex items-center justify-center rounded-full px-3 py-1.5 text-sm font-semibold transition lg:px-4",
                pathName === href
                  ? "bg-gray-900 text-white"
                  : "text-gray-700 hover:text-gray-900"
              )}
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
