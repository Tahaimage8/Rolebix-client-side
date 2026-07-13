import { getSeekerApplicationById } from "@/lib/api/seekerApplications";
import { getUserSession } from "@/lib/core/session";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

const STATUS_CONFIG = {
  applied: {
    label: "Applied",
    description: "Your application was submitted successfully.",
    className: "border-blue-400/30 bg-blue-500/10 text-blue-300",
    dotClassName: "bg-blue-400",
  },
  reviewing: {
    label: "Reviewing",
    description: "The recruiter is reviewing your application.",
    className: "border-amber-400/30 bg-amber-500/10 text-amber-300",
    dotClassName: "bg-amber-400",
  },
  shortlisted: {
    label: "Shortlisted",
    description: "Your profile has been shortlisted.",
    className: "border-violet-400/30 bg-violet-500/10 text-violet-300",
    dotClassName: "bg-violet-400",
  },
  interview: {
    label: "Interview",
    description: "You have moved to the interview stage.",
    className: "border-cyan-400/30 bg-cyan-500/10 text-cyan-300",
    dotClassName: "bg-cyan-400",
  },
  hired: {
    label: "Hired",
    description: "The recruiter marked this application as hired.",
    className: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300",
    dotClassName: "bg-emerald-400",
  },
  rejected: {
    label: "Rejected",
    description: "The recruiter did not move forward with this application.",
    className: "border-red-400/30 bg-red-500/10 text-red-300",
    dotClassName: "bg-red-400",
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

const getId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value?.$oid) return value.$oid;
  return String(value);
};

const formatDate = (date, includeTime = false) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...(includeTime
      ? {
          hour: "numeric",
          minute: "2-digit",
        }
      : {}),
  });
};

const ApplicationDetailsPage = async ({ params }) => {
  const user = await getUserSession();
  const userId = user?.id || user?._id;

  if (!userId) {
    redirect("/auth/signin");
  }

  const { id } = await params;

  let application = null;
  let errorMessage = "";

  try {
    application = await getSeekerApplicationById(id);
  } catch (error) {
    console.error("Application details page error:", error);

    if (error?.status === 404) {
      notFound();
    }

    errorMessage =
      error?.message || "Application details could not be loaded.";
  }

  if (errorMessage) {
    return (
      <section className="space-y-5 text-white">
        <Link
          href="/dashboard/seeker/applications"
          className="inline-flex text-sm text-white/55 transition hover:text-white"
        >
          ← Back to applications
        </Link>

        <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-5 text-sm text-red-200">
          {errorMessage}
        </div>
      </section>
    );
  }

  if (!application) {
    notFound();
  }

  const job = application?.job || {};
  const status = normalizeStatus(application?.status);
  const statusConfig = STATUS_CONFIG[status];

  const jobId = getId(
    application?.jobId || job?._id || job?.id,
  );

  const jobTitle =
    job?.title ||
    application?.jobTitle ||
    application?.position ||
    "Untitled job";

  const companyName =
    job?.company?.name ||
    application?.companyName ||
    "Company unavailable";

  const category =
    job?.category || application?.jobCategory || "Not specified";

  const jobType =
    job?.type || application?.jobType || "Not specified";

  const location =
    job?.location?.display ||
    job?.location?.city ||
    application?.companyLocation ||
    "Not specified";

  const experience =
    job?.experienceLevel ||
    application?.experienceLevel ||
    "Not specified";

  const resumeUrl =
    application?.resumeUrl ||
    application?.resume ||
    application?.resumeLink ||
    "";

  const history = Array.isArray(application?.statusHistory)
    ? [...application.statusHistory]
    : [];

  if (!history.length) {
    history.push({
      status: "applied",
      changedAt: application?.createdAt,
    });

    if (status !== "applied") {
      history.push({
        status,
        changedAt: application?.updatedAt,
      });
    }
  }

  history.sort((first, second) => {
    const firstTime = new Date(
      first?.changedAt || first?.at || 0,
    ).getTime();
    const secondTime = new Date(
      second?.changedAt || second?.at || 0,
    ).getTime();

    return firstTime - secondTime;
  });

  return (
    <section className="space-y-6 text-white">
      <Link
        href="/dashboard/seeker/applications"
        className="inline-flex text-sm text-white/55 transition hover:text-white"
      >
        ← Back to applications
      </Link>

      <div className="rounded-3xl border border-white/10 bg-[#111] p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/35">
              Application details
            </p>

            <h1 className="mt-3 text-3xl font-bold tracking-tight">
              {jobTitle}
            </h1>

            <p className="mt-2 text-base text-white/55">
              {companyName}
            </p>
          </div>

          <span
            className={`inline-flex w-fit rounded-full border px-3 py-1.5 text-sm font-semibold ${
              statusConfig.className
            }`}
          >
            {statusConfig.label}
          </span>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="font-medium text-white">
            {statusConfig.description}
          </p>
          <p className="mt-1 text-sm text-white/40">
            Last updated {formatDate(application?.updatedAt || application?.createdAt, true)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <InfoCard label="Category" value={category} />
        <InfoCard label="Employment type" value={jobType} />
        <InfoCard label="Location" value={location} />
        <InfoCard label="Experience level" value={experience} />
        <InfoCard
          label="Applied on"
          value={formatDate(application?.createdAt)}
        />
        <InfoCard
          label="Application ID"
          value={getId(application?._id || application?.id)}
          breakAll
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
            <h2 className="text-lg font-semibold">Cover letter</h2>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-white/55">
              {application?.coverLetter ||
                application?.message ||
                "No cover letter was submitted with this application."}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
            <h2 className="text-lg font-semibold">Documents and links</h2>

            <div className="mt-4 flex flex-wrap gap-3">
              {resumeUrl ? (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
                >
                  Open submitted resume
                </a>
              ) : (
                <span className="inline-flex h-10 items-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white/40">
                  No resume attached
                </span>
              )}

              {jobId ? (
                <Link
                  href={`/jobs/${jobId}`}
                  className="inline-flex h-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white/70 transition hover:bg-white/10 hover:text-white"
                >
                  View original job
                </Link>
              ) : null}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#111] p-6">
          <h2 className="text-lg font-semibold">Application timeline</h2>

          <div className="mt-6 space-y-0">
            {history.map((entry, index) => {
              const entryStatus = normalizeStatus(entry?.status);
              const config = STATUS_CONFIG[entryStatus];
              const isLast = index === history.length - 1;

              return (
                <div
                  key={`${entryStatus}-${entry?.changedAt || entry?.at || index}`}
                  className="relative flex gap-4 pb-6 last:pb-0"
                >
                  {!isLast ? (
                    <span className="absolute left-[5px] top-4 h-[calc(100%-4px)] w-px bg-white/10" />
                  ) : null}

                  <span
                    className={`relative mt-1.5 h-3 w-3 shrink-0 rounded-full ${
                      config.dotClassName
                    }`}
                  />

                  <div>
                    <p className="font-semibold text-white">
                      {config.label}
                    </p>
                    <p className="mt-1 text-xs text-white/40">
                      {formatDate(
                        entry?.changedAt || entry?.at,
                        true,
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

const InfoCard = ({ label, value, breakAll = false }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
    <p className="text-xs font-semibold uppercase tracking-wider text-white/35">
      {label}
    </p>
    <p
      className={`mt-2 font-medium text-white/85 ${
        breakAll ? "break-all text-sm" : ""
      }`}
    >
      {value}
    </p>
  </div>
);

export default ApplicationDetailsPage;
