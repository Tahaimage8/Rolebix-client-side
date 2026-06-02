import React from "react";
import { Button, Card } from "@heroui/react";
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
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">
          My Top Companies
        </h2>

        <Button variant="ghost" size="sm" className="text-white/65">
          View all
        </Button>
      </div>

      {/* Card */}
      <Card className="rounded-xl border border-white/10 bg-white/4 p-6">
        <Card.Content>
          <div className="space-y-7">
            {companies.map((company) => {
              const Icon = company.icon;

              return (
                <div
                  key={company.id}
                  className="flex items-center justify-between gap-4"
                >
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

          <Button
            variant="secondary"
            className="mt-7 h-12 w-full border border-white/10 bg-transparent text-white/80"
          >
            View All Companies
          </Button>
        </Card.Content>
      </Card>
    </aside>
  );
};

export default TopCompaniesCard;