import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import Link from "next/link";

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
      <main className="min-h-screen bg-black px-4 py-24 text-white">
        <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-[#111111]/90 p-8 text-center shadow-2xl shadow-black/50">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 text-2xl">
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

  return (
    <main className="min-h-screen bg-black px-4 py-24 text-white">
      <div className="mx-auto max-w-3xl rounded-[32px] border border-white/10 bg-[#111111]/90 p-8 shadow-2xl shadow-black/50">
        <h1 className="text-3xl font-semibold tracking-tight text-white">
          Apply for this job
        </h1>

        <p className="mt-3 text-sm leading-6 text-white/55">
          Complete your application details and submit your profile for this
          role.
        </p>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/6 p-6">
          Apply here
        </div>
      </div>
    </main>
  );
};

export default ApplyPage;