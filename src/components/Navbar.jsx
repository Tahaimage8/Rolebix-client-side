/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    label: "Browse Jobs",
    href: "/jobs",
  },
  {
    label: "Company",
    href: "/companies",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#181818]/85 backdrop-blur-xl">
      <header className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center">
            <img
              src="/images/rolebix-logo.png"
              alt="Rolebix Logo"
              width={130}
              height={40}
              className="h-8 w-auto object-contain"
            />
        </Link>

        {/* Right: Desktop Menu + Actions */}
        <div className="hidden items-center justify-end gap-7 md:flex">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-white"
                      : "text-white/65 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Vertical Divider */}
          <span className="h-6 w-px bg-white/15" aria-hidden="true" />

          <div className="flex items-center gap-5">
            <Link
              href="/signin"
              className="text-sm font-medium text-[#8B7CFF] transition-colors hover:text-white"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.02] hover:shadow-violet-500/40"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <section className="border-t border-white/10 bg-[#101010] px-4 py-5 md:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive(link.href)
                      ? "bg-white/10 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mx-auto mt-4 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-4">
            <Link
              href="/signin"
              className="rounded-xl px-4 py-3 text-sm font-medium text-[#8B7CFF] transition hover:bg-white/5 hover:text-white"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              className="rounded-xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01]"
            >
              Get Started
            </Link>
          </div>
        </section>
      )}
    </nav>
  );
};

const MenuIcon = () => {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
};

const CloseIcon = () => {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
};

export default Navbar;