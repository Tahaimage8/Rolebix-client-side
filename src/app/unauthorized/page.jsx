"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { motion } from "framer-motion";

export default function UnauthorizedPage() {
  const router = useRouter();
  const [count, setCount] = useState(5);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const timer = setTimeout(async () => {
      await authClient.signOut();
      router.push("/auth/signin");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white px-6">

      {/* BACKGROUND GLOW */}
      <div className="absolute w-[400px] h-[400px] bg-red-500/20 blur-[120px] rounded-full" />

      {/* CARD */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 text-center shadow-2xl"
      >

        {/* ICON */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="mx-auto w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-2xl font-bold"
        >
          !
        </motion.div>

        {/* TITLE */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-2xl font-semibold tracking-tight"
        >
          Access Restricted
        </motion.h1>

        {/* DESCRIPTION */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-3 text-sm text-white/60 leading-6"
        >
          You don’t have permission to access this area.
          <br />
          Auto logout for security protection.
        </motion.p>

        {/* COUNTDOWN */}
        <div className="mt-6 flex items-center justify-center gap-2 text-sm">
          <span className="text-white/50">Redirecting in</span>
          <span className="text-red-400 font-semibold text-lg">{count}</span>
          <span className="text-white/50">seconds</span>
        </div>

        {/* PROGRESS BAR */}
        <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-red-400"
            animate={{ width: `${(count / 5) * 100}%` }}
            transition={{ duration: 1 }}
          />
        </div>

        {/* BUTTONS */}
        <div className="mt-7 flex flex-col gap-3">

          <Link
            href="/auth/signin"
            className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition"
          >
            Login Again
          </Link>

          <Link
            href="/"
            className="w-full py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition"
          >
            Go Home
          </Link>

        </div>

        {/* FOOT NOTE */}
        <p className="mt-6 text-[11px] text-white/30">
          Security logout active • protected session
        </p>

      </motion.div>
    </main>
  );
}