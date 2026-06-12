import { getApplicationByApplicant } from "@/lib/api/application";
import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

const ApplicationsPage = async () => {
  const user = await getUserSession();

  if (!user?.id) {
    redirect("/auth/signin");
  }

  const jobs = await getApplicationByApplicant(user.id);

  return (
    <div className="p-6 text-white">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">My Applications</h1>
        <p className="text-sm text-white/50">
          Track all your applied jobs
        </p>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-xl border border-white/10 bg-[#111]">
        <table className="w-full text-left text-white">

          {/* HEADER */}
          <thead className="border-b border-white/10 text-sm text-white/70">
            <tr>
              <th className="p-3">JOB</th>
              <th className="p-3">COMPANY</th>
              <th className="p-3">TYPE</th>
              <th className="p-3">LOCATION</th>
              <th className="p-3">STATUS</th>
              <th className="p-3">DATE</th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {jobs?.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-white/40">
                  No applications found
                </td>
              </tr>
            ) : (
              jobs?.map((item) => (
                <tr
                  key={item._id || item.id}
                  className="border-b border-white/5 hover:bg-white/5"
                >

                  {/* JOB */}
                  <td className="p-3">
                    <p className="font-medium">{item.jobTitle}</p>
                    <p className="text-xs text-white/40">
                      {item.jobCategory}
                    </p>
                  </td>

                  {/* COMPANY */}
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {item.companyLogoUrl && (
                        <img
                          src={item.companyLogoUrl}
                          className="h-6 w-6 rounded-full"
                          alt="logo"
                        />
                      )}
                      <span>{item.companyName}</span>
                    </div>
                  </td>

                  {/* TYPE */}
                  <td className="p-3 text-white/70">
                    {item.jobType}
                  </td>

                  {/* LOCATION */}
                  <td className="p-3 text-white/70">
                    {item.companyLocation}
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    <StatusBadge status={item.status} />
                  </td>

                  {/* DATE */}
                  <td className="p-3 text-white/60 text-sm">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleDateString()
                      : "-"}
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
};

export default ApplicationsPage;

/* ================= STATUS BADGE ================= */

const StatusBadge = ({ status = "pending" }) => {
  const s = status.toLowerCase();

  const styles = {
    pending: "bg-yellow-500/10 text-yellow-300 border-yellow-400/30",
    approved: "bg-green-500/10 text-green-300 border-green-400/30",
    accepted: "bg-green-500/10 text-green-300 border-green-400/30",
    rejected: "bg-red-500/10 text-red-300 border-red-400/30",
    cancelled: "bg-red-500/10 text-red-300 border-red-400/30",
  };

  const style = styles[s] || styles.pending;

  return (
    <span
      className={`px-2 py-1 text-xs rounded border font-medium capitalize ${style}`}
    >
      {s}
    </span>
  );
};