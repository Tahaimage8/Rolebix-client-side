import Link from "next/link";
import { getAdminDashboard } from "@/lib/api/admin";

const emptyData = {
  stats: {
    totalUsers: 0,
    totalSeekers: 0,
    totalRecruiters: 0,
    totalAdmins: 0,
    totalJobs: 0,
    activeJobs: 0,
    pendingJobs: 0,
    totalCompanies: 0,
    approvedCompanies: 0,
    pendingCompanies: 0,
    totalApplications: 0,
    totalPayments: 0,
    paidPayments: 0,
  },
  revenueByCurrency: [],
  recentJobs: [],
  recentPayments: [],
  recentUsers: [],
};

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

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
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
  const value = String(status || "unmoderated").toLowerCase();

  if (["active", "paid", "complete", "completed", "succeeded"].includes(value)) {
    return "border-emerald-400/25 bg-emerald-500/10 text-emerald-300";
  }

  if (["pending", "unmoderated", "paused"].includes(value)) {
    return "border-amber-400/25 bg-amber-500/10 text-amber-300";
  }

  if (["rejected", "failed", "cancelled", "closed"].includes(value)) {
    return "border-red-400/25 bg-red-500/10 text-red-300";
  }

  return "border-white/15 bg-white/5 text-white/60";
};

const MetricCard = ({ label, value, note, href }) => (
  <Link
    href={href}
    className="rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.055]"
  >
    <p className="text-sm text-white/45">{label}</p>
    <p className="mt-2 text-3xl font-bold tracking-tight text-white">
      {value}
    </p>
    <p className="mt-2 text-xs text-white/35">{note}</p>
  </Link>
);

const AdminDashboardPage = async () => {
  let data = emptyData;
  let errorMessage = "";

  try {
    data = await getAdminDashboard();
  } catch (error) {
    console.error("Admin dashboard page error:", error);
    errorMessage =
      error?.message || "Admin dashboard could not be loaded.";
  }

  const stats = {
    ...emptyData.stats,
    ...(data?.stats || {}),
  };

  const primaryRevenue = data?.revenueByCurrency?.[0] || {
    amountTotal: 0,
    currency: "usd",
  };

  return (
    <section className="space-y-7 text-white">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
              Rolebix Administration
            </span>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
              Monitor users, companies, job listings, applications, and
              subscription payments from one workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/dashboard/admin/jobs"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Moderate Jobs
            </Link>

            <Link
              href="/dashboard/admin/payments"
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/75 transition hover:bg-white/10 hover:text-white"
            >
              Payment History
            </Link>
          </div>
        </div>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Users"
          value={stats.totalUsers}
          note={`${stats.totalSeekers} seekers • ${stats.totalRecruiters} recruiters`}
          href="/dashboard/admin/users"
        />

        <MetricCard
          label="Total Jobs"
          value={stats.totalJobs}
          note={`${stats.activeJobs} active • ${stats.pendingJobs} pending`}
          href="/dashboard/admin/jobs"
        />

        <MetricCard
          label="Companies"
          value={stats.totalCompanies}
          note={`${stats.approvedCompanies} approved • ${stats.pendingCompanies} pending`}
          href="/dashboard/admin/companies"
        />

        <MetricCard
          label="Applications"
          value={stats.totalApplications}
          note="All submitted job applications"
          href="/dashboard/admin/jobs"
        />

        <MetricCard
          label="Payment Records"
          value={stats.totalPayments}
          note={`${stats.paidPayments} marked as paid`}
          href="/dashboard/admin/payments"
        />

        <MetricCard
          label="Recorded Revenue"
          value={formatMoney(
            primaryRevenue.amountTotal,
            primaryRevenue.currency,
          )}
          note="Based on saved subscription records"
          href="/dashboard/admin/payments"
        />

        <MetricCard
          label="Administrators"
          value={stats.totalAdmins}
          note="Users with admin access"
          href="/dashboard/admin/users"
        />

        <MetricCard
          label="Active Jobs"
          value={stats.activeJobs}
          note="Publicly active job listings"
          href="/dashboard/admin/jobs?status=active"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="font-semibold">Recent Jobs</h2>
              <p className="mt-1 text-xs text-white/40">
                Latest job listings submitted to Rolebix
              </p>
            </div>

            <Link
              href="/dashboard/admin/jobs"
              className="text-sm font-semibold text-blue-300 hover:text-blue-200"
            >
              View all →
            </Link>
          </div>

          {data?.recentJobs?.length ? (
            <div className="divide-y divide-white/10">
              {data.recentJobs.map((job) => {
                const jobId = getId(job?._id || job?.id);
                const status = job?.status || "unmoderated";

                return (
                  <div
                    key={jobId}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">
                        {job?.title || "Untitled job"}
                      </p>
                      <p className="mt-1 truncate text-sm text-white/40">
                        {job?.company?.name || "Company unavailable"} •{" "}
                        {formatDate(job?.createdAt)}
                      </p>
                    </div>

                    <span
                      className={`rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${statusClass(
                        status,
                      )}`}
                    >
                      {status}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-white/40">
              No jobs found.
            </p>
          )}
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="font-semibold">Recent Payments</h2>
              <p className="mt-1 text-xs text-white/40">
                Latest saved subscription payment records
              </p>
            </div>

            <Link
              href="/dashboard/admin/payments"
              className="text-sm font-semibold text-blue-300 hover:text-blue-200"
            >
              View history →
            </Link>
          </div>

          {data?.recentPayments?.length ? (
            <div className="divide-y divide-white/10">
              {data.recentPayments.map((payment) => {
                const paymentId = getId(payment?._id || payment?.id);
                const paymentStatus =
                  payment?.paymentStatus || "pending";

                return (
                  <div
                    key={paymentId}
                    className="flex items-center gap-4 px-5 py-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold">
                        {payment?.email || "Unknown customer"}
                      </p>
                      <p className="mt-1 truncate text-sm text-white/40">
                        {payment?.planName ||
                          payment?.planId ||
                          "Unknown plan"}{" "}
                        • {formatDate(payment?.createdAt)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold">
                        {formatMoney(
                          payment?.amountTotal,
                          payment?.currency,
                        )}
                      </p>
                      <span
                        className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold capitalize ${statusClass(
                          paymentStatus,
                        )}`}
                      >
                        {paymentStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-white/40">
              No payment history found.
            </p>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div>
            <h2 className="font-semibold">Newest Users</h2>
            <p className="mt-1 text-xs text-white/40">
              Recently created Rolebix accounts
            </p>
          </div>

          <Link
            href="/dashboard/admin/users"
            className="text-sm font-semibold text-blue-300 hover:text-blue-200"
          >
            Manage users →
          </Link>
        </div>

        {data?.recentUsers?.length ? (
          <div className="grid divide-y divide-white/10 md:grid-cols-2 md:divide-x md:divide-y-0 xl:grid-cols-5">
            {data.recentUsers.map((user) => (
              <div
                key={getId(user?._id || user?.id)}
                className="min-w-0 p-5"
              >
                <p className="truncate font-semibold">
                  {user?.name || "Unnamed user"}
                </p>
                <p className="mt-1 truncate text-xs text-white/40">
                  {user?.email || "No email"}
                </p>
                <span className="mt-3 inline-flex rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[11px] font-semibold capitalize text-white/55">
                  {user?.role || "seeker"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="p-8 text-center text-sm text-white/40">
            No users found.
          </p>
        )}
      </div>
    </section>
  );
};

export default AdminDashboardPage;
