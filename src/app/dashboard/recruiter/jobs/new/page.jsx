"use client";

import { useState } from "react";
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
  FiMapPin,
  FiSend,
} from "react-icons/fi";

const jobCategories = [
  { id: "design", label: "Design" },
  { id: "development", label: "Development" },
  { id: "marketing", label: "Marketing" },
  { id: "sales", label: "Sales" },
  { id: "customer-support", label: "Customer Support" },
  { id: "management", label: "Management" },
];

const jobTypes = [
  { id: "full-time", label: "Full-time" },
  { id: "part-time", label: "Part-time" },
  { id: "contract", label: "Contract" },
  { id: "internship", label: "Internship" },
];

const currencies = [
  { id: "USD", label: "USD" },
  { id: "BDT", label: "BDT" },
  { id: "EUR", label: "EUR" },
  { id: "GBP", label: "GBP" },
];

const recruiterCompany = {
  id: "company_001",
  name: "Rolebix Technologies",
  status: "approved",
};

const initialFormData = {
  title: "",
  category: "",
  type: "",
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

const PostJobPage = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const isCompanyApproved = recruiterCompany.status === "approved";

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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Job title is required.";
    }

    if (!formData.category) {
      newErrors.category = "Job category is required.";
    }

    if (!formData.type) {
      newErrors.type = "Job type is required.";
    }

    if (!formData.salaryMin) {
      newErrors.salaryMin = "Minimum salary is required.";
    }

    if (!formData.salaryMax) {
      newErrors.salaryMax = "Maximum salary is required.";
    }

    if (
      formData.salaryMin &&
      formData.salaryMax &&
      Number(formData.salaryMin) > Number(formData.salaryMax)
    ) {
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

    if (!formData.responsibilities.trim()) {
      newErrors.responsibilities = "Responsibilities are required.";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Requirements are required.";
    }

    if (!isCompanyApproved) {
      newErrors.company = "Your company must be approved before posting a job.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const payload = {
        ...formData,
        status: "active",
        visibility: "public",
        companyId: recruiterCompany.id,
        companyName: recruiterCompany.name,
        location: formData.isRemote
          ? "Remote"
          : `${formData.city}, ${formData.country}`,
        createdAt: new Date().toISOString(),
      };

      console.log("POST JOB PAYLOAD:", payload);

      // Future API call:
      // await fetch("/api/jobs", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });

      setSuccessMessage("Job posted successfully and is now publicly visible.");
      setFormData(initialFormData);
    } catch (error) {
      setErrors({
        submit: error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-[#151515] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-6xl">
        {/* Page Header */}
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

          <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
            <p className="text-xs text-white/40">Posting Company</p>
            <p className="mt-1 font-semibold text-white">
              {recruiterCompany.name}
            </p>
          </div>
        </div>

        <Form
          validationBehavior="aria"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Job Info Section */}
          <Fieldset className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl shadow-black/20">
            <Fieldset.Legend className="flex items-center gap-3 text-xl font-semibold text-white">
              <FiBriefcase className="h-5 w-5 text-violet-300" />
              Job Info
            </Fieldset.Legend>

            <Fieldset.Group className="mt-6 grid gap-5 md:grid-cols-2">
              {/* Job Title */}
              <AppTextField
                label="Job Title"
                name="title"
                placeholder="Senior Product Designer"
                value={formData.title}
                error={errors.title}
                onChange={(value) => handleChange("title", value)}
              />

              {/* Job Category */}
              <AppSelect
                label="Job Category"
                placeholder="Select category"
                value={formData.category}
                error={errors.category}
                items={jobCategories}
                onChange={(value) => handleChange("category", value)}
              />

              {/* Job Type */}
              <AppSelect
                label="Job Type"
                placeholder="Select job type"
                value={formData.type}
                error={errors.type}
                items={jobTypes}
                onChange={(value) => handleChange("type", value)}
              />

              {/* Currency */}
              <AppSelect
                label="Currency"
                placeholder="Select currency"
                value={formData.currency}
                error={errors.currency}
                items={currencies}
                onChange={(value) => handleChange("currency", value)}
              />

              {/* Minimum Salary */}
              <AppTextField
                label="Minimum Salary"
                name="salaryMin"
                type="number"
                placeholder="50000"
                value={formData.salaryMin}
                error={errors.salaryMin}
                onChange={(value) => handleChange("salaryMin", value)}
              />

              {/* Maximum Salary */}
              <AppTextField
                label="Maximum Salary"
                name="salaryMax"
                type="number"
                placeholder="90000"
                value={formData.salaryMax}
                error={errors.salaryMax}
                onChange={(value) => handleChange("salaryMax", value)}
              />

              {/* Remote Toggle */}
              <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <Label className="text-sm font-medium text-white">
                      Remote job
                    </Label>

                    <Description className="mt-1 text-sm text-white/45">
                      Turn this on if this job does not require a physical
                      location.
                    </Description>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleChange("isRemote", !formData.isRemote)}
                    className={`relative h-8 w-14 rounded-full transition ${
                      formData.isRemote
                        ? "bg-violet-500"
                        : "bg-white/10"
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

              {/* City */}
              {!formData.isRemote && (
                <AppTextField
                  label="City"
                  name="city"
                  placeholder="Dhaka"
                  value={formData.city}
                  error={errors.city}
                  onChange={(value) => handleChange("city", value)}
                />
              )}

              {/* Country */}
              {!formData.isRemote && (
                <AppTextField
                  label="Country"
                  name="country"
                  placeholder="Bangladesh"
                  value={formData.country}
                  error={errors.country}
                  onChange={(value) => handleChange("country", value)}
                />
              )}

              {/* Deadline */}
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

          {/* Job Description Section */}
          <Fieldset className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl shadow-black/20">
            <Fieldset.Legend className="flex items-center gap-3 text-xl font-semibold text-white">
              <FiCalendar className="h-5 w-5 text-violet-300" />
              Job Description
            </Fieldset.Legend>

            <Fieldset.Group className="mt-6 grid gap-5">
              {/* Responsibilities */}
              <AppTextArea
                label="Responsibilities"
                name="responsibilities"
                placeholder="Write the key responsibilities for this role..."
                value={formData.responsibilities}
                error={errors.responsibilities}
                onChange={(value) => handleChange("responsibilities", value)}
              />

              {/* Requirements */}
              <AppTextArea
                label="Requirements"
                name="requirements"
                placeholder="Write required skills, experience, and qualifications..."
                value={formData.requirements}
                error={errors.requirements}
                onChange={(value) => handleChange("requirements", value)}
              />

              {/* Benefits */}
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

          {/* Company Section */}
          <Fieldset className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl shadow-black/20">
            <Fieldset.Legend className="flex items-center gap-3 text-xl font-semibold text-white">
              <FiMapPin className="h-5 w-5 text-violet-300" />
              Company
            </Fieldset.Legend>

            <Fieldset.Group className="mt-6">
              <div className="rounded-2xl border border-white/10 bg-black/25 p-5">
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <p className="text-sm text-white/45">
                      Auto-filled company
                    </p>

                    <h3 className="mt-1 text-lg font-semibold text-white">
                      {recruiterCompany.name}
                    </h3>

                    <p className="mt-2 text-sm text-white/45">
                      This job will be linked to this company profile.
                    </p>
                  </div>

                  <div
                    className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase ${
                      isCompanyApproved
                        ? "bg-green-500/15 text-green-300"
                        : "bg-red-500/15 text-red-300"
                    }`}
                  >
                    {isCompanyApproved ? (
                      <FiCheckCircle className="h-4 w-4" />
                    ) : (
                      <FiAlertCircle className="h-4 w-4" />
                    )}

                    {isCompanyApproved ? "Approved" : "Not Approved"}
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
                On submit, the job will be saved as active and publicly visible.
              </p>

              <Button
                type="submit"
                isDisabled={!isCompanyApproved || isSubmitting}
                className="h-12 rounded-xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] px-6 text-sm font-semibold text-white shadow-lg shadow-violet-500/20"
              >
                <FiSend className="h-4 w-4" />
                {isSubmitting ? "Publishing..." : "Publish Job"}
              </Button>
            </Fieldset.Actions>
          </Fieldset>

          {/* Success Message */}
          {successMessage && (
            <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {successMessage}
            </div>
          )}

          {/* Submit Error */}
          {errors.submit && (
            <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {errors.submit}
            </div>
          )}
        </Form>
      </div>
    </section>
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

export default PostJobPage;