/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

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
import {
  FiBriefcase,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiRefreshCcw,
  FiSearch,
} from "react-icons/fi";

import JobCard from "@/components/jobs/JobCard";

const DEFAULT_LIMIT = 9;

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

const buildJobsPath = (params = {}) => {
  const query = new URLSearchParams();

  query.set("page", params.page || "1");
  query.set("limit", params.limit || String(DEFAULT_LIMIT));

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.category && params.category !== "all") {
    query.set("category", params.category);
  }

  if (params.type && params.type !== "all") {
    query.set("type", params.type);
  }

  if (params.experienceLevel && params.experienceLevel !== "all") {
    query.set("experienceLevel", params.experienceLevel);
  }

  if (params.workMode && params.workMode !== "all") {
    query.set("workMode", params.workMode);
  }

  if (params.company && params.company !== "all") {
    query.set("company", params.company);
  }

  return `/jobs?${query.toString()}`;
};

const JobsSearchFilter = ({ jobs = [], pagination = {}, filters = {} }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const currentPage = Number(pagination?.page || 1);
  const limit = Number(pagination?.limit || DEFAULT_LIMIT);
  const totalJobs = Number(pagination?.totalJobs || jobs.length || 0);
  const totalPages = Math.max(1, Number(pagination?.totalPages || 1));

  const [search, setSearch] = useState(filters?.search || "");
  const [category, setCategory] = useState(filters?.category || "all");
  const [jobType, setJobType] = useState(filters?.type || "all");
  const [experience, setExperience] = useState(
    filters?.experienceLevel || "all",
  );
  const [workMode, setWorkMode] = useState(filters?.workMode || "all");
  const [company, setCompany] = useState(filters?.company || "all");

  useEffect(() => {
    setSearch(filters?.search || "");
    setCategory(filters?.category || "all");
    setJobType(filters?.type || "all");
    setExperience(filters?.experienceLevel || "all");
    setWorkMode(filters?.workMode || "all");
    setCompany(filters?.company || "all");
  }, [filters]);

  const currentPageCompanies = useMemo(() => {
    const companies = getUniqueOptions(jobs, (job) => job.company?.name);

    if (company !== "all" && company && !companies.includes(company)) {
      return [company, ...companies];
    }

    return companies;
  }, [jobs, company]);

  const paginationItems = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    const items = [1];

    if (currentPage > 3) {
      items.push("start-ellipsis");
    }

    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);

    for (let page = startPage; page <= endPage; page += 1) {
      items.push(page);
    }

    if (currentPage < totalPages - 2) {
      items.push("end-ellipsis");
    }

    items.push(totalPages);

    return items;
  }, [currentPage, totalPages]);

  const fromCount = totalJobs === 0 ? 0 : (currentPage - 1) * limit + 1;
  const toCount = Math.min(currentPage * limit, totalJobs);

  const scrollToResults = () => {
    const resultsSection = document.getElementById("jobs-results");

    if (resultsSection) {
      resultsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const updateJobsRoute = (nextParams = {}) => {
    const path = buildJobsPath({
      page: nextParams.page || "1",
      limit,
      search,
      category,
      type: jobType,
      experienceLevel: experience,
      workMode,
      company,
      ...nextParams,
    });

    startTransition(() => {
      router.push(path);
    });

    setTimeout(scrollToResults, 80);
  };

  const handleApplySearch = () => {
    updateJobsRoute({
      page: "1",
      search: search.trim(),
    });
  };

  const handlePageChange = (page) => {
    updateJobsRoute({
      page: String(page),
    });
  };

  const handleCategoryChange = (value) => {
    const nextValue = value || "all";
    setCategory(nextValue);

    updateJobsRoute({
      page: "1",
      category: nextValue,
    });
  };

  const handleJobTypeChange = (value) => {
    const nextValue = value || "all";
    setJobType(nextValue);

    updateJobsRoute({
      page: "1",
      type: nextValue,
    });
  };

  const handleExperienceChange = (value) => {
    const nextValue = value || "all";
    setExperience(nextValue);

    updateJobsRoute({
      page: "1",
      experienceLevel: nextValue,
    });
  };

  const handleWorkModeChange = (value) => {
    const nextValue = value || "all";
    setWorkMode(nextValue);

    updateJobsRoute({
      page: "1",
      workMode: nextValue,
    });
  };

  const handleCompanyChange = (value) => {
    const nextValue = value || "all";
    setCompany(nextValue);

    updateJobsRoute({
      page: "1",
      company: nextValue,
    });
  };

  const resetFilters = () => {
    setSearch("");
    setCategory("all");
    setJobType("all");
    setExperience("all");
    setWorkMode("all");
    setCompany("all");

    startTransition(() => {
      router.push("/jobs?page=1&limit=9");
    });

    setTimeout(scrollToResults, 80);
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
              {totalJobs} matched jobs
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
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      handleApplySearch();
                    }
                  }}
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
                ...Object.entries(categoryLabels).map(([id, label]) => ({
                  id,
                  label,
                })),
              ]}
              onChange={handleCategoryChange}
            />

            <FilterSelect
              label="Job Type"
              value={jobType}
              items={[
                { id: "all", label: "All Types" },
                ...Object.entries(typeLabels).map(([id, label]) => ({
                  id,
                  label,
                })),
              ]}
              onChange={handleJobTypeChange}
            />

            <FilterSelect
              label="Experience"
              value={experience}
              items={[
                { id: "all", label: "All Levels" },
                ...Object.entries(experienceLabels).map(([id, label]) => ({
                  id,
                  label,
                })),
              ]}
              onChange={handleExperienceChange}
            />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-[1fr_1fr_auto_auto]">
            <FilterSelect
              label="Work Mode"
              value={workMode}
              items={[
                { id: "all", label: "All Work Modes" },
                ...Object.entries(workModeLabels).map(([id, label]) => ({
                  id,
                  label,
                })),
              ]}
              onChange={handleWorkModeChange}
            />

            <FilterSelect
              label="Company"
              value={company}
              items={[
                { id: "all", label: "All Companies" },
                ...currentPageCompanies.map((item) => ({
                  id: item,
                  label: item,
                })),
              ]}
              onChange={handleCompanyChange}
            />

            <div className="flex items-end">
              <Button
                type="button"
                isLoading={isPending}
                onPress={handleApplySearch}
                className="h-12 w-full rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 md:w-auto"
              >
                <FiSearch className="h-4 w-4" />
                Search
              </Button>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                isDisabled={isPending}
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

            <ActiveFilter label="Search" value={filters?.search} />
            <ActiveFilter
              label="Category"
              value={filters?.category}
              hiddenValue="all"
            />
            <ActiveFilter
              label="Type"
              value={filters?.type}
              hiddenValue="all"
            />

            <ActiveFilter
              label="Experience"
              value={filters?.experienceLevel}
              hiddenValue="all"
            />

            <ActiveFilter
              label="Mode"
              value={filters?.workMode}
              hiddenValue="all"
            />
            <ActiveFilter
              label="Company"
              value={filters?.company}
              hiddenValue="all"
            />
          </div>
        </motion.div>

        {/* Results meta */}
        <div
          id="jobs-results"
          className="mb-5 flex flex-col justify-between gap-3 rounded-2xl border border-white/10 bg-white/3 px-4 py-3 sm:flex-row sm:items-center"
        >
          <div>
            <p className="text-sm font-medium text-white">
              Showing <span className="text-violet-200">{fromCount}</span> to{" "}
              <span className="text-violet-200">{toCount}</span> of{" "}
              <span className="text-violet-200">{totalJobs}</span> matched jobs
            </p>

            <p className="mt-1 text-xs text-white/35">
              Page {currentPage} of {totalPages}
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-200">
            <FiBriefcase className="h-4 w-4" />
            {limit} jobs per page
          </div>
        </div>

        {/* Jobs grid */}
        {jobs.length > 0 ? (
          <>
            <motion.div layout className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {jobs.map((job, index) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#1b1b1b] px-4 py-4 sm:flex-row">
                <p className="text-sm text-white/40">
                  Page{" "}
                  <span className="font-semibold text-white">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {totalPages}
                  </span>
                </p>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    disabled={currentPage === 1 || isPending}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <FiChevronLeft className="h-4 w-4" />
                    Prev
                  </button>

                  {paginationItems.map((item) => {
                    if (typeof item === "string") {
                      return (
                        <span
                          key={item}
                          className="flex h-10 items-center px-1 text-sm text-white/35"
                        >
                          ...
                        </span>
                      );
                    }

                    const isActive = currentPage === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        disabled={isPending}
                        onClick={() => handlePageChange(item)}
                        className={`h-10 min-w-10 rounded-xl px-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          isActive
                            ? "bg-white text-black"
                            : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}

                  <button
                    type="button"
                    disabled={currentPage === totalPages || isPending}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 text-sm font-semibold text-white/60 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <FiChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
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