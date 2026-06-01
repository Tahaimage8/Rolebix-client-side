/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

import CircleCheck from "@gravity-ui/icons/CircleCheck";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";

import { authClient } from "@/lib/auth-client";

const initialFormData = {
  email: "",
  password: "",
};

const SignInPage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [alert, setAlert] = useState({
    type: "",
    message: "",
  });

  const showAlert = (type, message) => {
    setAlert({
      type,
      message,
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password;

    if (!email) {
      showAlert("error", "Email is required.");
      return false;
    }

    if (!email.includes("@")) {
      showAlert("error", "Please enter a valid email address.");
      return false;
    }

    if (!password) {
      showAlert("error", "Password is required.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setAlert({
      type: "",
      message: "",
    });

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const { data, error } = await authClient.signIn.email({
        email: formData.email.trim(),
        password: formData.password,
        // callbackURL: "/",
      });

      if (error) {
        showAlert("error", error.message || "Sign in failed. Please try again.");
        return;
      }

     if (data) {
  showAlert("success", "Signed in successfully. Redirecting...");

  setFormData(initialFormData);

  setTimeout(() => {
    window.location.href = "/";
  }, 900);
}
    } catch (error) {
      showAlert("error", error?.message || "Something went wrong.");
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
              Welcome Back
            </div>

            <h1 className="max-w-xl text-5xl font-semibold tracking-tighter text-white lg:text-[70px] lg:leading-[0.98]">
              Continue your career journey.
            </h1>

            <p className="mt-6 max-w-lg text-base leading-8 text-white/55">
              Sign in to apply faster, manage saved jobs, track applications,
              and access your Rolebix dashboard.
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
              Sign in
            </h2>

            <p className="mt-2 text-sm text-white/45">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-violet-300 transition hover:text-violet-200"
              >
                Create account
              </Link>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              icon={<FiMail />}
              label="Email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />

            <PasswordField
              label="Password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              isVisible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
            />

            <div className="flex items-center justify-end">
              <Link
                href="/forgot-password"
                className="text-sm text-white/45 transition hover:text-violet-300"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>

            {alert.message && (
              <div
                role="alert"
                className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
                  alert.type === "success"
                    ? "border-green-500/20 bg-green-500/10 text-green-300"
                    : "border-red-500/20 bg-red-500/10 text-red-300"
                }`}
              >
                {alert.type === "success" ? (
                  <FiCheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                ) : (
                  <FiAlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                )}

                <p>{alert.message}</p>
              </div>
            )}
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Link
              href="/auth/register"
              className="text-sm text-white/45 transition hover:text-white"
            >
              Go back to create account
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

export default SignInPage;