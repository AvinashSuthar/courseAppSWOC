import { motion } from "framer-motion";
import React from "react";
import { Button } from "../ui/button";

export default function DummyFooter() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="text-center md:mt-20 mt-10 mb-10 md:p-12 p-6 bg-card rounded-2xl border border-border/50 shadow-lg"
    >
      <h2 className="text-2xl md:text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
        Not sure where to start?
      </h2>
      <p className="md:text-xl text-base text-muted-foreground mb-8 max-w-2xl mx-auto">
        Our course advisors are here to help you choose the perfect learning
        path tailored to your goals and experience.
      </p>
      <Button
        variant="default"
        size="lg"
        className="rounded-full md:text-lg text-sm md:px-8 md:py-6"
      >
        Get Personalized Recommendations
      </Button>
    </motion.div>
  );
}
