import JobDetailsView from "@/components/jobs/JobDetailsView";
import { getJobById } from "@/lib/api/jobs";
import { notFound } from "next/navigation";

const JobsDetailsPage = async ({ params }) => {
  const { id } = await params;

  const job = await getJobById(id);

  if (!job?._id) {
    notFound();
  }

  return <JobDetailsView job={job} />;
};

export default JobsDetailsPage;
