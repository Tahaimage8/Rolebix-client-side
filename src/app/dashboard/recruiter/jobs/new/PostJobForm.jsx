/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Button,
  Description,
  FieldError,
  Fieldset,
  Form,
  Input,
  Label,
  ListBox,
  Select,
  TextArea,
  TextField,
} from "@heroui/react";

import {
  FiAlertCircle,
  FiBriefcase,
  FiCalendar,
  FiCheckCircle,
  FiEye,
  FiGlobe,
  FiMapPin,
  FiSave,
  FiSend,
} from "react-icons/fi";

import { createJob } from "@/lib/actions/jobs";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { RejectedCompanyAlert } from "@/components/dashboard/RejectedCompanyAlert";
import { PendingCompanyAlert } from "@/components/dashboard/PendingCompanyAlert";

/* Job category options */
const jobCategories = [
  { id: "design", label: "Design" },
  { id: "development", label: "Development" },
  { id: "software-engineering", label: "Software Engineering" },
  { id: "web-development", label: "Web Development" },
  { id: "mobile-development", label: "Mobile Development" },
  { id: "data-science", label: "Data Science" },
  { id: "ai-ml", label: "AI / Machine Learning" },
  { id: "devops", label: "DevOps / Cloud" },
  { id: "cybersecurity", label: "Cybersecurity" },
  { id: "product-management", label: "Product Management" },
  { id: "project-management", label: "Project Management" },
  { id: "marketing", label: "Marketing" },
  { id: "digital-marketing", label: "Digital Marketing" },
  { id: "sales", label: "Sales" },
  { id: "customer-support", label: "Customer Support" },
  { id: "operations", label: "Operations" },
  { id: "human-resources", label: "Human Resources" },
  { id: "finance", label: "Finance / Accounting" },
  { id: "content-writing", label: "Content Writing" },
  { id: "video-editing", label: "Video Editing" },
  { id: "education", label: "Education / Training" },
  { id: "healthcare", label: "Healthcare" },
  { id: "legal", label: "Legal" },
  { id: "management", label: "Management" },
];

/* Job type options */
const jobTypes = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
];

/* Experience level options */
const experienceLevels = [
  { id: "entry", label: "Entry Level" },
  { id: "mid", label: "Mid Level" },
  { id: "senior", label: "Senior Level" },
  { id: "lead", label: "Lead / Manager" },
];

/* Currency options */
const currencies = [
  { id: "USD", label: "USD" },
  { id: "BDT", label: "BDT" },
  { id: "EUR", label: "EUR" },
  { id: "GBP", label: "GBP" },
];

/* Initial form values */
const initialFormData = {
  title: "",
  category: "",
  type: "",
  experienceLevel: "",
  skills: "",
  salaryMin: "",
  salaryMax: "",
  currency: "USD",
  city: "",
  country: "",
  isRemote: false,
  deadline: "",
  responsibilities: "",
  requirements: "",
  benefits: "",
};

/* Helper: today's date for deadline validation */
const getTodayDate = () => {
  return new Date().toISOString().split("T")[0];
};

/* Helper: get label from select option */
const getOptionLabel = (items, id) => {
  return items.find((item) => item.id === id)?.label || "";
};

/* Helper: convert comma-separated skills to array */
const formatSkills = (skills) => {
  return skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
};

/* Helper: support MongoDB _id string/object */
const getCompanyId = (company) => {
  if (typeof company?._id === "string") return company._id;
  if (company?._id?.$oid) return company._id.$oid;
  return company?.id || "";
};

/* Helper: normalize company status */
const getNormalizedCompanyStatus = (status) => {
  return status?.toLowerCase().trim() || "pending";
};

/* Helper: company status label */
const getCompanyStatusLabel = (status) => {
  const normalizedStatus = getNormalizedCompanyStatus(status);

  if (normalizedStatus === "approved") return "Approved";
  if (normalizedStatus === "rejected") return "Rejected";
  return "Pending";
};

