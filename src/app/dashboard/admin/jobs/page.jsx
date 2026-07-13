import { getAdminJobs } from "@/lib/api/admin";
import AdminJobsManager from "@/components/dashboard/admin/AdminJobsManager";

const AdminJobsPage = async ({ searchParams }) => {
  const resolvedSearchParams = await searchParams;

  const filters = {
    page: Math.max(Number(resolvedSearchParams?.page) || 1, 1),
    search: String(resolvedSearchParams?.search || ""),
    status: String(resolvedSearchParams?.status || "all"),
    category: String(resolvedSearchParams?.category || "all"),
  };

  let data = {
    jobs: [],
    pagination: {
      page: filters.page,
      limit: 10,
      total: 0,
      totalPages: 1,
      hasNextPage: false,
      hasPreviousPage: false,
    },
  };
  let errorMessage = "";

  try {
    data = await getAdminJobs(filters);
  } catch (error) {
    console.error("Admin jobs page error:", error);
    errorMessage =
      error?.message || "Admin jobs could not be loaded.";
  }

  return (
    <section className="space-y-6 text-white">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
          Administration
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          Job Moderation
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-white/50">
          Review every job listing and control whether it is active,
          pending, paused, closed, or rejected.
        </p>
      </div>

      <AdminJobsManager
        initialJobs={data?.jobs || []}
        pagination={data?.pagination}
        initialFilters={filters}
        errorMessage={errorMessage}
      />
    </section>
  );
};

export default AdminJobsPage;
