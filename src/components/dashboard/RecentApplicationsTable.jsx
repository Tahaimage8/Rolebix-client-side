import React from "react";
import { Avatar, Button, Chip, Table } from "@heroui/react";

const defaultApplications = [
  {
    id: 1,
    candidateName: "Julianne Moore",
    role: "Senior Product Designer",
    dateApplied: "Oct 24, 2023",
    experience: "6 years",
    status: "Interviewing",
    statusColor: "success",
  },
  {
    id: 2,
    candidateName: "Robert Downey",
    role: "Backend Engineer",
    dateApplied: "Oct 23, 2023",
    experience: "4 years",
    status: "New",
    statusColor: "default",
  },
  {
    id: 3,
    candidateName: "Emma Stone",
    role: "Marketing Lead",
    dateApplied: "Oct 22, 2023",
    experience: "8 years",
    status: "Reviewing",
    statusColor: "warning",
  },
  {
    id: 4,
    candidateName: "Chris Pratt",
    role: "Product Manager",
    dateApplied: "Oct 21, 2023",
    experience: "5 years",
    status: "Rejected",
    statusColor: "danger",
  },
];

const RecentApplicationsTable = ({ applications = defaultApplications }) => {
  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          Recent Applications
        </h2>

        <Button variant="ghost" size="sm" className="text-white/65">
          View all
        </Button>
      </div>

      {/* Table */}
      <Table className="overflow-hidden rounded-xl border border-white/10 bg-white/4">
        <Table.ScrollContainer>
          <Table.Content aria-label="Recent applications table">
            <Table.Header>
              <Table.Column>Candidate Name</Table.Column>
              <Table.Column>Role</Table.Column>
              <Table.Column>Date Applied</Table.Column>
              <Table.Column>Experience</Table.Column>
              <Table.Column>Status</Table.Column>
            </Table.Header>

            <Table.Body>
              {applications.map((application) => (
                <Table.Row key={application.id}>
                  <Table.Cell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={application.candidateName}
                        className="h-9 w-9"
                      />

                      <span className="font-semibold text-white">
                        {application.candidateName}
                      </span>
                    </div>
                  </Table.Cell>

                  <Table.Cell>{application.role}</Table.Cell>
                  <Table.Cell>{application.dateApplied}</Table.Cell>
                  <Table.Cell>{application.experience}</Table.Cell>

                  <Table.Cell>
                    <Chip color={application.statusColor} size="sm">
                      {application.status}
                    </Chip>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.ScrollContainer>
      </Table>
    </section>
  );
};

export default RecentApplicationsTable;