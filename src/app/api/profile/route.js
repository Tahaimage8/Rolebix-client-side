import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const baseUri = String(
  process.env.NEXT_PUBLIC_BASE_URI || "",
).replace(/\/$/, "");

const getToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.session?.token || "";
};

const createProxyResponse = async (response) => {
  const payload = await response.json().catch(() => ({
    message: "Invalid response from the Rolebix server.",
  }));

  return NextResponse.json(payload, {
    status: response.status,
  });
};

export async function GET() {
  try {
    if (!baseUri) {
      return NextResponse.json(
        {
          message: "NEXT_PUBLIC_BASE_URI is missing.",
        },
        {
          status: 500,
        },
      );
    }

    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized access.",
        },
        {
          status: 401,
        },
      );
    }

    const response = await fetch(`${baseUri}/api/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    return createProxyResponse(response);
  } catch (error) {
    console.error("Profile GET proxy error:", error);

    return NextResponse.json(
      {
        message: "Failed to load profile.",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}

export async function PATCH(request) {
  try {
    if (!baseUri) {
      return NextResponse.json(
        {
          message: "NEXT_PUBLIC_BASE_URI is missing.",
        },
        {
          status: 500,
        },
      );
    }

    const token = await getToken();

    if (!token) {
      return NextResponse.json(
        {
          message: "Unauthorized access.",
        },
        {
          status: 401,
        },
      );
    }

    const body = await request.json();

    const response = await fetch(`${baseUri}/api/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });

    return createProxyResponse(response);
  } catch (error) {
    console.error("Profile PATCH proxy error:", error);

    return NextResponse.json(
      {
        message: "Failed to update profile.",
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
