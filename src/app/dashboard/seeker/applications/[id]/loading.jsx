const ApplicationDetailsLoading = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-4 w-40 rounded bg-white/10" />

    <div className="h-56 rounded-3xl border border-white/10 bg-[#111]" />

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="h-24 rounded-2xl border border-white/10 bg-white/[0.03]"
        />
      ))}
    </div>

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <div className="h-72 rounded-2xl border border-white/10 bg-[#111]" />
      <div className="h-72 rounded-2xl border border-white/10 bg-[#111]" />
    </div>
  </div>
);

export default ApplicationDetailsLoading;
