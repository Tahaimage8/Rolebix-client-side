/* eslint-disable @next/next/no-img-element */
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getUserSession } from "@/lib/core/session";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getJobById } from "@/lib/api/jobs";
import JobApply from "./JobApply";
import {
  FiArrowLeft,
  FiBriefcase,
  FiLock,
  FiCheckCircle,
  FiZap,
} from "react-icons/fi";
import { getApplicationByApplicant } from "@/lib/api/application";
import { getPlanById } from "@/lib/api/plans";

const getJobId = (job) => {
  if (typeof job?._id === "string") return job._id;
  if (job?._id?.$oid) return job._id.$oid;
  return job?.id || "";
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value?.$oid) return value.$oid;
  return String(value);
};

const isSameMonth = (date) => {
  if (!date) return false;

  const applicationDate = new Date(date);
  const now = new Date();

  return (
    applicationDate.getMonth() === now.getMonth() &&
    applicationDate.getFullYear() === now.getFullYear()
  );
};

const getUniqueApplicationsByJob = (applications = []) => {
  const map = new Map();

  applications.forEach((application) => {
    const jobId = getId(application?.jobId);

    if (jobId && !map.has(jobId)) {
      map.set(jobId, application);
    }
  });

  return [...map.values()];
};

const ApplyPage = async ({ params, searchParams }) => {
  const { id } = await params;
  const currentSearchParams = await searchParams;

  const appliedSuccess = currentSearchParams?.applied === "success";

  const user = await getUserSession();

  if (!user) {
    redirect(
      `/auth/signin?redirect=${encodeURIComponent(`/jobs/${id}/apply`)}`
    );
  }

  if (user.role !== "seeker") {
    return (
      <main className="relative min-h-screen overflow-hidden bg-black px-4 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.22),transparent_35%),linear-gradient(180deg,#111111_0%,#050505_55%,#000000_100%)]" />

        <div className="relative z-10 mx-auto max-w-xl rounded-[32px] border border-white/10 bg-[#111111]/90 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl font-bold text-red-300">
            !
          </div>

          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Only job seekers can apply
          </h1>

          <p className="mt-3 text-sm leading-6 text-white/55">
            This application page is only available for job seeker accounts.
            Recruiters can manage jobs and applicants from the dashboard.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard/recruiter"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90"
            >
              Go to Dashboard
            </Link>

            <Link
              href={`/jobs/${id}`}
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 px-5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Back to Job
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  const applications = (await getApplicationByApplicant(user.id)) || [];

  const plan = await getPlanById(user.plan || "seeker_free");

  const isUnlimitedPlan = plan?.maxApplicationsPerMonth === "unlimited";

  const maxApplicationsPerMonth = isUnlimitedPlan
    ? Infinity
    : Number(plan?.maxApplicationsPerMonth || 3);

  const maxApplicationsLabel = isUnlimitedPlan
    ? "Unlimited"
    : maxApplicationsPerMonth;

  const planName = plan?.name || "Free";

  const jobId = getJobId(job);

  const monthlyApplications = applications.filter((application) =>
    isSameMonth(application?.createdAt)
  );

  const uniqueMonthlyApplications =
    getUniqueApplicationsByJob(monthlyApplications);

  const alreadyAppliedFromDB = applications.some(
    (application) => getId(application?.jobId) === getId(jobId)
  );

  const alreadyApplied = alreadyAppliedFromDB || appliedSuccess;

  const hasApplicationLimit =
    !isUnlimitedPlan &&
    uniqueMonthlyApplications.length >= maxApplicationsPerMonth;

  const canApply = !alreadyApplied && !hasApplicationLimit;

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.25),transparent_34%),linear-gradient(180deg,#181818_0%,#050505_55%,#000000_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-105 w-180 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 top-28 h-56 w-56 rounded-full bg-[#7C5CFF]/10 blur-[90px]" />

      <section className="relative z-10 mx-auto max-w-6xl">
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            href={`/jobs/${id}`}
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/55 transition hover:text-white"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to job details
          </Link>

          <h2 className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm font-medium text-white/55">
            {uniqueMonthlyApplications.length}/{maxApplicationsLabel}{" "}
            applications used on your {planName} plan
          </h2>
        </div>

        {canApply && <JobApply applicant={user} job={job} />}

        {alreadyApplied && (
          <ApplicationNotice
            icon={<FiCheckCircle />}
            title="You already applied for this job"
            description="Your application has already been submitted for this role. You can browse other jobs and apply to a new opportunity."
            actionText="Browse More Jobs"
            actionHref="/jobs"
            type="success"
          />
        )}

        {!alreadyApplied && hasApplicationLimit && (
          <ApplicationNotice
            icon={<FiLock />}
            title="Application limit reached"
            description={`You have reached the ${maxApplicationsPerMonth} applications limit on your ${planName} plan. To apply for more jobs this month, please upgrade your plan.`}
            actionText="Upgrade Plan"
            actionHref="/pricing"
            type="warning"
          />
        )}
      </section>
    </main>
  );
};

const ApplicationNotice = ({
  icon,
  title,
  description,
  actionText,
  actionHref,
  type = "warning",
}) => {
  const styles =
    type === "success"
      ? "border-green-500/20 bg-green-500/10 text-green-300"
      : "border-yellow-500/20 bg-yellow-500/10 text-yellow-300";

  return (
    <div className="mx-auto max-w-2xl rounded-[32px] border border-white/10 bg-[#111111]/90 p-8 text-center shadow-2xl shadow-black/50 backdrop-blur-xl">
      <div
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border text-2xl ${styles}`}
      >
        {icon}
      </div>

      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white">
        {title}
      </h1>

      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-white/55">
        {description}
      </p>

      <Link
        href={actionHref}
        className="mt-7 inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 text-sm font-semibold text-black transition hover:bg-white/90"
      >
        {type === "warning" ? (
          <FiZap className="h-4 w-4" />
        ) : (
          <FiBriefcase className="h-4 w-4" />
        )}

        {actionText}
      </Link>
    </div>
  );
};

export default ApplyPage;