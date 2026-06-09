"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheck,
  FiChevronDown,
  FiHelpCircle,
  FiShield,
  FiStar,
  FiUsers,
  FiZap,
} from "react-icons/fi";

/* 
  All pricing page links are here.
  Later just replace "#" with real routes.
*/
const pricingLinks = {
  seekerFree: "#",
  seekerPro: "#",
  seekerPremium: "#",

  recruiterFree: "#",
  recruiterGrowth: "#",
  recruiterEnterprise: "#",

  bottomPrimary: "#",
  bottomSecondary: "#",
};

const seekerPlans = [
  {
    name: "Free",
    id: "seeker_Free",
    price: "$0",
    duration: "forever",
    description: "A simple way to explore Rolebix and start applying.",
    badge: "Start here",
    highlighted: false,
    href: pricingLinks.seekerFree,
    features: [
      "Browse and save up to 10 jobs",
      "Apply to up to 3 jobs per month",
      "Basic career profile",
      "Email job alerts",
      "Access public job listings",
    ],
    cta: "Get started",
  },
  {
    name: "Pro",
    id: "seeker_Pro",
    price: "$19",
    duration: "month",
    description:
      "For active job seekers who want better tracking and insights.",
    badge: "Most popular",
    highlighted: true,
    href: pricingLinks.seekerPro,
    features: [
      "Apply to up to 30 jobs per month",
      "Unlimited saved jobs",
      "Application tracking",
      "Salary insights",
      "Priority job recommendations",
    ],
    cta: "Upgrade to Pro",
  },
  {
    name: "Premium",
    id: "seeker_Premium",
    price: "$39",
    duration: "month",
    description: "For serious candidates who want stronger visibility.",
    badge: "Best visibility",
    highlighted: false,
    href: pricingLinks.seekerPremium,
    features: [
      "Everything in Pro",
      "Unlimited applications",
      "Profile boost to recruiters",
      "Early access to new jobs",
      "Priority support",
    ],
    cta: "Go Premium",
  },
];

const recruiterPlans = [
  {
    name: "Free",
    id: "recruiter_Free",
    price: "$0",
    duration: "forever",
    description: "Perfect for a company posting its first few roles.",
    badge: "Starter",
    highlighted: false,
    href: pricingLinks.recruiterFree,
    features: [
      "Up to 3 active job posts",
      "Basic applicant management",
      "Standard listing visibility",
      "Company profile page",
      "Great for early hiring",
    ],
    cta: "Start hiring",
  },
  {
    name: "Growth",
     id: "recruiter_Growth",
    price: "$49",
    duration: "month",
    description: "For growing teams that need better applicant tracking.",
    badge: "Recommended",
    highlighted: true,
    href: pricingLinks.recruiterGrowth,
    features: [
      "Up to 10 active job posts",
      "Applicant tracking",
      "Basic hiring analytics",
      "Email support",
      "Better job listing visibility",
    ],
    cta: "Choose Growth",
  },
  {
    name: "Enterprise",
     id: "recruiter_Enterprise",
    price: "$149",
    duration: "month",
    description: "For companies hiring across multiple roles and teams.",
    badge: "Scale hiring",
    highlighted: false,
    href: pricingLinks.recruiterEnterprise,
    features: [
      "Up to 50 active job posts",
      "Advanced analytics dashboard",
      "Featured job listings",
      "Team collaboration",
      "Custom branding and priority support",
    ],
    cta: "Contact sales",
  },
];

const faqs = [
  {
    question: "Can I switch plans later?",
    answer:
      "Yes. You can upgrade or downgrade your plan anytime based on your hiring or job search needs.",
  },
  {
    question: "Do you offer refunds?",
    answer:
      "Refunds depend on the billing cycle and usage. If there is an issue with your plan, our support team can review it.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "Rolebix can support standard online payment methods such as cards and supported digital payment options depending on your region.",
  },
  {
    question: "Can recruiters use the free plan?",
    answer:
      "Yes. Recruiters can start with the free plan and post a limited number of jobs before upgrading.",
  },
];

