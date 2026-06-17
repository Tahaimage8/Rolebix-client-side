"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

export const updateUserRole = async (userId, role) => {
  try {
    if (!userId) {
      return {
        success: false,
        message: "User ID is required.",
      };
    }

    if (!role) {
      return {
        success: false,
        message: "Role is required.",
      };
    }

    const result = await auth.api.setRole({
      body: {
        userId,
        role,
      },
      headers: await headers(),
    });

    revalidatePath("/dashboard/admin/users");

    return {
      success: true,
      message: "User role updated successfully.",
      result,
    };
  } catch (error) {
    return {
      success: false,
      message: error?.message || "Failed to update user role.",
    };
  }
};