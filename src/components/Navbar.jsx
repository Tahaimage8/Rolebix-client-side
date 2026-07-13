/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { authClient } from "@/lib/auth-client";

const baseNavLinks = [
  {
    label: "Browse Jobs",
    href: "/jobs",
  },
  {
    label: "Company",
    href: "/companies",
  },
  {
    label: "Pricing",
    href: "/pricing",
  },
];

const dashboardLinks = {
  seeker: "/dashboard/seeker",
  recruiter: "/dashboard/recruiter",
  admin: "/dashboard/admin",
};

const Navbar = () => {
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [session, setSession] = useState(null);
  const [isPending, setIsPending] = useState(true);
  const [sessionError, setSessionError] = useState("");

  const user = session?.user;
  const role = user?.role;
  const dashboardHref = dashboardLinks[role || "seeker"] || dashboardLinks.seeker;

  const navLinks = user?.email
    ? [
        ...baseNavLinks,
        {
          label: "Dashboard",
          href: dashboardHref,
        },
      ]
    : baseNavLinks;

  const loadSession = async () => {
    try {
      setIsPending(true);
      setSessionError("");

      const { data, error } = await authClient.getSession({
        query: {
          disableCookieCache: true,
        },
      });

      if (error) {
        setSession(null);
        setSessionError(error.message || "Session check failed");
        return;
      }

      setSession(data || null);
    } catch (error) {
      console.log("SESSION CATCH ERROR:", error);
      setSession(null);
      setSessionError(error?.message || "Session server error");
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            setSession(null);
            setIsDropdownOpen(false);
            window.location.href = "/auth/signin";
          },
        },
      });
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#181818]/85 backdrop-blur-xl"
    >
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45, delay: 0.08 }}
        className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8"
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link href="/" className="flex items-center">
            <img
              src="/images/rolebix-logo.png"
              alt="Rolebix Logo"
              width={130}
              height={40}
              className="h-8 w-auto object-contain"
            />
          </Link>
        </motion.div>

        <div className="hidden items-center justify-end gap-7 md:flex">
          <motion.ul
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.06,
                },
              },
            }}
            className="flex items-center gap-8"
          >
            {navLinks.map((link) => (
              <motion.li
                key={link.href}
                variants={{
                  hidden: { opacity: 0, y: -8 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive(link.href)
                      ? "text-white"
                      : "text-white/65 hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>

          <span className="h-6 w-px bg-white/15" aria-hidden="true" />

          <div className="relative flex items-center gap-5">
            {isPending ? (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-white/45"
              >
                Checking...
              </motion.span>
            ) : user ? (
              <>
                <motion.button
                  whileHover={{ y: -1, scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/4 px-3 py-2 transition hover:bg-white/8"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}

                  <div className="text-left">
                    <p className="max-w-30 truncate text-sm font-semibold text-white">
                      {user.name || "User"}
                    </p>
                    <p className="max-w-35 truncate text-xs text-white/45">
                      {user.email}
                    </p>
                  </div>

                  <motion.svg
                    animate={{ rotate: isDropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="h-4 w-4 text-white/45 transition"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </motion.svg>
                </motion.button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute right-0 top-14 w-72 rounded-3xl border border-white/10 bg-[#111111] p-3 shadow-2xl shadow-black/50"
                    >
                      <div className="flex items-center gap-3 rounded-2xl bg-white/4 p-3">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="h-11 w-11 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-white">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                          </div>
                        )}

                        <div>
                          <p className="text-sm font-semibold text-white">
                            {user.name || "User"}
                          </p>
                          <p className="max-w-45 truncate text-xs text-white/45">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                          hidden: {},
                          visible: {
                            transition: {
                              staggerChildren: 0.04,
                            },
                          },
                        }}
                        className="mt-3 space-y-1"
                      >
                        <motion.div
                          variants={{
                            hidden: { opacity: 0, x: -6 },
                            visible: { opacity: 1, x: 0 },
                          }}
                        >
                          <Link
                            href={dashboardHref}
                            className="block rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/6 hover:text-white"
                          >
                            Dashboard
                          </Link>
                        </motion.div>

                        <motion.div
                          variants={{
                            hidden: { opacity: 0, x: -6 },
                            visible: { opacity: 1, x: 0 },
                          }}
                        >
                          <Link
                            href="/profile"
                            className="block rounded-xl px-4 py-3 text-sm text-white/70 transition hover:bg-white/6 hover:text-white"
                          >
                            My Profile
                          </Link>
                        </motion.div>

                        <motion.div
                          variants={{
                            hidden: { opacity: 0, x: -6 },
                            visible: { opacity: 1, x: 0 },
                          }}
                        >

                        </motion.div>

                        <motion.button
                          variants={{
                            hidden: { opacity: 0, x: -6 },
                            visible: { opacity: 1, x: 0 },
                          }}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.98 }}
                          type="button"
                          onClick={handleLogout}
                          disabled={isLoggingOut}
                          className="mt-2 flex w-full items-center justify-center rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isLoggingOut ? "Logging out..." : "Logout"}
                        </motion.button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                {sessionError && (
                  <motion.button
                    whileHover={{ y: -1, scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={loadSession}
                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300"
                  >
                    Retry Session
                  </motion.button>
                )}

                <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href="/auth/signin"
                    className="text-sm font-medium text-[#8B7CFF] transition-colors hover:text-white"
                  >
                    Sign In
                  </Link>
                </motion.div>

                <motion.div
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href="/auth/register"
                    className="rounded-xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.02] hover:shadow-violet-500/40"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.94 }}
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 md:hidden"
        >
          {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </motion.button>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.section
            initial={{ opacity: 0, height: 0, y: -8 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="border-t border-white/10 bg-[#101010] px-4 py-5 md:hidden"
          >
            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                  },
                },
              }}
              className="mx-auto flex max-w-7xl flex-col gap-2"
            >
              {navLinks.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <Link
                    href={link.href}
                    className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                      isActive(link.href)
                        ? "bg-white/10 text-white"
                        : "text-white/70 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.05,
                    delayChildren: 0.08,
                  },
                },
              }}
              className="mx-auto mt-4 flex max-w-7xl flex-col gap-3 border-t border-white/10 pt-4"
            >
              {isPending ? (
                <motion.span
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    visible: { opacity: 1, x: 0 },
                  }}
                  className="rounded-xl px-4 py-3 text-sm text-white/45"
                >
                  Checking...
                </motion.span>
              ) : user ? (
                <>
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    className="flex items-center gap-3 rounded-xl bg-white/4 p-3"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/20 text-sm font-semibold text-white">
                        {user.name?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user.name || "User"}
                      </p>
                      <p className="text-xs text-white/45">{user.email}</p>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href={dashboardHref}
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
                    >
                      Dashboard
                    </Link>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href="/profile"
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
                    >
                      My Profile
                    </Link>
                  </motion.div>

                  <motion.button
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoggingOut ? "Logging out..." : "Logout"}
                  </motion.button>
                </>
              ) : (
                <>
                  {sessionError && (
                    <motion.button
                      variants={{
                        hidden: { opacity: 0, x: -8 },
                        visible: { opacity: 1, x: 0 },
                      }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={loadSession}
                      className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300"
                    >
                      Retry Session
                    </motion.button>
                  )}

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      visible: { opacity: 1, x: 0 },
                    }}
                  >
                    <Link
                      href="/auth/signin"
                      className="block rounded-xl px-4 py-3 text-sm font-medium text-[#8B7CFF] transition hover:bg-white/5 hover:text-white"
                    >
                      Sign In
                    </Link>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      visible: { opacity: 1, x: 0 },
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      href="/auth/register"
                      className="block rounded-xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:scale-[1.01]"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

const MenuIcon = () => {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
};

const CloseIcon = () => {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
};

export default Navbar;