const PricingPage = () => {
  const [activeTab, setActiveTab] = useState("seekers");

  const plans = activeTab === "seekers" ? seekerPlans : recruiterPlans;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.28),transparent_34%),linear-gradient(180deg,#181818_0%,#050505_55%,#000000_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 top-28 h-56 w-56 rounded-full bg-[#7C5CFF]/10 blur-[90px]" />

      <section className="relative z-10 mx-auto max-w-7xl">
        {/* Hero */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70"
          >
            <FiStar className="h-4 w-4 text-violet-300" />
            Pricing
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{
              duration: 0.55,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-5xl font-semibold tracking-tighter text-white sm:text-6xl lg:text-[76px] lg:leading-[0.96]"
          >
            Flexible plans for every hiring journey.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.16,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/55"
          >
            Start free, then upgrade when you need more applications, better
            visibility, stronger tracking, or advanced hiring tools.
          </motion.p>
        </div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.45,
            delay: 0.24,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto mt-10 flex w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.06] p-1.5"
        >
          <button
            type="button"
            onClick={() => setActiveTab("seekers")}
            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition ${
              activeTab === "seekers"
                ? "bg-white text-black shadow-lg"
                : "text-white/55 hover:text-white"
            }`}
          >
            <FiUsers className="h-4 w-4" />
            Job Seekers
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("recruiters")}
            className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl text-sm font-semibold transition ${
              activeTab === "recruiters"
                ? "bg-white text-black shadow-lg"
                : "text-white/55 hover:text-white"
            }`}
          >
            <FiBriefcase className="h-4 w-4" />
            Recruiters
          </button>
        </motion.div>

        {/* Pricing cards */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(8px)" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 grid gap-6 lg:grid-cols-3"
          >
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Trust strip */}
        <div className="mt-8 grid gap-4 rounded-[32px] border border-white/10 bg-[#111111]/80 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:grid-cols-3">
          <TrustItem
            icon={<FiShield />}
            title="Transparent billing"
            description="Clear monthly pricing with simple plan switching."
          />

          <TrustItem
            icon={<FiZap />}
            title="Built for speed"
            description="Apply faster or manage applicants from one clean place."
          />

          <TrustItem
            icon={<FiStar />}
            title="Upgrade anytime"
            description="Start free and scale only when you need more power."
          />
        </div>

        {/* FAQ */}
        <section className="mx-auto mt-20 max-w-3xl">
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/60">
              <FiHelpCircle className="h-4 w-4 text-violet-300" />
              FAQ
            </div>

            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Common pricing questions
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/50">
              Everything you need to know before choosing a Rolebix plan.
            </p>
          </div>

          <div className="mt-8 space-y-3">
            {faqs.map((faq, index) => (
              <FaqItem key={faq.question} faq={faq} index={index} />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mt-20 rounded-[36px] border border-white/10 bg-[linear-gradient(135deg,rgba(124,92,255,0.18),rgba(255,255,255,0.06))] p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-12">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Ready to move faster?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/55">
            Whether you are applying for your next role or hiring your next
            teammate, Rolebix gives you a cleaner way to manage the process.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <Link href={"#"} className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90">
            Here
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
};

const PricingCard = ({ plan }) => {
  return (
    <div
      className={`relative flex min-h-[560px] flex-col rounded-[32px] border p-6 shadow-2xl backdrop-blur-xl transition hover:-translate-y-1 ${
        plan.highlighted
          ? "border-violet-400/40 bg-[linear-gradient(180deg,rgba(124,92,255,0.18),rgba(17,17,17,0.92))] shadow-violet-950/30"
          : "border-white/10 bg-[#111111]/90 shadow-black/50"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border border-violet-300/30 bg-violet-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-violet-500/25">
          Recommended
        </div>
      )}

      <div>
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-2xl font-semibold tracking-tight text-white">
            {plan.name}
          </h3>

          <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-medium text-white/55">
            {plan.badge}
          </span>
        </div>

        <p className="mt-4 min-h-[48px] text-sm leading-6 text-white/50">
          {plan.description}
        </p>

        <div className="mt-8 flex items-end gap-2">
          <span className="text-5xl font-semibold tracking-tighter text-white">
            {plan.price}
          </span>

          <span className="pb-2 text-sm font-medium text-white/40">
            /{plan.duration}
          </span>
        </div>
      </div>

      <div className="my-7 h-px bg-white/10" />

      <ul className="space-y-4">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex gap-3 text-sm leading-6 text-white/65"
          >
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-violet-200">
              <FiCheck className="h-3.5 w-3.5" />
            </span>

            {feature}
          </li>
        ))}
      </ul>

            <form action="/api/checkout_sessions"  className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90" method="POST">
            <input type="hidden" name="plan_id" value={plan.id} />
              <section>
                <button type="submit" role="link">
                  Checkout
                </button>
              </section>
            </form> 
    </div>
  );
};

const TrustItem = ({ icon, title, description }) => {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-white/4 p-4">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20 text-violet-200">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>

        <p className="mt-1 text-sm leading-6 text-white/45">{description}</p>
      </div>
    </div>
  );
};

const FaqItem = ({ faq, index }) => {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111111]/90 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
      >
        <span className="text-sm font-semibold text-white">{faq.question}</span>

        <FiChevronDown
          className={`h-4 w-4 shrink-0 text-white/50 transition ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="border-t border-white/10 px-5 py-5 text-sm leading-7 text-white/50">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PricingPage;
