/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";

import LogoFacebook from "@gravity-ui/icons/LogoFacebook";
import LogoGithub from "@gravity-ui/icons/LogoGithub";
import LogoLinkedin from "@gravity-ui/icons/LogoLinkedin";

const productLinks = [
  { label: "Job discovery", href: "/jobs" },
  { label: "Worker AI", href: "/worker-ai" },
  { label: "Companies", href: "/companies" },
  { label: "Salary data", href: "/salary" },
];

const navigationLinks = [
  { label: "Help center", href: "/help" },
  { label: "Career library", href: "/career-library" },
  { label: "Contact", href: "/contact" },
];

const resourceLinks = [
  { label: "Brand Guideline", href: "/brand-guideline" },
  { label: "Newsroom", href: "/newsroom" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    Icon: LogoFacebook,
  },
  {
    label: "GitHub",
    href: "#",
    Icon: LogoGithub,
  },
  {
    label: "LinkedIn",
    href: "#",
    Icon: LogoLinkedin,
  },
];

const Footer = () => {
  return (
    <footer className="relative overflow-hidden bg-black text-white">
      {/* Background Grid */}
      <div
        className="absolute inset-0 opacity-45"
        style={{
          backgroundImage: "url('/cta-bg.png')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "top center",
          backgroundSize: "cover",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_2fr] lg:gap-20">
          {/* Brand Area */}
          <section>
            <Link href="/" className="inline-flex items-center">
            <img
              src="/images/rolebix-logo.png"
              alt="Rolebix Logo" className="h-8 w-auto object-contain"/>
            </Link>

            <p className="mt-6 max-w-xs text-sm leading-6 text-white/45">
              The AI-native career platform. Built for people who take their
              work seriously.
            </p>

            <div className="mt-16 flex items-center gap-3 md:mt-24">
              {socialLinks.map((social) => (
                <SocialLink
                  key={social.label}
                  href={social.href}
                  label={social.label}
                  Icon={social.Icon}
                />
              ))}
            </div>
          </section>

          {/* Footer Links */}
          <section className="grid gap-10 sm:grid-cols-3">
            <FooterColumn title="Product" links={productLinks} />
            <FooterColumn title="Navigations" links={navigationLinks} />
            <FooterColumn title="Resources" links={resourceLinks} />
          </section>
        </div>

        {/* Bottom */}
        <div className="mt-12 flex flex-col gap-4 text-sm text-white/35 md:flex-row md:items-center md:justify-end">
          <p>Copyright 2026 — Rolebix</p>

          <span className="hidden h-4 w-px bg-white/15 md:block" />

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/terms" className="transition hover:text-white/70">
              Terms & Policy
            </Link>

            <span>-</span>

            <Link href="/privacy" className="transition hover:text-white/70">
              Privacy Guideline
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FooterColumn = ({ title, links }) => {
  return (
    <nav aria-label={title}>
      <h3 className="text-sm font-medium text-[#7C5CFF]">{title}</h3>

      <ul className="mt-5 space-y-4">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-white/40 transition hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const SocialLink = ({ href, label, Icon }) => {
  return (
    <Link
      href={href}
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/55 transition hover:border-[#7C5CFF]/50 hover:bg-[#7C5CFF]/20 hover:text-white"
    >
      <Icon className="h-4 w-4" />
    </Link>
  );
};

export default Footer;