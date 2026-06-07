"use client";

import { CreateApplication } from "@/lib/actions/application";
import { useState } from "react";
import {
  FiFileText,
  FiLink,
  FiMail,
  FiPhone,
  FiSend,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";


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

    try {
      setIsSubmitting(true);

      const application = {
        jobId: job?._id,
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

        status: "pending",
      };

      const result = await CreateApplication(application);

      if (!result?.insertedId && !result?.acknowledged) {
        toast.error("Failed to submit application. Please try again.");
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
    } catch (error) {
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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