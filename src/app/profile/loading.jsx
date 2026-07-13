const ProfileLoading = () => (
  <main className="min-h-screen bg-[#090909] px-4 py-8 text-white sm:px-6 lg:px-8">
    <div className="mx-auto max-w-6xl space-y-6 animate-pulse">
      <div className="h-56 rounded-3xl border border-white/10 bg-[#111]" />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <div className="h-44 rounded-2xl border border-white/10 bg-[#111]" />
          <div className="h-80 rounded-2xl border border-white/10 bg-[#111]" />
          <div className="h-36 rounded-2xl border border-white/10 bg-[#111]" />
        </div>

        <div className="space-y-6">
          <div className="h-56 rounded-2xl border border-white/10 bg-[#111]" />
          <div className="h-96 rounded-2xl border border-white/10 bg-[#111]" />
        </div>
      </div>
    </div>
  </main>
);

export default ProfileLoading;
