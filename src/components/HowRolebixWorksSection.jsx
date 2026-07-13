import Link from "next/link";

const steps = [
  {
    number: "01",
    title: "Create your profile",
    description:
      "Add your experience, skills, and career preferences so Rolebix understands what you are looking for.",
    accent: "from-violet-500/20 to-transparent",
  },
  {
    number: "02",
    title: "Discover better matches",
    description:
      "Explore relevant opportunities from growing companies and find roles that fit your goals.",
    accent: "from-blue-500/20 to-transparent",
  },
  {
    number: "03",
    title: "Apply and track",
    description:
      "Submit applications, follow recruiter updates, and manage your progress from one dashboard.",
    accent: "from-cyan-500/20 to-transparent",
  },
];

const StepIcon = ({ number }) => {
  if (number === "01") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
      </svg>
    );
  }

  if (number === "02") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
        <path d="M8.5 11h5" />
        <path d="M11 8.5v5" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z" />
      <path d="m7 12 3 3 7-7" />
    </svg>
  );
};

const HowRolebixWorksSection = () => {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-[#0a0a0a] px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-72 w-[46rem] -translate-x-1/2 rounded-full bg-violet-500/10 blur-[110px]" />

        <div
          className="absolute inset-0 opacity-[0.16]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-violet-200">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
            How Rolebix works
          </div>

          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            From profile to opportunity
            <span className="block text-white/45">
              in three simple steps.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/45 sm:text-base">
            Rolebix keeps job discovery and application tracking simple, so
            you can focus on choosing the right next move.
          </p>
        </div>

        <div className="relative mt-12 grid gap-4 lg:grid-cols-3">
          <div className="pointer-events-none absolute left-[16.5%] right-[16.5%] top-12 hidden h-px bg-gradient-to-r from-transparent via-white/15 to-transparent lg:block" />

          {steps.map((step) => (
            <article
              key={step.number}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111] p-6 transition duration-300 hover:-translate-y-1 hover:border-white/20 sm:p-7"
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b ${step.accent} opacity-80`}
              />

              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-white/75 transition group-hover:bg-white/[0.08] group-hover:text-white">
                    <StepIcon number={step.number} />
                  </div>

                  <span className="text-4xl font-black tracking-tighter text-white/[0.08]">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-8 text-xl font-semibold tracking-tight">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-white/45">
                  {step.description}
                </p>

                <div className="mt-8 h-px bg-white/10" />

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.18em] text-white/30">
                  Step {step.number}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/auth/register"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-white px-5 text-sm font-semibold text-black transition hover:bg-white/90 sm:w-auto"
          >
            Create your profile
          </Link>

          <Link
            href="/jobs"
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:bg-white/10 hover:text-white sm:w-auto"
          >
            Browse available jobs
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowRolebixWorksSection;
