"use client";

import { usePathname } from "next/navigation";
import Navbar from "../Navbar";
import Footer from "../Footer";

// Tomar project-er actual import path use korba


const ConditionalLayout = ({ children }) => {
  const pathname = usePathname();

  const isDashboardRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  return (
    <>
      {!isDashboardRoute ? <Navbar /> : null}

      {children}

      {!isDashboardRoute ? <Footer /> : null}
    </>
  );
};

export default ConditionalLayout;