import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const baseUri = String(
  process.env.NEXT_PUBLIC_BASE_URI || "",
).replace(/\/$/, "");

const getAdminToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.session?.token || "";
};

const adminFetch = async (path) => {
  if (!baseUri) {
    throw new Error("NEXT_PUBLIC_BASE_URI is missing.");
  }

  const token = await getAdminToken();

  if (!token) {
    const error = new Error("Please sign in as an admin.");
    error.status = 401;
    throw error;
  }

  const response = await fetch(`${baseUri}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.error && process.env.NODE_ENV === "development"
        ? `${payload?.message || "Admin request failed."} ${payload.error}`
        : payload?.message || "Admin request failed.";

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
};

export const getAdminDashboard = async () =>
  adminFetch("/api/admin/dashboard");

export const getAdminJobs = async ({
  page = 1,
  limit = 10,
  search = "",
  status = "all",
  category = "all",
} = {}) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) query.set("search", search);
  if (status && status !== "all") query.set("status", status);
  if (category && category !== "all") {
    query.set("category", category);
  }

  return adminFetch(`/api/admin/jobs?${query.toString()}`);
};

export const getAdminPayments = async ({
  page = 1,
  limit = 10,
  search = "",
  paymentStatus = "all",
  planId = "all",
} = {}) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (search) query.set("search", search);

  if (paymentStatus && paymentStatus !== "all") {
    query.set("paymentStatus", paymentStatus);
  }

  if (planId && planId !== "all") {
    query.set("planId", planId);
  }

  return adminFetch(`/api/admin/payments?${query.toString()}`);
};
