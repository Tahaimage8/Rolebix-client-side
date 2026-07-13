/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const DEFAULT_PROFILE = {
  name: "",
  email: "",
  role: "seeker",
  plan: "seeker_free",
  image: "",
  headline: "",
  phone: "",
  location: "",
  bio: "",
  skills: [],
  experienceLevel: "",
  currentCompany: "",
  currentPosition: "",
  education: "",
  website: "",
  linkedin: "",
  github: "",
  portfolio: "",
  resumeUrl: "",
  openToWork: false,
  preferredJobTypes: [],
  preferredLocations: [],
};

const toFormState = (profile) => ({
  name: profile?.name || "",
  headline: profile?.headline || "",
  phone: profile?.phone || "",
  location: profile?.location || "",
  bio: profile?.bio || "",
  skills: Array.isArray(profile?.skills)
    ? profile.skills.join(", ")
    : "",
  experienceLevel: profile?.experienceLevel || "",
  currentCompany: profile?.currentCompany || "",
  currentPosition: profile?.currentPosition || "",
  education: profile?.education || "",
  image: profile?.image || "",
  website: profile?.website || "",
  linkedin: profile?.linkedin || "",
  github: profile?.github || "",
  portfolio: profile?.portfolio || "",
  resumeUrl: profile?.resumeUrl || "",
  openToWork: Boolean(profile?.openToWork),
  preferredJobTypes: Array.isArray(profile?.preferredJobTypes)
    ? profile.preferredJobTypes.join(", ")
    : "",
  preferredLocations: Array.isArray(profile?.preferredLocations)
    ? profile.preferredLocations.join(", ")
    : "",
});

const splitList = (value) =>
  Array.from(
    new Set(
      String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  );

const readablePlan = (plan) =>
  String(plan || "seeker_free")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Field = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
}) => (
  <label className="space-y-2">
    <span className="text-sm font-medium text-white/70">
      {label}
    </span>

    <input
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/10"
    />
  </label>
);

const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  rows = 5,
}) => (
  <label className="space-y-2">
    <span className="text-sm font-medium text-white/70">
      {label}
    </span>

    <textarea
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full resize-y rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm leading-6 text-white outline-none transition placeholder:text-white/25 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/10"
    />
  </label>
);

const InfoItem = ({ label, value }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
    <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
      {label}
    </p>
    <p className="mt-2 break-words text-sm font-medium text-white/80">
      {value || "Not added"}
    </p>
  </div>
);

const LinkItem = ({ label, href }) => (
  <div className="rounded-xl border border-white/10 bg-white/[0.025] p-4">
    <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
      {label}
    </p>

    {href ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="mt-2 block truncate text-sm font-semibold text-blue-300 transition hover:text-blue-200"
      >
        Open link ↗
      </a>
    ) : (
      <p className="mt-2 text-sm text-white/40">Not added</p>
    )}
  </div>
);

