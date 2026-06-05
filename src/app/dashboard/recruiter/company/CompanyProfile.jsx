/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import {
  Button,
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
  ArrowRight,
  ArrowUpToLine,
  ChevronDown,
  Factory,
  Globe,
  Pencil,
} from "@gravity-ui/icons";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";
import { createCompany } from "@/lib/actions/companies";

/* Company industry options */
const industryOptions = [
  { id: "technology", label: "Technology" },
  { id: "software", label: "Software / SaaS" },
  { id: "design", label: "Design / Creative" },
  { id: "marketing", label: "Marketing / Agency" },
  { id: "ecommerce", label: "E-commerce" },
  { id: "finance", label: "Finance / Banking" },
  { id: "education", label: "Education / EdTech" },
  { id: "healthcare", label: "Healthcare" },
  { id: "real-estate", label: "Real Estate" },
  { id: "media", label: "Media / Entertainment" },
  { id: "manufacturing", label: "Manufacturing" },
  { id: "logistics", label: "Logistics / Supply Chain" },
  { id: "other", label: "Other" },
];

/* Employee count options */
const employeeCountOptions = [
  { id: "1-10", label: "1-10 employees" },
  { id: "11-50", label: "11-50 employees" },
  { id: "51-200", label: "51-200 employees" },
  { id: "201-500", label: "201-500 employees" },
  { id: "501+", label: "501+ employees" },
];

/* Initial form values */
const initialCompanyForm = {
  companyName: "",
  websiteUrl: "",
  industry: "technology",
  location: "",
  employeeCount: "1-10",
  description: "",
};

/* Shared styles */
const inputClass =
  "mt-2 h-12 w-full rounded-xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-violet-400/50";

const textareaClass =
  "mt-2 min-h-36 w-full resize-none rounded-xl border border-white/10 bg-white/6 px-4 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-violet-400/50";

const triggerClass =
  "mt-2 flex h-12 w-full items-center justify-between rounded-xl border border-white/10 bg-white/6 px-4 text-sm text-white outline-none transition hover:border-white/20";

const popoverClass =
  "rounded-xl border border-white/10 bg-[#1b1b1b] p-2 text-white shadow-2xl";

const listItemClass =
  "cursor-pointer rounded-lg px-3 py-2 text-sm text-white/75 outline-none transition hover:bg-white/10 hover:text-white";

/* Helper: get selected option label */
const getOptionLabel = (items, id) => {
  return items.find((item) => item.id === id)?.label || id;
};

/* Helper: normalize website url */
const normalizeWebsiteUrl = (url) => {
  const cleanUrl = url.trim();

  if (!cleanUrl) return "";

  if (cleanUrl.startsWith("http://") || cleanUrl.startsWith("https://")) {
    return cleanUrl;
  }

  return `https://${cleanUrl}`;
};

