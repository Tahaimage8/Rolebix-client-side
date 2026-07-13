import Link from "next/link";
import { getAdminPayments } from "@/lib/api/admin";

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value?.$oid) return value.$oid;
  return String(value);
};

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatMoney = (amountTotal, currency = "usd") => {
  const rawAmount = Number(amountTotal || 0);
  const amount = rawAmount / 100;
  const normalizedCurrency = String(currency || "usd").toUpperCase();

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: normalizedCurrency,
    }).format(amount);
  } catch {
    return `${normalizedCurrency} ${amount.toFixed(2)}`;
  }
};

const statusClass = (status) => {
  const value = String(status || "pending").toLowerCase();

  if (
    ["paid", "complete", "completed", "succeeded"].includes(
      value,
    )
  ) {
    return "border-emerald-400/25 bg-emerald-500/10 text-emerald-300";
  }

  if (["failed", "cancelled", "refunded"].includes(value)) {
    return "border-red-400/25 bg-red-500/10 text-red-300";
  }

  return "border-amber-400/25 bg-amber-500/10 text-amber-300";
};

const buildPageHref = ({
  page,
  search,
  paymentStatus,
  planId,
}) => {
  const query = new URLSearchParams();

  query.set("page", String(page));

  if (search) query.set("search", search);

  if (paymentStatus && paymentStatus !== "all") {
    query.set("paymentStatus", paymentStatus);
  }

  if (planId && planId !== "all") {
    query.set("planId", planId);
  }

  return `/dashboard/admin/payments?${query.toString()}`;
};

const SummaryCard = ({ label, value, note }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
    <p className="text-sm text-white/45">{label}</p>
    <p className="mt-2 text-3xl font-bold tracking-tight">
      {value}
    </p>
    <p className="mt-2 text-xs text-white/35">{note}</p>
  </div>
);

const AdminPaymentsPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;

  const filters = {
    page: Math.max(Number(resolvedSearchParams?.page) || 1, 1),
    search: String(resolvedSearchParams?.search || ""),
    paymentStatus: String(
      resolvedSearchParams?.paymentStatus || "all",
    ),
    planId: String(resolvedSearchParams?.planId || "all"),
  };

  let data = {
    payments: [],
    planIds: [],
    summary: {
      totalPayments: 0,
      paidPayments: 0,
      pendingPayments: 0,
      revenueByCurrency: [],
    },
    pagination: {
      page: filters.page,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
  let errorMessage = "";

  try {
    data = await getAdminPayments(filters);
  } catch (error) {
    errorMessage =
      error?.message || "Payment history could not be loaded.";
  }

  const summary = data?.summary || {};
  const primaryRevenue = summary?.revenueByCurrency?.[0] || {
    amountTotal: 0,
    currency: "usd",
  };

  return (
    <section className="space-y-6 text-white">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Payment History
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
          Review every subscription record saved by Rolebix after a
          Stripe checkout.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          label="Payment Records"
          value={summary?.totalPayments || 0}
          note="All saved subscription records"
        />

        <SummaryCard
          label="Paid"
          value={summary?.paidPayments || 0}
          note="Completed payment records"
        />

        <SummaryCard
          label="Pending"
          value={summary?.pendingPayments || 0}
          note="Pending or incomplete payments"
        />

        <SummaryCard
          label="Recorded Revenue"
          value={formatMoney(
            primaryRevenue.amountTotal,
            primaryRevenue.currency,
          )}
          note="Calculated from amountTotal"
        />
      </div>

      <form className="grid gap-3 rounded-2xl border border-white/10 bg-[#111] p-4 lg:grid-cols-[minmax(0,1fr)_190px_210px_auto_auto]">
        <input
          name="search"
          defaultValue={filters.search}
          placeholder="Search email, plan, Stripe ID..."
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white outline-none placeholder:text-white/30 focus:border-blue-400/50"
        />

        <select
          name="paymentStatus"
          defaultValue={filters.paymentStatus}
          className="h-11 rounded-xl border border-white/10 bg-[#171717] px-3 text-sm text-white outline-none"
        >
          <option value="all">All statuses</option>
          <option value="paid">Paid</option>
          <option value="complete">Complete</option>
          <option value="succeeded">Succeeded</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>

        <select
          name="planId"
          defaultValue={filters.planId}
          className="h-11 rounded-xl border border-white/10 bg-[#171717] px-3 text-sm text-white outline-none"
        >
          <option value="all">All plans</option>
          {(data?.planIds || []).map((planId) => (
            <option key={planId} value={planId}>
              {planId}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="h-11 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
        >
          Apply
        </button>

        <Link
          href="/dashboard/admin/payments"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/65 transition hover:bg-white/10 hover:text-white"
        >
          Clear
        </Link>
      </form>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="font-semibold">Subscription Payments</h2>
            <p className="mt-1 text-xs text-white/40">
              {data?.pagination?.total || 0} matching records
            </p>
          </div>
        </div>

        {data?.payments?.length ? (
          <div className="overflow-x-auto">
            <table className="min-w-[1150px] w-full text-left">
              <thead className="border-b border-white/10 bg-white/[0.025] text-xs uppercase tracking-wider text-white/35">
                <tr>
                  <th className="px-5 py-3">Customer</th>
                  <th className="px-5 py-3">Plan</th>
                  <th className="px-5 py-3">Amount</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Stripe Session</th>
                  <th className="px-5 py-3">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {data.payments.map((payment) => {
                  const paymentId = getId(
                    payment?._id || payment?.id,
                  );
                  const paymentStatus =
                    payment?.paymentStatus || "pending";

                  return (
                    <tr
                      key={paymentId}
                      className="transition hover:bg-white/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <p className="max-w-64 truncate font-semibold">
                          {payment?.email || "Unknown customer"}
                        </p>
                        <p className="mt-1 text-xs text-white/35">
                          {payment?.stripeCustomerId ||
                            "No customer ID"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-white/75">
                          {payment?.planName ||
                            payment?.planId ||
                            "Unknown plan"}
                        </p>
                        <p className="mt-1 text-xs text-white/35">
                          {payment?.planId || "No plan ID"}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-semibold">
                        {formatMoney(
                          payment?.amountTotal,
                          payment?.currency,
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(
                            paymentStatus,
                          )}`}
                        >
                          {paymentStatus}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <p
                          className="max-w-56 truncate text-xs text-white/45"
                          title={payment?.stripeSessionId || ""}
                        >
                          {payment?.stripeSessionId ||
                            "Not available"}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-sm text-white/45">
                        {formatDate(
                          payment?.createdAt ||
                            payment?.updatedAt,
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="p-10 text-center text-sm text-white/40">
            No payment history found.
          </p>
        )}

        <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
          <p className="text-xs text-white/40">
            Page {data?.pagination?.page || 1} of{" "}
            {data?.pagination?.totalPages || 1}
          </p>

          <div className="flex gap-2">
            {data?.pagination?.hasPreviousPage ? (
              <Link
                href={buildPageHref({
                  ...filters,
                  page: filters.page - 1,
                })}
                className="inline-flex h-9 items-center rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/65 transition hover:bg-white/10"
              >
                Previous
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/25">
                Previous
              </span>
            )}

            {data?.pagination?.hasNextPage ? (
              <Link
                href={buildPageHref({
                  ...filters,
                  page: filters.page + 1,
                })}
                className="inline-flex h-9 items-center rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/65 transition hover:bg-white/10"
              >
                Next
              </Link>
            ) : (
              <span className="inline-flex h-9 items-center rounded-lg border border-white/10 bg-white/5 px-3 text-xs font-semibold text-white/25">
                Next
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminPaymentsPage;
