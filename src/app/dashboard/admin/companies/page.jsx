import { getCompanies } from "@/lib/api/companies";
import AdminCompaniesTable from "@/components/dashboard/admin/AdminCompaniesTable";

const AdminCompaniesPage = async () => {
  const companies = await getCompanies();

  return <AdminCompaniesTable companies={companies || []} />;
};

export default AdminCompaniesPage;