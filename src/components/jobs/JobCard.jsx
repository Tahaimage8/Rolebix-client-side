/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { Button, Card, Chip } from "@heroui/react";
import { motion } from "framer-motion";
import {
  FiArrowRight,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
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

const JobCard = ({ job }) => {
  const jobId = getJobId(job);
  const applyHref = jobId ? `/jobs/${jobId}` : "/jobs";

  return (
    <motion.div
      layout
      whileHover={{
        y: -8,
      }}
      transition={{
        duration: 0.25,
        ease: "easeOut",
      }}
      className="h-full"
    >
      <Card className="group h-full overflow-hidden border border-white/10 bg-[#171717] text-white shadow-2xl shadow-black/20 transition duration-300 hover:border-violet-400/30 hover:bg-[#1b1b1b]">
        <Card.Header className="p-6 pb-0">
          <div className="flex items-center gap-3">
            {job?.company?.logoUrl ? (
              <motion.img
                src={job.company.logoUrl}
                alt={job.company.name}
                whileHover={{
                  rotate: 6,
                  scale: 1.08,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="h-11 w-11 rounded-xl border border-white/10 bg-black object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/6">
                <FiBriefcase className="h-5 w-5 text-white/50" />
              </div>
            )}

            <div>
              <Card.Title className="text-sm font-semibold text-white">
                {job?.company?.name || "Company"}
              </Card.Title>

              <Card.Description className="text-xs text-white/40">
                {job?.company?.industryLabel || job?.company?.industry}
              </Card.Description>
            </div>
          </div>
        </Card.Header>

        <Card.Content className="p-6">
          <h2 className="text-2xl font-semibold tracking-[-0.04em] text-white">
            {job?.title}
          </h2>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/50">
            {job?.description?.responsibilities}
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <JobInfoChip icon={<FiMapPin />}>
              {job?.location?.display || "Location not set"}
            </JobInfoChip>

            <JobInfoChip icon={<FiBriefcase />}>
              {typeLabels[job?.type] || job?.type}
            </JobInfoChip>

            <JobInfoChip icon={<FiDollarSign />}>
              {formatSalary(job?.salary)}
            </JobInfoChip>

            <JobInfoChip icon={<FiCalendar />}>
              {formatDate(job?.deadline)}
            </JobInfoChip>
          </div>

          {job?.skills?.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {job.skills.slice(0, 4).map((skill) => (
                <Chip
                  key={skill}
                  size="sm"
                  variant="soft"
                  className="border border-white/10 bg-white/6 text-white/60"
                >
                  {skill}
                </Chip>
              ))}

              {job.skills.length > 4 && (
                <Chip
                  size="sm"
                  variant="soft"
                  className="border border-white/10 bg-white/6 text-white/60"
                >
                  +{job.skills.length - 4}
                </Chip>
              )}
            </div>
          )}
        </Card.Content>

        <Card.Footer className="flex items-center justify-between gap-4 border-t border-white/10 p-6 pt-5">
          <div>
            <p className="text-xs text-white/35">Experience</p>
            <p className="mt-1 text-sm font-medium text-white/70">
              {experienceLabels[job?.experienceLevel] || job?.experienceLevel}
            </p>
          </div>

          <Link
            href={applyHref}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-white px-3 text-sm font-semibold text-black transition group-hover:bg-violet-500 group-hover:text-white"
          >
            View Details
            <FiArrowRight className="h-4 w-4" />
          </Link>
        </Card.Footer>
      </Card>
    </motion.div>
  );
};

const JobInfoChip = ({ icon, children }) => {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-white/6 px-3 py-2 text-xs font-medium text-white/75">
      <span className="text-violet-300">{icon}</span>
      {children}
    </span>
  );
};

export default JobCard;
