"use client";

import { FiSearch, FiMapPin } from "react-icons/fi";

const SearchHeroC = () => {
  return (
    <form className="relative z-30 mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-black/80 p-2 shadow-2xl shadow-violet-950/30 backdrop-blur-xl">
      <div className="grid gap-2 md:grid-cols-[1fr_250px_56px]">
        <label className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 transition focus-within:border-violet-400/50 focus-within:bg-white/[0.1]">
          <FiSearch className="h-4 w-4 shrink-0 text-white/40" />

          <input
            type="text"
            placeholder="Job title, skill or company"
            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
        </label>

        <label className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 transition focus-within:border-violet-400/50 focus-within:bg-white/[0.1]">
          <FiMapPin className="h-4 w-4 shrink-0 text-white/40" />

          <input
            type="text"
            placeholder="Location or Remote"
            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
        </label>

        <button
          type="submit"
          aria-label="Search jobs"
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.02] md:w-14"
        >
          <FiSearch className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
};

export default SearchHeroC;