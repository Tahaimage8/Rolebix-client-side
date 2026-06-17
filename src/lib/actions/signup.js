"use server";

import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

let cachedClient = null;

const getClient = async () => {
  if (cachedClient) {
    return cachedClient;
  }

  cachedClient = new MongoClient(uri);
  await cachedClient.connect();

  return cachedClient;
};

export const updateSignupUserRole = async ({ email, role, plan }) => {
  try {
    if (!email) {
      return {
        success: false,
        message: "Email is required.",
      };
    }

    if (!["seeker", "recruiter"].includes(role)) {
      return {
        success: false,
        message: "Invalid role.",
      };
    }

    const client = await getClient();
    const db = client.db("role");

    const result = await db.collection("user").updateOne(
      {
        email,
      },
      {
        $set: {
          role,
          plan,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return {
        success: false,
        message: "User created, but role was not updated.",
      };
    }

    return {
      success: true,
      message: "User role updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Failed to update user role.",
    };
  }
};
