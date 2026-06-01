"use client";

import { useState } from "react";
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
    <section className="relative overflow-hidden bg-black py-24 text-white sm:py-28">
      {/* Background Glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-105 w-190 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-2 w-2 rounded-sm bg-[#7C5CFF]" />

            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-white/75">
              Pricing
            </p>

            <span className="h-2 w-2 rounded-sm bg-[#7C5CFF]" />
          </div>

          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Pay for the leverage,
            <br />
            not the listings
          </h2>
        </div>

        {/* Billing Toggle */}
        <div className="mt-14 flex justify-center">
          <div className="flex items-center rounded-full border border-white/20 bg-gray-900 p-1 shadow-2xl shadow-black/40">
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                billingCycle === "monthly"
                  ? "bg-white text-black"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Monthly
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("yearly")}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                billingCycle === "yearly"
                  ? "bg-white text-black"
                  : "text-black/60 hover:text-black"
              }`}
            >
              Yearly
              <span className="rounded-full bg-fuchsia-500 px-2.5 py-1 text-xs font-bold text-white">
                25%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {pricingPlans.map((plan) => {
            const Icon = plan.Icon;
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;

            return (
              <article
                key={plan.name}
                className={`relative overflow-hidden rounded-3xl border p-7 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 ${
                  plan.highlighted
                    ? "border-white/20 bg-[#191919] shadow-2xl shadow-white/10"
                    : "border-white/10 bg-black"
                }`}
              >
                {plan.highlighted && (
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_45%)]" />
                )}

                <div className="relative">
                  {/* Top Row */}
                  <div className="flex items-start justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/4 text-pink-200">
                        <Icon className="h-5 w-5" />
                      </div>

                      <h3 className="text-2xl font-medium tracking-[-0.03em] text-white">
                        {plan.name}
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="flex items-end justify-end">
                        <span className="text-5xl font-semibold tracking-tighter text-white">
                          ${price}
                        </span>

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

                    <ul className="mt-5 space-y-4">
                      {plan.features.map((feature) => (
                        <li
                          key={feature}
                          className="flex items-center gap-3 text-base text-white/60"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/8 text-white">
                            <FiPlus className="h-4 w-4" />
                          </span>

                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA */}
                  <button
                    type="button"
                    className={`mt-20 flex w-full items-center justify-between rounded-xl px-6 py-4 text-base font-semibold transition ${
                      plan.highlighted
                        ? "bg-white text-black hover:bg-white/90"
                        : "bg-white/20 text-white hover:bg-white/25"
                    }`}
                  >
                    Choose This Plan
                    <FiArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* Trust Line */}
        <div className="mt-8 flex items-center justify-center gap-2 text-sm text-white/45">
          <CircleCheck className="h-4 w-4 text-violet-300" />
          <span>Upgrade, downgrade, or cancel anytime.</span>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;