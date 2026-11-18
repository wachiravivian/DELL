"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { site, type NavItem } from "@/lib/site";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false); // phone menu
  const [sub, setSub] = useState(false); // desktop drop-down
  const subRef = useRef<HTMLDivElement>(null);

  // Close menus when the page changes
  useEffect(() => {
    setOpen(false);
    setSub(false);
  }, [pathname]);

  // Close the drop-down on outside click or Escape
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (subRef.current && !subRef.current.contains(e.target as Node)) setSub(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSub(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const isActive = (href?: string) => !!href && (href === "/" ? pathname === "/" : pathname.startsWith(href));
  const groupActive = (item: NavItem) => !!item.children?.some((c) => isActive(c.href));

  const linkClass = (active: boolean) =>
    `px-1 py-2 font-medium transition-colors hover:text-olive ${
      active ? "text-olive underline decoration-sun decoration-4 underline-offset-8" : "text-bark"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="container-site flex items-center justify-between gap-4 py-3">
        <Link href="/" aria-label="Maranet home">
          <Image
            src="/images/maranet-logo.png"
            alt="Maranet – The People's net"
            width={404}
            height={201}
            priority
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop menu */}
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main">
          {site.nav.map((item) =>
            item.children ? (
              <div key={item.label} ref={subRef} className="relative">
                <button
                  type="button"
                  aria-expanded={sub}
                  aria-haspopup="true"
                  onClick={() => setSub(!sub)}
                  className={`${linkClass(groupActive(item))} inline-flex items-center gap-1`}
                >
                  {item.label}
                  <ChevronDown size={16} className={`transition-transform ${sub ? "rotate-180" : ""}`} aria-hidden />
                </button>
                {sub && (
                  <div className="absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded-2xl border border-line bg-white p-2 shadow-xl">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className={`block rounded-xl px-4 py-2.5 font-medium hover:bg-sand ${isActive(c.href) ? "text-olive" : ""}`}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link key={item.href} href={item.href!} className={linkClass(isActive(item.href))}>
                {item.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden lg:block">
          <Link href="/get-connected/" className="btn-sun">Get connected</Link>
        </div>

        {/* Phone menu button */}
        <button
          type="button"
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-white lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(!open)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3A2414" strokeWidth="2.5" strokeLinecap="round">
            {open ? <path d="M5 5l14 14M19 5L5 19" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* Phone menu panel */}
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-cream lg:hidden">
          <nav className="container-site flex flex-col py-4" aria-label="Mobile">
            {site.nav.map((item) =>
              item.children ? (
                <div key={item.label} className="border-b border-line py-3">
                  <p className="text-sm font-bold uppercase tracking-wider text-bark-soft">{item.label}</p>
                  <div className="mt-1 flex flex-col">
                    {item.children.map((c) => (
                      <Link
                        key={c.href}
                        href={c.href}
                        className={`py-2 pl-4 text-lg ${isActive(c.href) ? "font-bold text-olive" : ""}`}
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`border-b border-line py-3 text-lg ${isActive(item.href) ? "font-bold text-olive" : ""}`}
                >
                  {item.label}
                </Link>
              )
            )}
            <div className="mt-5">
              <Link href="/get-connected/" className="btn-sun w-full">Get connected</Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}