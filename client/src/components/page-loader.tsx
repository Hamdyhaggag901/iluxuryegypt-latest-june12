import { motion } from "framer-motion";

export default function PageLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Simple spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
          className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full"
        />

        {/* Brand text */}
        <div className="text-center">
          <h2 className="text-xl font-serif font-bold text-primary">
            I.LUXURYEGYPT
          </h2>
        </div>
      </div>
    </motion.div>
  );
}