const CompanyProfile = ({ recruiter }) => {
  /* Saved company data */
  const [company, setCompany] = useState(null);

  /* Create/edit mode */
  const [isEditing, setIsEditing] = useState(false);

  /* Form data */
  const [formData, setFormData] = useState(initialCompanyForm);

  /* Logo upload states */
  const [logoPreview, setLogoPreview] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [logoFile, setLogoFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  /* Form states */
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  /* Handle form field change */
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

  /* Start company registration */
  const startRegistration = () => {
    setFormData(initialCompanyForm);
    setLogoPreview("");
    setLogoUrl("");
    setLogoFile(null);
    setErrors({});
    setSuccessMessage("");
    setIsEditing(true);
  };

  /* Start editing company */
  const startEditing = () => {
    setFormData({
      companyName: company?.name || "",
      websiteUrl: company?.websiteUrl || "",
      industry: company?.industry || "technology",
      location: company?.location || "",
      employeeCount: company?.employeeCount || "1-10",
      description: company?.description || "",
    });

    setLogoPreview(company?.logoUrl || "");
    setLogoUrl(company?.logoUrl || "");
    setLogoFile(null);
    setErrors({});
    setSuccessMessage("");
    setIsEditing(true);
  };

  /* Upload company logo to Imgbb */
  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        logo: "File size must be less than 5MB.",
      }));
      return;
    }

    const imageUploadKey = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API;

    if (!imageUploadKey) {
      setErrors((prev) => ({
        ...prev,
        logo: "Imgbb API key is missing in .env.local.",
      }));
      toast.error("Imgbb API key is missing.");
      return;
    }

    try {
      setIsUploading(true);

      /* Local instant preview */
      const localPreview = URL.createObjectURL(file);
      setLogoPreview(localPreview);
      setLogoFile(file);

      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imageUploadKey}`,
        {
          method: "POST",
          body: uploadFormData,
        }
      );

      const data = await response.json();

      if (!data?.success) {
        throw new Error("Image upload failed. Please try again.");
      }

      const uploadedImageUrl = data.data.url;

      setLogoUrl(uploadedImageUrl);
      setLogoPreview(uploadedImageUrl);

      setErrors((prev) => ({
        ...prev,
        logo: "",
      }));

      toast.success("Logo uploaded successfully.");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        logo: error?.message || "Logo upload failed.",
      }));

      toast.error(error?.message || "Logo upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  /* Validate form */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required.";
    }

    if (!formData.websiteUrl.trim()) {
      newErrors.websiteUrl = "Website URL is required.";
    }

    if (!formData.industry) {
      newErrors.industry = "Industry is required.";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required.";
    }

    if (!formData.employeeCount) {
      newErrors.employeeCount = "Employee count is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Company description is required.";
    }

    if (isUploading) {
      newErrors.logo = "Please wait until logo upload is finished.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* Submit form: console log only */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const payload = {
      name: formData.companyName.trim(),
      websiteUrl: normalizeWebsiteUrl(formData.websiteUrl),
      industry: formData.industry,
      industryLabel: getOptionLabel(industryOptions, formData.industry),
      location: formData.location.trim(),
      employeeCount: formData.employeeCount,
      employeeCountLabel: getOptionLabel(
        employeeCountOptions,
        formData.employeeCount
      ),
      description: formData.description.trim(),
      logoUrl,
      logo: {
        url: logoUrl,
        fileName: logoFile?.name || "",
        fileSize: logoFile?.size || "",
        fileType: logoFile?.type || "",
      },
      status: company?.status || "Pending",
      updatedAt: new Date().toISOString(),
      recruiterId: recruiter?.id 
    };

    // console.log("COMPANY PROFILE PAYLOAD:", payload);
    
    setCompany(payload);

const companyPayload = await createCompany(payload);

// console.log("CREATE COMPANY RESPONSE:", companyPayload);

if (companyPayload?.insertedId) {
  toast.success("Company profile created successfully.");
}

    setIsEditing(false);
    setErrors({});
    // setSuccessMessage(company? "Company profile updated successfully.": "Company profile created successfully.");

    // toast.success(company? "Company profile updated successfully.": "Company profile created successfully.");
  };

  /* Status style */
  const getStatusStyles = (status) => {
    switch (status) {
      case "Approved":
        return "border-green-500/20 bg-green-500/10 text-green-300";
      case "Rejected":
        return "border-red-500/20 bg-red-500/10 text-red-300";
      default:
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
    }
  };

  /* Empty company state */
  if (!company && !isEditing) {
    return (
      <section className="min-h-screen bg-[#151515] p-6 text-white lg:p-8">
        <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
          <div className="w-full rounded-3xl border border-white/10 bg-[#1b1b1b] p-8 text-center shadow-2xl shadow-black/20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
              <Factory className="h-7 w-7 text-white/50" />
            </div>

            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white">
              No Company Registered Yet
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/45">
              Register your company profile first. After approval, you can post
              public jobs and manage applicants from your recruiter dashboard.
            </p>

            <Button
              onPress={startRegistration}
              className="mt-7 h-12 rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Register Company
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    );
  }

  /* Company profile view mode */
  if (company && !isEditing) {
    return (
      <section className="min-h-screen bg-[#151515] p-6 text-white lg:p-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 border-b border-white/10 pb-6">
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Company Profile
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Manage your company identity, hiring status, and public employer
              profile.
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-300">
              {successMessage}
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl shadow-black/20">
            <div className="flex flex-col justify-between gap-5 border-b border-white/10 pb-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4">
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl}
                    alt={company.name}
                    className="h-16 w-16 rounded-2xl border border-white/10 bg-black/25 object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 bg-black/25">
                    <Factory className="h-7 w-7 text-white/40" />
                  </div>
                )}

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-white">
                      {company.name}
                    </h2>

                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                        company.status
                      )}`}
                    >
                      {company.status === "Approved" ? (
                        <FiCheckCircle className="h-4 w-4" />
                      ) : (
                        <FiAlertCircle className="h-4 w-4" />
                      )}
                      {company.status}
                    </span>
                  </div>

                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
                  >
                    <Globe className="h-4 w-4" />
                    {company.websiteUrl}
                  </a>
                </div>
              </div>

              <Button
                onPress={startEditing}
                className="h-11 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <Pencil className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <ProfileMetaCard
                label="Industry"
                value={company.industryLabel}
                icon={<Factory className="h-5 w-5" />}
              />

              <ProfileMetaCard
                label="Location"
                value={company.location}
                icon={<FiMapPin className="h-5 w-5" />}
              />

              <ProfileMetaCard
                label="Company Size"
                value={company.employeeCountLabel}
                icon={<FiUsers className="h-5 w-5" />}
              />
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-white/45">
                About Company
              </h3>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-white/65">
                {company.description}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* Create/Edit form */
  return (
    <section className="min-h-screen bg-[#151515] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 border-b border-white/10 pb-6">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
            <Factory className="h-4 w-4" />
            Recruiter Company
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            {company ? "Update Company Profile" : "Register Company"}
          </h1>

          <p className="mt-2 text-sm text-white/45">
            Complete your employer profile to post jobs and build trust with
            applicants.
          </p>
        </div>

        <Form
          validationBehavior="aria"
          onSubmit={handleSubmit}
          className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-6 shadow-2xl shadow-black/20"
        >
          <Fieldset className="w-full">
            <Fieldset.Legend className="text-xl font-semibold text-white">
              Company Information
            </Fieldset.Legend>

            <Fieldset.Group className="mt-6 grid gap-5 md:grid-cols-2">
              <AppTextField
                label="Company Name"
                name="companyName"
                placeholder="Rolebix Technologies"
                value={formData.companyName}
                error={errors.companyName}
                onChange={(value) => handleChange("companyName", value)}
              />

              <AppSelect
                label="Industry / Category"
                value={formData.industry}
                error={errors.industry}
                items={industryOptions}
                onChange={(value) => handleChange("industry", value)}
              />

              <AppTextField
                label="Website URL"
                name="websiteUrl"
                placeholder="www.company.com"
                value={formData.websiteUrl}
                error={errors.websiteUrl}
                onChange={(value) => handleChange("websiteUrl", value)}
              />

              <AppTextField
                label="Location"
                name="location"
                placeholder="Dhaka, Bangladesh"
                value={formData.location}
                error={errors.location}
                onChange={(value) => handleChange("location", value)}
              />

              <AppSelect
                label="Employee Count"
                value={formData.employeeCount}
                error={errors.employeeCount}
                items={employeeCountOptions}
                onChange={(value) => handleChange("employeeCount", value)}
              />

              <div>
                <Label className="text-sm font-medium text-white/70">
                  Company Logo
                </Label>

                <div className="mt-2 flex items-center gap-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                  <label className="flex h-16 w-16 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border border-dashed border-white/15 bg-white/6 transition hover:border-violet-400/50">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />

                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Company logo preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ArrowUpToLine className="h-5 w-5 text-white/45" />
                    )}
                  </label>

                  <div>
                    <p className="text-sm font-medium text-white">
                      {isUploading ? "Uploading..." : "Upload logo"}
                    </p>

                    <p className="mt-1 text-xs text-white/35">
                      PNG or JPG, up to 5MB.
                    </p>

                    {logoFile && (
                      <p className="mt-1 max-w-44 truncate text-xs text-violet-300">
                        {logoFile.name}
                      </p>
                    )}

                    {errors.logo && (
                      <p className="mt-1 text-xs text-red-400">
                        {errors.logo}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <AppTextArea
                  label="Brief Description"
                  name="description"
                  placeholder="Tell applicants about your company, mission, team culture, and hiring goals..."
                  value={formData.description}
                  error={errors.description}
                  onChange={(value) => handleChange("description", value)}
                />
              </div>
            </Fieldset.Group>

            {errors.submit && (
              <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errors.submit}
              </div>
            )}

            <Fieldset.Actions className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
              {company && (
                <Button
                  type="button"
                  onPress={() => setIsEditing(false)}
                  className="h-12 rounded-xl border border-white/10 bg-white/5 px-6 text-sm font-semibold text-white"
                >
                  Cancel
                </Button>
              )}

              <Button
                type="submit"
                isDisabled={isUploading}
                className="h-12 rounded-xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                {company ? "Save Updates" : "Complete Setup"}
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>
      </div>
    </section>
  );
};

