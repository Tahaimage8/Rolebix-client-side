"use client";

import { motion } from "motion/react";
import { FiSearch, FiMapPin } from "react-icons/fi";

const SearchHeroC = () => {
  return (
    <motion.form
      initial={{
        opacity: 0,
        y: 24,
        scale: 0.97,
        filter: "blur(6px)",
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
      }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -2,
        scale: 1.005,
      }}
      className="relative z-30 mx-auto w-full max-w-4xl rounded-3xl border border-white/10 bg-black/80 p-2 shadow-2xl shadow-violet-950/30 backdrop-blur-xl"
    >
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.08,
              delayChildren: 0.16,
            },
          },
        }}
        className="grid gap-2 md:grid-cols-[1fr_250px_56px]"
      >
        <motion.label
          variants={{
            hidden: {
              opacity: 0,
              x: -18,
              scale: 0.98,
            },
            visible: {
              opacity: 1,
              x: 0,
              scale: 1,
            },
          }}
          transition={{
            duration: 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            y: -1,
            scale: 1.005,
          }}
          className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 transition focus-within:border-violet-400/50 focus-within:bg-white/[0.1]"
        >
          <motion.span
            whileHover={{
              rotate: 360,
              scale: 1.12,
            }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
          >
            <FiSearch className="h-4 w-4 shrink-0 text-white/40" />
          </motion.span>

          <input
            type="text"
            placeholder="Job title, skill or company"
            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
        </motion.label>

        <motion.label
          variants={{
            hidden: {
              opacity: 0,
              x: -18,
              scale: 0.98,
            },
            visible: {
              opacity: 1,
              x: 0,
              scale: 1,
            },
          }}
          transition={{
            duration: 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            y: -1,
            scale: 1.005,
          }}
          className="flex h-14 items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 transition focus-within:border-violet-400/50 focus-within:bg-white/[0.1]"
        >
          <motion.span
            whileHover={{
              y: -2,
              scale: 1.12,
            }}
            transition={{
              duration: 0.22,
              ease: "easeOut",
            }}
          >
            <FiMapPin className="h-4 w-4 shrink-0 text-white/40" />
          </motion.span>

          <input
            type="text"
            placeholder="Location or Remote"
            className="h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35"
          />
        </motion.label>

        <motion.button
          variants={{
            hidden: {
              opacity: 0,
              x: -18,
              scale: 0.92,
              rotate: -8,
            },
            visible: {
              opacity: 1,
              x: 0,
              scale: 1,
              rotate: 0,
            },
          }}
          transition={{
            duration: 0.42,
            ease: [0.22, 1, 0.36, 1],
          }}
          whileHover={{
            y: -2,
            scale: 1.06,
            rotate: 2,
          }}
          whileTap={{
            scale: 0.94,
            rotate: 0,
          }}
          type="submit"
          aria-label="Search jobs"
          className="flex h-14 w-full items-center justify-center rounded-2xl bg-linear-to-r from-[#7C5CFF] to-[#5B7CFF] text-white shadow-lg shadow-violet-500/30 transition hover:scale-[1.02] md:w-14"
        >
          <motion.span
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <FiSearch className="h-5 w-5" />
          </motion.span>
        </motion.button>
      </motion.div>
    </motion.form>
  );
};

export default SearchHeroC;