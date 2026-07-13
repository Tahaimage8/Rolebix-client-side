const SeekerDashboardLoading = () => (
  <div className="space-y-7 animate-pulse">
    <div className="h-64 rounded-3xl border border-white/10 bg-[#111]" />

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="h-36 rounded-2xl border border-white/10 bg-white/[0.035]"
        />
      ))}
    </div>

    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
      <div className="h-[430px] rounded-2xl border border-white/10 bg-[#111]" />

      <div className="space-y-6">
        <div className="h-56 rounded-2xl border border-white/10 bg-[#111]" />
        <div className="h-80 rounded-2xl border border-white/10 bg-[#111]" />
      </div>
    </div>

    <div className="h-80 rounded-2xl border border-white/10 bg-[#111]" />
  </div>
);

export default SeekerDashboardLoading;
