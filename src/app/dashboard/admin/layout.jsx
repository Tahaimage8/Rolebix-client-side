import { getUserSession } from "@/lib/core/session";
import { redirect } from "next/navigation";

const AdminLayout = async ({ children }) => {
  const user = await getUserSession();

  if (!user) {
    redirect("/auth/signin");
  }

  if (user?.role !== "admin") {
    redirect("/unauthorized");
  }

  return children;
};

export default AdminLayout;
