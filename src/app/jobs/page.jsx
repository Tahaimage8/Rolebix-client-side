import JobsPageView from "@/components/jobs/JobsPageView";
import { getJobs } from "@/lib/api/jobs";

const JobsPage = async () => {
  const jobs = (await getJobs()) || [];

  return <JobsPageView jobs={jobs} />;
};

export default JobsPage;