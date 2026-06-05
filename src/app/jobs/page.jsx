import JobCard from "@/components/jobs/JobCard";
import { getJobs } from "@/lib/api/jobs";

const JobsPage = async () => {
  const jobs = (await getJobs()) || [];

  return (
        <div className="max-w-7xl mx-auto">
                <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {jobs.map((job) => (
        <JobCard key={job._id?.$oid || job._id} job={job} />
      ))}
    </section>
        </div>
  );
};

export default JobsPage;