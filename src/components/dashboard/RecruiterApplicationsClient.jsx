"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Button,
  Card,
  Chip,
  Input,
  Spinner,
  Table,
} from "@heroui/react";
import { toast } from "react-toastify";
import { ArrowUpArrowDown } from "@gravity-ui/icons";
import {
  FiBriefcase,
  FiChevronDown,
  FiChevronUp,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiFileText,
  FiMail,
  FiSearch,
  FiUser,
  FiUsers,
  FiX,
  FiXCircle,
} from "react-icons/fi";

const STATUS_OPTIONS = [
  { value: "applied", label: "Applied" },
  { value: "reviewing", label: "Reviewing" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "interview", label: "Interview" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
];

const STATUS_CHIP = {
  applied: { color: "accent", variant: "soft" },
  reviewing: { color: "warning", variant: "soft" },
  shortlisted: { color: "accent", variant: "soft" },
  interview: { color: "default", variant: "soft" },
  hired: { color: "success", variant: "soft" },
  rejected: { color: "danger", variant: "soft" },
};

const getMongoId = (value) => {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (value?.$oid) return value.$oid;
  return String(value);
};

const normalizeStatus = (status) => {
  const value = String(status || "applied").toLowerCase();

  if (value === "new") return "applied";
  if (value === "interviewing") return "interview";

  return STATUS_OPTIONS.some((item) => item.value === value)
    ? value
    : "applied";
};

const formatDate = (date) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getCandidateName = (application) =>
  application?.applicant?.name ||
  application?.applicantName ||
  application?.candidateName ||
  application?.name ||
  "Unnamed candidate";

const getCandidateEmail = (application) =>
  application?.applicant?.email ||
  application?.applicantEmail ||
  application?.email ||
  "No email";

const getCandidateImage = (application) =>
  application?.applicant?.image || application?.applicantImage || "";

const getJobTitle = (application) =>
  application?.job?.title ||
  application?.jobTitle ||
  application?.position ||
  "Untitled job";

const getResumeUrl = (application) =>
  application?.resumeUrl || application?.resume || application?.resumeLink || "";

const getStatusLabel = (status) =>
  STATUS_OPTIONS.find((item) => item.value === normalizeStatus(status))?.label ||
  "Applied";

const StatCard = ({ icon: Icon, label, value, tone = "accent" }) => {
  const toneClasses = {
    accent: "bg-accent-soft text-accent-soft-foreground",
    warning: "bg-warning-soft text-warning-soft-foreground",
    success: "bg-success-soft text-success-soft-foreground",
    default: "bg-default-soft text-default-soft-foreground",
  };

  return (
    <Card
      variant="default"
      className="border border-border/70 bg-surface shadow-surface"
    >
      <Card.Content className="flex-row items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
            {value}
          </p>
        </div>

        <div
          className={`flex size-11 items-center justify-center rounded-2xl ${
            toneClasses[tone] || toneClasses.accent
          }`}
        >
          <Icon className="size-5" />
        </div>
      </Card.Content>
    </Card>
  );
};

const StatusChip = ({ status }) => {
  const normalizedStatus = normalizeStatus(status);
  const style = STATUS_CHIP[normalizedStatus] || STATUS_CHIP.applied;

  return (
    <Chip color={style.color} variant={style.variant} size="md">
      <Chip.Label>{getStatusLabel(normalizedStatus)}</Chip.Label>
    </Chip>
  );
};

const SortableHeader = ({ children, sortDirection }) => (
  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
    <span>{children}</span>

    {sortDirection === "ascending" ? (
      <FiChevronUp className="size-3.5 text-accent" aria-hidden="true" />
    ) : sortDirection === "descending" ? (
      <FiChevronDown className="size-3.5 text-accent" aria-hidden="true" />
    ) : (
      <ArrowUpArrowDown
        className="size-3.5 text-muted/70"
        aria-hidden="true"
      />
    )}
  </span>
);

const EmptyState = ({ hasFilters }) => (
  <Card
    variant="secondary"
    className="border border-border/60 bg-surface-secondary"
  >
    <Card.Content className="min-h-72 items-center justify-center px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-accent-soft text-accent-soft-foreground">
        <FiUsers className="size-6" />
      </div>

      <Card.Title className="mt-5 text-lg">
        {hasFilters ? "No matching applications" : "No applications yet"}
      </Card.Title>

      <Card.Description className="mt-1 max-w-md leading-6">
        {hasFilters
          ? "Try changing the candidate search, job, or status filter."
          : "Applications submitted to your company jobs will appear here."}
      </Card.Description>
    </Card.Content>
  </Card>
);

const RecruiterApplicationsClient = ({
  initialApplications = [],
  initialJobs = [],
  company = null,
  errorMessage = "",
}) => {
  const [applications, setApplications] = useState(initialApplications);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState("");
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [sortDescriptor, setSortDescriptor] = useState(
    /** @type {import("@react-types/shared").SortDescriptor} */ ({
      column: "appliedAt",
      direction: "descending",
    }),
  );

  const jobs = useMemo(() => {
    if (initialJobs.length) return initialJobs;

    const uniqueJobs = new Map();

    applications.forEach((application) => {
      const id = getMongoId(application?.job?._id || application?.jobId);

      if (id && !uniqueJobs.has(id)) {
        uniqueJobs.set(id, {
          _id: id,
          title: getJobTitle(application),
        });
      }
    });

    return Array.from(uniqueJobs.values());
  }, [applications, initialJobs]);

  const stats = useMemo(() => {
    const nextStats = {
      total: applications.length,
      applied: 0,
      reviewing: 0,
      shortlisted: 0,
      interview: 0,
      hired: 0,
      rejected: 0,
    };

    applications.forEach((application) => {
      const status = normalizeStatus(application?.status);
      nextStats[status] = (nextStats[status] || 0) + 1;
    });

    return nextStats;
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = applications.filter((application) => {
      const status = normalizeStatus(application?.status);
      const applicationJobId = getMongoId(
        application?.job?._id || application?.jobId,
      );

      const matchesStatus =
        statusFilter === "all" || status === statusFilter;
      const matchesJob =
        jobFilter === "all" || applicationJobId === jobFilter;

      const searchableText = [
        getCandidateName(application),
        getCandidateEmail(application),
        getJobTitle(application),
        application?.applicant?.phone,
        application?.phone,
        Array.isArray(application?.skills)
          ? application.skills.join(" ")
          : application?.skills,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !normalizedSearch || searchableText.includes(normalizedSearch);

      return matchesStatus && matchesJob && matchesSearch;
    });

    const sorted = [...filtered].sort((a, b) => {
      const column = sortDescriptor?.column;
      /** @type {string | number} */
      let firstValue = "";
      /** @type {string | number} */
      let secondValue = "";

      if (column === "candidate") {
        firstValue = getCandidateName(a).toLowerCase();
        secondValue = getCandidateName(b).toLowerCase();
      } else if (column === "job") {
        firstValue = getJobTitle(a).toLowerCase();
        secondValue = getJobTitle(b).toLowerCase();
      } else if (column === "status") {
        firstValue = normalizeStatus(a?.status);
        secondValue = normalizeStatus(b?.status);
      } else {
        firstValue = new Date(a?.createdAt || 0).getTime();
        secondValue = new Date(b?.createdAt || 0).getTime();
      }

      let comparison = 0;

      if (firstValue < secondValue) comparison = -1;
      if (firstValue > secondValue) comparison = 1;

      return sortDescriptor?.direction === "descending"
        ? -comparison
        : comparison;
    });

    return sorted;
  }, [applications, jobFilter, search, sortDescriptor, statusFilter]);

  const updateStatus = async (application, nextStatus) => {
    const applicationId = getMongoId(application?._id || application?.id);

    if (!applicationId) {
      toast.error("Application ID was not found.");
      return;
    }

    const currentStatus = normalizeStatus(application?.status);

    if (currentStatus === nextStatus) return;

    try {
      setUpdatingId(applicationId);

      const response = await fetch(
        `/api/recruiter/applications/${applicationId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
        },
      );

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          payload?.message || "Application status update failed.",
        );
      }

      const updatedAt = new Date().toISOString();

      setApplications((currentApplications) =>
        currentApplications.map((item) => {
          const itemId = getMongoId(item?._id || item?.id);

          return itemId === applicationId
            ? {
                ...item,
                status: nextStatus,
                updatedAt,
              }
            : item;
        }),
      );

      setSelectedApplication((current) => {
        if (!current) return current;

        const selectedId = getMongoId(current?._id || current?.id);

        return selectedId === applicationId
          ? { ...current, status: nextStatus, updatedAt }
          : current;
      });

      toast.success("Application status updated.");
    } catch (error) {
      toast.error(error?.message || "Could not update application status.");
    } finally {
      setUpdatingId("");
    }
  };

  const hasFilters =
    Boolean(search.trim()) ||
    statusFilter !== "all" ||
    jobFilter !== "all";

  return (
    <div className="space-y-6 text-foreground">
      {errorMessage ? (
        <Card
          variant="default"
          className="border border-danger/30 bg-danger-soft text-danger-soft-foreground"
        >
          <Card.Content>
            <p className="text-sm font-medium">{errorMessage}</p>
          </Card.Content>
        </Card>
      ) : null}

      {!company && !errorMessage ? (
        <Card
          variant="default"
          className="border border-warning/30 bg-warning-soft text-warning-soft-foreground"
        >
          <Card.Content className="gap-3">
            <div>
              <Card.Title className="text-warning-soft-foreground">
                Company profile required
              </Card.Title>
              <Card.Description className="mt-1 text-warning-soft-foreground/80">
                Register your company before managing job applications.
              </Card.Description>
            </div>

            <Link
              href="/dashboard/recruiter/company"
              className="inline-flex h-10 w-fit items-center justify-center rounded-3xl bg-warning px-4 text-sm font-medium text-warning-foreground transition hover:opacity-90"
            >
              Open company profile
            </Link>
          </Card.Content>
        </Card>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={FiFileText}
          label="Total applications"
          value={stats.total}
          tone="accent"
        />
        <StatCard
          icon={FiClock}
          label="Needs review"
          value={stats.applied + stats.reviewing}
          tone="warning"
        />
        <StatCard
          icon={FiUsers}
          label="Interview stage"
          value={stats.interview}
          tone="default"
        />
        <StatCard
          icon={FiCheckCircle}
          label="Hired"
          value={stats.hired}
          tone="success"
        />
      </div>

      <Card
        variant="default"
        className="border border-border/70 bg-surface shadow-surface"
      >
        <Card.Content>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted" />
              <Input
                aria-label="Search applications"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search candidate, email, or job..."
                className="h-11 w-full pl-10"
              />
            </div>

            <select
              aria-label="Filter applications by job"
              value={jobFilter}
              onChange={(event) => setJobFilter(event.target.value)}
              className="h-11 w-full rounded-field border border-field-border bg-field px-3 text-sm text-field-foreground outline-none transition focus:border-focus focus:ring-2 focus:ring-focus/25"
            >
              <option value="all">All jobs</option>
              {jobs.map((job) => {
                const jobId = getMongoId(job?._id || job?.id);

                return (
                  <option key={jobId} value={jobId}>
                    {job?.title || "Untitled job"}
                  </option>
                );
              })}
            </select>

            <select
              aria-label="Filter applications by status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-11 w-full rounded-field border border-field-border bg-field px-3 text-sm text-field-foreground outline-none transition focus:border-focus focus:ring-2 focus:ring-focus/25"
            >
              <option value="all">All statuses</option>
              {STATUS_OPTIONS.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
        </Card.Content>
      </Card>

      {filteredApplications.length === 0 ? (
        <EmptyState hasFilters={hasFilters} />
      ) : (
        <Card
          variant="default"
          className="overflow-hidden border border-border/70 bg-surface p-0 shadow-surface"
        >
          <Card.Header className="flex-row items-center justify-between gap-4 border-b border-separator/70 px-5 py-4">
            <div>
              <Card.Title className="text-base">Candidate applications</Card.Title>
              <Card.Description className="mt-0.5">
                Showing {filteredApplications.length} of {applications.length}
              </Card.Description>
            </div>

            <div className="flex size-10 items-center justify-center rounded-2xl bg-default-soft text-default-soft-foreground">
              <FiBriefcase className="size-5" />
            </div>
          </Card.Header>

          <Card.Content className="gap-0 p-0">
            <Table variant="secondary" className="w-full">
              <Table.ScrollContainer>
                <Table.Content
                  aria-label="Recruiter applications table"
                  sortDescriptor={sortDescriptor}
                  onSortChange={setSortDescriptor}
                >
                  <Table.Header>
                    <Table.Column id="candidate" allowsSorting isRowHeader>
                      {({ sortDirection }) => (
                        <SortableHeader sortDirection={sortDirection}>
                          Candidate
                        </SortableHeader>
                      )}
                    </Table.Column>

                    <Table.Column id="job" allowsSorting>
                      {({ sortDirection }) => (
                        <SortableHeader sortDirection={sortDirection}>
                          Job
                        </SortableHeader>
                      )}
                    </Table.Column>

                    <Table.Column id="appliedAt" allowsSorting>
                      {({ sortDirection }) => (
                        <SortableHeader sortDirection={sortDirection}>
                          Applied
                        </SortableHeader>
                      )}
                    </Table.Column>

                    <Table.Column id="status" allowsSorting>
                      {({ sortDirection }) => (
                        <SortableHeader sortDirection={sortDirection}>
                          Status
                        </SortableHeader>
                      )}
                    </Table.Column>

                    <Table.Column id="actions">Actions</Table.Column>
                  </Table.Header>

                  <Table.Body>
                    {filteredApplications.map((application) => {
                      const applicationId = getMongoId(
                        application?._id || application?.id,
                      );
                      const status = normalizeStatus(application?.status);
                      const candidateName = getCandidateName(application);
                      const candidateEmail = getCandidateEmail(application);
                      const candidateImage = getCandidateImage(application);
                      const isUpdating = updatingId === applicationId;

                      return (
                        <Table.Row
                          id={applicationId}
                          key={applicationId}
                          className="group"
                        >
                          <Table.Cell className="min-w-64 px-4 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar size="md" color="accent" variant="soft">
                                {candidateImage ? (
                                  <Avatar.Image
                                    src={candidateImage}
                                    alt={candidateName}
                                  />
                                ) : null}
                                <Avatar.Fallback>
                                  {candidateName.charAt(0).toUpperCase()}
                                </Avatar.Fallback>
                              </Avatar>

                              <div className="min-w-0">
                                <p className="truncate font-semibold text-foreground">
                                  {candidateName}
                                </p>
                                <p className="truncate text-sm text-muted">
                                  {candidateEmail}
                                </p>
                              </div>
                            </div>
                          </Table.Cell>

                          <Table.Cell className="min-w-52 px-4 py-4">
                            <p className="max-w-64 truncate font-medium text-foreground/90">
                              {getJobTitle(application)}
                            </p>
                          </Table.Cell>

                          <Table.Cell className="whitespace-nowrap px-4 py-4 text-muted">
                            {formatDate(application?.createdAt)}
                          </Table.Cell>

                          <Table.Cell className="min-w-44 px-4 py-4">
                            <div className="flex items-center gap-2">
                              <StatusChip status={status} />

                              <select
                                aria-label={`Update ${candidateName}'s application status`}
                                value={status}
                                disabled={isUpdating}
                                onChange={(event) =>
                                  updateStatus(application, event.target.value)
                                }
                                className="h-9 min-w-32 rounded-field border border-field-border bg-field px-2.5 text-xs font-medium text-field-foreground outline-none transition focus:border-focus disabled:cursor-wait disabled:opacity-60"
                              >
                                {STATUS_OPTIONS.map((item) => (
                                  <option key={item.value} value={item.value}>
                                    {item.label}
                                  </option>
                                ))}
                              </select>

                              {isUpdating ? <Spinner size="sm" /> : null}
                            </div>
                          </Table.Cell>

                          <Table.Cell className="px-4 py-4">
                            <Button
                              size="sm"
                              variant="outline"
                              onPress={() =>
                                setSelectedApplication(application)
                              }
                            >
                              <FiEye />
                              View
                            </Button>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>

              <Table.Footer className="flex items-center justify-between border-t border-separator/70 px-5 py-3 text-xs text-muted">
                <span>{filteredApplications.length} applications shown</span>
                <span>Click a column heading to sort</span>
              </Table.Footer>
            </Table>
          </Card.Content>
        </Card>
      )}

      {selectedApplication ? (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-backdrop p-4 backdrop-blur-sm">
          <button
            type="button"
            aria-label="Close application details"
            className="absolute inset-0 cursor-default"
            onClick={() => setSelectedApplication(null)}
          />

          <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-overlay text-overlay-foreground shadow-overlay">
            <div className="flex items-start justify-between gap-4 border-b border-separator/70 p-6">
              <div>
                <p className="text-sm font-medium text-accent">
                  Application details
                </p>
                <h2 className="mt-1 text-2xl font-bold tracking-tight text-overlay-foreground">
                  {getCandidateName(selectedApplication)}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {getJobTitle(selectedApplication)}
                </p>
              </div>

              <Button
                isIconOnly
                variant="ghost"
                aria-label="Close"
                onPress={() => setSelectedApplication(null)}
              >
                <FiX />
              </Button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <Card variant="secondary" className="shadow-none">
                  <Card.Content>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <FiMail />
                      Email
                    </div>
                    <p className="mt-1 break-all text-sm text-muted">
                      {getCandidateEmail(selectedApplication)}
                    </p>
                  </Card.Content>
                </Card>

                <Card variant="secondary" className="shadow-none">
                  <Card.Content>
                    <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                      <FiUser />
                      Current status
                    </div>
                    <div className="mt-2">
                      <StatusChip status={selectedApplication?.status} />
                    </div>
                  </Card.Content>
                </Card>
              </div>

              <div>
                <h3 className="font-semibold text-overlay-foreground">
                  Cover letter
                </h3>
                <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-muted">
                  {selectedApplication?.coverLetter ||
                    selectedApplication?.message ||
                    "No cover letter was provided."}
                </p>
              </div>

              <div className="flex flex-col gap-3 border-t border-separator/70 pt-5 sm:flex-row sm:items-center">
                {getResumeUrl(selectedApplication) ? (
                  <a
                    href={getResumeUrl(selectedApplication)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-3xl bg-accent px-4 text-sm font-medium text-accent-foreground transition hover:bg-accent-hover"
                  >
                    <FiFileText />
                    Open resume
                  </a>
                ) : (
                  <Chip color="default" variant="soft" size="lg">
                    <FiXCircle />
                    <Chip.Label>Resume not attached</Chip.Label>
                  </Chip>
                )}

                <select
                  aria-label="Update selected application status"
                  value={normalizeStatus(selectedApplication?.status)}
                  disabled={
                    updatingId ===
                    getMongoId(
                      selectedApplication?._id || selectedApplication?.id,
                    )
                  }
                  onChange={(event) =>
                    updateStatus(selectedApplication, event.target.value)
                  }
                  className="h-10 min-w-44 rounded-field border border-field-border bg-field px-3 text-sm font-medium text-field-foreground outline-none transition focus:border-focus disabled:cursor-wait disabled:opacity-60"
                >
                  {STATUS_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                      Set as {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default RecruiterApplicationsClient;