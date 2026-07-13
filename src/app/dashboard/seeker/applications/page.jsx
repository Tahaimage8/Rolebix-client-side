import { Table } from "@heroui/react";
import { getSeekerApplications } from "@/lib/api/seekerApplications";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";
import Link from "next/link";

const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    className: "border-blue-400/30 bg-blue-500/10 text-blue-300",
  },
  reviewing: {
    label: "Reviewing",
    className: "border-amber-400/30 bg-amber-500/10 text-amber-300",
  },
  shortlisted: {
    label: "Shortlisted",
    className: "border-violet-400/30 bg-violet-500/10 text-violet-300",
  },
  interview: {
    label: "Interview",
    className: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
  },
  hired: {
    label: "Hired",
    className: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
  },
  rejected: {
    label: "Rejected",
    className: "border-red-400/30 bg-red-500/10 text-red-300",
  },
};

const normalizeStatus = (status) => {
  const value = String(status || "applied").toLowerCase();

  if (value === "pending" || value === "new") return "applied";
  if (value === "approved") return "shortlisted";
  if (value === "accepted") return "hired";
  if (value === "interviewing") return "interview";

  return STATUS_CONFIG[value] ? value : "applied";
};

const StatusBadge = ({ status }) => {
  const normalizedStatus = normalizeStatus(status);
  const config = STATUS_CONFIG[normalizedStatus];

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${
        config.className
      }`}
    >
      {config.label}
    </span>
  );
};

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value?.$oid) return value.$oid;
  return String(value);
};

const getJobTitle = (item) =>
  item?.job?.title || item?.jobTitle || item?.position || "Untitled job";

const getJobCategory = (item) =>
  item?.job?.category || item?.jobCategory || "Not specified";

const getCompanyName = (item) =>
  item?.job?.company?.name || item?.companyName || "Company unavailable";

const getJobType = (item) =>
  item?.job?.type || item?.jobType || "Not specified";

const getLocation = (item) =>
  item?.job?.location?.display ||
  item?.job?.location?.city ||
  item?.companyLocation ||
  "Not specified";

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const ApplicationsPage = async () => {
  const user = await getUserSession();
  const userId = user?.id || user?._id;

  if (!userId) {
    redirect("/auth/signin");
  }

  let applications = [];
  let errorMessage = "";

  try {
    const result = await getSeekerApplications(userId);
    applications = Array.isArray(result) ? result : result?.applications || [];
  } catch (error) {
    console.error("Seeker applications page error:", error);
    errorMessage =
      error?.message || "Your applications could not be loaded.";
  }

  const totalApplications = applications.length;
  const activeApplications = applications.filter(
    (item) =>
      !["hired", "rejected"].includes(normalizeStatus(item?.status)),
  ).length;
  const interviewCount = applications.filter(
    (item) => normalizeStatus(item?.status) === "interview",
  ).length;
  const hiredCount = applications.filter(
    (item) => normalizeStatus(item?.status) === "hired",
  ).length;

  return (
    <section className="space-y-6 p-1 text-white sm:p-2">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
          Seeker workspace
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">
          My Applications
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Track every job application and follow the latest hiring status.
        </p>
      </div>

      {errorMessage ? (
        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total applications" value={totalApplications} />
        <StatCard label="Active applications" value={activeApplications} />
        <StatCard label="Interview stage" value={interviewCount} />
        <StatCard label="Hired" value={hiredCount} />
      </div>

      {totalApplications === 0 && !errorMessage ? (
        <div className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-xl">
            0
          </div>

          <h2 className="mt-5 text-xl font-semibold">
            No applications found
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-white/45">
            Apply to a job first. Your submitted applications will appear
            here automatically.
          </p>

          <Link
            href="/jobs"
            className="mt-5 inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Browse jobs
          </Link>
        </div>
      ) : null}

      {totalApplications > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div>
              <h2 className="font-semibold">Application history</h2>
              <p className="mt-1 text-xs text-white/40">
                {totalApplications} application
                {totalApplications === 1 ? "" : "s"} found
              </p>
            </div>

            <Link
              href="/jobs"
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              Find more jobs
            </Link>
          </div>

          <Table className="w-full">
            <Table.ScrollContainer>
              <Table.Content aria-label="My job applications">
                <Table.Header>
                  <Table.Column id="job" isRowHeader>
                    JOB
                  </Table.Column>
                  <Table.Column id="company">COMPANY</Table.Column>
                  <Table.Column id="type">TYPE</Table.Column>
                  <Table.Column id="location">LOCATION</Table.Column>
                  <Table.Column id="applied">APPLIED</Table.Column>
                  <Table.Column id="status">STATUS</Table.Column>
                  <Table.Column id="details">DETAILS</Table.Column>
                </Table.Header>

                <Table.Body>
                  {applications.map((item) => {
                    const applicationId = getId(item?._id || item?.id);

                    return (
                      <Table.Row id={applicationId} key={applicationId}>
                        <Table.Cell className="min-w-60 py-4">
                          <div>
                            <p className="font-semibold text-white">
                              {getJobTitle(item)}
                            </p>
                            <p className="mt-1 text-xs text-white/40">
                              {getJobCategory(item)}
                            </p>
                          </div>
                        </Table.Cell>

                        <Table.Cell className="min-w-44 py-4 text-white/75">
                          {getCompanyName(item)}
                        </Table.Cell>

                        <Table.Cell className="min-w-32 py-4 text-white/60">
                          {getJobType(item)}
                        </Table.Cell>

                        <Table.Cell className="min-w-44 py-4 text-white/60">
                          {getLocation(item)}
                        </Table.Cell>

                        <Table.Cell className="min-w-32 py-4 text-white/50">
                          {formatDate(item?.createdAt)}
                        </Table.Cell>

                        <Table.Cell className="min-w-32 py-4">
                          <StatusBadge status={item?.status} />
                        </Table.Cell>

                        <Table.Cell className="py-4">
                          <Link
                            href={`/dashboard/seeker/applications/${applicationId}`}
                            className="inline-flex rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-300 transition hover:bg-blue-500/20"
                          >
                            Details
                          </Link>
                        </Table.Cell>
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>

            <Table.Footer className="border-t border-white/10 px-5 py-3 text-xs text-white/35">
              Status updates made by recruiters will appear here.
            </Table.Footer>
          </Table>
        </div>
      ) : null}
    </section>
  );
};

const StatCard = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
    <p className="text-sm text-white/45">{label}</p>
    <p className="mt-2 text-3xl font-bold tracking-tight text-white">
      {value}
    </p>
  </div>
);

export default ApplicationsPage;
