import React from "react";

const StatCard = ({ statsData = [] }) => {
  return (
    <section className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {statsData.map((stat) => {
        const { title, value, icon: Icon } = stat;

        return (
          <article
            key={title}
            className="rounded-xl border border-white/10 bg-[#1b1b1b] p-6 text-white"
          >
            {/* Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white/70">
              {Icon && <Icon className="h-5 w-5" />}
            </div>

            {/* Title */}
            <p className="mt-8 text-sm text-white/60">{title}</p>

            {/* Value */}
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
              {value}
            </h3>
          </article>
        );
      })}
    </section>
  );
};

export default StatCard;