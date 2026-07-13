import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  Briefcase,
  Envelope,
  Magnifier,
} from "@gravity-ui/icons";
import { getUserSession } from "@/lib/core/session";
import { getSeekerDashboardData } from "@/lib/api/seekerDashboard";

const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    className: "border-blue-400/25 bg-blue-500/10 text-blue-300",
  },
  reviewing: {
    label: "Reviewing",
    className: "border-amber-400/25 bg-amber-500/10 text-amber-300",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "border-violet-400/25 bg-violet-500/10 text-violet-300",
  },
  interview: {
    label: "Interview",
    className: "border-cyan-400/25 bg-cyan-500/10 text-cyan-300",
  },
  hired: {
    label: "Hired",
    className: "border-emerald-400/25 bg-emerald-500/10 text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-400/25 bg-red-500/10 text-red-300",
  },
};

const normalizeStatus = (status) => {
  const value = String(status || "applied").toLowerCase();

  if (value === "new" || value === "pending") return "applied";
  if (value === "approved") return "shortlisted";
  if (value === "accepted") return "hired";
  if (value === "interviewing") return "interview";
  if (value === "cancelled") return "rejected";

  return STATUS_CONFIG[value] ? value : "applied";
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value?.$oid) return value.$oid;
  return String(value);
};

const getJobTitle = (item) =>
  item?.job?.title ||
  item?.jobTitle ||
  item?.position ||
  item?.title ||
  "Untitled job";

const getCompanyName = (item) =>
  item?.job?.company?.name ||
  item?.company?.name ||
  item?.companyName ||
  "Company unavailable";

const getLocation = (item) =>
  item?.job?.location?.display ||
  item?.location?.display ||
  item?.job?.location?.city ||
  item?.location?.city ||
  item?.companyLocation ||
  "Location not specified";

const getJobType = (item) =>
  item?.job?.type || item?.type || item?.jobType || "Job type not specified";

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


const StatusBadge = ({ status }) => {
  const normalizedStatus = normalizeStatus(status);
  const config = STATUS_CONFIG[normalizedStatus];

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
};

