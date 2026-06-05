import CompanyJobsTable from "@/components/dashboard/CompanyJobsTable";
import { getLoggedInRecruiterCompany } from "@/lib/api/companies";
import { getCompanyJobs } from "@/lib/api/jobs";

const getCompanyId = (company) => {
  if (typeof company?._id === "string") return company._id;
  if (company?._id?.$oid) return company._id.$oid;
  return company?.id || "";
};

const RecruiterJobs = async () => {
  const company = await getLoggedInRecruiterCompany();

  const companyId = getCompanyId(company);

  const jobs = companyId ? await getCompanyJobs(companyId) : [];

  if (!company) {
    return (
      <section className="min-h-screen bg-[#151515] p-6 text-white lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-8">
            <h1 className="text-2xl font-semibold text-white">
              No company found
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Please register your company first before managing jobs.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#151515] p-6 text-white lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              Company Jobs
            </h1>

            <p className="mt-2 text-sm text-white/45">
              Manage all jobs posted under your company profile.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/4 px-4 py-3">
            <p className="text-xs text-white/40">Company</p>
            <p className="mt-1 font-semibold text-white">{company.name}</p>
          </div>
        </div>

        <CompanyJobsTable jobs={jobs} />
      </div>
    </section>
  );
};

export default RecruiterJobs;