"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { Briefcase, CircleCheck } from "@gravity-ui/icons";
import { FiArrowRight, FiBarChart2, FiPlus, FiZap } from "react-icons/fi";

const pricingPlans = [
  {
    name: "Starter",
    Icon: Briefcase,
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Start building your career hub:",
    features: [
      "Browse jobs and companies",
      "Save up to 10 jobs",
      "Basic seeker profile",
      "Email job notifications",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    Icon: FiBarChart2,
    monthlyPrice: 17,
    yearlyPrice: 153,
    description: "Best for serious job seekers:",
    features: [
      "Unlimited job applications",
      "Unlimited saved jobs",
      "Application tracking",
      "Salary insights",
    ],
    highlighted: true,
  },
  {
    name: "Premium",
    Icon: FiZap,
    monthlyPrice: 99,
    yearlyPrice: 891,
    description: "For teams and recruiters:",
    features: [
      "Everything in Growth",
      "Unlimited job posts",
      "Applicant management",
      "Recruiter analytics",
    ],
    highlighted: false,
  },
];

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const isYearly = billingCycle === "yearly";

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden bg-black py-24 text-white sm:py-28"
    >
      {/* Background Glow */}
      <motion.div
        animate={{
          opacity: [0.65, 1, 0.65],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute left-1/2 top-0 h-105 w-190 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[130px]"
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
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

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
              Pricing
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
            Pay for the leverage,
            <br />
            not the listings
          </motion.h2>
        </motion.div>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 flex justify-center"
        >
          <motion.div
            whileHover={{ y: -2, scale: 1.01 }}
            className="flex items-center rounded-full border border-white/20 bg-gray-900 p-1 shadow-2xl shadow-black/40"
          >
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                billingCycle === "monthly"
                  ? "bg-white text-black"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Monthly
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                billingCycle === "yearly"
                  ? "bg-white text-black"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Yearly
              <motion.span
                animate={{
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="rounded-full bg-fuchsia-500 px-2.5 py-1 text-xs font-bold text-white"
              >
                25%
              </motion.span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.14,
              },
            },
          }}
          className="mt-8 grid gap-6 lg:grid-cols-3"
        >
          {pricingPlans.map((plan) => {
            const Icon = plan.Icon;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <motion.article
                key={plan.name}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 42,
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
                className={`relative overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 ${
                  plan.highlighted
                    ? "border-white/20 bg-[#191919] shadow-2xl shadow-white/10"
                    : "border-white/10 bg-black"
                }`}
              >
                {plan.highlighted && (
                  <motion.div
                    animate={{
                      opacity: [0.75, 1, 0.75],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_45%)]"
                  />
                )}

                <div className="relative">
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{
                          rotate: 360,
                          scale: 1.12,
                        }}
                        transition={{
                          duration: 0.58,
                          ease: "easeInOut",
                        }}
                        className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/4 text-pink-200"
                      >
                        <Icon className="h-5 w-5" />
                      </motion.div>

                      <h3 className="text-2xl font-medium tracking-[-0.03em] text-white">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="flex items-end justify-end">
                        <motion.span
                          key={`${plan.name}-${price}`}
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.25, ease: "easeOut" }}
                          className="text-5xl font-semibold tracking-tighter text-white"
                        >
                          ${price}
                        </motion.span>

                        <span className="mb-1 ml-1 text-sm text-white/80">
                          /{isYearly ? "year" : "month"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mt-12">
                    <p className="text-lg font-semibold text-white">
                      {plan.description}
                    </p>

                    <motion.ul
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={{
                        hidden: {},
                        visible: {
                          transition: {
                            staggerChildren: 0.05,
                            delayChildren: 0.12,
                          },
                        },
                      }}
                      className="mt-5 space-y-4"
                    >
                      {plan.features.map((feature) => (
                        <motion.li
                          key={feature}
                          variants={{
                            hidden: {
                              opacity: 0,
                              x: -10,
                            },
                            visible: {
                              opacity: 1,
                              x: 0,
                            },
                          }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="flex items-center gap-3 text-base text-white/60"
                        >
                          <motion.span
                            whileHover={{
                              rotate: 180,
                              scale: 1.1,
                            }}
                            transition={{
                              duration: 0.25,
                              ease: "easeOut",
                            }}
                            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/8 text-white"
                          >
                            <FiPlus className="h-4 w-4" />
                          </motion.span>

                          <span>{feature}</span>
                        </motion.li>
                      ))}
                    </motion.ul>
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileHover={{
                      y: -2,
                      scale: 1.015,
                    }}
                    whileTap={{
                      scale: 0.97,
                    }}
                    type="button"
                    className={`mt-20 flex w-full items-center justify-between rounded-xl px-6 py-4 text-base font-semibold transition ${
                      plan.highlighted
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-white/20 text-white hover:bg-white/25"
                    }`}
                  >
                    Choose This Plan
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
                      <FiArrowRight className="h-5 w-5" />
                    </motion.span>
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        {/* Trust Line */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.45, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex items-center justify-center gap-2 text-sm text-white/45"
        >
          <motion.span
            animate={{
              rotate: [0, 360],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <CircleCheck className="h-4 w-4 text-violet-300" />
          </motion.span>
          <span>Upgrade, downgrade, or cancel anytime.</span>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default PricingSection;