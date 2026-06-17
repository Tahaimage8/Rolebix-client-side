/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { toast } from "react-toastify";
import {
  FiChevronLeft,
  FiChevronRight,
  FiDownload,
  FiSearch,
  FiShield,
  FiTrendingUp,
  FiUserCheck,
  FiUserPlus,
  FiUsers,
} from "react-icons/fi";

import { updateUserRole } from "@/lib/actions/users";

const PAGE_SIZE = 4;

const roleOptions = ["seeker", "recruiter", "admin"];

const normalizeRole = (role) => {
  if (Array.isArray(role)) {
    return role[0]?.toLowerCase() || "seeker";
  }

  const normalized = String(role || "seeker").toLowerCase();

  if (normalized === "user") {
    return "seeker";
  }

  return normalized;
};

const getRoleLabel = (role) => {
  const normalized = normalizeRole(role);

  if (normalized === "admin") return "Admin";
  if (normalized === "recruiter") return "Recruiter";
  return "Seeker";
};

const getRoleStyles = (role) => {
  const normalized = normalizeRole(role);

  if (normalized === "admin") {
    return "border-violet-400/20 bg-violet-500/10 text-violet-200";
  }

  if (normalized === "recruiter") {
    return "border-sky-400/20 bg-sky-500/10 text-sky-200";
  }

  return "border-white/10 bg-white/6 text-white/65";
};

const getStatusStyles = (user) => {
  if (user?.banned) {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }

  return "border-green-500/20 bg-green-500/10 text-green-300";
};

