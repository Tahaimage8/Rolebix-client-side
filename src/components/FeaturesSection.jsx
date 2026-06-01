"use client";

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
    <section className="relative overflow-hidden bg-[#161616] py-24 text-white sm:py-28">
      {/* Soft background glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-90 w-155 -translate-x-1/2 rounded-full bg-violet-600/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-2 w-2 rounded-sm bg-[#7C5CFF]" />
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/70">
              Features Job
            </p>
            <span className="h-2 w-2 rounded-sm bg-[#7C5CFF]" />
          </div>

          <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl lg:text-[56px] lg:leading-[1.05]">
            Everything you need
            <br />
            to succeed
          </h2>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.Icon;

            return (
              <article
                key={feature.title}
                className="group flex items-start gap-6"
              >
                {/* Icon Box */}
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/70 shadow-lg shadow-black/30 transition duration-300 group-hover:border-violet-400/40 group-hover:bg-violet-500/10">
                  <Icon className="h-8 w-8 text-pink-200 transition duration-300 group-hover:text-violet-300" />
                </div>

                {/* Text */}
                <div>
                  <h3 className="text-xl font-semibold tracking-[-0.02em] text-white">
                    {feature.title}
                  </h3>

                  <p className="mt-3 max-w-57.5 text-base leading-7 text-white/60">
                    {feature.description}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;