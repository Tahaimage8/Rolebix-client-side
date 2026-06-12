import { serverFetch } from "../core/server";

export const getPlanById = async (planId) => {
  const safePlanId = String(planId).toLowerCase();

  return serverFetch(`/api/plans?plan_id=${safePlanId}`);
};