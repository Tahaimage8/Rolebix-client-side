import { serverFetch } from "@/lib/core/server";
import { getSeekerApplications } from "@/lib/api/seekerApplications";

const normalizeApplications = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.applications)) return payload.applications;
  return [];
};

const normalizeJobs = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.jobs)) return payload.jobs;
  return [];
};

export const getSeekerDashboardData = async (userId) => {
  const [applicationsResult, jobsResult] = await Promise.allSettled([
    getSeekerApplications(userId),
    serverFetch("/api/jobs?page=1&limit=4&status=active"),
  ]);

  const applications =
    applicationsResult.status === "fulfilled"
      ? normalizeApplications(applicationsResult.value)
      : [];

  const jobs =
    jobsResult.status === "fulfilled"
      ? normalizeJobs(jobsResult.value)
      : [];

  return {
    applications,
    jobs,
    errors: {
      applications:
        applicationsResult.status === "rejected"
          ? applicationsResult.reason?.message ||
            "Applications could not be loaded."
          : "",
      jobs:
        jobsResult.status === "rejected"
          ? jobsResult.reason?.message || "Jobs could not be loaded."
          : "",
    },
  };
};
