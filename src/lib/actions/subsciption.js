"use server";

import { serverMutation } from "../core/server";

export const CreateSubscription = async (subInfo) => {
  return serverMutation("/api/subscription", subInfo);
};