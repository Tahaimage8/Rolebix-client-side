
import AdminUsersTable from "@/components/dashboard/admin/AdminUsersTable";
import { getUsersList } from "@/lib/api/users";

const AdminUsersPage = async () => {
  const data = await getUsersList();

  const users = (data?.users || []).map((user) => ({
    ...user,
    createdAt: user?.createdAt ? new Date(user.createdAt).toISOString() : null,
    updatedAt: user?.updatedAt ? new Date(user.updatedAt).toISOString() : null,
  }));

  return <AdminUsersTable users={users} totalUsers={data?.total || users.length} />;
};

export default AdminUsersPage;