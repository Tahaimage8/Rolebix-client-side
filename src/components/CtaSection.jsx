"use client";

import Link from "next/link";
import { motion } from "motion/react";

const CtaSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-black py-20 text-white sm:py-24"
    >
      {/* Background glow */}
      <motion.div
        animate={{
          opacity: [0.65, 1, 0.65],
          scale: [1, 1.06, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.20),transparent_40%)]"
      />

      {/* CTA grid background image */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 1.04 }}
        whileInView={{ opacity: 0.95, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-contain bg-bottom bg-no-repeat opacity-95"
        style={{
          backgroundImage: "url('/images/cta-bg.png')",
        }}
      />

      {/* Bottom fade for smooth blend */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black to-transparent" />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.25 }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.08,
            },
          },
        }}
        className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8"
      >
        <motion.h2
          variants={{
            hidden: {
              opacity: 0,
              y: 28,
              scale: 0.97,
              filter: "blur(7px)",
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            },
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[56px] lg:leading-[1.05]"
        >
          Your next role is
          <br />
          already looking for you
        </motion.h2>

        <motion.p
          variants={{
            hidden: {
              opacity: 0,
              y: 18,
            },
            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base"
        >
          Build a profile in three minutes. The matches start arriving tomorrow
          morning.
        </motion.p>

        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              y: 20,
              scale: 0.96,
            },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
            },
          }}
          transition={{
            duration: 0.48,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <motion.div
            whileHover={{
              y: -3,
              scale: 1.025,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Create a free account
            </Link>
          </motion.div>

          <motion.div
            whileHover={{
              y: -3,
              scale: 1.025,
              rotate: 1,
            }}
            whileTap={{
              scale: 0.97,
              rotate: 0,
            }}
          >
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white transition hover:bg-white/[0.09]"
            >
              View pricing
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default CtaSection;