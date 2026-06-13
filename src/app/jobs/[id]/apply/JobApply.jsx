/* eslint-disable @next/next/no-img-element */
"use client";

import { CreateApplication } from "@/lib/actions/application";
import { useState } from "react";
import {
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiFileText,
  FiLink,
  FiMail,
  FiMapPin,
  FiPhone,
  FiSend,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";

const getJobId = (job) => {
  if (typeof job?._id === "string") return job._id;
  if (job?._id?.$oid) return job._id.$oid;
  return job?.id || "";
};

const formatSalary = (salary) => {
  if (!salary?.min || !salary?.max) return "Salary not disclosed";

  return `${salary.currency || "USD"} ${Number(
    salary.min
  ).toLocaleString()} - ${Number(salary.max).toLocaleString()}`;
};

const formatDate = (date) => {
  if (!date) return "Open";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const JobApply = ({ applicant, job }) => {
  const [formData, setFormData] = useState({
    name: applicant?.name || "",
    email: applicant?.email || "",
    phone: "",
    portfolioUrl: "",
    resumeUrl: "",
    coverLetter: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const jobId = getJobId(job);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Name is required.");
      return false;
    }

    if (!formData.email.trim()) {
      toast.error("Email is required.");
      return false;
    }

    if (!formData.email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!formData.phone.trim()) {
      toast.error("Phone number is required.");
      return false;
    }

    if (!formData.resumeUrl.trim()) {
      toast.error("Resume URL is required.");
      return false;
    }

    if (!formData.coverLetter.trim()) {
      toast.error("Cover letter is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (!jobId) {
      toast.error("Job information is missing.");
      return;
    }

    try {
      setIsSubmitting(true);

      const application = {
        jobId,
        jobTitle: job?.title,
        jobType: job?.type,
        jobCategory: job?.category,
        jobStatus: job?.status,

        companyId: job?.company?.id,
        companyName: job?.company?.name,
        companyLogoUrl: job?.company?.logoUrl,
        companyIndustry: job?.company?.industry,
        companyLocation: job?.company?.location,

        applicantId: applicant?.id || applicant?._id,
        applicantName: formData.name.trim(),
        applicantEmail: formData.email.trim(),
        applicantImage: applicant?.image || "",

        phone: formData.phone.trim(),
        portfolioUrl: formData.portfolioUrl.trim(),
        resumeUrl: formData.resumeUrl.trim(),
        coverLetter: formData.coverLetter.trim(),

        status: "applied",
      };

      const result = await CreateApplication(application);

      if (result?.message && !result?.insertedId && !result?.acknowledged) {
        toast.error(result.message);
        setIsSubmitting(false);
        return;
      }

      if (!result?.insertedId && !result?.acknowledged) {
        toast.error("Failed to submit application. Please try again.");
        setIsSubmitting(false);
        return;
      }

      toast.success("Application submitted successfully.");

      setFormData((prev) => ({
        ...prev,
        phone: "",
        portfolioUrl: "",
        resumeUrl: "",
        coverLetter: "",
      }));

      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set("applied", "success");
      currentUrl.searchParams.set("t", Date.now().toString());

      setTimeout(() => {
        window.location.replace(currentUrl.toString());
      }, 600);
    } catch (error) {
      toast.error(error?.message || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Job header */}
      <section className="overflow-hidden rounded-[34px] border border-white/10 bg-[#111111]/90 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <div className="relative p-6 sm:p-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(124,92,255,0.18),transparent_36%)]" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-2">
                {job?.company?.logoUrl ? (
                  <img
                    src={job.company.logoUrl}
                    alt={job.company?.name || "Company logo"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <FiBriefcase className="h-7 w-7 text-black" />
                )}
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-violet-200">
                  Application
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Apply for {job?.title}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-white/55">
                  Complete your application details and submit your profile to{" "}
                  <span className="font-medium text-white">
                    {job?.company?.name}
                  </span>{" "}
                  for review.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/55">
                  <span className="font-medium text-white/80">
                    {job?.company?.name}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium capitalize text-white/60">
                    {job?.type?.replace("-", " ")}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium capitalize text-white/60">
                    {job?.experienceLevel}
                  </span>
                </div>
              </div>
            </div>

            <span className="w-fit rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium capitalize text-green-300">
              {job?.status || "active"}
            </span>
          </div>

          <div className="relative mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={<FiMapPin />}
              label="Location"
              value={job?.location?.display || "Not specified"}
            />

            <InfoCard
              icon={<FiDollarSign />}
              label="Salary"
              value={formatSalary(job?.salary)}
            />

            <InfoCard
              icon={<FiCalendar />}
              label="Deadline"
              value={formatDate(job?.deadline)}
            />

            <InfoCard
              icon={<FiUsers />}
              label="Company size"
              value={job?.company?.employeeCountLabel || "Not specified"}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        {/* Form */}
        <section className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
          <div>
            <p className="mb-3 inline-flex rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-white/50">
              Application form
            </p>

            <h2 className="text-2xl font-semibold tracking-tight text-white">
              Submit your application
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/50">
              Review your details carefully before applying for{" "}
              <span className="font-medium text-white/75">{job?.title}</span>.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                icon={<FiUser />}
                label="Full name"
                name="name"
                type="text"
                placeholder="Your full name"
                value={formData.name}
                onChange={handleChange}
              />

              <InputField
                icon={<FiMail />}
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                icon={<FiPhone />}
                label="Phone"
                name="phone"
                type="tel"
                placeholder="+880 1XXXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
              />

              <InputField
                icon={<FiLink />}
                label="Portfolio URL"
                name="portfolioUrl"
                type="url"
                placeholder="https://yourportfolio.com"
                value={formData.portfolioUrl}
                onChange={handleChange}
              />
            </div>

            <InputField
              icon={<FiFileText />}
              label="Resume URL"
              name="resumeUrl"
              type="url"
              placeholder="Google Drive / Dropbox / resume link"
              value={formData.resumeUrl}
              onChange={handleChange}
            />

            <div>
              <label className="mb-2 block text-sm font-medium text-white/70">
                Cover letter
              </label>

              <textarea
                name="coverLetter"
                value={formData.coverLetter}
                onChange={handleChange}
                rows={7}
                placeholder="Write a short message explaining why you are a good fit for this role..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-sm leading-6 text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/50 focus:bg-white/9"
              />
            </div>

            <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
              <p className="text-sm leading-6 text-violet-100/80">
                Your application will be shared with{" "}
                <span className="font-semibold text-white">
                  {job?.company?.name}
                </span>{" "}
                for review.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiSend className="h-4 w-4" />
              {isSubmitting ? "Submitting application..." : "Apply now"}
            </button>
          </form>
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#111111]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Job summary
            </h2>

            <div className="mt-5 space-y-4">
              <SummaryItem label="Role" value={job?.title} />
              <SummaryItem
                label="Category"
                value={job?.category?.replace("-", " ")}
              />
              <SummaryItem
                label="Industry"
                value={job?.company?.industryLabel || job?.company?.industry}
              />
              <SummaryItem label="Company" value={job?.company?.name} />
              <SummaryItem
                label="Work mode"
                value={job?.location?.display || job?.location?.type}
              />
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#111111]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Required skills
            </h2>

            <div className="mt-4 flex flex-wrap gap-2">
              {job?.skills?.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/65"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-white/10 bg-[#111111]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <h2 className="text-lg font-semibold tracking-tight text-white">
              Responsibilities
            </h2>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/55">
              {job?.description?.responsibilities ||
                "Responsibilities will be shared by the recruiter."}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-violet-200">
        {icon}
      </div>

      <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold capitalize text-white/80">
        {value || "Not specified"}
      </p>
    </div>
  );
};

const SummaryItem = ({ label, value }) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <p className="text-sm text-white/40">{label}</p>

      <p className="text-right text-sm font-medium capitalize text-white/75">
        {value || "Not specified"}
      </p>
    </div>
  );
};

const InputField = ({
  icon,
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
}) => {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </span>

      <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 transition focus-within:border-violet-400/50 focus-within:bg-white/9">
        <span className="text-white/35 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>

        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
      </div>
    </label>
  );
};

export default JobApply;