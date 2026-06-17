"use client";

import JobsSearchFilter from "@/components/jobs/JobsSearchFilter";
import { motion } from "framer-motion";
import { FiBriefcase, FiMapPin, FiSearch, FiTrendingUp } from "react-icons/fi";

const containerVariant = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUpVariant = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const JobsPageView = ({ jobs = [], pagination = {}, filters = {} }) => {
  const remoteJobs = jobs.filter((job) => job?.location?.type === "remote");

  const companies = [
    ...new Set(jobs.map((job) => job?.company?.name).filter(Boolean)),
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0b0b0b] px-4 py-16 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-500/15 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

        <motion.div
          variants={containerVariant}
          initial="hidden"
          animate="show"
          className="relative mx-auto max-w-7xl"
        >
          <div className="max-w-3xl">
            <motion.div
              variants={fadeUpVariant}
              className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200"
            >
              <FiSearch className="h-4 w-4" />
              Browse Jobs
            </motion.div>

            <motion.h1
              variants={fadeUpVariant}
              className="text-4xl font-semibold tracking-tighter text-white sm:text-5xl lg:text-6xl"
            >
              Find the right role,
              <br />
              faster with Rolebix
            </motion.h1>

            <motion.p
              variants={fadeUpVariant}
              className="mt-5 max-w-2xl text-sm leading-7 text-white/50 sm:text-base"
            >
              Explore curated opportunities from top companies. Search by role,
              skills, company, job type, experience level, and work mode.
            </motion.p>
          </div>

          {/* Stats */}
          <motion.div
            variants={containerVariant}
            className="mt-10 grid gap-4 sm:grid-cols-3"
          >
            <JobsStatCard
              icon={<FiBriefcase />}
              label="Active Jobs"
              value={pagination?.totalJobs || jobs.length}
            />

            <JobsStatCard
              icon={<FiTrendingUp />}
              label="Hiring Companies"
              value={companies.length}
            />

            <JobsStatCard
              icon={<FiMapPin />}
              label="Remote Roles"
              value={remoteJobs.length}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Jobs Search + Cards */}
      <JobsSearchFilter
        jobs={jobs}
        pagination={pagination}
        filters={filters}
      />
    </main>
  );
};

const JobsStatCard = ({ icon, label, value }) => {
  return (
    <motion.div
      variants={fadeUpVariant}
      whileHover={{
        y: -6,
        scale: 1.02,
      }}
      transition={{
        duration: 0.25,
      }}
      className="rounded-2xl border border-white/10 bg-white/4 p-5 backdrop-blur-xl"
    >
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-xl bg-white/6 text-violet-300">
        {icon}
      </div>

      <p className="text-sm text-white/45">{label}</p>

      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">
        {value}
      </h3>
    </motion.div>
  );
};

export default JobsPageView;