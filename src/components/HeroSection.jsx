/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  FiBriefcase,
  FiHome,
  FiUsers,
  FiCheckCircle,
  FiZap,
  FiArrowRight,
} from "react-icons/fi";
// import SearchHeroC from "./SearchHeroC";

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
    <section className="relative overflow-hidden bg-black text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.28),transparent_30%),linear-gradient(180deg,#171717_0%,#050505_50%,#000000_100%)]" />
      <div className="absolute left-1/2 top-0 h-105 w-180 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        {/* Hero Text */}
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/70 backdrop-blur-xl">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500/15 text-orange-400">
              <FiZap className="h-3.5 w-3.5" />
            </span>

            <span>
              <strong className="font-semibold text-white">50,000+</strong> new
              jobs this month
            </span>
          </div>

          <h1 className="max-w-5xl text-5xl font-semibold tracking-tighter text-white sm:text-6xl lg:text-[76px] lg:leading-[0.98]">
            Find Your Dream Job Today
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/55 sm:text-base">
            Rolebix connects top talent with world-class companies. Browse
            thousands of curated opportunities and land your next role — faster.
          </p>
        </div>

        {/* Search + Visual Area */}
        <div className="relative mx-auto mt-12 max-w-6xl">
          {/* Search Component */}
          {/* <SearchHeroC /> */}

          {/* Visual Card */}
          <div className="relative -mt-7 overflow-hidden rounded-[32px] border border-white/10 bg-[#030303] shadow-2xl shadow-black/60">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(91,124,255,0.18),transparent_55%)]" />

            <img
              src="/images/globe.png"
              alt=""
              className="h-107.5 w-full object-cover object-center opacity-90 mix-blend-lighten sm:h-125 lg:h-140"
            />

            <div className="absolute inset-0 bg-linear-to-b from-black via-transparent to-black" />
            <div className="absolute inset-0 bg-linear-to-r from-black via-transparent to-black" />

            {/* Trending */}
            <div className="absolute left-1/2 top-20 z-20 flex w-full -translate-x-1/2 flex-wrap items-center justify-center gap-2 px-4 text-xs text-white/40">
              <span>Trending searches:</span>

              {trendingKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-white/10 bg-white/8 px-3 py-1 text-white/65 backdrop-blur-md"
                >
                  {keyword}
                </span>
              ))}
            </div>

            {/* Globe Text */}
            <div className="absolute left-1/2 top-[46%] z-20 w-full max-w-xl -translate-x-1/2 px-4 text-center">
              <p className="text-2xl font-semibold leading-tight text-white drop-shadow-2xl sm:text-3xl">
                Assisting over{" "}
                <span className="text-white">15,000</span> job seekers
                <br />
                find their dream positions.
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="relative z-30 -mt-24 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.Icon;

              return (
                <article
                  key={stat.label}
                  className="group rounded-3xl border border-white/10 bg-[#111111]/95 p-7 text-left shadow-2xl shadow-black/50 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-[#151515]"
                >
                  <div className="mb-12 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-white/60 group-hover:text-violet-300">
                    <Icon className="h-4 w-4" />
                  </div>

                  <h3 className="text-4xl font-semibold tracking-tight text-white">
                    {stat.value}
                  </h3>

                  <p className="mt-2 text-sm text-white/45">{stat.label}</p>
                </article>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mx-auto mt-12 flex flex-col items-center justify-center gap-4 text-center sm:flex-row">
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Browse Jobs
          </Link>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.08]"
          >
            For Recruiters
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;