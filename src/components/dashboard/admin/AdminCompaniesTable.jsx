/* eslint-disable @next/next/no-img-element */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { toast } from "react-toastify";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiChevronDown,
  FiFilter,
  FiSearch,
  FiXCircle,
} from "react-icons/fi";

import { updateCompany } from "@/lib/actions/companies";

/* Helper: support MongoDB _id string/object */
const getCompanyId = (company) => {
  if (typeof company?._id === "string") return company._id;
  if (company?._id?.$oid) return company._id.$oid;
  return company?.id || "";
};

/* Helper: normalize status */
const getNormalizedStatus = (status) => {
  return status?.toLowerCase().trim() || "pending";
};

/* Helper: status label */
const getStatusLabel = (status) => {
  const normalized = getNormalizedStatus(status);

  if (normalized === "approved") return "Approved";
  if (normalized === "rejected") return "Rejected";
  return "Pending";
};

/* Helper: status chip styles */
const getStatusStyles = (status) => {
  const normalized = getNormalizedStatus(status);

  if (normalized === "approved") {
    return "border-green-500/20 bg-green-500/10 text-green-300";
  }

  if (normalized === "rejected") {
    return "border-red-500/20 bg-red-500/10 text-red-300";
  }

  return "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";
};

/* Helper: date format */
const formatDate = (date) => {
  if (!date) return "Not available";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(date));
};

/* Helper: logo fallback */
const getCompanyInitials = (name = "") => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

/* Status filter options */
const statusFilterOptions = [
  { id: "all", label: "All Status" },
  { id: "pending", label: "Pending" },
  { id: "approved", label: "Approved" },
  { id: "rejected", label: "Rejected" },
];

