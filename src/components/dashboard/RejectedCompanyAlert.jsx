"use client";

import { motion } from "framer-motion";
import { FiXCircle } from "react-icons/fi";

export const RejectedCompanyAlert = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-100"
      >
        <div className="flex items-start gap-4">
          <FiXCircle className="text-2xl text-red-400" />

          <div>
            <h2 className="text-lg font-semibold">
              Company Not Approved
            </h2>

            <p className="mt-2 text-sm text-red-100/70 leading-6">
              Please update your company details and resubmit.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};