const MetricCard = ({
  icon: Icon,
  label,
  value,
  description,
  href,
  accentClass,
}) => (
  <Link
    href={href}
    className="group rounded-2xl border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/5.5"
  >
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm text-white/45">{label}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white">
          {value}
        </p>
        <p className="mt-2 text-xs text-white/35">{description}</p>
      </div>

      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${accentClass}`}
      >
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </Link>
);

const QuickAction = ({ icon: Icon, title, description, href }) => (
  <Link
    href={href}
    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/3 p-3.5 transition hover:border-white/20 hover:bg-white/6"
  >
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/70 transition group-hover:bg-white/10 group-hover:text-white">
      <Icon className="h-5 w-5" />
    </div>

    <div className="min-w-0">
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-0.5 truncate text-xs text-white/40">{description}</p>
    </div>

    <span className="ml-auto text-white/25 transition group-hover:translate-x-0.5 group-hover:text-white/60">
      →
    </span>
  </Link>
);

const SeekerDashboardPage = async () => {
  const user = await getUserSession();
  const userId = user?.id || user?._id;

  if (!userId) {
    redirect("/auth/signin");
  }

  if (user?.role && user.role !== "seeker") {
    redirect("/unauthorized");
  }

  const { applications, jobs, errors } =
    await getSeekerDashboardData(userId);

  const totalApplications = applications.length;

  const activeApplications = applications.filter((application) =>
    ["applied", "reviewing", "shortlisted", "interview"].includes(
      normalizeStatus(application?.status),
    ),
  ).length;

  const interviewCount = applications.filter(
    (application) =>
      normalizeStatus(application?.status) === "interview",
  ).length;

  const recentApplications = applications.slice(0, 5);
  const firstName = String(user?.name || "Job Seeker").split(" ")[0];
  const planName = String(
    user?.subscription?.planName || user?.plan || "Seeker Free",
  ).replaceAll("_", " ");

  return (
    <section className="space-y-7 text-white">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111] p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-white/55">
                Job Seeker Dashboard
              </span>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-semibold capitalize text-emerald-300">
                {planName}
              </span>
            </div>

            <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, {firstName}
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
              Keep track of your applications and discover new job opportunities
              from one simple dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/jobs"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              <Magnifier className="h-5 w-5" />
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>

      {(errors?.applications || errors?.jobs) ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 p-4 text-sm text-amber-200">
          Some dashboard information could not be loaded.
          {errors?.applications ? ` ${errors.applications}` : ""}
          {errors?.jobs ? ` ${errors.jobs}` : ""}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          icon={Envelope}
          label="Total Applications"
          value={totalApplications}
          description="All submitted applications"
          href="/dashboard/seeker/applications"
          accentClass="bg-blue-500/10 text-blue-300"
        />

        <MetricCard
          icon={Briefcase}
          label="In Progress"
          value={activeApplications}
          description="Applications still active"
          href="/dashboard/seeker/applications"
          accentClass="bg-amber-500/10 text-amber-300"
        />

        <MetricCard
          icon={Bell}
          label="Interview Stage"
          value={interviewCount}
          description="Applications at interview"
          href="/dashboard/seeker/applications"
          accentClass="bg-cyan-500/10 text-cyan-300"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold">Recent Applications</h2>
              <p className="mt-1 text-xs text-white/40">
                Your latest application activity
              </p>
            </div>

            <Link
              href="/dashboard/seeker/applications"
              className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
            >
              View all →
            </Link>
          </div>

          {recentApplications.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/55">
                <Envelope className="h-6 w-6" />
              </div>

              <h3 className="mt-5 text-lg font-semibold">
                No applications yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-white/40">
                Start applying to jobs and your latest application activity
                will appear here.
              </p>

              <Link
                href="/jobs"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black"
              >
                Find a job
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {recentApplications.map((application) => {
                const applicationId = getId(
                  application?._id || application?.id,
                );

                return (
                  <div
                    key={applicationId}
                    className="flex flex-col gap-4 px-5 py-4 transition hover:bg-white/2.5 sm:flex-row sm:items-center sm:px-6"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/5 text-white/60">
                      <Briefcase className="h-5 w-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-semibold text-white">
                        {getJobTitle(application)}
                      </p>
                      <p className="mt-1 truncate text-sm text-white/40">
                        {getCompanyName(application)} •{" "}
                        {formatDate(application?.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <StatusBadge status={application?.status} />

                      <Link
                        href={`/dashboard/seeker/applications/${applicationId}`}
                        className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/60 transition hover:bg-white/10 hover:text-white"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
          <h2 className="font-semibold">Quick Actions</h2>
          <p className="mt-1 text-xs text-white/40">
            Common seeker activities
          </p>

          <div className="mt-4 space-y-3">
            <QuickAction
              icon={Magnifier}
              title="Browse Jobs"
              description="Find your next opportunity"
              href="/jobs"
            />

            <QuickAction
              icon={Envelope}
              title="My Applications"
              description="Track submitted applications"
              href="/dashboard/seeker/applications"
            />
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
        <div className="flex flex-col gap-3 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h2 className="text-lg font-semibold">Latest Opportunities</h2>
            <p className="mt-1 text-xs text-white/40">
              Recently posted active jobs
            </p>
          </div>

          <Link
            href="/jobs"
            className="text-sm font-semibold text-blue-300 transition hover:text-blue-200"
          >
            Explore all jobs →
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/40">
            No active jobs are available right now.
          </div>
        ) : (
          <div className="grid gap-px bg-white/10 md:grid-cols-2 xl:grid-cols-4">
            {jobs.slice(0, 4).map((job) => {
              const jobId = getId(job?._id || job?.id);

              return (
                <article
                  key={jobId}
                  className="flex min-h-60 flex-col bg-[#111] p-5 transition hover:bg-[#151515]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white/60">
                    <Briefcase className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 line-clamp-2 text-lg font-semibold text-white">
                    {getJobTitle(job)}
                  </h3>

                  <p className="mt-2 truncate text-sm text-white/45">
                    {getCompanyName(job)}
                  </p>

                  <div className="mt-4 space-y-1.5 text-xs text-white/35">
                    <p>{getLocation(job)}</p>
                    <p>{getJobType(job)}</p>
                  </div>

                  <Link
                    href={`/jobs/${jobId}`}
                    className="mt-auto inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                  >
                    View job
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SeekerDashboardPage;