const AdminCompaniesTable = ({ companies = [] }) => {
  const router = useRouter();

  const [companyList, setCompanyList] = useState(companies);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [updatingCompanyId, setUpdatingCompanyId] = useState("");
  const [updatingAction, setUpdatingAction] = useState("");

  const isUpdating = Boolean(updatingCompanyId);

  const activeStatusFilterLabel =
    statusFilterOptions.find((option) => option.id === statusFilter)?.label ||
    "Filter";

  const filteredCompanies = useMemo(() => {
    return companyList.filter((company) => {
      const search = searchTerm.toLowerCase().trim();
      const status = getNormalizedStatus(company.status);

      const matchesSearch =
        (company?.name || "").toLowerCase().includes(search) ||
        (company?.websiteUrl || "").toLowerCase().includes(search) ||
        (company?.industryLabel || "").toLowerCase().includes(search) ||
        (company?.location || "").toLowerCase().includes(search);

      const matchesStatus = statusFilter === "all" || status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [companyList, searchTerm, statusFilter]);

  const updateTableStatus = (companyId, nextStatus) => {
    setCompanyList((currentCompanies) =>
      currentCompanies.map((company) => {
        const currentCompanyId = getCompanyId(company);

        if (currentCompanyId !== companyId) {
          return company;
        }

        return {
          ...company,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      }),
    );
  };

  const handleUpdateStatus = async (companyId, nextStatus) => {
    try {
      setUpdatingCompanyId(companyId);
      setUpdatingAction(nextStatus);

      const result = await updateCompany(companyId, {
        status: nextStatus,
      });

      if (!result) {
        toast.error("Company status update failed.");
        return;
      }

      if (result?.matchedCount === 0) {
        toast.error("Company not found.");
        return;
      }

      if (result?.acknowledged !== true) {
        toast.error(result?.message || "Company status update failed.");
        return;
      }

      updateTableStatus(companyId, nextStatus);

      if (nextStatus === "approved") {
        toast.success("Company approved successfully.", {
          autoClose: 2500,
        });
      }

      if (nextStatus === "rejected") {
        toast.success("Company rejected successfully.", {
          autoClose: 2500,
        });
      }

      setTimeout(() => {
        router.refresh();
      }, 300);
    } catch (error) {
      toast.error(error?.message || "Failed to update company status.");
    } finally {
      setUpdatingCompanyId("");
      setUpdatingAction("");
    }
  };

  const handleApprove = async (companyId) => {
    await handleUpdateStatus(companyId, "approved");
  };

  const handleReject = async (companyId) => {
    await handleUpdateStatus(companyId, "rejected");
  };

  return (
    <section className="min-h-screen bg-[#151515] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-violet-200">
              Admin Workspace
            </p>

            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Company Registrations
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/45">
              Review and manage recruiter company approval requests for the
              Rolebix ecosystem.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Status Filter Dropdown */}
            <div className="relative">
              <Button
                type="button"
                isDisabled={isUpdating}
                onPress={() => setIsFilterOpen((prev) => !prev)}
                className="h-11 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FiFilter className="h-4 w-4" />
                {activeStatusFilterLabel}
                <FiChevronDown
                  className={`h-4 w-4 transition ${
                    isFilterOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {isFilterOpen && (
                <div className="absolute right-0 z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#1b1b1b] p-2 shadow-2xl shadow-black/40">
                  {statusFilterOptions.map((option) => {
                    const isActive = statusFilter === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => {
                          setStatusFilter(option.id);
                          setIsFilterOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm transition ${
                          isActive
                            ? "bg-violet-500/15 text-violet-200"
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>{option.label}</span>

                        {isActive && (
                          <span className="h-2 w-2 rounded-full bg-violet-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Wait state */}
        {isUpdating && (
          <div className="mb-5 rounded-2xl border border-violet-400/20 bg-violet-500/10 px-4 py-3 text-sm text-violet-200">
            Please wait, updating company status...
          </div>
        )}

        {/* Search + Stats */}
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="relative w-full md:max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35" />

            <input
              type="text"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              disabled={isUpdating}
              className="h-11 w-full rounded-xl border border-white/10 bg-white/6 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-violet-400/50 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm text-white/40">
            <span>
              Total companies:{" "}
              <span className="font-semibold text-white">
                {companyList.length}
              </span>
            </span>

            <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:block" />

            <span>
              Showing:{" "}
              <span className="font-semibold text-white">
                {filteredCompanies.length}
              </span>
            </span>
          </div>
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#1b1b1b] shadow-2xl shadow-black/20">
          {filteredCompanies.length === 0 ? (
            <div className="flex min-h-80 items-center justify-center p-8 text-center">
              <div>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                  <FiAlertCircle className="h-6 w-6 text-white/45" />
                </div>

                <h2 className="mt-5 text-xl font-semibold text-white">
                  No company registrations found.
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  Try changing the status filter or search keyword.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03] text-left">
                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Company
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Industry
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Jobs
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Location
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Size
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Status
                    </th>

                    <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Updated
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-white/35">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCompanies.map((company) => {
                    const companyId = getCompanyId(company);
                    const status = getNormalizedStatus(company.status);
                    const isCurrentUpdating = updatingCompanyId === companyId;

                    return (
                      <tr
                        key={companyId}
                        className={`border-b border-white/5 transition ${
                          isCurrentUpdating
                            ? "bg-violet-500/[0.04]"
                            : "hover:bg-white/[0.03]"
                        }`}
                      >
                        {/* Company */}
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {company?.logoUrl ? (
                              <img
                                src={company.logoUrl}
                                alt={company.name}
                                className="h-11 w-11 rounded-xl border border-white/10 bg-black object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/6 text-xs font-bold text-white/60">
                                {getCompanyInitials(company?.name)}
                              </div>
                            )}

                            <div>
                              <p className="font-semibold text-white">
                                {company?.name || "Unnamed Company"}
                              </p>

                              <a
                                href={company?.websiteUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1 block max-w-[220px] truncate text-xs text-white/40 transition hover:text-violet-300"
                              >
                                {company?.websiteUrl || "No website"}
                              </a>
                            </div>
                          </div>
                        </td>

                        {/* Industry */}
                        <td className="px-5 py-4">
                          <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/65">
                            {company?.industryLabel ||
                              company?.industry ||
                              "Not set"}
                          </span>
                        </td>

                        {/* Jobs */}
                        <td className="px-5 py-4">
                          <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium text-white/65">
                            {company?.jobCount ?? 0}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="px-5 py-4 text-sm text-white/60">
                          {company?.location || "Not set"}
                        </td>

                        {/* Size */}
                        <td className="px-5 py-4 text-sm text-white/60">
                          {company?.employeeCountLabel ||
                            company?.employeeCount ||
                            "Not set"}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusStyles(
                              company.status,
                            )}`}
                          >
                            {status === "approved" ? (
                              <FiCheckCircle className="h-4 w-4" />
                            ) : status === "rejected" ? (
                              <FiXCircle className="h-4 w-4" />
                            ) : (
                              <FiAlertCircle className="h-4 w-4" />
                            )}

                            {getStatusLabel(company.status)}
                          </span>
                        </td>

                        {/* Updated date */}
                        <td className="px-5 py-4 text-sm text-white/50">
                          {formatDate(company?.updatedAt)}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {status !== "approved" && (
                              <Button
                                size="sm"
                                isDisabled={isUpdating}
                                isLoading={
                                  isCurrentUpdating &&
                                  updatingAction === "approved"
                                }
                                onPress={() => handleApprove(companyId)}
                                className="h-9 rounded-lg border border-green-500/20 bg-green-500/10 px-3 text-xs font-semibold text-green-300 transition hover:bg-green-500/20 disabled:opacity-50"
                              >
                                {isCurrentUpdating &&
                                updatingAction === "approved"
                                  ? "Approving..."
                                  : "Approve"}
                              </Button>
                            )}

                            {status !== "rejected" && (
                              <Button
                                size="sm"
                                isDisabled={isUpdating}
                                isLoading={
                                  isCurrentUpdating &&
                                  updatingAction === "rejected"
                                }
                                onPress={() => handleReject(companyId)}
                                className="h-9 rounded-lg border border-red-500/20 bg-red-500/10 px-3 text-xs font-semibold text-red-300 transition hover:bg-red-500/20 disabled:opacity-50"
                              >
                                {isCurrentUpdating &&
                                updatingAction === "rejected"
                                  ? "Rejecting..."
                                  : "Reject"}
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          <div className="flex flex-col justify-between gap-3 border-t border-white/10 px-5 py-4 text-sm text-white/40 sm:flex-row sm:items-center">
            <p>
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredCompanies.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {companyList.length}
              </span>{" "}
              companies
            </p>

            <p className="text-xs text-white/30">
              Rolebix Admin Company Verification System
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminCompaniesTable;
