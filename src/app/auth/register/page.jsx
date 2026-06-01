/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

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
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white sm:px-6 lg:px-8"
    >
      {/* Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.65 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.28),transparent_34%),linear-gradient(180deg,#181818_0%,#050505_55%,#000000_100%)]"
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.86 }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 0.85,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="pointer-events-none absolute left-1/2 top-0 h-105 w-180 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]"
      />

      <motion.div
        aria-hidden="true"
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute right-10 top-28 h-56 w-56 rounded-full bg-[#7C5CFF]/10 blur-[90px]"
      />

      <motion.section
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.12,
              delayChildren: 0.08,
            },
          },
        }}
        className="relative z-10 mx-auto grid min-h-[calc(100vh-80px)] max-w-6xl items-center gap-10 lg:grid-cols-[1fr_460px]"
      >
        {/* Left content */}
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              x: -32,
              filter: "blur(6px)",
            },
            visible: {
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
            },
          }}
          transition={{
            duration: 0.62,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="hidden lg:block"
        >
          <motion.div whileHover={{ x: -3 }} whileTap={{ scale: 0.98 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/55 transition hover:text-white"
            >
              <FiArrowLeft className="h-4 w-4" />
              Back to home
            </Link>
          </motion.div>

          <div className="mt-12">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                duration: 0.45,
                delay: 0.18,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -2, scale: 1.015 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/70"
            >
              <motion.span
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <CircleCheck className="h-4 w-4 text-violet-300" />
              </motion.span>
              Join Rolebix
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 28, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{
                duration: 0.6,
                delay: 0.25,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="max-w-xl text-5xl font-semibold tracking-tighter text-white lg:text-[70px] lg:leading-[0.98]"
            >
              Create your career profile.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.34,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-6 max-w-lg text-base leading-8 text-white/55"
            >
              Save jobs, apply faster, track your applications, and discover
              roles that match your skills.
            </motion.p>
          </div>
        </motion.div>

        {/* Form card */}
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              x: 34,
              y: 18,
              rotateX: 10,
              rotateY: -10,
              scale: 0.95,
              filter: "blur(8px)",
            },
            visible: {
              opacity: 1,
              x: 0,
              y: 0,
              rotateX: 0,
              rotateY: 0,
              scale: 1,
              filter: "blur(0px)",
            },
          }}
          transition={{
            duration: 0.72,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            y: -4,
            rotateX: 2,
            rotateY: -2,
            transition: {
              duration: 0.25,
              ease: "easeOut",
            },
          }}
          style={{
            transformPerspective: 1000,
            transformStyle: "preserve-3d",
          }}
          className="rounded-[32px] border border-white/10 bg-[#111111]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.08,
                },
              },
            }}
            className="mb-8 text-center"
          >
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14, scale: 0.96 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
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
            </motion.div>

            <motion.h2
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="text-3xl font-semibold tracking-tight text-white"
            >
              Create account
            </motion.h2>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 text-sm text-white/45"
            >
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="font-medium text-violet-300 transition hover:text-violet-200"
              >
                Sign in
              </Link>
            </motion.p>
          </motion.div>

          <motion.form
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.07,
                  delayChildren: 0.18,
                },
              },
            }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
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
              <motion.div
                initial={{ opacity: 0, y: 12, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 p-3"
              >
                <motion.img
                  src={formData.image}
                  alt="Profile preview"
                  onError={() => setImageError(true)}
                  whileHover={{ rotate: 3, scale: 1.05 }}
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
              </motion.div>
            )}

            {imageError && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-400"
              >
                Image URL could not be loaded. Please use a valid direct image
                link.
              </motion.p>
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

            <motion.button
              variants={{
                hidden: { opacity: 0, y: 16, scale: 0.96 },
                visible: { opacity: 1, y: 0, scale: 1 },
              }}
              transition={{
                duration: 0.42,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -2,
                scale: 1.015,
              }}
              whileTap={{
                scale: 0.97,
              }}
              type="submit"
              disabled={isLoading}
              className="mt-2 flex h-14 w-full items-center justify-center rounded-2xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? "Creating account..." : "Create account"}
            </motion.button>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 flex items-center justify-center"
          >
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth/signin"
                className="text-sm text-white/45 transition hover:text-white"
              >
                Go back to sign in
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
    </motion.main>
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
    <motion.label
      variants={{
        hidden: {
          opacity: 0,
          y: 16,
          scale: 0.98,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
        },
      }}
      transition={{
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="block"
    >
      <span className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </span>

      <motion.div
        whileHover={{
          y: -1,
          scale: 1.005,
        }}
        className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 transition focus-within:border-violet-400/50 focus-within:bg-white/9"
      >
        <motion.span
          whileHover={{
            rotate: 360,
            scale: 1.12,
          }}
          transition={{
            duration: 0.55,
            ease: "easeInOut",
          }}
          className="text-white/35 [&>svg]:h-4 [&>svg]:w-4"
        >
          {icon}
        </motion.span>

        <input
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />
      </motion.div>
    </motion.label>
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
    <motion.label
      variants={{
        hidden: {
          opacity: 0,
          y: 16,
          scale: 0.98,
        },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
        },
      }}
      transition={{
        duration: 0.42,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="block"
    >
      <span className="mb-2 block text-sm font-medium text-white/70">
        {label}
      </span>

      <motion.div
        whileHover={{
          y: -1,
          scale: 1.005,
        }}
        className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/6 px-4 transition focus-within:border-violet-400/50 focus-within:bg-white/9"
      >
        <motion.span
          whileHover={{
            rotate: 360,
            scale: 1.12,
          }}
          transition={{
            duration: 0.55,
            ease: "easeInOut",
          }}
        >
          <FiLock className="h-4 w-4 shrink-0 text-white/35" />
        </motion.span>

        <input
          name={name}
          type={isVisible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/30"
        />

        <motion.button
          whileHover={{
            scale: 1.12,
            rotate: isVisible ? -8 : 8,
          }}
          whileTap={{
            scale: 0.92,
          }}
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
        </motion.button>
      </motion.div>
    </motion.label>
  );
};

export default SignUpPage;