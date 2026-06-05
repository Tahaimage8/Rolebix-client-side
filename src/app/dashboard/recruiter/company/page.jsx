import React from "react";
import CompanyProfile from "./CompanyProfile";
import { getUserSession } from "@/lib/core/session";
import { getRecruiterCompany } from "@/lib/api/companies";

const CompanyPage = async () => {
  const recruiter = await getUserSession();
  // console.log('Recruiter:', recruiter);

  const recruiterCompany = await getRecruiterCompany(recruiter?.id);
  return (
    <div>
      <CompanyProfile
        recruiter={recruiter}
        recruiterCompany={recruiterCompany}
      />
    </div>
  );
};

export default CompanyPage;
