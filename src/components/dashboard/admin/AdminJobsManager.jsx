"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "pending", label: "Pending" },
  { value: "paused", label: "Paused" },
  { value: "closed", label: "Closed" },
  { value: "rejected", label: "Rejected" },
];

const FILTER_STATUS_OPTIONS = [
  { value: "all", label: "All statuses" },
  { value: "unmoderated", label: "Unmoderated" },
  ...STATUS_OPTIONS,
];

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value?.$oid) return value.$oid;
  return String(value);
};

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

const statusClass = (status) => {
  const value = String(status || "unmoderated").toLowerCase();

  if (value === "active") {
    return "border-emerald-400/25 bg-emerald-500/10 text-emerald-300";
  }

  if (["pending", "paused", "unmoderated"].includes(value)) {
    return "border-amber-400/25 bg-amber-500/10 text-amber-300";
  }

  return "border-red-400/25 bg-red-500/10 text-red-300";
};

const AdminJobsManager = ({
  initialJobs = [],
  pagination = {},
  initialFilters = {},
  errorMessage = "",
}) => {
  const router = useRouter();

  const [jobs, setJobs] = useState(initialJobs);
  const [search, setSearch] = useState(initialFilters.search || "");
  const [status, setStatus] = useState(
    initialFilters.status || "all",
  );
  const [category, setCategory] = useState(
    initialFilters.category || "all",
  );
  const [updatingId, setUpdatingId] = useState("");

  const categories = useMemo(() => {
    const values = jobs
      .map((job) => job?.category)
      .filter(Boolean);

    if (
      initialFilters.category &&
      initialFilters.category !== "all"
    ) {
      values.push(initialFilters.category);
    }

    return [...new Set(values)].sort();
  }, [initialFilters.category, jobs]);

  const applyFilters = (event) => {
    event.preventDefault();

    const query = new URLSearchParams();

    if (search.trim()) query.set("search", search.trim());
    if (status !== "all") query.set("status", status);
    if (category !== "all") query.set("category", category);

    router.push(
      `/dashboard/admin/jobs${
        query.toString() ? `?${query.toString()}` : ""
      }`,
    );
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("all");
    setCategory("all");
    router.push("/dashboard/admin/jobs");
  };

  const updateStatus = async (job, nextStatus) => {
    const jobId = getId(job?._id || job?.id);

    if (!jobId || nextStatus === job?.status) return;

    try {
      setUpdatingId(jobId);

      const response = await fetch(
        `/api/admin/jobs/${jobId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: nextStatus,
          }),
        },
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.message || "Job status update failed.",
        );
      }

      setJobs((currentJobs) =>
        currentJobs.map((currentJob) =>
          getId(currentJob?._id || currentJob?.id) === jobId
            ? {
                ...currentJob,
                status: nextStatus,
                updatedAt: new Date().toISOString(),
              }
            : currentJob,
        ),
      );

      toast.success("Job status updated.");
      router.refresh();
    } catch (error) {
      toast.error(
        error?.message || "Could not update job status.",
      );
    } finally {
      setUpdatingId("");
    }
  };

  const buildPageHref = (page) => {
    const query = new URLSearchParams();

    query.set("page", String(page));

    if (initialFilters.search) {
      query.set("search", initialFilters.search);
    }

    if (
      initialFilters.status &&
      initialFilters.status !== "all"
    ) {
      query.set("status", initialFilters.status);
    }

    if (
      initialFilters.category &&
      initialFilters.category !== "all"
    ) {
      query.set("category", initialFilters.category);
    }

    return `/dashboard/admin/jobs?${query.toString()}`;
  };

  return (
    <div className="space-y-5">
      {errorMessage ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <form
        onSubmit={applyFilters}
        className="grid gap-3 rounded-2xl border border-white/10 bg-[#111] p-4 lg:grid-cols-[minmax(0,1fr)_190px_190px_auto_auto]"
      >
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search job, company, category..."
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-400/50"
        />

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-[#171717] px-3 text-sm text-white outline-none"
        >
          {FILTER_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="h-11 rounded-xl border border-white/10 bg-[#171717] px-3 text-sm text-white outline-none"
        >
          <option value="all">All categories</option>
          {categories.map((singleCategory) => (
            <option
              key={singleCategory}
              value={singleCategory}
            >
              {singleCategory}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="h-11 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Apply
        </button>

        <button
          type="button"
          onClick={clearFilters}
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          Clear
        </button>
      </form>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="font-semibold">All Job Listings</h2>
            <p className="mt-1 text-xs text-white/40">
              {pagination?.total || jobs.length} jobs found
            </p>
          </div>
        </div>

        {jobs.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-[1050px] w-full text-left">
              <thead className="border-b border-white/10 bg-white/[0.025] text-xs uppercase tracking-wider text-white/35">
                <tr>
                  <th className="px-5 py-3">Job</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Applications</th>
                  <th className="px-5 py-3">Created</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Moderation</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {jobs.map((job) => {
                  const jobId = getId(job?._id || job?.id);
                  const jobStatus =
                    job?.status || "unmoderated";
                  const isUpdating = updatingId === jobId;

                  return (
                    <tr
                      key={jobId}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <p className="max-w-64 truncate font-semibold">
                          {job?.title || "Untitled job"}
                        </p>
                        <p className="mt-1 text-xs text-white/35">
                          {job?.type || "Type unavailable"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-white/65">
                        {job?.company?.name ||
                          "Company unavailable"}
                      </td>

                      <td className="px-5 py-4 text-sm text-white/55">
                        {job?.category || "Not specified"}
                      </td>

                      <td className="px-5 py-4 text-sm text-white/65">
                        {job?.applicationCount || 0}
                      </td>

                      <td className="px-5 py-4 text-sm text-white/45">
                        {formatDate(job?.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(
                            jobStatus,
                          )}`}
                        >
                          {jobStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={
                            jobStatus === "unmoderated"
                              ? "pending"
                              : jobStatus
                          }
                          disabled={isUpdating}
                          onChange={(event) =>
                            updateStatus(job, event.target.value)
                          }
                          className="h-10 min-w-32 rounded-xl border border-white/10 bg-[#171717] px-3 text-sm text-white outline-none disabled:cursor-wait disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map((option) => (
                            <option
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-10 text-center text-sm text-white/40">
            No matching jobs found.
          </p>
        )}

        <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
          <p className="text-xs text-white/40">
            Page {pagination?.page || 1} of{" "}
            {pagination?.totalPages || 1}
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={!pagination?.hasPreviousPage}
              onClick={() =>
                router.push(
                  buildPageHref(
                    Math.max(
                      Number(pagination?.page || 1) - 1,
                      1,
                    ),
                  ),
                )
              }
              className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/65 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={!pagination?.hasNextPage}
              onClick={() =>
                router.push(
                  buildPageHref(
                    Number(pagination?.page || 1) + 1,
                  ),
                )
              }
              className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/65 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-35"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminJobsManager;
