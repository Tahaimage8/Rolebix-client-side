import JobsPageView from "@/components/jobs/JobsPageView";
import { getJobs } from "@/lib/api/jobs";

const JobsPage = async ({ searchParams }) => {
  const params = await searchParams;

  const filters = {
    search: params?.search || "",
    category: params?.category || "all",
    type: params?.type || "all",
    experienceLevel: params?.experienceLevel || "all",
    workMode: params?.workMode || "all",
    company: params?.company || "all",
  };

  const data = await getJobs({
    page: params?.page || "1",
    limit: params?.limit || "9",
    ...filters,
  });

  return (
    <JobsPageView
      jobs={data?.jobs || []}
      pagination={
        data?.pagination || {
          page: 1,
          limit: 9,
          totalJobs: 0,
          totalPages: 1,
          hasNextPage: false,
          hasPreviousPage: false,
        }
      }
      filters={filters}
    />
  );
};

export default JobsPage;