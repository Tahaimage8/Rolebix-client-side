"use client";

import RecentApplicationsTable from "@/components/dashboard/RecentApplicationsTable";
import StatCard from "@/components/dashboard/StatCard";
import TopCompaniesCard from "@/components/dashboard/TopCompaniesCard";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/react";
import { FiFileText, FiUsers, FiZap, FiCheckCircle } from "react-icons/fi";

const RecruiterDashboardHomePage = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div>
        <Spinner size="sm" />
      </div>
    );
  }

  const data = session?.user;

  const statsData = [
    {
      title: "Total Job Posts",
      value: "48",
      icon: FiFileText,
    },
    {
      title: "Total Applicants",
      value: "1,284",
      icon: FiUsers,
    },
    {
      title: "Active Jobs",
      value: "18",
      icon: FiZap,
    },
    {
      title: "Jobs Closed",
      value: "32",
      icon: FiCheckCircle,
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome back, {data?.name}</h1>

      <StatCard statsData={statsData} />
    <section className="mt-14 grid gap-8 xl:grid-cols-[1.9fr_0.95fr]">
  <RecentApplicationsTable />
  <TopCompaniesCard />
</section>

    </div>
  );
};

export default RecruiterDashboardHomePage;