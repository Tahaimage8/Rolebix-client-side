import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const baseUri = String(
  process.env.NEXT_PUBLIC_BASE_URI || "",
).replace(/\/$/, "");

const getSessionToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.session?.token || "";
};

const parseResponse = async (response, fallbackMessage) => {
  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      payload?.error && process.env.NODE_ENV === "development"
        ? `${payload?.message || fallbackMessage} ${payload.error}`
        : payload?.message || fallbackMessage;

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return payload;
};

export const getMyProfile = async () => {
  if (!baseUri) {
    throw new Error("NEXT_PUBLIC_BASE_URI is missing.");
  }

  const token = await getSessionToken();

  if (!token) {
    const error = new Error("Please sign in to view your profile.");
    error.status = 401;
    throw error;
  }

  const response = await fetch(`${baseUri}/api/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  return parseResponse(response, "Failed to load profile.");
};
