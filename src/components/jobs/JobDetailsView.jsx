/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Card, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiGlobe,
  FiMapPin,
  FiShield,
  FiUsers,
} from "react-icons/fi";

const typeLabels = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

const experienceLabels = {
  entry: "Entry Level",
  mid: "Mid Level",
  senior: "Senior Level",
  lead: "Lead / Manager",
};

const getJobId = (job) => {
  if (typeof job?._id === "string") return job._id;
  if (job?._id?.$oid) return job._id.$oid;
  return job?.id || "";
};

const formatSalary = (salary) => {
  if (!salary?.min || !salary?.max) return "Salary not disclosed";

  return `${salary.currency} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
};

const formatDate = (date) => {
  if (!date) return "No deadline";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const JobDetailsView = ({ job }) => {
  const jobId = getJobId(job);
  const applyHref = jobId ? `/jobs/${jobId}/apply` : "/jobs";

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Top glow */}
      <div className="pointer-events-none fixed left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-violet-500/15 blur-[140px]" />

      <section className="relative px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Back */}
          <Link
            href="/jobs"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-white/45 transition hover:text-white"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to jobs
          </Link>

          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Main */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="space-y-6"
            >
              {/* Header card */}
              <Card className="overflow-hidden border border-white/10 bg-[#171717] text-white shadow-2xl shadow-black/30">
                <Card.Header className="relative p-6 sm:p-8">
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,92,255,0.18),transparent_35%)]" />

                  <div className="relative w-full">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
                      <div>
                        {/* Company */}
                        <div className="mb-6 flex items-center gap-3">
                          {job?.company?.logoUrl ? (
                            <img
                              src={job.company.logoUrl}
                              alt={job.company.name}
                              className="h-14 w-14 rounded-2xl border border-white/10 bg-black object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                              <FiBriefcase className="h-6 w-6 text-white/45" />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-white">
                              {job?.company?.name}
                            </p>
                            <p className="mt-1 text-sm text-white/45">
                              {job?.company?.industryLabel}
                            </p>
                          </div>
                        </div>

                        <p className="mb-3 inline-flex rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
                          {typeLabels[job?.type] || job?.type}
                        </p>

                        <h1 className="max-w-4xl text-4xl font-semibold tracking-tighter text-white sm:text-5xl">
                          {job?.title}
                        </h1>

                        <p className="mt-5 max-w-3xl whitespace-pre-wrap text-sm leading-7 text-white/50 sm:text-base">
                          {job?.description?.responsibilities}
                        </p>
                      </div>

                      <span className="inline-flex w-fit items-center gap-2 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-semibold uppercase text-green-300">
                        <FiShield className="h-4 w-4" />
                        {job?.status}
                      </span>
                    </div>
                  </div>
                </Card.Header>

                <Card.Content className="border-t border-white/10 p-6 sm:p-8">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <InfoCard
                      icon={<FiBriefcase />}
                      label="Job Type"
                      value={typeLabels[job?.type] || job?.type}
                    />

                    <InfoCard
                      icon={<FiUsers />}
                      label="Experience"
                      value={
                        experienceLabels[job?.experienceLevel] ||
                        job?.experienceLevel
                      }
                    />

                    <InfoCard
                      icon={<FiMapPin />}
                      label="Location"
                      value={job?.location?.display}
                    />

                    <InfoCard
                      icon={<FiDollarSign />}
                      label="Salary"
                      value={formatSalary(job?.salary)}
                    />
                  </div>
                </Card.Content>
              </Card>

              {/* Skills */}
              <Card className="border border-white/10 bg-[#171717] text-white shadow-2xl shadow-black/20">
                <Card.Header className="p-6 pb-0">
                  <Card.Title className="text-xl font-semibold text-white">
                    Required Skills
                  </Card.Title>
                </Card.Header>

                <Card.Content className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {job?.skills?.map((skill) => (
                      <Chip
                        key={skill}
                        size="sm"
                        variant="soft"
                        className="border border-white/10 bg-white/6 text-white/70"
                      >
                        {skill}
                      </Chip>
                    ))}
                  </div>
                </Card.Content>
              </Card>

              <DetailsBlock
                title="Responsibilities"
                content={job?.description?.responsibilities}
              />

              <DetailsBlock
                title="Requirements"
                content={job?.description?.requirements}
              />

              <DetailsBlock title="Benefits" content={job?.description?.benefits} />
            </motion.div>

            {/* Sidebar */}
            <motion.aside
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="h-fit lg:sticky lg:top-8"
            >
              <Card className="border border-white/10 bg-[#171717] text-white shadow-2xl shadow-black/30">
                <Card.Header className="p-6 pb-0">
                  <Card.Title className="text-xl font-semibold text-white">
                    Apply for this role
                  </Card.Title>

                  <Card.Description className="mt-2 text-sm leading-6 text-white/45">
                    Your application will be sent to the company recruiter for
                    review.
                  </Card.Description>
                </Card.Header>

                <Card.Content className="p-6">
                  <Link
                    href={applyHref}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-violet-500 hover:text-white"
                  >
                    Apply Now
                    <FiArrowRight className="h-4 w-4" />
                  </Link>

                  <div className="mt-5 space-y-3">
                    <SidebarInfo
                      icon={<FiCalendar />}
                      label="Deadline"
                      value={formatDate(job?.deadline)}
                    />

                    <SidebarInfo
                      icon={<FiGlobe />}
                      label="Company Website"
                      value={job?.company?.websiteUrl}
                    />

                    <SidebarInfo
                      icon={<FiUsers />}
                      label="Company Size"
                      value={job?.company?.employeeCountLabel}
                    />
                  </div>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-4">
                    <p className="text-xs uppercase tracking-[0.16em] text-white/35">
                      Hiring Company
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <img
                        src={job?.company?.logoUrl}
                        alt={job?.company?.name}
                        className="h-11 w-11 rounded-xl border border-white/10 object-cover"
                      />

                      <div>
                        <p className="font-semibold text-white">
                          {job?.company?.name}
                        </p>
                        <p className="text-xs text-white/40">
                          {job?.company?.location}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </motion.aside>
          </div>
        </div>
      </section>
    </main>
  );
};

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/6 text-violet-300">
        {icon}
      </div>

      <p className="text-xs uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-2 wrap-break-word text-sm font-semibold text-white">
        {value || "Not specified"}
      </p>
    </div>
  );
};

const SidebarInfo = ({ icon, label, value }) => {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/6 text-violet-300">
        {icon}
      </div>

      <div>
        <p className="text-xs text-white/35">{label}</p>
        <p className="mt-1 break-all text-sm font-medium text-white/70">
          {value || "Not specified"}
        </p>
      </div>
    </div>
  );
};

const DetailsBlock = ({ title, content }) => {
  return (
    <Card className="border border-white/10 bg-[#171717] text-white shadow-2xl shadow-black/20">
      <Card.Header className="p-6 pb-0">
        <Card.Title className="text-xl font-semibold text-white">
          {title}
        </Card.Title>
      </Card.Header>

      <Card.Content className="p-6">
        <p className="whitespace-pre-wrap text-sm leading-7 text-white/55">
          {content || "Not specified"}
        </p>
      </Card.Content>
    </Card>
  );
};

export default JobDetailsView;