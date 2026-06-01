"use client";

import { motion } from "motion/react";
import {
  FiSearch,
  FiBarChart2,
  FiBriefcase,
  FiBookmark,
  FiMousePointer,
  FiClipboard,
  FiHexagon,
  FiTrendingUp,
} from "react-icons/fi";

const features = [
  {
    title: "Smart Search",
    description: "Find your ideal job with advanced filters.",
    Icon: FiSearch,
  },
  {
    title: "Salary Insights",
    description: "Get real salary data to negotiate confidently.",
    Icon: FiBarChart2,
  },
  {
    title: "Top Companies",
    description: "Apply to vetted companies that are hiring.",
    Icon: FiBriefcase,
  },
  {
    title: "Saved Jobs",
    description: "Manage apps & favorites on your dashboard.",
    Icon: FiBookmark,
  },
  {
    title: "One-Click Apply",
    description: "Simplify your job applications for an easier process.",
    Icon: FiMousePointer,
  },
  {
    title: "Resume Builder",
    description: "Create professional resumes with modern templates.",
    Icon: FiClipboard,
  },
  {
    title: "Skill-Based Matching",
    description: "Discover jobs that match your skills and experience.",
    Icon: FiHexagon,
  },
  {
    title: "Career Growth Resources",
    description: "Boost your career with quick interview tips.",
    Icon: FiTrendingUp,
  },
];

const FeaturesSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-[#161616] py-24 text-white sm:py-28"
    >
      {/* Soft background glow */}
      <motion.div
        animate={{
          opacity: [0.7, 1, 0.7],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-0 h-90 w-155 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.96 },
              visible: { opacity: 1, y: 0, scale: 1 },
            }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mb-5 flex items-center justify-center gap-3"
          >
            <motion.span
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-2 w-2 rounded-sm bg-[#7C5CFF]"
            />
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
              Features Job
            </p>
            <motion.span
              animate={{
                rotate: [360, 180, 0],
                scale: [1, 1.15, 1],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="h-2 w-2 rounded-sm bg-[#7C5CFF]"
            />
          </motion.div>

          <motion.h2
            variants={{
              hidden: {
                opacity: 0,
                y: 24,
                filter: "blur(6px)",
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              },
            }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[56px] lg:leading-[1.05]"
          >
            Everything you need
            <br />
            to succeed
          </motion.h2>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.18 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.09,
                delayChildren: 0.12,
              },
            },
          }}
          className="mt-20 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
        >
          {features.map((feature) => {
            const Icon = feature.Icon;

            return (
              <motion.article
                key={feature.title}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 34,
                    rotateX: 18,
                    rotateY: -14,
                    rotateZ: -1.5,
                    scale: 0.94,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    rotateY: 0,
                    rotateZ: 0,
                    scale: 1,
                  },
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -8,
                  rotateX: 5,
                  rotateY: -6,
                  rotateZ: 1,
                  scale: 1.025,
                  transition: {
                    duration: 0.24,
                    ease: "easeOut",
                  },
                }}
                whileTap={{
                  scale: 0.98,
                  rotateX: 0,
                  rotateY: 0,
                  rotateZ: 0,
                }}
                style={{
                  transformPerspective: 900,
                  transformStyle: "preserve-3d",
                }}
                className="group flex items-start gap-6"
              >
                {/* Icon Box */}
                <motion.div
                  whileHover={{
                    rotate: 360,
                    scale: 1.08,
                  }}
                  transition={{
                    duration: 0.6,
                    ease: "easeInOut",
                  }}
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/70 shadow-lg shadow-black/30 transition duration-300 group-hover:border-violet-400/40 group-hover:bg-violet-500/10"
                >
                  <Icon className="h-8 w-8 text-pink-200 transition duration-300 group-hover:text-violet-300" />
                </motion.div>

                {/* Text */}
                <motion.div
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 max-w-57.5 text-base leading-7 text-white/60">
                    {feature.description}
                  </p>
                </motion.div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;