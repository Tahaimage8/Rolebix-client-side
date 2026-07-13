import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const baseUri = process.env.NEXT_PUBLIC_BASE_URI;

const getSessionToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.session?.token || "";
};

const parseResponse = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(payload?.message || fallbackMessage);
    error.status = response.status;
    throw error;
  }

  return payload;
};

export const getSeekerApplications = async (applicantId) => {
  if (!baseUri) {
    throw new Error("NEXT_PUBLIC_BASE_URI is missing.");
  }

  if (!applicantId) {
    throw new Error("Applicant ID is required.");
  }

  const token = await getSessionToken();

  if (!token) {
    throw new Error("Please sign in as a seeker.");
  }

  const query = new URLSearchParams({
    applicantId: String(applicantId),
  });

  const response = await fetch(
    `${baseUri}/api/applications?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  return parseResponse(response, "Failed to load your applications.");
};

export const getSeekerApplicationById = async (applicationId) => {
  if (!baseUri) {
    throw new Error("NEXT_PUBLIC_BASE_URI is missing.");
  }

  if (!applicationId) {
    throw new Error("Application ID is required.");
  }

  const token = await getSessionToken();

  if (!token) {
    throw new Error("Please sign in as a seeker.");
  }

  const response = await fetch(
    `${baseUri}/api/applications/${encodeURIComponent(applicationId)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    },
  );

  return parseResponse(response, "Failed to load application details.");
};
