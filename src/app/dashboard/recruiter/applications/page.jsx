import RecruiterApplicationsClient from "@/components/dashboard/RecruiterApplicationsClient";
import { getRecruiterApplications } from "@/lib/api/recruiterApplications";

const emptyData = {
  applications: [],
  jobs: [],
  company: null,
  stats: {
    total: 0,
    applied: 0,
    reviewing: 0,
    shortlisted: 0,
    interview: 0,
    hired: 0,
    rejected: 0,
  },
};

const RecruiterApplicationsPage = async () => {
  let data = emptyData;
  let errorMessage = "";

  try {
    data = await getRecruiterApplications();
  } catch (error) {
    console.error("Recruiter applications page error:", error);
    errorMessage =
      error?.message || "Applications could not be loaded. Please try again.";
  }

  return (
    <section className="space-y-6 text-foreground">
      <div className="flex flex-col gap-2">
        <div className="inline-flex w-fit items-center rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent-soft-foreground">
          Recruiter workspace
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Applications
        </h1>

        <p className="max-w-2xl text-sm leading-6 text-muted">
          Review candidates, open resumes, and update every application&apos;s
          hiring status from one place.
        </p>
      </div>

      <RecruiterApplicationsClient
        initialApplications={data?.applications || []}
        initialJobs={data?.jobs || []}
        company={data?.company || null}
        errorMessage={errorMessage}
      />
    </section>
  );
};

export default RecruiterApplicationsPage;
