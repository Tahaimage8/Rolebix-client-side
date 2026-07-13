const SeekerApplicationsLoading = () => (
  <div className="space-y-6 animate-pulse">
    <div className="space-y-3">
      <div className="h-3 w-36 rounded bg-white/10" />
      <div className="h-9 w-64 rounded bg-white/10" />
      <div className="h-4 w-96 max-w-full rounded bg-white/10" />
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-28 rounded-2xl border border-white/10 bg-white/[0.03]"
        />
      ))}
    </div>

    <div className="h-96 rounded-2xl border border-white/10 bg-[#111]" />
  </div>
);

export default SeekerApplicationsLoading;
