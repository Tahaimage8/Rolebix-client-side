/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { CircleCheck } from "@gravity-ui/icons";
import {
  FiUser,
  FiMail,
  FiImage,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiBriefcase,
  FiUsers,
} from "react-icons/fi";

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

/* Initial form data */
const initialFormData = {
  name: "",
  email: "",
  image: "",
  password: "",
  confirmPassword: "",
  role: "seeker",
};

const SignUpPage = () => {
  const router = useRouter();

  /* Form state */
  const [formData, setFormData] = useState(initialFormData);

  /* Loading state */
  const [isLoading, setIsLoading] = useState(false);

  /* Password visibility states */
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  /* Image preview error state */
  const [imageError, setImageError] = useState(false);

  /* Input change handler */
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "image") {
      setImageError(false);
    }
  };

  /* Role change handler */
  const handleRoleChange = (role) => {
    setFormData((prev) => ({
      ...prev,
      role,
    }));
  };

  /* Form validation */
  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const image = formData.image.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;
    const role = formData.role;

    if (!name) {
      toast.error("Name is required.");
      return false;
    }

    if (!email) {
      toast.error("Email is required.");
      return false;
    }

    if (!email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return false;
    }

    if (!image) {
      toast.error("Image URL is required.");
      return false;
    }

    if (!role) {
      toast.error("Please select your role.");
      return false;
    }

    if (!password) {
      toast.error("Password is required.");
      return false;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match.");
      return false;
    }

    return true;
  };

  /* Submit handler */
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const { data, error } = await authClient.signUp.email({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        image: formData.image.trim(),
        role: formData.role,
        callbackURL: "/",
      });

      if (error) {
        toast.error(error.message || "Signup failed. Please try again.");
        return;
      }

      toast.success("Account created successfully.");

      setFormData(initialFormData);

      setTimeout(() => {
        router.push("/auth/signin");
      }, 900);
    } catch (error) {
      toast.error(error?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.28),transparent_34%),linear-gradient(180deg,#181818_0%,#050505_55%,#000000_100%)]" />

      {/* Background glow shape */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-105 w-180 -translate-x-1/2 rounded-full bg-violet-600/15" />

      {/* Background small glow shape */}
      <div className="pointer-events-none absolute right-10 top-28 h-56 w-56 rounded-full bg-[#7C5CFF]/10" />

      {/* Main layout */}
      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_460px]">
        {/* Left content */}
        <div className="hidden lg:block">
          {/* Back to home link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/55 transition hover:text-white"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {/* Left heading area */}
          <div className="mt-12">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">
              <CircleCheck className="h-4 w-4 text-violet-300" />
              Join Rolebix
            </div>

            {/* Main heading */}
            <h1 className="max-w-xl text-5xl font-semibold tracking-tighter text-white lg:text-[70px] lg:leading-[0.98]">
              Create your career profile.
            </h1>

            {/* Main description */}
            <p className="mt-6 max-w-lg text-base leading-8 text-white/55">
              Save jobs, apply faster, track your applications, and discover
              roles that match your skills.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-6 shadow-2xl shadow-black/50 sm:p-8">
          {/* Form header */}
          <div className="mb-8 text-center">
            {/* Logo */}
            <Link href="/" className="mb-6 inline-flex justify-center">
              <Image
                src="/images/rolebix-logo.png"
                alt="Rolebix Logo"
                width={140}
                height={42}
                priority
                className="h-9 w-auto object-contain"
              />
            </Link>

            {/* Form title */}
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Create account
            </h2>

            {/* Sign in link */}
            <p className="mt-2 text-sm text-white/45">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-violet-300 transition hover:text-violet-200"
              >
                Sign in
              </Link>
            </p>
          </div>

          {/* Registration form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field */}
            <InputField
              icon={<FiUser />}
              label="Name"
              name="name"
              type="text"
              placeholder="Your full name"
              value={formData.name}
              onChange={handleChange}
            />

            {/* Email field */}
            <InputField
              icon={<FiMail />}
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            {/* Image URL field */}
            <InputField
              icon={<FiImage />}
              label="Image URL"
              name="image"
              type="url"
              placeholder="https://example.com/avatar.png"
              value={formData.image}
              onChange={handleChange}
            />

            {/* Image preview */}
            {formData.image && !imageError && (
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 p-3">
                <img
                  src={formData.image}
                  alt="Profile preview"
                  onError={() => setImageError(true)}
                  className="h-12 w-12 rounded-full object-cover"
                />

                <div>
                  <p className="text-sm font-medium text-white">
                    Image preview
                  </p>
                  <p className="text-xs text-white/40">
                    This photo will be saved to your profile.
                  </p>
                </div>
              </div>
            )}

            {/* Image error message */}
            {imageError && (
              <p className="text-sm text-red-400">
                Image URL could not be loaded. Please use a valid direct image
                link.
              </p>
            )}

            {/* Password field */}
            <PasswordField
              label="Password"
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              isVisible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
            />

            {/* Confirm password field */}
            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-type your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              isVisible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
            />

            {/* Role selection */}
            <RoleSelector value={formData.role} onChange={handleRoleChange} />

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          {/* Bottom sign in link */}
          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/auth/signin"
              className="text-sm text-white/45 transition hover:text-white"
            >
              Go back to sign in
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

/* Reusable input field */
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
      {/* Field label */}
      <span className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </span>

      {/* Field input wrapper */}
      <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 transition focus-within:border-violet-400/50 focus-within:bg-white/9">
        {/* Field icon */}
        <span className="text-white/35 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>

        {/* Field input */}
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

/* Reusable password field */
const PasswordField = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  isVisible,
  onToggle,
}) => {
  return (
    <label className="block">
      {/* Password label */}
      <span className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </span>

      {/* Password input wrapper */}
      <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 transition focus-within:border-violet-400/50 focus-within:bg-white/9">
        {/* Password icon */}
        <FiLock className="h-4 w-4 shrink-0 text-white/35" />

        {/* Password input */}
        <input
          name={name}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />

        {/* Password show/hide button */}
        <button
          type="button"
          onClick={onToggle}
          className="text-white/40 transition hover:text-white"
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? (
            <FiEyeOff className="h-4 w-4" />
          ) : (
            <FiEye className="h-4 w-4" />
          )}
        </button>
      </div>
    </label>
  );
};

