import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const baseUri = process.env.NEXT_PUBLIC_BASE_URI;

const defaultResponse = {
  applications: [],
  jobs: [],
  company: null,
  stats: {
    total: 0,
    applied: 0,
    reviewing: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
    rejected: 0,
  },
  pagination: {
    page: 1,
    limit: 100,
    total: 0,
    totalPages: 1,
  },
};

export const getRecruiterApplications = async ({
  status = "",
  jobId = "",
  search = "",
  page = 1,
  limit = 100,
} = {}) => {
  if (!baseUri) {
    throw new Error("NEXT_PUBLIC_BASE_URI is missing.");
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const token = session?.session?.token;

  if (!token) {
    throw new Error("Please sign in as a recruiter.");
  }

  const query = new URLSearchParams();

  if (status) query.set("status", status);
  if (jobId) query.set("jobId", jobId);
  if (search) query.set("search", search);

  query.set("page", String(page));
  query.set("limit", String(limit));

  const response = await fetch(
    `${baseUri}/api/recruiter/applications?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      payload?.message || "Failed to load recruiter applications.",
    );
  }

  return {
    ...defaultResponse,
    ...payload,
    stats: {
      ...defaultResponse.stats,
      ...(payload?.stats || {}),
    },
    pagination: {
      ...defaultResponse.pagination,
      ...(payload?.pagination || {}),
    },
  };
};
