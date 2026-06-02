import React from "react";

const defaultApplications = [
  {
    id: 1,
    candidateName: "Julianne Moore",
    role: "Senior Product Designer",
    dateApplied: "Oct 24, 2023",
    experience: "6 years",
    status: "Interviewing",
    statusColor: "green",
  },
  {
    id: 2,
    candidateName: "Robert Downey",
    role: "Backend Engineer",
    dateApplied: "Oct 23, 2023",
    experience: "4 years",
    status: "New",
    statusColor: "gray",
  },
  {
    id: 3,
    candidateName: "Emma Stone",
    role: "Marketing Lead",
    dateApplied: "Oct 22, 2023",
    experience: "8 years",
    status: "Reviewing",
    statusColor: "yellow",
  },
  {
    id: 4,
    candidateName: "Chris Pratt",
    role: "Product Manager",
    dateApplied: "Oct 21, 2023",
    experience: "5 years",
    status: "Rejected",
    statusColor: "red",
  },
];

const statusStyles = {
  green: "bg-green-500/15 text-green-400",
  gray: "bg-white/15 text-white",
  yellow: "bg-yellow-500/15 text-yellow-400",
  red: "bg-red-500/15 text-red-400",
};

const RecentApplicationsTable = ({ applications = defaultApplications }) => {
  return (
    <section>
      {/* Section header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          Recent Applications
        </h2>

        <button
          type="button"
          className="text-sm text-white/65 transition hover:text-white"
        >
          View all
        </button>
      </div>

      {/* Table wrapper */}
      <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.04]">
        <table className="w-full text-left">
          {/* Table head */}
          <thead className="border-b border-white/10 text-sm text-white/70">
            <tr>
              <th className="px-6 py-5 font-semibold">Candidate Name</th>
              <th className="px-6 py-5 font-semibold">Role</th>
              <th className="px-6 py-5 font-semibold">Date Applied</th>
              <th className="px-6 py-5 font-semibold">Experience</th>
              <th className="px-6 py-5 font-semibold">Status</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {applications.map((application) => (
              <tr
                key={application.id}
                className="border-b border-white/5 last:border-b-0"
              >
                {/* Candidate name */}
                <td className="px-6 py-6">
                  <div className="flex items-center gap-4">
                    <span className="h-9 w-9 rounded-full bg-white/10" />

                    <span className="font-semibold text-white">
                      {application.candidateName}
                    </span>
                  </div>
                </td>

                {/* Role */}
                <td className="px-6 py-6 text-white/65">
                  {application.role}
                </td>

                {/* Date applied */}
                <td className="px-6 py-6 text-white/65">
                  {application.dateApplied}
                </td>

                {/* Experience */}
                <td className="px-6 py-6 text-white/65">
                  {application.experience}
                </td>

                {/* Status */}
                <td className="px-6 py-6">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      statusStyles[application.statusColor] || statusStyles.gray
                    }`}
                  >
                    {application.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default RecentApplicationsTable;