/* Role selector */
const RoleSelector = ({ value, onChange }) => {
  const roles = [
    {
      value: "seeker",
      label: "Job Seeker",
      Icon: FiUsers,
    },
    {
      value: "recruiter",
      label: "Recruiter",
      Icon: FiBriefcase,
    },
  ];

  return (
    <div className="space-y-3">
      {/* Role selector label */}
      <p className="text-sm font-medium text-white/70">I&apos;m joining as</p>

      {/* Hidden role input */}
      <input type="hidden" name="role" value={value} />

      {/* Role buttons */}
      <div className="grid grid-cols-2 gap-3">
        {roles.map((role) => {
          const Icon = role.Icon;
          const isSelected = value === role.value;

          return (
            <button
              key={role.value}
              type="button"
              onClick={() => onChange(role.value)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition ${
                isSelected
                  ? "border-violet-400/60 bg-violet-500/15 text-white"
                  : "border-white/10 bg-white/6 text-white/55 hover:border-white/20 hover:text-white"
              }`}
            >
              {/* Role icon */}
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl border transition ${
                  isSelected
                    ? "border-violet-300/50 bg-violet-500/20 text-violet-200"
                    : "border-white/10 bg-black/20 text-white/40"
                }`}
              >
                <Icon className="h-4 w-4" />
              </span>

              {/* Role name */}
              <span className="text-sm font-semibold">{role.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SignUpPage;