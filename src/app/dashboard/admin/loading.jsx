const AdminPageLoading = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-56 rounded-3xl border border-white/10 bg-[#111]" />

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="h-32 rounded-2xl border border-white/10 bg-white/[0.035]"
        />
      ))}
    </div>

    <div className="grid gap-6 xl:grid-cols-2">
      <div className="h-96 rounded-2xl border border-white/10 bg-[#111]" />
      <div className="h-96 rounded-2xl border border-white/10 bg-[#111]" />
    </div>
  </div>
);

export default AdminPageLoading;
