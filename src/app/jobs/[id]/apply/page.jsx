/* eslint-disable @next/next/no-img-element */
import { getUserSession } from "@/lib/core/session";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getJobById } from "@/lib/api/jobs";
import JobApply from "./JobApply";
import { FiArrowLeft } from "react-icons/fi";
import { getApplicationByApplicant } from "@/lib/api/application";

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

  const applications = (await getApplicationByApplicant(user.id)) || [];

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
        <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            href={`/jobs/${id}`}
            className="inline-flex w-fit items-center gap-2 text-sm font-medium text-white/55 transition hover:text-white"
          >
            <FiArrowLeft className="h-4 w-4" />
            Back to job details
          </Link>

          <h2 className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/6 px-3 py-1 text-sm font-medium text-white/55">
            You have applied to {applications.length} jobs so far
          </h2>
        </div>

        <JobApply applicant={user} job={job} />
      </section>
    </main>
  );
};

export default ApplyPage;