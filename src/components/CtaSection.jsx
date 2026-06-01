"use client";

import Link from "next/link";

const CtaSection = () => {
  return (
    <section className="relative overflow-hidden bg-black py-20 text-white sm:py-24">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.20),transparent_40%)]" />

      {/* CTA grid background image */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-contain bg-bottom bg-no-repeat opacity-95"
        style={{
          backgroundImage: "url('/images/cta-bg.png')",
        }}
      />

      {/* Bottom fade for smooth blend */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="mx-auto max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
          Your next role is
          <br />
          already looking for you
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
          Build a profile in three minutes. The matches start arriving tomorrow
          morning.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Create a free account
          </Link>

          <Link
            href="/pricing"
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/[0.09]"
          >
            View pricing
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CtaSection;