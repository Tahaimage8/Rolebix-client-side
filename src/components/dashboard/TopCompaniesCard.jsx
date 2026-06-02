import React from "react";
import { FiBox, FiCpu, FiZap } from "react-icons/fi";

const defaultCompanies = [
  {
    id: 1,
    name: "Google Inc.",
    category: "Technology",
    location: "Mountain View",
    activeJobs: 24,
    icon: FiCpu,
  },
  {
    id: 2,
    name: "Meta Platforms",
    category: "Social Media",
    location: "Menlo Park",
    activeJobs: 18,
    icon: FiZap,
  },
  {
    id: 3,
    name: "Stripe",
    category: "Fintech",
    location: "San Francisco",
    activeJobs: 12,
    icon: FiBox,
  },
  {
    id: 4,
    name: "Tesla",
    category: "Automotive",
    location: "Austin",
    activeJobs: 31,
    icon: FiZap,
  },
];

const TopCompaniesCard = ({ companies = defaultCompanies }) => {
  return (
    <aside>
      {/* Section header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          My Top Companies
        </h2>

        <button
          type="button"
          className="text-sm text-white/65 transition hover:text-white"
        >
          View all
        </button>
      </div>

      {/* Card */}
      <div className="rounded-xl border border-white/10 bg-white/[0.04] p-6">
        <div className="space-y-7">
          {companies.map((company) => {
            const Icon = company.icon;

            return (
              <div
                key={company.id}
                className="flex items-center justify-between gap-4"
              >
                {/* Company left info */}
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 text-white/75">
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {company.name}
                    </h3>

                    <p className="mt-1 text-sm text-white/45">
                      {company.category} • {company.location}
                    </p>
                  </div>
                </div>

                {/* Active jobs */}
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">
                    {company.activeJobs}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-white/55">
                    Active Jobs
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Button */}
        <button
          type="button"
          className="mt-7 h-12 w-full rounded-lg border border-white/10 text-sm font-semibold text-white/80 transition hover:bg-white/5 hover:text-white"
        >
          View All Companies
        </button>
      </div>
    </aside>
  );
};

export default TopCompaniesCard;