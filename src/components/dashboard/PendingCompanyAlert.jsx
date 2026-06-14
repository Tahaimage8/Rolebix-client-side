"use client";

import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";

export const PendingCompanyAlert = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-2xl w-full rounded-2xl border border-yellow-500/30 bg-linear-to-br from-yellow-500/10 to-black/30 p-6 text-yellow-100 shadow-lg"
      >
        <div className="flex items-start gap-4">
          {/* Animated icon */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }} 
            className="text-2xl"
          >
            <FiClock />
          </motion.div>

          <div>
            <h2 className="text-lg font-semibold">
              Company Under Review
            </h2>

            <p className="mt-2 text-sm text-yellow-100/70 leading-6">
              Your company is being verified by our admin team.
              This usually takes <b>24–48 hours</b>.
            </p>

            {/* Progress indicator */}
            <div className="mt-4 h-2 w-full rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full w-1/2 bg-yellow-400"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </div>

            <p className="mt-3 text-xs text-yellow-200/60">
              Please wait while we verify your company details.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};