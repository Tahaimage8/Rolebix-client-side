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

/* NAV */
const navItemsByRole = {
  seeker: [
    { icon: House, href: "/dashboard/seeker", label: "Dashboard", exact: true },
    { icon: Magnifier, href: "/jobs", label: "Jobs" },
    { icon: Briefcase, href: "/dashboard/seeker/applications", label: "Applications" },
    { icon: Bell, href: "/dashboard/seeker/saved-jobs", label: "Saved Jobs" },
    { icon: Person, href: "/dashboard/seeker/profile", label: "Profile" },
    { icon: Gear, href: "/dashboard/seeker/settings", label: "Settings" },
  ],

  recruiter: [
    { icon: House, href: "/dashboard/recruiter", label: "Dashboard", exact: true },

    // 🔥 FIX 1 (added exact)
    { icon: Briefcase, href: "/dashboard/recruiter/company", label: "My Company", exact: true },

    // 🔥 FIX 2 (added exact to prevent overlap)
    { icon: Bell, href: "/dashboard/recruiter/jobs/new", label: "Post A Job", exact: true },

    // 🔥 FIX 3 (added exact to prevent overlap bug)
    { icon: Magnifier, href: "/dashboard/recruiter/jobs", label: "Manage Jobs", exact: true },

    { icon: Envelope, href: "/dashboard/recruiter/applications", label: "Applications" },
    { icon: Person, href: "/dashboard/recruiter/profile", label: "Profile" },
    { icon: Gear, href: "/dashboard/recruiter/settings", label: "Settings" },
  ],

  admin: [
    { icon: House, href: "/dashboard/admin", label: "Dashboard", exact: true },
    { icon: Person, href: "/dashboard/admin/users", label: "Users" },
    { icon: Briefcase, href: "/dashboard/admin/companies", label: "Companies" },
    { icon: Bell, href: "/dashboard/admin/jobs", label: "Jobs" },
    { icon: Envelope, href: "/dashboard/admin/payments", label: "Payments" },
    { icon: Gear, href: "/dashboard/admin/settings", label: "Settings" },
  ],
};

export default function DashboardSidebar() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data } = await authClient.getSession();
      setUser(data?.user || null);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <>
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={() => setOpen(true)}
        className="fixed left-3 top-3 z-50 flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-[#151515] px-3 text-sm text-white lg:hidden"
      >
        <LayoutSideContentLeft className="h-4 w-4" />
        Menu
      </button>

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex h-screen w-72 flex-col border-r border-white/10 bg-[#111] text-white">
        <SidebarContent user={user} pathname={pathname} loading={loading} />
      </aside>

      {/* MOBILE OVERLAY */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/70"
          />

          <aside className="relative h-full w-72 bg-[#111] text-white flex flex-col">
            <SidebarContent
              user={user}
              pathname={pathname}
              loading={loading}
              onNavigate={() => setOpen(false)}
            />
          </aside>
        </div>
      )}
    </>
  );
}

/* ================= SIDEBAR ================= */

function SidebarContent({ user, pathname, loading, onNavigate }) {
  const role = user?.role || "seeker";
  const navItems = navItemsByRole[role] || [];

  const roleBadge = {
    seeker: "text-sky-300 bg-sky-500/10 border-sky-400/20",
    recruiter: "text-green-300 bg-green-500/10 border-green-400/20",
    admin: "text-purple-300 bg-purple-500/10 border-purple-400/20",
  };

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/auth/signin";
  };

  return (
    <div className="flex h-full flex-col px-5 py-6">

      {/* LOGO */}
      <Link href="/" onClick={onNavigate}>
        <Image
          src="/images/rolebix-logo.png"
          width={130}
          height={35}
          alt="logo"
        />
      </Link>

      {/* USER */}
      <div className="mt-8 flex items-center gap-3">

        {user?.image ? (
          <img
            src={user.image}
            className="h-9 w-9 rounded-full object-cover border border-white/20"
            alt="avatar"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-sm">
            {user?.name?.charAt(0) || "U"}
          </div>
        )}

        <div className="min-w-0">
          <p className="text-sm font-medium truncate">
            {loading ? "Loading..." : user?.name}
          </p>

          <span
            className={`text-[10px] px-2 py-[2px] rounded border inline-block mt-1 ${roleBadge[role]}`}
          >
            {role.toUpperCase()}
          </span>
        </div>
      </div>

      {/* NAV */}
      <nav className="mt-10 flex flex-col gap-1 flex-1 overflow-auto">
        {navItems.map((item) => {
          const Icon = item.icon;

          /* unchanged logic */
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-white/10 text-white"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-white/10 pt-3 mt-3">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300 hover:bg-red-500/20 transition"
        >
          Logout
        </button>
      </div>

    </div>
  );
}