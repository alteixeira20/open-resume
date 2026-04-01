"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { cx } from "lib/cx";
import { NAV_LINKS } from "content/nav";
import { SITE } from "content/site";
import { WORKBENCH_UI } from "components/layout/workbench-ui";

export const TopNavBar = () => {
  const pathName = usePathname();
  const isWorkbenchRoute =
    pathName === "/builder" || pathName === "/parser";

  return (
    <header aria-label="Site Header" className="sticky top-0 z-40 w-full">
      <div className="relative overflow-hidden bg-[linear-gradient(180deg,rgba(250,243,236,0.9),rgba(245,237,230,0.68))] shadow-[0_20px_40px_-36px_rgba(18,13,10,0.42)] backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_22%,rgba(216,137,30,0.1),transparent_24%),radial-gradient(circle_at_82%_14%,rgba(196,74,10,0.07),transparent_18%),radial-gradient(circle_at_50%_-10%,rgba(255,255,255,0.5),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.22),transparent_44%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,transparent,rgba(196,74,10,0.16),transparent)]" />
        <div
          className={cx(
            "relative h-[var(--top-nav-bar-height)]",
            isWorkbenchRoute
              ? `mx-auto ${WORKBENCH_UI.shellMaxWidthClass} px-3 md:px-4 xl:px-6`
              : "mx-auto w-full max-w-screen-xl px-8 lg:px-12"
          )}
        >
          <div
            className="flex h-full items-center justify-between gap-3"
          >
            <Link href="/" className="flex shrink-0 items-center gap-0">
              <span className="sr-only">{SITE.name}</span>
              <Image
                src="/anvil_logo.png"
                alt=""
                aria-hidden="true"
                width={298}
                height={150}
                className="mr-0.5 h-4.5 w-auto self-center object-contain sm:h-5"
                priority
              />
              <span className="flex items-baseline gap-0">
                <span className="text-xl font-black tracking-tight text-[color:var(--color-text-primary)] sm:text-2xl lg:text-3xl">
                  CV
                </span>
                <span className="text-primary text-xl font-black tracking-tight sm:text-2xl lg:text-3xl">
                  Forge
                </span>
              </span>
            </Link>
            <nav
              aria-label="Site Nav Bar"
              className="ml-auto flex min-w-0 items-center justify-end gap-1.5 text-sm font-semibold sm:gap-2.5"
            >
              {NAV_LINKS.map(({ href, label }) => (
                <Link
                  key={label}
                  aria-current={pathName === href ? "page" : undefined}
                  className={cx(
                    "shrink-0 rounded-full px-2.5 py-1.5 text-xs font-semibold transition sm:px-3 sm:py-2 sm:text-sm lg:px-4 lg:text-base",
                    pathName === href
                      ? "bg-[linear-gradient(135deg,rgba(196,74,10,0.12),rgba(143,90,31,0.08))] text-[color:var(--color-forge-800)] shadow-[inset_0_0_0_1px_rgba(196,74,10,0.18)]"
                      : "text-[color:var(--color-forge-600)] hover:bg-[rgba(253,248,245,0.66)] hover:text-[color:var(--color-forge-800)]"
                  )}
                  href={href}
                >
                  {label === "Parser" ? (
                    <>
                      <span className="min-[420px]:hidden">Parse</span>
                      <span className="hidden min-[420px]:inline">{label}</span>
                    </>
                  ) : (
                    label
                  )}
                </Link>
              ))}
              <div className="-mr-6 ml-1 hidden shrink-0 items-center overflow-hidden sm:flex">
                <iframe
                  src="https://ghbtns.com/github-btn.html?user=alteixeira20&repo=cvforge&type=star&count=true"
                  width="96"
                  height="20"
                  className="block overflow-hidden border-none"
                  title="GitHub"
                />
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};