/* Helper: company status styles */
const getCompanyStatusStyles = (status) => {
  const normalizedStatus = getNormalizedCompanyStatus(status);

  if (normalizedStatus === "approved") {
    return "border-green-500/20 bg-green-500/10 text-green-300";
  }

  if (normalizedStatus === "rejected") {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }

  return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
};

const PostJobForm = ({ company }) => {
  const router = useRouter();

  /* Company values */
  const companyId = getCompanyId(company);
  const companyStatus = company?.status || "Pending";
  const normalizedCompanyStatus = getNormalizedCompanyStatus(companyStatus);

  const isCompanyApproved = normalizedCompanyStatus === "approved";
  const isCompanyPending = normalizedCompanyStatus === "pending";
  const isCompanyRejected = normalizedCompanyStatus === "rejected";

  /* Form state */
  const [formData, setFormData] = useState(initialFormData);

  /* Form errors */
  const [errors, setErrors] = useState({});

  /* Submit loading state */
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* Success message */
  const [successMessage, setSuccessMessage] = useState("");

  /* Job preview values */
  const preview = useMemo(() => {
    return {
      title: formData.title || "Untitled Job",
      category: getOptionLabel(jobCategories, formData.category) || "Category",
      type: getOptionLabel(jobTypes, formData.type) || "Job Type",
      experience:
        getOptionLabel(experienceLevels, formData.experienceLevel) ||
        "Experience Level",
      location: formData.isRemote
        ? "Remote"
        : formData.city && formData.country
          ? `${formData.city}, ${formData.country}`
          : "Location",
      salary:
        formData.salaryMin && formData.salaryMax
          ? `${formData.currency} ${formData.salaryMin} - ${formData.salaryMax}`
          : "Salary range",
      skills: formatSkills(formData.skills),
    };
  }, [formData]);

  /* No company state */
  if (!company) {
    return (
      <section className="min-h-screen bg-[#151515] p-6 text-white lg:p-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-3xl border border-white/10 bg-[#1b1b1b] p-8 text-center shadow-2xl shadow-black/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
              <FiBriefcase className="h-7 w-7 text-white/50" />
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white">
              Register your company first
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
              You need an approved company profile before posting jobs on
              Rolebix.
            </p>

            <Button
              as={Link}
              href="/dashboard/recruiter/company"
              className="mt-7 h-12 rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Register Company
            </Button>
          </div>
        </div>
      </section>
    );
  }

  /* Handle input/select change */
  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
      submit: "",
    }));

    setSuccessMessage("");
  };

  /* Validate form before publish */
  const validateForm = () => {
    const newErrors = {};

    const salaryMin = Number(formData.salaryMin);
    const salaryMax = Number(formData.salaryMax);

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required.";
    }

    if (!formData.category) {
      newErrors.category = "Job category is required.";
    }

    if (!formData.type) {
      newErrors.type = "Job type is required.";
    }

    if (!formData.experienceLevel) {
      newErrors.experienceLevel = "Experience level is required.";
    }

    if (!formData.skills.trim()) {
      newErrors.skills = "At least one skill is required.";
    }

    if (!formData.salaryMin) {
      newErrors.salaryMin = "Minimum salary is required.";
    }

    if (!formData.salaryMax) {
      newErrors.salaryMax = "Maximum salary is required.";
    }

    if (formData.salaryMin && salaryMin <= 0) {
      newErrors.salaryMin = "Minimum salary must be greater than 0.";
    }

    if (formData.salaryMax && salaryMax <= 0) {
      newErrors.salaryMax = "Maximum salary must be greater than 0.";
    }

    if (formData.salaryMin && formData.salaryMax && salaryMin > salaryMax) {
      newErrors.salaryMax =
        "Maximum salary must be greater than minimum salary.";
    }

    if (!formData.currency) {
      newErrors.currency = "Currency is required.";
    }

    if (!formData.isRemote) {
      if (!formData.city.trim()) {
        newErrors.city = "City is required.";
      }

      if (!formData.country.trim()) {
        newErrors.country = "Country is required.";
      }
    }

    if (!formData.deadline) {
      newErrors.deadline = "Application deadline is required.";
    }

    if (formData.deadline && formData.deadline < getTodayDate()) {
      newErrors.deadline = "Deadline cannot be in the past.";
    }

    if (!formData.responsibilities.trim()) {
      newErrors.responsibilities = "Responsibilities are required.";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Requirements are required.";
    }

    if (!company) {
      newErrors.company = "Please register your company before posting a job.";
    }

    if (company && !isCompanyApproved) {
      newErrors.company = "Your company must be approved before posting a job.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* Build final payload for API */
  const buildJobPayload = (status = "active") => {
    return {
      title: formData.title.trim(),
      category: formData.category,
      type: formData.type,
      experienceLevel: formData.experienceLevel,
      skills: formatSkills(formData.skills),
      salary: {
        min: formData.salaryMin ? Number(formData.salaryMin) : null,
        max: formData.salaryMax ? Number(formData.salaryMax) : null,
        currency: formData.currency,
      },
      location: {
        type: formData.isRemote ? "remote" : "onsite",
        city: formData.isRemote ? "" : formData.city.trim(),
        country: formData.isRemote ? "" : formData.country.trim(),
        display: formData.isRemote
          ? "Remote"
          : `${formData.city.trim()}, ${formData.country.trim()}`,
      },
      deadline: formData.deadline,
      description: {
        responsibilities: formData.responsibilities.trim(),
        requirements: formData.requirements.trim(),
        benefits: formData.benefits.trim(),
      },
      company: {
        id: companyId,
        name: company?.name || "",
        logoUrl: company?.logoUrl || "",
        websiteUrl: company?.websiteUrl || "",
        industry: company?.industry || "",
        industryLabel: company?.industryLabel || company?.industry || "",
        employeeCount: company?.employeeCount || "",
        employeeCountLabel:
          company?.employeeCountLabel || company?.employeeCount || "",
        location: company?.location || "",
        status: normalizedCompanyStatus,
      },
      status,
      visibility: status === "active" ? "public" : "private",
    };
  };

  /* Save draft */
  const handleSaveDraft = () => {
    const payload = buildJobPayload("draft");

    console.log("SAVE DRAFT PAYLOAD:", payload);

    setSuccessMessage(
      "Job draft saved locally. API integration can be added later.",
    );
  };

  /* Publish job */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload = buildJobPayload("active");

      const res = await createJob(payload);

      if (res?.insertedId) {
        toast.success("Job posted successfully.");
        setSuccessMessage(
          "Job posted successfully and is now publicly visible.",
        );
        setFormData(initialFormData);
        router.push("/dashboard/recruiter");
        return;
      }

      toast.error(res?.message || "Failed to post job. Please try again.");
      setErrors({
        submit: res?.message || "Failed to post job. Please try again.",
      });
    } catch (error) {
      toast.error(error?.message || "Something went wrong. Please try again.");

      setErrors({
        submit: error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#151515] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Page header */}
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
              <FiBriefcase className="h-4 w-4" />
              Recruiter Workspace
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Post a Job
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
              Create a public job post linked to your approved company profile.
            </p>
          </div>

          {/* Header company card */}
          <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
            <div className="flex items-center gap-3">
              {company?.logoUrl ? (
                <img
                  src={company.logoUrl}
                  alt={company.name}
                  className="h-10 w-10 rounded-xl border border-white/10 object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-black/25">
                  <FiBriefcase className="h-5 w-5 text-white/45" />
                </div>
              )}

              <div>
                <p className="text-xs text-white/40">Posting Company</p>
                <p className="mt-1 font-semibold text-white">
                  {company?.name || "No company found"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isCompanyRejected && (
          <div>
            <RejectedCompanyAlert />
          </div>
        )}

        {isCompanyPending && (
          <div>
            <PendingCompanyAlert />
          </div>
        )}

        {isCompanyApproved && (
          <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
            {/* Main form */}
            <Form
              validationBehavior="aria"
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Job info section */}
              <Fieldset className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl shadow-black/20">
                <Fieldset.Legend className="flex items-center gap-3 text-xl font-semibold text-white">
                  <FiBriefcase className="h-5 w-5 text-violet-300" />
                  Job Info
                </Fieldset.Legend>

                <Fieldset.Group className="mt-6 grid gap-5 md:grid-cols-2">
                  <AppTextField
                    label="Job Title"
                    name="title"
                    placeholder="Senior Product Designer"
                    value={formData.title}
                    error={errors.title}
                    onChange={(value) => handleChange("title", value)}
                  />

                  <AppSelect
                    label="Job Category"
                    placeholder="Select category"
                    value={formData.category}
                    error={errors.category}
                    items={jobCategories}
                    onChange={(value) => handleChange("category", value)}
                  />

                  <AppSelect
                    label="Job Type"
                    placeholder="Select job type"
                    value={formData.type}
                    error={errors.type}
                    items={jobTypes}
                    onChange={(value) => handleChange("type", value)}
                  />

                  <AppSelect
                    label="Experience Level"
                    placeholder="Select experience level"
                    value={formData.experienceLevel}
                    error={errors.experienceLevel}
                    items={experienceLevels}
                    onChange={(value) => handleChange("experienceLevel", value)}
                  />

                  <AppTextField
                    label="Skills"
                    name="skills"
                    placeholder="React, Next.js, MongoDB"
                    value={formData.skills}
                    error={errors.skills}
                    onChange={(value) => handleChange("skills", value)}
                  />

                  <AppSelect
                    label="Currency"
                    placeholder="Select currency"
                    value={formData.currency}
                    error={errors.currency}
                    items={currencies}
                    onChange={(value) => handleChange("currency", value)}
                  />

                  <AppTextField
                    label="Minimum Salary"
                    name="salaryMin"
                    type="number"
                    placeholder="50000"
                    value={formData.salaryMin}
                    error={errors.salaryMin}
                    onChange={(value) => handleChange("salaryMin", value)}
                  />

                  <AppTextField
                    label="Maximum Salary"
                    name="salaryMax"
                    type="number"
                    placeholder="90000"
                    value={formData.salaryMax}
                    error={errors.salaryMax}
                    onChange={(value) => handleChange("salaryMax", value)}
                  />

                  {/* Remote toggle */}
                  <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div>
                        <Label className="text-sm font-medium text-white">
                          Remote job
                        </Label>

                        <Description className="mt-1 block text-sm leading-6 text-white/45">
                          Turn this on if this job does not require a physical
                          location.
                        </Description>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleChange("isRemote", !formData.isRemote)
                        }
                        className={`relative h-8 w-14 shrink-0 rounded-full transition ${
                          formData.isRemote ? "bg-violet-500" : "bg-white/10"
                        }`}
                      >
                        <span
                          className={`absolute top-1 h-6 w-6 rounded-full bg-white transition ${
                            formData.isRemote ? "left-7" : "left-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {!formData.isRemote && (
                    <>
                      <AppTextField
                        label="City"
                        name="city"
                        placeholder="Dhaka"
                        value={formData.city}
                        error={errors.city}
                        onChange={(value) => handleChange("city", value)}
                      />

                      <AppTextField
                        label="Country"
                        name="country"
                        placeholder="Bangladesh"
                        value={formData.country}
                        error={errors.country}
                        onChange={(value) => handleChange("country", value)}
                      />
                    </>
                  )}

                  <AppTextField
                    label="Application Deadline"
                    name="deadline"
                    type="date"
                    value={formData.deadline}
                    error={errors.deadline}
                    onChange={(value) => handleChange("deadline", value)}
                  />
                </Fieldset.Group>
              </Fieldset>

              {/* Job description section */}
              <Fieldset className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl shadow-black/20">
                <Fieldset.Legend className="flex items-center gap-3 text-xl font-semibold text-white">
                  <FiCalendar className="h-5 w-5 text-violet-300" />
                  Job Description
                </Fieldset.Legend>

                <Fieldset.Group className="mt-6 grid gap-5">
                  <AppTextArea
                    label="Responsibilities"
                    name="responsibilities"
                    placeholder="Write the key responsibilities for this role..."
                    value={formData.responsibilities}
                    error={errors.responsibilities}
                    onChange={(value) =>
                      handleChange("responsibilities", value)
                    }
                  />

                  <AppTextArea
                    label="Requirements"
                    name="requirements"
                    placeholder="Write required skills, experience, and qualifications..."
                    value={formData.requirements}
                    error={errors.requirements}
                    onChange={(value) => handleChange("requirements", value)}
                  />

                  <AppTextArea
                    label="Benefits"
                    name="benefits"
                    placeholder="Health insurance, remote flexibility, bonuses, learning budget..."
                    value={formData.benefits}
                    error={errors.benefits}
                    onChange={(value) => handleChange("benefits", value)}
                  />
                </Fieldset.Group>
              </Fieldset>

              {/* Company section */}
              <Fieldset className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl shadow-black/20">
                <Fieldset.Legend className="flex items-center gap-3 text-xl font-semibold text-white">
                  <FiMapPin className="h-5 w-5 text-violet-300" />
                  Company
                </Fieldset.Legend>

                <Fieldset.Group className="mt-6">
                  <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                      <div className="flex items-start gap-4">
                        {company?.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={company.name}
                            className="h-16 w-16 rounded-2xl border border-white/10 bg-black object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                            <FiBriefcase className="h-7 w-7 text-white/45" />
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-white/45">
                            Auto-filled company
                          </p>

                          <h3 className="mt-1 text-xl font-semibold text-white">
                            {company?.name || "No company found"}
                          </h3>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <CompanyInfoPill>
                              {company?.industryLabel ||
                                company?.industry ||
                                "Industry not set"}
                            </CompanyInfoPill>

                            <CompanyInfoPill>
                              {company?.employeeCountLabel ||
                                company?.employeeCount ||
                                "Company size not set"}
                            </CompanyInfoPill>

                            <CompanyInfoPill>
                              {company?.location || "Location not set"}
                            </CompanyInfoPill>
                          </div>

                          {company?.websiteUrl && (
                            <a
                              href={company.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-3 inline-flex items-center gap-2 text-sm text-violet-300 transition hover:text-violet-200"
                            >
                              <FiGlobe className="h-4 w-4" />
                              {company.websiteUrl}
                            </a>
                          )}

                          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
                            This job will be linked to your recruiter company
                            profile.
                          </p>
                        </div>
                      </div>

                      <div
                        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getCompanyStatusStyles(
                          companyStatus,
                        )}`}
                      >
                        {isCompanyApproved ? (
                          <FiCheckCircle className="h-4 w-4" />
                        ) : (
                          <FiAlertCircle className="h-4 w-4" />
                        )}

                        {getCompanyStatusLabel(companyStatus)}
                      </div>
                    </div>

                    {errors.company && (
                      <p className="mt-4 text-sm text-red-400">
                        {errors.company}
                      </p>
                    )}
                  </div>
                </Fieldset.Group>

                <Fieldset.Actions className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-white/40">
                    On submit, the job will be saved as active and publicly
                    visible.
                  </p>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button
                      type="button"
                      onPress={handleSaveDraft}
                      className="h-12 rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white"
                    >
                      <FiSave className="h-4 w-4" />
                      Save Draft
                    </Button>

                    <Button
                      type="submit"
                      isDisabled={!isCompanyApproved || isSubmitting}
                      className="h-12 rounded-xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] px-6 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
                    >
                      <FiSend className="h-4 w-4" />
                      {isSubmitting ? "Publishing..." : "Publish Job"}
                    </Button>
                  </div>
                </Fieldset.Actions>
              </Fieldset>

              {successMessage && (
                <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
                  {successMessage}
                </div>
              )}

              {errors.submit && (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {errors.submit}
                </div>
              )}
            </Form>

            {/* Preview card */}
            <aside className="h-fit rounded-3xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl shadow-black/20 xl:sticky xl:top-8">
              <div className="mb-5 flex items-center gap-2">
                <FiEye className="h-5 w-5 text-violet-300" />
                <h2 className="text-lg font-semibold text-white">
                  Job Preview
                </h2>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-violet-200">
                  {preview.category}
                </p>

                <h3 className="mt-3 text-xl font-semibold text-white">
                  {preview.title}
                </h3>

                <div className="mt-4 space-y-2 text-sm text-white/50">
                  <p>{preview.type}</p>
                  <p>{preview.experience}</p>
                  <p>{preview.location}</p>
                  <p>{preview.salary}</p>
                </div>

                {preview.skills.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {preview.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {company?.name && (
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-white/30">
                      Company
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      {company?.logoUrl ? (
                        <img
                          src={company.logoUrl}
                          alt={company.name}
                          className="h-10 w-10 rounded-xl border border-white/10 object-cover"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/6">
                          <FiBriefcase className="h-5 w-5 text-white/45" />
                        </div>
                      )}

                      <div>
                        <p className="font-semibold text-white">
                          {company.name}
                        </p>
                        <p className="text-xs text-white/40">
                          {company?.industryLabel ||
                            company?.industry ||
                            "Company"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="mt-5 text-sm leading-6 text-white/40">
                This preview helps recruiters check how the job post may appear
                before publishing.
              </p>
            </aside>
          </div>
        )}
      </div>
    </section>
  );
};

const CompanyInfoPill = ({ children }) => {
  return (
    <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/60">
      {children}
    </span>
  );
};

const AppTextField = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  error,
  onChange,
}) => {
  return (
    <TextField
      name={name}
      type={type}
      isInvalid={Boolean(error)}
      className="w-full"
    >
      <Label className="text-sm font-medium text-white/70">{label}</Label>

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 h-12 rounded-xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-400/50"
      />

      <FieldError className="mt-1 text-xs text-red-400">{error}</FieldError>
    </TextField>
  );
};

const AppTextArea = ({
  label,
  name,
  placeholder = "",
  value,
  error,
  onChange,
}) => {
  return (
    <TextField name={name} isInvalid={Boolean(error)} className="w-full">
      <Label className="text-sm font-medium text-white/70">{label}</Label>

      <TextArea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 min-h-36 w-full rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-violet-400/50"
      />

      <FieldError className="mt-1 text-xs text-red-400">{error}</FieldError>
    </TextField>
  );
};

const AppSelect = ({ label, placeholder, value, error, items, onChange }) => {
  return (
    <Select
      value={value || null}
      onChange={(selectedValue) => onChange(selectedValue || "")}
      isInvalid={Boolean(error)}
      placeholder={placeholder}
      className="w-full"
    >
      <Label className="text-sm font-medium text-white/70">{label}</Label>

      <Select.Trigger className="mt-2 flex h-12 items-center justify-between rounded-xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition hover:border-white/20">
        <Select.Value className="text-white data-[placeholder=true]:text-white/25" />
        <Select.Indicator className="text-white/45" />
      </Select.Trigger>

      <FieldError className="mt-1 text-xs text-red-400">{error}</FieldError>

      <Select.Popover className="rounded-xl border border-white/10 bg-[#1b1b1b] p-2 text-white shadow-2xl">
        <ListBox>
          {items.map((item) => (
            <ListBox.Item
              key={item.id}
              id={item.id}
              textValue={item.label}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-white/75 outline-none transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default PostJobForm;