const getUserInitials = (name = "", email = "") => {
  const base = name || email || "User";

  return base
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

const formatDate = (date) => {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

const isNewWithin24Hours = (date) => {
  if (!date) return false;

  const createdTime = new Date(date).getTime();
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  return now - createdTime <= oneDay;
};

const AdminUsersTable = ({ users = [], totalUsers = 0 }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [userList, setUserList] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingUserId, setUpdatingUserId] = useState("");
  const [updatingRole, setUpdatingRole] = useState("");

  const isUpdating = Boolean(updatingUserId) || isPending;

  useEffect(() => {
    setUserList(users);
  }, [users]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter]);

  const stats = useMemo(() => {
    const activeUsers = userList.filter((user) => !user?.banned).length;
    const recruiterUsers = userList.filter(
      (user) => normalizeRole(user?.role) === "recruiter",
    ).length;
    const suspendedUsers = userList.filter((user) => user?.banned).length;
    const newSignups = userList.filter((user) =>
      isNewWithin24Hours(user?.createdAt),
    ).length;

    return {
      activeUsers,
      recruiterUsers,
      suspendedUsers,
      newSignups,
    };
  }, [userList]);

  const filteredUsers = useMemo(() => {
    const sortedUsers = [...userList].sort((a, b) => {
      const firstDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
      const secondDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;

      return secondDate - firstDate;
    });

    return sortedUsers.filter((user) => {
      const search = searchTerm.toLowerCase().trim();
      const role = normalizeRole(user?.role);

      const matchesSearch =
        (user?.name || "").toLowerCase().includes(search) ||
        (user?.email || "").toLowerCase().includes(search);

      const matchesRole = roleFilter === "all" || role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [userList, searchTerm, roleFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PAGE_SIZE));

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;

    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage]);

  const fromCount =
    filteredUsers.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;

  const toCount = Math.min(currentPage * PAGE_SIZE, filteredUsers.length);

  const handleRoleChange = async (userId, nextRole) => {
    try {
      setUpdatingUserId(userId);
      setUpdatingRole(nextRole);

      const response = await updateUserRole(userId, nextRole);

      if (!response?.success) {
        toast.error(response?.message || "Failed to update user role.");
        return;
      }

      setUserList((currentUsers) =>
        currentUsers.map((user) => {
          if (user?.id !== userId) {
            return user;
          }

          return {
            ...user,
            role: nextRole,
            updatedAt: new Date().toISOString(),
          };
        }),
      );

      toast.success(`User role updated to ${getRoleLabel(nextRole)}.`, {
        autoClose: 2500,
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      toast.error(error?.message || "Failed to update user role.");
    } finally {
      setUpdatingUserId("");
      setUpdatingRole("");
    }
  };

  const handleExportUsers = () => {
    const csvHeader = ["Name", "Email", "Role", "Status", "Join Date"];

    const csvRows = filteredUsers.map((user) => [
      user?.name || "Unnamed User",
      user?.email || "No email",
      getRoleLabel(user?.role),
      user?.banned ? "Suspended" : "Active",
      formatDate(user?.createdAt),
    ]);

    const csvContent = [csvHeader, ...csvRows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "rolebix-users.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <section className="min-h-screen bg-[#151515] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Top bar */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
              Admin Workspace
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              User Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Review, filter, and manage platform access for all users.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />

              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                disabled={isUpdating}
                className="h-11 w-full rounded-xl border border-white/10 bg-white/6 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              disabled={isUpdating}
              className="h-11 rounded-xl border border-white/10 bg-[#1f1f1f] px-4 text-sm font-semibold text-white outline-none transition focus:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="all">All Roles</option>
              <option value="seeker">Seekers</option>
              <option value="recruiter">Recruiters</option>
              <option value="admin">Admins</option>
            </select>

            <Button
              type="button"
              onPress={handleExportUsers}
              className="h-11 rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              <FiDownload className="h-4 w-4" />
              Export List
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/6">
              <FiUsers className="h-5 w-5 text-white/60" />
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">
              Total Active Users
            </p>

            <h3 className="mt-2 text-3xl font-semibold text-white">
              {stats.activeUsers}
            </h3>

            <p className="mt-2 text-xs font-medium text-green-300">
              Active platform users
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-sky-400/20 bg-sky-500/10">
              <FiTrendingUp className="h-5 w-5 text-sky-200" />
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">
              Recruiters
            </p>

            <h3 className="mt-2 text-3xl font-semibold text-white">
              {stats.recruiterUsers}
            </h3>

            <p className="mt-2 text-xs font-medium text-sky-200">
              Hiring accounts
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-red-400/20 bg-red-500/10">
              <FiShield className="h-5 w-5 text-red-200" />
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">
              Suspended Accounts
            </p>

            <h3 className="mt-2 text-3xl font-semibold text-white">
              {stats.suspendedUsers}
            </h3>

            <p className="mt-2 text-xs font-medium text-red-200">
              Restricted users
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-500/10">
              <FiUserPlus className="h-5 w-5 text-yellow-200" />
            </div>

            <p className="text-xs font-medium uppercase tracking-[0.14em] text-white/35">
              New Signups 24h
            </p>

            <h3 className="mt-2 text-3xl font-semibold text-white">
              {stats.newSignups}
            </h3>

            <p className="mt-2 text-xs font-medium text-yellow-200">
              Recent registrations
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#1b1b1b] shadow-2xl shadow-black/20">
          {paginatedUsers.length === 0 ? (
            <div className="flex min-h-80 items-center justify-center p-8 text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                  <FiUsers className="h-6 w-6 text-white/45" />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-white">
                  No users found.
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  Try changing the search keyword or role filter.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04] text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      User Name
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Email Address
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Role
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Join Date
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Status
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((user) => {
                    const currentRole = normalizeRole(user?.role);
                    const availableActions = roleOptions.filter(
                      (role) => role !== currentRole,
                    );
                    const isCurrentUpdating = updatingUserId === user?.id;

                    return (
                      <tr
                        key={user?.id}
                        className={`border-b border-white/5 transition ${
                          isCurrentUpdating
                            ? "bg-violet-500/[0.04]"
                            : "hover:bg-white/[0.03]"
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {user?.image ? (
                              <img
                                src={user.image}
                                alt={user?.name || "User"}
                                className="h-10 w-10 rounded-full border border-white/10 bg-black object-cover"
                              />
                            ) : (
                              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/8 text-xs font-bold text-white/65">
                                {getUserInitials(user?.name, user?.email)}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-white">
                                {user?.name || "Unnamed User"}
                              </p>

                              <p className="mt-1 text-xs text-white/35">
                                ID: {user?.id?.slice(0, 8) || "N/A"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <p className="max-w-[260px] truncate text-sm text-white/60">
                            {user?.email || "No email"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getRoleStyles(
                              user?.role,
                            )}`}
                          >
                            <FiUserCheck className="h-3.5 w-3.5" />
                            {getRoleLabel(user?.role)}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-sm text-white/50">
                          {formatDate(user?.createdAt)}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                              user,
                            )}`}
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-current" />
                            {user?.banned ? "Suspended" : "Active"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {availableActions.map((role) => {
                              const isThisRoleUpdating =
                                isCurrentUpdating && updatingRole === role;

                              return (
                                <Button
                                  key={role}
                                  size="sm"
                                  isDisabled={isUpdating}
                                  isLoading={isThisRoleUpdating}
                                  onPress={() =>
                                    handleRoleChange(user?.id, role)
                                  }
                                  className={`h-9 rounded-lg border px-3 text-xs font-semibold transition disabled:opacity-50 ${
                                    role === "admin"
                                      ? "border-violet-400/20 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20"
                                      : role === "recruiter"
                                        ? "border-sky-400/20 bg-sky-500/10 text-sky-200 hover:bg-sky-500/20"
                                        : "border-white/10 bg-white/6 text-white/70 hover:bg-white/10"
                                  }`}
                                >
                                  {isThisRoleUpdating
                                    ? "Updating..."
                                    : `Make ${getRoleLabel(role)}`}
                                </Button>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer + pagination */}
          <div className="flex flex-col justify-between gap-4 border-t border-white/10 px-5 py-4 text-sm text-white/40 lg:flex-row lg:items-center">
            <p>
              Showing{" "}
              <span className="font-semibold text-white">{fromCount}</span> to{" "}
              <span className="font-semibold text-white">{toCount}</span> of{" "}
              <span className="font-semibold text-white">
                {filteredUsers.length}
              </span>{" "}
              users
              {totalUsers > filteredUsers.length && (
                <span className="text-white/25"> / {totalUsers} total</span>
              )}
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronLeft className="h-4 w-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, index) => {
                const page = index + 1;

                if (
                  totalPages > 5 &&
                  page !== 1 &&
                  page !== totalPages &&
                  Math.abs(page - currentPage) > 1
                ) {
                  if (page === 2 || page === totalPages - 1) {
                    return (
                      <span key={page} className="px-1 text-white/35">
                        ...
                      </span>
                    );
                  }

                  return null;
                }

                return (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-white text-black"
                        : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/60 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FiChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminUsersTable;