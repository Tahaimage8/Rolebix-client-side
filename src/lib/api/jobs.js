import { serverFetch } from "../core/server";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URI;

const buildJobsQuery = (params = {}) => {
  const query = new URLSearchParams();

  query.set("page", params.page || "1");
  query.set("limit", params.limit || "9");

  if (params.search) {
    query.set("search", params.search);
  }

  if (params.category && params.category !== "all") {
    query.set("category", params.category);
  }

  if (params.type && params.type !== "all") {
    query.set("type", params.type);
  }

  if (params.experienceLevel && params.experienceLevel !== "all") {
    query.set("experienceLevel", params.experienceLevel);
  }

  if (params.workMode && params.workMode !== "all") {
    query.set("workMode", params.workMode);
  }

  if (params.company && params.company !== "all") {
    query.set("company", params.company);
  }

  if (params.companyId) {
    query.set("companyId", params.companyId);
  }

  if (params.status) {
    query.set("status", params.status);
  }

  return query.toString();
};

export const getJobs = async (params = {}) => {
  const query = buildJobsQuery(params);

  return serverFetch(`/api/jobs?${query}`);
};

export const getJobById = async (jobId) => {
  return serverFetch(`/api/jobs/${jobId}`);
};

export const getCompanyJobs = async (companyId, status = "active") => {
  const res = await fetch(
    `${baseUrl}/api/jobs?companyId=${companyId}&status=${status}&page=1&limit=50`,
    {
      cache: "no-store",
    },
  );

  const data = await res.json();

  return data?.jobs || [];
};