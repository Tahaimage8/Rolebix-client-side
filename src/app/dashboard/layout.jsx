import DashboardSideBar from "@/components/dashboard/DashboardSideBar";

const DashboardLayout = ({ children }) => {
  return (
    <section className="flex min-h-screen bg-[#151515] text-white">
      {/* Sidebar */}
      <DashboardSideBar />

      {/* Main dashboard area */}
      <main className="min-w-0 flex-1 overflow-x-hidden p-10">
        {children}
      </main>
    </section>
  );
};

export default DashboardLayout;