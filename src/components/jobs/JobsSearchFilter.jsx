"use client";

import { useMemo, useState } from "react";
import {
  Button,
  Chip,
  InputGroup,
  Label,
  ListBox,
  Select,
  TextField,
} from "@heroui/react";
import { AnimatePresence, motion } from "framer-motion";
import { FiBriefcase, FiFilter, FiRefreshCcw, FiSearch } from "react-icons/fi";
import JobCard from "@/components/jobs/JobCard";

const categoryLabels = {
  design: "Design",
  development: "Development",
  "software-engineering": "Software Engineering",
  "web-development": "Web Development",
  "mobile-development": "Mobile Development",
  "data-science": "Data Science",
  "ai-ml": "AI / Machine Learning",
  devops: "DevOps / Cloud",
  cybersecurity: "Cybersecurity",
  "product-management": "Product Management",
  "project-management": "Project Management",
  marketing: "Marketing",
  "digital-marketing": "Digital Marketing",
  sales: "Sales",
  "customer-support": "Customer Support",
  operations: "Operations",
  "human-resources": "Human Resources",
  finance: "Finance / Accounting",
  "content-writing": "Content Writing",
  "video-editing": "Video Editing",
  education: "Education / Training",
  healthcare: "Healthcare",
  legal: "Legal",
  management: "Management",
};

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

const workModeLabels = {
  remote: "Remote",
  onsite: "Onsite",
  hybrid: "Hybrid",
};

const getJobId = (job) => {
  if (typeof job?._id === "string") return job._id;
  if (job?._id?.$oid) return job._id.$oid;
  return job?.id || job?.title;
};

const getUniqueOptions = (jobs, getter) => {
  return [...new Set(jobs.map(getter).filter(Boolean))];
};

