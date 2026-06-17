import { getCompanies } from "@/lib/api/companies";
import AdminCompaniesTable from "@/components/dashboard/admin/AdminCompaniesTable";

const getCompanyId = (company) => {
  if (typeof company?._id === "string") return company._id;
  if (company?._id?.$oid) return company._id.$oid;
  return company?.id || "";
};

const AdminCompaniesPage = async () => {
  const companies = (await getCompanies()) || [];
  const tableKey = companies
    .map(
      (company) =>
        `${getCompanyId(company)}:${company?.status || ""}:${
          company?.updatedAt || ""
        }`,
    )
    .join("|");

  return <AdminCompaniesTable key={tableKey} companies={companies} />;
};

export default AdminCompaniesPage;
