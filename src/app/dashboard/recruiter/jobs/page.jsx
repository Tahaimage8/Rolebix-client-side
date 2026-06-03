import CompanyJobsTable from "@/components/dashboard/CompanyJobsTable";
import { getCompanyJobs } from "@/lib/api/jobs";

const RecruiterJobs = async () => {
  const companyId = "company_001"; // future: get from recruiter company/session
  const jobs = await getCompanyJobs(companyId);

  return (
    <section className="min-h-screen bg-[#151515] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 border-b border-white/10 pb-6">
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Company Jobs
          </h1>

          <p className="mt-2 text-sm text-white/45">
            Manage all jobs posted under your company profile.
          </p>
        </div>

        <CompanyJobsTable jobs={jobs} />
      </div>
    </section>
  );
};

export default RecruiterJobs;