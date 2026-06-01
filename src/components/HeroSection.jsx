/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  FiBriefcase,
  FiHome,
  FiUsers,
  FiCheckCircle,
  FiZap,
  FiArrowRight,
} from "react-icons/fi";
import SearchHeroC from "./SearchHeroC";

const trendingKeywords = [
  "Product Designer",
  "AI Engineering",
  "Web Developer",
];

const stats = [
  {
    label: "Active Jobs",
    value: "50K",
    Icon: FiBriefcase,
  },
  {
    label: "Companies",
    value: "12K",
    Icon: FiHome,
  },
  {
    label: "Job Seekers",
    value: "2M",
    Icon: FiUsers,
  },
  {
    label: "Satisfaction Rate",
    value: "97%",
    Icon: FiCheckCircle,
  },
];

const HeroSection = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-black text-white"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.28),transparent_30%),linear-gradient(180deg,#171717_0%,#050505_50%,#000000_100%)]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="absolute left-1/2 top-0 h-105 w-180 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]"
      />

      <motion.div
        aria-hidden="true"
        animate={{
          opacity: [0.18, 0.32, 0.18],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-20 h-60 w-60 -translate-x-1/2 rounded-full bg-[#7C5CFF]/10 blur-[90px]"
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        {/* Hero Text */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.11,
                delayChildren: 0.08,
              },
            },
          }}
          className="mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <motion.div
            variants={{
              hidden: {
                opacity: 0,
                y: 18,
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
            whileHover={{
              y: -2,
              scale: 1.02,
            }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/70 backdrop-blur-xl"
          >
            <motion.span
              animate={{
                rotate: [0, 10, -10, 0],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/15 text-orange-400"
            >
              <FiZap className="h-3.5 w-3.5" />
            </motion.span>

            <span>
              <strong className="font-semibold text-white">50,000+</strong> new
              jobs this month
            </span>
          </motion.div>

          <motion.h1
            variants={{
              hidden: {
                opacity: 0,
                y: 28,
                filter: "blur(8px)",
              },
              visible: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              },
            }}
            transition={{
              duration: 0.62,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="max-w-5xl text-5xl font-semibold tracking-tighter text-white sm:text-6xl lg:text-[76px] lg:leading-[0.98]"
          >
            Find Your Dream Job Today
          </motion.h1>

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
              duration: 0.52,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base"
          >
            Rolebix connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </motion.p>
        </motion.div>

        {/* Search + Visual Area */}
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.58,
            delay: 0.22,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto mt-12 max-w-6xl"
        >
          {/* Search Component */}
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.52,
              delay: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <SearchHeroC />
          </motion.div>

          {/* Visual Card */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.96,
              y: 28,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.72,
              delay: 0.38,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
              scale: 1.005,
            }}
            className="relative -mt-7 overflow-hidden rounded-[32px] border border-white/10 bg-[#030303] shadow-2xl shadow-black/60"
          >
            <motion.div
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.08, 1],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,124,255,0.18),transparent_55%)]"
            />

            <motion.img
              initial={{
                scale: 1.08,
                opacity: 0,
                rotate: -1.2,
              }}
              animate={{
                scale: 1,
                opacity: 0.9,
                rotate: 0,
              }}
              transition={{
                duration: 1,
                delay: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              src="/images/globe.png"
              alt=""
              className="h-107.5 w-full object-cover object-center opacity-90 mix-blend-lighten sm:h-125 lg:h-140"
            />

            <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
            <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black" />

            {/* Trending */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.07,
                    delayChildren: 0.68,
                  },
                },
              }}
              className="absolute left-1/2 top-20 z-20 flex w-full -translate-x-1/2 flex-wrap items-center justify-center gap-2 px-4 text-xs text-white/40"
            >
              <motion.span
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 8,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                  },
                }}
              >
                Trending searches:
              </motion.span>

              {trendingKeywords.map((keyword) => (
                <motion.span
                  key={keyword}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 8,
                      scale: 0.94,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    },
                  }}
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -3,
                    scale: 1.04,
                    rotate: 1,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/65 backdrop-blur-md"
                >
                  {keyword}
                </motion.span>
              ))}
            </motion.div>

            {/* Globe Text */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
                scale: 0.98,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.58,
                delay: 0.76,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute left-1/2 top-[46%] z-20 w-full max-w-xl -translate-x-1/2 px-4 text-center"
            >
              <p className="text-2xl font-semibold leading-tight text-white drop-shadow-2xl sm:text-3xl">
                Assisting over{" "}
                <span className="text-white">15,000</span> job seekers
                <br />
                find their dream positions.
              </p>
            </motion.div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.13,
                  delayChildren: 0.58,
                },
              },
            }}
            className="relative z-30 -mt-24 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {stats.map((stat) => {
              const Icon = stat.Icon;

              return (
                <motion.article
                  key={stat.label}
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: 40,
                      rotateX: 22,
                      rotateY: -18,
                      rotateZ: -2,
                      scale: 0.9,
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
                    duration: 0.68,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{
                    y: -10,
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
                  className="group rounded-3xl border border-white/10 bg-[#111111]/95 p-7 text-left shadow-2xl shadow-black/50 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-[#151515]"
                >
                  <motion.div
                    whileHover={{
                      rotate: 360,
                      scale: 1.14,
                    }}
                    transition={{
                      duration: 0.58,
                      ease: "easeInOut",
                    }}
                    className="mb-12 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-white/60 group-hover:text-violet-300"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.div>

                  <motion.h3
                    initial={{
                      opacity: 0,
                      y: 8,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.42,
                      delay: 0.9,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="text-4xl font-semibold tracking-tight text-white"
                  >
                    {stat.value}
                  </motion.h3>

                  <motion.p
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.38,
                      delay: 0.98,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="mt-2 text-sm text-white/45"
                  >
                    {stat.label}
                  </motion.p>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.55,
            delay: 0.95,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-12 flex flex-col items-center justify-center gap-4 text-center sm:flex-row"
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
              href="/jobs"
              className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Browse Jobs
            </Link>
          </motion.div>

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
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
            >
              For Recruiters
              <motion.span
                animate={{
                  x: [0, 3, 0],
                }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FiArrowRight className="h-4 w-4" />
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroSection;