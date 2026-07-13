"use client";

import Link from "next/link";
import { motion } from "motion/react";

const CtaSection = () => {
  return (
    <section className="relative overflow-hidden border-t border-white/10 bg-black px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[34rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[100px]" />
        <div className="absolute -right-24 top-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.2]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage:
              "radial-gradient(circle at center, black, transparent 72%)",
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
        className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#101010]/90 px-6 py-14 shadow-2xl shadow-violet-950/20 backdrop-blur sm:px-10 sm:py-16 lg:px-16"
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/55">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Ready for your next role?
            </div>

            <h2 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Build one profile.
              <span className="block text-white/45">
                Open the door to better opportunities.
              </span>
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
              Join Rolebix to discover relevant jobs, submit applications, and
              follow every update from one simple workspace.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/auth/register"
                className="inline-flex h-12 items-center justify-center rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Create free account
              </Link>

              <Link
                href="/jobs"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white/75 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
              >
                Explore jobs
              </Link>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/30">
              <span>✓ Free to get started</span>
              <span>✓ Track applications</span>
              <span>✓ No credit card required</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-violet-500/15 via-transparent to-blue-500/15 blur-2xl" />

            <div className="relative space-y-3 rounded-3xl border border-white/10 bg-black/50 p-4">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                <div>
                  <p className="text-xs text-white/35">Matched role</p>
                  <p className="mt-1 font-semibold">
                    Product Designer
                  </p>
                  <p className="mt-1 text-xs text-white/35">
                    Remote • Full-time
                  </p>
                </div>

                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-300">
                  96% match
                </span>
              </div>

              <div className="ml-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] p-4 opacity-80">
                <div>
                  <p className="text-xs text-white/35">
                    Application status
                  </p>
                  <p className="mt-1 font-semibold">
                    Interview stage
                  </p>
                </div>

                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
              </div>

              <div className="mr-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 opacity-60">
                <p className="text-xs text-white/35">
                  New opportunity
                </p>
                <p className="mt-1 font-semibold">
                  Frontend Engineer
                </p>
                <p className="mt-1 text-xs text-white/35">
                  Dhaka • Hybrid
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CtaSection;
