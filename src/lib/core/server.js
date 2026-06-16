import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseUri = process.env.NEXT_PUBLIC_BASE_URI;

export const authHeader = async () => {
  const token = await getUserToken();

  if (!token) {
    return {};
  }

  return {
    authorization: `Bearer ${token}`,
  };
};

const handleResponse = async (res, url) => {
  const text = await res.text();

  let parsedData = null;

  if (text) {
    try {
      parsedData = JSON.parse(text);
    } catch (error) {
      console.error("Invalid JSON response from:", url);
      console.error("Response was:", text);

      throw new Error("API did not return valid JSON.");
    }
  }

  // 401 = user login nai / token nai
  if (res.status === 401) {
    redirect("/auth/signin");
  }

  // 403 = login ase but permission nai
  if (res.status === 403) {
    redirect("/unauthorized");
  }

  // 404 = data / route not found
  if (res.status === 404) {
    throw new Error(parsedData?.message || "Data not found.");
  }

  // Any other failed response
  if (!res.ok) {
    throw new Error(parsedData?.message || "Request failed.");
  }

  return parsedData;
};

export const serverFetch = async (path) => {
  const url = `${baseUri}${path}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  return handleResponse(res, url);
};

export const protectedFetch = async (path) => {
  const url = `${baseUri}${path}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      ...(await authHeader()),
    },
  });

  return handleResponse(res, url);
};

export const serverMutation = async (api, data, method = "POST") => {
  const url = `${baseUri}${api}`;

  const res = await fetch(url, {
    method,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      ...(await authHeader()),
    },
    body: JSON.stringify(data),
  });

  return handleResponse(res, url);
};