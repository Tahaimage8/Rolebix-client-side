import { getUserSession } from "@/lib/core/session";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getJobById } from "@/lib/api/jobs";
import JobApply from "./JobApply";
import {
  FiArrowLeft,
  FiBriefcase,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";

const formatSalary = (salary) => {
  if (!salary?.min || !salary?.max) return "Salary not disclosed";

  return `${salary.currency || "USD"} ${Number(
    salary.min
  ).toLocaleString()} - ${Number(salary.max).toLocaleString()}`;
};

const ApplyPage = async ({ params }) => {
  const { id } = await params;

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

  return (
    <main className="relative min-h-screen overflow-hidden bg-black px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,92,255,0.25),transparent_34%),linear-gradient(180deg,#181818_0%,#050505_55%,#000000_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-105 w-180 -translate-x-1/2 rounded-full bg-violet-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute right-10 top-28 h-56 w-56 rounded-full bg-[#7C5CFF]/10 blur-[90px]" />

      <section className="relative z-10 mx-auto max-w-6xl">
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-white/55 transition hover:text-white"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back to job details
        </Link>

        <div className="mt-8 rounded-[34px] border border-white/10 bg-[#111111]/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white p-2">
                {job.company?.logoUrl ? (
                  <img
                    src={job.company.logoUrl}
                    alt={job.company?.name || "Company logo"}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <FiBriefcase className="h-7 w-7 text-black" />
                )}
              </div>

              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.16em] text-violet-200">
                  Application
                </div>

                <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  Apply for {job.title}
                </h1>

                <p className="mt-3 text-sm leading-6 text-white/55">
                  Complete your application details and submit your profile for
                  this role.
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/55">
                  <span className="font-medium text-white/80">
                    {job.company?.name}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium capitalize text-white/60">
                    {job.type?.replace("-", " ")}
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-medium capitalize text-white/60">
                    {job.experienceLevel}
                  </span>
                </div>
              </div>
            </div>

            <span className="w-fit rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-medium capitalize text-green-300">
              {job.status || "active"}
            </span>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <InfoCard
              icon={<FiMapPin />}
              label="Location"
              value={job.location?.display || "Not specified"}
            />

            <InfoCard
              icon={<FiDollarSign />}
              label="Salary"
              value={formatSalary(job.salary)}
            />

            <InfoCard
              icon={<FiCalendar />}
              label="Deadline"
              value={job.deadline || "Open"}
            />

            <InfoCard
              icon={<FiUsers />}
              label="Company size"
              value={job.company?.employeeCountLabel || "Not specified"}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_380px]">
          <JobApply applicant={user} job={job} />

          <aside className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[#111111]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Job summary
              </h2>

              <div className="mt-5 space-y-4">
                <SummaryItem label="Role" value={job.title} />
                <SummaryItem
                  label="Category"
                  value={job.category?.replace("-", " ")}
                />
                <SummaryItem
                  label="Industry"
                  value={job.company?.industryLabel || job.company?.industry}
                />
                <SummaryItem label="Company" value={job.company?.name} />
                <SummaryItem
                  label="Work mode"
                  value={job.location?.display || job.location?.type}
                />
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#111111]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Required skills
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {job.skills?.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/6 px-3 py-1.5 text-xs font-medium text-white/65"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#111111]/90 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Responsibilities
              </h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-white/55">
                {job.description?.responsibilities ||
                  "Responsibilities will be shared by the recruiter."}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-violet-200">
        {icon}
      </div>

      <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/35">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold capitalize text-white/80">
        {value || "Not specified"}
      </p>
    </div>
  );
};

const SummaryItem = ({ label, value }) => {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-3 last:border-b-0 last:pb-0">
      <p className="text-sm text-white/40">{label}</p>

      <p className="text-right text-sm font-medium capitalize text-white/75">
        {value || "Not specified"}
      </p>
    </div>
  );
};

export default ApplyPage;