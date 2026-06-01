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
} from "react-icons/fi";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

const initialFormData = {
  name: "",
  email: "",
  image: "",
  password: "",
  confirmPassword: "",
};

const SignUpPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imageError, setImageError] = useState(false);

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

  const validateForm = () => {
    const name = formData.name.trim();
    const email = formData.email.trim();
    const image = formData.image.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

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
      <div className="pointer-events-none absolute left-1/2 top-0 h-105 w-180 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />

      <section className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_460px]">
        {/* Left content */}
        <div className="hidden lg:block">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/55 transition hover:text-white"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          <div className="mt-12">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70">
              <CircleCheck className="h-4 w-4 text-violet-300" />
              Join Rolebix
            </div>

            <h1 className="max-w-xl text-5xl font-semibold tracking-tighter text-white lg:text-[70px] lg:leading-[0.98]">
              Create your career profile.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-white/55">
              Save jobs, apply faster, track your applications, and discover
              roles that match your skills.
            </p>
          </div>
        </div>

        {/* Form card */}
        <div className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
          <div className="mb-8 text-center">
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

            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Create account
            </h2>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              icon={<FiUser />}
              label="Name"
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

            <InputField
              icon={<FiImage />}
              label="Image URL"
              name="image"
              type="url"
              placeholder="https://example.com/avatar.png"
              value={formData.image}
              onChange={handleChange}
            />

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

            {imageError && (
              <p className="text-sm text-red-400">
                Image URL could not be loaded. Please use a valid direct image
                link.
              </p>
            )}

            <PasswordField
              label="Password"
              name="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={handleChange}
              isVisible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
            />

            <PasswordField
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Re-type your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              isVisible={showConfirmPassword}
              onToggle={() => setShowConfirmPassword((prev) => !prev)}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

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
      <span className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </span>

      <div className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 transition focus-within:border-violet-400/50 focus-within:bg-white/9">
        <FiLock className="h-4 w-4 shrink-0 text-white/35" />

        <input
          name={name}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />

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

export default SignUpPage;