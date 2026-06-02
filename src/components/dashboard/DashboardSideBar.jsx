/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import {
  LayoutSideContentLeft,
  Bell,
  Briefcase,
  Envelope,
  Gear,
  House,
  Magnifier,
  Person,
} from "@gravity-ui/icons";

import { authClient } from "@/lib/auth-client";

/* Recruiter sidebar links */
const recruiterNavItems = [
  { icon: House, href: "/dashboard/recruiter", label: "Dashboard" },
  { icon: Briefcase, href: "/dashboard/recruiter/company", label: "My Company" },
  { icon: Bell, href: "/dashboard/recruiter/jobs/new", label: "Post A Job" },
  { icon: Magnifier, href: "/dashboard/recruiter/jobs", label: "Manage Jobs" },
  { icon: Envelope, href: "/dashboard/recruiter/applications", label: "Applications" },
  { icon: Person, href: "/dashboard/recruiter/profile", label: "Profile" },
  { icon: Gear, href: "/dashboard/recruiter/settings", label: "Settings" },
];

/* Job seeker sidebar links */
const seekerNavItems = [
  { icon: House, href: "/dashboard/seeker", label: "Dashboard" },
  { icon: Magnifier, href: "/jobs", label: "Browse Jobs" },
  { icon: Briefcase, href: "/dashboard/seeker/applications", label: "My Applications" },
  { icon: Bell, href: "/dashboard/seeker/saved-jobs", label: "Saved Jobs" },
  { icon: Person, href: "/dashboard/seeker/profile", label: "Profile" },
  { icon: Gear, href: "/dashboard/seeker/settings", label: "Settings" },
];

const DashboardSideBar = () => {
  const pathname = usePathname();

  /* Mobile sidebar open state */
  const [isOpen, setIsOpen] = useState(false);

  /* Session user state */
  const [user, setUser] = useState(null);

  /* Session loading state */
  const [isLoading, setIsLoading] = useState(true);

  /* Get session data */
  useEffect(() => {
    const getSessionData = async () => {
      try {
        const { data, error } = await authClient.getSession();

        // console.log("SIDEBAR SESSION DATA:", data);
        // console.log("SIDEBAR SESSION ERROR:", error);

        if (error) {
          setUser(null);
          return;
        }

        setUser(data?.user || null);
      } catch (error) {
        console.log("Sidebar session error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getSessionData();
  }, []);

  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed left-4 top-4 z-50 flex h-11 items-center gap-2 rounded-xl border border-white/10 bg-[#151515] px-4 text-sm font-medium text-white shadow-xl shadow-black/30 lg:hidden"
      >
        <LayoutSideContentLeft className="h-5 w-5" />
        Menu
      </button>

      {/* Desktop sidebar */}
      <aside className="hidden min-h-screen w-72 shrink-0 border-r border-white/10 bg-[#111111] text-white lg:block">
        <SidebarContent
          user={user}
          pathname={pathname}
          isLoading={isLoading}
        />
      </aside>

      {/* Mobile sidebar drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-60 lg:hidden">
          {/* Overlay */}
          <button
            type="button"
            aria-label="Close sidebar"
            onClick={closeSidebar}
            className="absolute inset-0 bg-black/70"
          />

          {/* Drawer */}
          <aside className="relative h-full w-80 max-w-[86vw] border-r border-white/10 bg-[#111111] text-white shadow-2xl shadow-black">
            <SidebarContent
              user={user}
              pathname={pathname}
              isLoading={isLoading}
              onNavigate={closeSidebar}
            />
          </aside>
        </div>
      )}
    </>
  );
};

const SidebarContent = ({ user, pathname, isLoading, onNavigate }) => {
  const userName = user?.name || "Guest User";
  const userEmail = user?.email || "";
  const userImage = user?.image || "";
  const userRole = user?.role || "seeker";

  const isRecruiter = userRole === "recruiter";

  const roleLabel = isRecruiter ? "Recruiter" : "Job Seeker";
  const accountLabel = isRecruiter ? "Recruiter Account" : "Seeker Account";
  const navItems = isRecruiter ? recruiterNavItems : seekerNavItems;

  return (
    <div className="flex h-full min-h-screen flex-col px-6 py-7">
      {/* Logo */}
      <Link href="/" onClick={onNavigate} className="inline-flex items-center">
        <Image
          src="/images/rolebix-logo.png"
          alt="Rolebix Logo"
          width={140}
          height={42}
          priority
          className="h-9 w-auto object-contain"
        />
      </Link>

      {/* User profile */}
      <div className="mt-10 flex items-center gap-4">
        {/* User image */}
        {userImage ? (
          <img
            src={userImage}
            alt={userName}
            className="h-11 w-11 rounded-full object-cover ring-2 ring-violet-400/30"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-violet-500/15 text-sm font-semibold text-white">
            {userName?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        {/* User info */}
        <div className="min-w-0">
          <h3 className="truncate text-base font-semibold text-white">
            {isLoading ? "Loading..." : userName}
          </h3>

          <p className="truncate text-sm text-white/45">
            {isLoading ? "Checking account..." : roleLabel}
          </p>

          {userEmail && (
            <p className="max-w-40 truncate text-xs text-white/30">
              {userEmail}
            </p>
          )}
        </div>
      </div>

      {/* Account badge */}
      <div className="mt-3 inline-flex w-fit rounded-md border border-white/25 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
        {accountLabel}
      </div>

      {/* Navigation */}
      <nav className="mt-16 flex flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`relative flex items-center gap-4 px-4 py-4 text-sm font-medium transition ${
                isActive
                  ? "bg-white/12 text-white"
                  : "text-white/45 hover:bg-white/6 hover:text-white"
              }`}
            >
              {/* Nav icon */}
              <Icon
                className={`h-5 w-5 ${
                  isActive ? "text-white" : "text-white/45"
                }`}
              />

              {/* Nav label */}
              <span>{item.label}</span>

              {/* Active indicator */}
              {isActive && (
                <span className="absolute right-0 top-0 h-full w-1 bg-white" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom text */}
      <div className="mt-auto border-t border-white/10 pt-5">
        <p className="text-xs leading-5 text-white/35">
          Rolebix {roleLabel.toLowerCase()} workspace.
          <br />
          {isRecruiter
            ? "Manage jobs, companies, and candidates."
            : "Track applications, saved jobs, and profile."}
        </p>
      </div>
    </div>
  );
};

export default DashboardSideBar;