const TagList = ({ items = [], emptyText = "Not added" }) => {
  if (!items.length) {
    return <p className="text-sm text-white/40">{emptyText}</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

const ProfileClient = ({
  initialProfile,
  errorMessage = "",
}) => {
  const [profile, setProfile] = useState({
    ...DEFAULT_PROFILE,
    ...(initialProfile || {}),
  });
  const [form, setForm] = useState(
    toFormState(initialProfile || DEFAULT_PROFILE),
  );
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const initials = useMemo(() => {
    const parts = String(profile?.name || "Rolebix User")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2);

    return parts.map((part) => part[0]?.toUpperCase()).join("");
  }, [profile?.name]);

  const updateField = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const cancelEditing = () => {
    setForm(toFormState(profile));
    setEditing(false);
  };

  const saveProfile = async (event) => {
    event.preventDefault();

    if (!form.name.trim()) {
      toast.error("Name is required.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          skills: splitList(form.skills),
          preferredJobTypes: splitList(
            form.preferredJobTypes,
          ),
          preferredLocations: splitList(
            form.preferredLocations,
          ),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.message || "Profile update failed.",
        );
      }

      const updatedProfile = {
        ...DEFAULT_PROFILE,
        ...(payload?.profile || {}),
      };

      setProfile(updatedProfile);
      setForm(toFormState(updatedProfile));
      setEditing(false);
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error(
        error?.message || "Could not update your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6">
      {errorMessage ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-2xl font-bold">
            {profile?.image ? (
              <img
                src={profile.image}
                alt={profile?.name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              initials || "RU"
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold capitalize text-white/55">
                {profile?.role || "seeker"}
              </span>

              <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                {readablePlan(profile?.plan)}
              </span>

              {profile?.openToWork ? (
                <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                  Open to work
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 truncate text-3xl font-bold tracking-tight sm:text-4xl">
              {profile?.name || "Rolebix User"}
            </h1>

            <p className="mt-2 text-sm text-white/55">
              {profile?.headline ||
                "Add a professional headline to your profile."}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/40">
              <span>{profile?.email || "No email"}</span>
              <span>{profile?.location || "Location not added"}</span>
              <span>
                Member since {formatDate(profile?.createdAt)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 gap-3">
            {editing ? (
              <>
                <button
                  type="button"
                  onClick={cancelEditing}
                  disabled={saving}
                  className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  form="profile-edit-form"
                  disabled={saving}
                  className="h-11 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="h-11 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>

      {editing ? (
        <form
          id="profile-edit-form"
          onSubmit={saveProfile}
          className="space-y-6"
        >
          <div className="rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-6">
            <h2 className="text-lg font-semibold">
              Basic Information
            </h2>
            <p className="mt-1 text-sm text-white/40">
              Update the information shown at the top of your profile.
            </p>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field
                label="Full name"
                name="name"
                value={form.name}
                onChange={updateField}
                placeholder="Your full name"
                required
              />

              <Field
                label="Professional headline"
                name="headline"
                value={form.headline}
                onChange={updateField}
                placeholder="Frontend Developer"
              />

              <Field
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={updateField}
                placeholder="+880..."
              />

              <Field
                label="Location"
                name="location"
                value={form.location}
                onChange={updateField}
                placeholder="Dhaka, Bangladesh"
              />

              <Field
                label="Profile image URL"
                name="image"
                type="url"
                value={form.image}
                onChange={updateField}
                placeholder="https://..."
              />

              <Field
                label="Experience level"
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={updateField}
                placeholder="Mid Level"
              />
            </div>

            <div className="mt-4">
              <TextAreaField
                label="About"
                name="bio"
                value={form.bio}
                onChange={updateField}
                placeholder="Write a short professional introduction..."
                rows={6}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-6">
            <h2 className="text-lg font-semibold">
              Career Information
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field
                label="Current position"
                name="currentPosition"
                value={form.currentPosition}
                onChange={updateField}
                placeholder="Software Engineer"
              />

              <Field
                label="Current company"
                name="currentCompany"
                value={form.currentCompany}
                onChange={updateField}
                placeholder="Company name"
              />

              <Field
                label="Education"
                name="education"
                value={form.education}
                onChange={updateField}
                placeholder="BSc in Computer Science"
              />

              <Field
                label="Skills"
                name="skills"
                value={form.skills}
                onChange={updateField}
                placeholder="React, Next.js, MongoDB"
              />

              <Field
                label="Preferred job types"
                name="preferredJobTypes"
                value={form.preferredJobTypes}
                onChange={updateField}
                placeholder="Full-time, Remote"
              />

              <Field
                label="Preferred locations"
                name="preferredLocations"
                value={form.preferredLocations}
                onChange={updateField}
                placeholder="Dhaka, Remote"
              />
            </div>

            <label className="mt-5 flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
              <input
                type="checkbox"
                name="openToWork"
                checked={form.openToWork}
                onChange={updateField}
                className="h-4 w-4 accent-blue-500"
              />

              <span>
                <span className="block text-sm font-semibold">
                  Open to work
                </span>
                <span className="mt-1 block text-xs text-white/40">
                  Show that you are currently looking for opportunities.
                </span>
              </span>
            </label>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-6">
            <h2 className="text-lg font-semibold">
              Links and Documents
            </h2>

            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <Field
                label="Website"
                name="website"
                type="url"
                value={form.website}
                onChange={updateField}
                placeholder="https://..."
              />

              <Field
                label="LinkedIn"
                name="linkedin"
                type="url"
                value={form.linkedin}
                onChange={updateField}
                placeholder="https://linkedin.com/in/..."
              />

              <Field
                label="GitHub"
                name="github"
                type="url"
                value={form.github}
                onChange={updateField}
                placeholder="https://github.com/..."
              />

              <Field
                label="Portfolio"
                name="portfolio"
                type="url"
                value={form.portfolio}
                onChange={updateField}
                placeholder="https://..."
              />

              <Field
                label="Resume URL"
                name="resumeUrl"
                type="url"
                value={form.resumeUrl}
                onChange={updateField}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={cancelEditing}
              disabled={saving}
              className="h-11 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="h-11 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-wait disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-6">
              <h2 className="text-lg font-semibold">About</h2>

              <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/55">
                {profile?.bio ||
                  "No professional summary has been added yet."}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-6">
              <h2 className="text-lg font-semibold">
                Career Information
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <InfoItem
                  label="Current position"
                  value={profile?.currentPosition}
                />
                <InfoItem
                  label="Current company"
                  value={profile?.currentCompany}
                />
                <InfoItem
                  label="Experience level"
                  value={profile?.experienceLevel}
                />
                <InfoItem
                  label="Education"
                  value={profile?.education}
                />
                <InfoItem
                  label="Phone"
                  value={profile?.phone}
                />
                <InfoItem
                  label="Location"
                  value={profile?.location}
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-5 sm:p-6">
              <h2 className="text-lg font-semibold">Skills</h2>
              <div className="mt-4">
                <TagList items={profile?.skills || []} />
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
              <h2 className="font-semibold">
                Job Preferences
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/35">
                    Preferred job types
                  </p>
                  <TagList
                    items={profile?.preferredJobTypes || []}
                  />
                </div>

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/35">
                    Preferred locations
                  </p>
                  <TagList
                    items={profile?.preferredLocations || []}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
              <h2 className="font-semibold">
                Links and Documents
              </h2>

              <div className="mt-4 space-y-3">
                <LinkItem
                  label="Website"
                  href={profile?.website}
                />
                <LinkItem
                  label="LinkedIn"
                  href={profile?.linkedin}
                />
                <LinkItem
                  label="GitHub"
                  href={profile?.github}
                />
                <LinkItem
                  label="Portfolio"
                  href={profile?.portfolio}
                />
                <LinkItem
                  label="Resume"
                  href={profile?.resumeUrl}
                />
              </div>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
};

export default ProfileClient;
