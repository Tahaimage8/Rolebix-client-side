"use client";

import Link from "next/link";
import { Button, Chip, Table } from "@heroui/react";
import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";

const categoryLabels = {
  design: "Design",
  development: "Development",
  "software-engineering": "Software Engineering",
  "web-development": "Web Development",
  "mobile-development": "Mobile Development",
  "data-science": "Data Science",
  "ai-ml": "AI / Machine Learning",
  devops: "DevOps / Cloud",
  cybersecurity: "Cybersecurity",
  "product-management": "Product Management",
  "project-management": "Project Management",
  marketing: "Marketing",
  "digital-marketing": "Digital Marketing",
  sales: "Sales",
  "customer-support": "Customer Support",
  operations: "Operations",
  "human-resources": "Human Resources",
  finance: "Finance / Accounting",
  "content-writing": "Content Writing",
  "video-editing": "Video Editing",
  education: "Education / Training",
  healthcare: "Healthcare",
  legal: "Legal",
  management: "Management",
};

const typeLabels = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  contract: "Contract",
  internship: "Internship",
};

const statusColors = {
  active: "success",
  draft: "warning",
  closed: "danger",
};

const getJobId = (job) => {
  if (typeof job?._id === "string") return job._id;
  if (job?._id?.$oid) return job._id.$oid;
  return job?.id;
};

const formatSalary = (salary) => {
  if (!salary?.min || !salary?.max) return "Not specified";

  return `${salary.currency || "USD"} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`;
};

const formatDate = (date) => {
  if (!date) return "No deadline";

  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const CompanyJobsTable = ({ jobs = [] }) => {
  return (
    <section className="rounded-3xl border border-white/10 bg-[#1b1b1b] p-6 text-white shadow-2xl shadow-black/20">
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            Manage Jobs
          </h2>
          <p className="mt-1 text-sm text-white/45">
            View, edit, and manage all jobs posted by your company.
          </p>
        </div>

        <Chip color="success" size="sm" variant="soft">
          {jobs.length} Jobs
        </Chip>
      </div>

      {/* Table */}
      <Table>
        <Table.ResizableContainer>
          <Table.Content
            aria-label="Company jobs table"
            className="min-w-225"
          >
            <Table.Header>
              <Table.Column isRowHeader defaultWidth="1.5fr" id="title" minWidth={220}>
                Job
                <Table.ColumnResizer />
              </Table.Column>

              <Table.Column defaultWidth="1fr" id="category" minWidth={180}>
                Category
                <Table.ColumnResizer />
              </Table.Column>

              <Table.Column defaultWidth="1fr" id="salary" minWidth={180}>
                Salary
                <Table.ColumnResizer />
              </Table.Column>

              <Table.Column defaultWidth="1fr" id="deadline" minWidth={150}>
                Deadline
                <Table.ColumnResizer />
              </Table.Column>

              <Table.Column defaultWidth="120px" id="status" minWidth={110}>
                Status
                <Table.ColumnResizer />
              </Table.Column>

              <Table.Column defaultWidth="150px" id="actions" minWidth={140}>
                Actions
              </Table.Column>
            </Table.Header>

            <Table.Body>
              {jobs.map((job) => {
                const jobId = getJobId(job);

                return (
                  <Table.Row key={jobId}>
                    {/* Job title */}
                    <Table.Cell>
                      <div>
                        <h3 className="font-semibold text-white">
                          {job.title}
                        </h3>

                        <p className="mt-1 text-sm text-white/45">
                          {typeLabels[job.type] || job.type} •{" "}
                          {job.location?.display || "Location not set"}
                        </p>
                      </div>
                    </Table.Cell>

                    {/* Category */}
                    <Table.Cell>
                      <span className="text-sm text-white/70">
                        {categoryLabels[job.category] || job.category}
                      </span>
                    </Table.Cell>

                    {/* Salary */}
                    <Table.Cell>
                      <span className="text-sm font-medium text-white/75">
                        {formatSalary(job.salary)}
                      </span>
                    </Table.Cell>

                    {/* Deadline */}
                    <Table.Cell>
                      <span className="text-sm text-white/65">
                        {formatDate(job.deadline)}
                      </span>
                    </Table.Cell>

                    {/* Status */}
                    <Table.Cell>
                      <Chip
                        color={statusColors[job.status] || "default"}
                        size="sm"
                        variant="soft"
                        className="capitalize"
                      >
                        {job.status}
                      </Chip>
                    </Table.Cell>

                    {/* Actions */}
                    <Table.Cell>
                      <div className="flex items-center gap-2">
                        <Button
                          as={Link}
                          href={`/dashboard/recruiter/jobs/${jobId}`}
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="text-white/70 hover:text-white"
                        >
                          <FiEye className="h-4 w-4" />
                        </Button>

                        <Button
                          as={Link}
                          href={`/dashboard/recruiter/jobs/${jobId}/edit`}
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="text-white/70 hover:text-white"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </Button>

                        <Button
                          type="button"
                          isIconOnly
                          size="sm"
                          variant="ghost"
                          className="text-red-400 hover:text-red-300"
                          onPress={() => console.log("Delete job:", jobId)}
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Content>
        </Table.ResizableContainer>
      </Table>
    </section>
  );
};

export default CompanyJobsTable;