/* Profile meta card */
const ProfileMetaCard = ({ label, value, icon }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/6 text-white/55">
        {icon}
      </div>

      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-2 font-semibold text-white">{value}</p>
    </div>
  );
};

/* Reusable text field */
const AppTextField = ({
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

      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />

      <FieldError className="mt-1 text-xs text-red-400">{error}</FieldError>
    </TextField>
  );
};

/* Reusable textarea */
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
        className={textareaClass}
      />

      <FieldError className="mt-1 text-xs text-red-400">{error}</FieldError>
    </TextField>
  );
};

/* Reusable select */
const AppSelect = ({ label, value, error, items, onChange }) => {
  return (
    <Select
      value={value || null}
      onChange={(selectedValue) => onChange(selectedValue || "")}
      isInvalid={Boolean(error)}
      className="w-full"
    >
      <Label className="text-sm font-medium text-white/70">{label}</Label>

      <Select.Trigger className={triggerClass}>
        <Select.Value className="text-white data-[placeholder=true]:text-white/25" />
        <Select.Indicator>
          <ChevronDown className="h-4 w-4 text-white/45" />
        </Select.Indicator>
      </Select.Trigger>

      <FieldError className="mt-1 text-xs text-red-400">{error}</FieldError>

      <Select.Popover className={popoverClass}>
        <ListBox>
          {items.map((item) => (
            <ListBox.Item
              key={item.id}
              id={item.id}
              textValue={item.label}
              className={listItemClass}
            >
              {item.label}
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
};

export default CompanyProfile;