const JobsSearchFilter = ({ jobs = [] }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [jobType, setJobType] = useState("all");
  const [experience, setExperience] = useState("all");
  const [workMode, setWorkMode] = useState("all");
  const [company, setCompany] = useState("all");

  const categories = useMemo(
    () => getUniqueOptions(jobs, (job) => job.category),
    [jobs]
  );

  const jobTypes = useMemo(
    () => getUniqueOptions(jobs, (job) => job.type),
    [jobs]
  );

  const experiences = useMemo(
    () => getUniqueOptions(jobs, (job) => job.experienceLevel),
    [jobs]
  );

  const workModes = useMemo(
    () => getUniqueOptions(jobs, (job) => job.location?.type),
    [jobs]
  );

  const companies = useMemo(
    () => getUniqueOptions(jobs, (job) => job.company?.name),
    [jobs]
  );

  const filteredJobs = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return jobs.filter((job) => {
      const searchableText = [
        job.title,
        job.category,
        job.type,
        job.experienceLevel,
        job.location?.display,
        job.company?.name,
        job.company?.industryLabel,
        ...(job.skills || []),
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !searchValue || searchableText.includes(searchValue);

      const matchesCategory = category === "all" || job.category === category;

      const matchesJobType = jobType === "all" || job.type === jobType;

      const matchesExperience =
        experience === "all" || job.experienceLevel === experience;

      const matchesWorkMode =
        workMode === "all" || job.location?.type === workMode;

      const matchesCompany = company === "all" || job.company?.name === company;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesJobType &&
        matchesExperience &&
        matchesWorkMode &&
        matchesCompany
      );
    });
  }, [jobs, search, category, jobType, experience, workMode, company]);

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setJobType("all");
    setExperience("all");
    setWorkMode("all");
    setCompany("all");
  };

  return (
    <section className="bg-[#151515] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Filter Bar */}
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-8 rounded-3xl border border-white/10 bg-[#1b1b1b] p-5 shadow-2xl shadow-black/20"
        >
          <div className="mb-5 flex flex-col justify-between gap-3 border-b border-white/10 pb-5 md:flex-row md:items-center">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white">
                Explore open roles
              </h2>

              <p className="mt-1 text-sm text-white/45">
                Filter jobs by role, company, skills, experience, and work mode.
              </p>
            </div>

            <Chip
              size="sm"
              variant="soft"
              className="w-fit border border-white/10 bg-white/6 text-white/70"
            >
              {filteredJobs.length} of {jobs.length} jobs
            </Chip>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
            <TextField className="w-full">
              <Label className="text-sm font-medium text-white/70">
                Search
              </Label>

              <InputGroup className="mt-2 h-12 rounded-xl border border-white/10 bg-white/6 px-3 text-white transition focus-within:border-violet-400/40">
                <InputGroup.Prefix>
                  <FiSearch className="h-4 w-4 text-white/35" />
                </InputGroup.Prefix>

                <InputGroup.Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, company, skills..."
                  className="bg-transparent text-sm text-white outline-none placeholder:text-white/30"
                />
              </InputGroup>
            </TextField>

            <FilterSelect
              label="Category"
              value={category}
              items={[
                { id: "all", label: "All Categories" },
                ...categories.map((item) => ({
                  id: item,
                  label: categoryLabels[item] || item,
                })),
              ]}
              onChange={setCategory}
            />

            <FilterSelect
              label="Job Type"
              value={jobType}
              items={[
                { id: "all", label: "All Types" },
                ...jobTypes.map((item) => ({
                  id: item,
                  label: typeLabels[item] || item,
                })),
              ]}
              onChange={setJobType}
            />

            <FilterSelect
              label="Experience"
              value={experience}
              items={[
                { id: "all", label: "All Levels" },
                ...experiences.map((item) => ({
                  id: item,
                  label: experienceLabels[item] || item,
                })),
              ]}
              onChange={setExperience}
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <FilterSelect
              label="Work Mode"
              value={workMode}
              items={[
                { id: "all", label: "All Work Modes" },
                ...workModes.map((item) => ({
                  id: item,
                  label: workModeLabels[item] || item,
                })),
              ]}
              onChange={setWorkMode}
            />

            <FilterSelect
              label="Company"
              value={company}
              items={[
                { id: "all", label: "All Companies" },
                ...companies.map((item) => ({
                  id: item,
                  label: item,
                })),
              ]}
              onChange={setCompany}
            />

            <div className="flex items-end">
              <Button
                type="button"
                onPress={resetFilters}
                className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10 md:w-auto"
              >
                <FiRefreshCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 text-xs text-white/35">
              <FiFilter className="h-4 w-4" />
              Active filters:
            </span>

            <ActiveFilter label="Search" value={search} />
            <ActiveFilter label="Category" value={category} hiddenValue="all" />
            <ActiveFilter label="Type" value={jobType} hiddenValue="all" />
            <ActiveFilter
              label="Experience"
              value={experience}
              hiddenValue="all"
            />
            <ActiveFilter label="Mode" value={workMode} hiddenValue="all" />
            <ActiveFilter label="Company" value={company} hiddenValue="all" />
          </div>
        </motion.div>

        {/* Jobs grid */}
        {filteredJobs.length > 0 ? (
          <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={getJobId(job)}
                  layout
                  initial={{
                    opacity: 0,
                    y: 24,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: 16,
                    scale: 0.98,
                  }}
                  transition={{
                    duration: 0.28,
                    delay: Math.min(index * 0.025, 0.18),
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <JobCard job={job} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-10 text-center"
          >
            <h2 className="text-2xl font-semibold text-white">
              No jobs found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
              Try changing your search keyword or removing some filters.
            </p>

            <Button
              type="button"
              onPress={resetFilters}
              className="mt-6 rounded-xl bg-white px-5 text-sm font-semibold text-black"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

const FilterSelect = ({ label, value, items, onChange }) => {
  return (
    <Select
      value={value}
      onChange={(selectedValue) => onChange(selectedValue || "all")}
      className="w-full"
    >
      <Label className="text-sm font-medium text-white/70">{label}</Label>

      <Select.Trigger className="mt-2 flex h-12 items-center justify-between rounded-xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition hover:border-white/20">
        <Select.Value className="text-white data-[placeholder=true]:text-white/25" />
        <Select.Indicator className="text-white/45" />
      </Select.Trigger>

      <Select.Popover className="rounded-xl border border-white/10 bg-[#1b1b1b] p-2 text-white shadow-2xl">
        <ListBox>
          {items.map((item) => (
            <ListBox.Item
              key={item.id}
              id={item.id}
              textValue={item.label}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-white/75 outline-none transition hover:bg-white/10 hover:text-white"
            >
              <Label>{item.label}</Label>
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

const ActiveFilter = ({ label, value, hiddenValue = "" }) => {
  if (!value || value === hiddenValue) return null;

  return (
    <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-200">
      {label}: {value}
    </span>
  );
};

export default JobsSearchFilter;