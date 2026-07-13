import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const baseUri = process.env.NEXT_PUBLIC_BASE_URI;

export async function PATCH(request, { params }) {
  try {
    if (!baseUri) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_BASE_URI is missing." },
        { status: 500 },
      );
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const token = session?.session?.token;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized access." },
        { status: 401 },
      );
    }

    const { id } = await params;
    const body = await request.json();

    const response = await fetch(
      `${baseUri}/api/applications/${id}/status`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
        cache: "no-store",
      },
    );

    const payload = await response.json().catch(() => ({
      message: "Invalid response from the Rolebix server.",
    }));

    return NextResponse.json(payload, {
      status: response.status,
    });
  } catch (error) {
    console.error("Application status proxy error:", error);

    return NextResponse.json(
      {
        message: "Failed to update application status.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}
