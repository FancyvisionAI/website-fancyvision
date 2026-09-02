"use client";

import { motion, useReducedMotion } from "framer-motion";

export function Reveal({
  children,
  className,
  delay = 0,
  offset = 28,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  // Distance (en px) parcourue par l'animation d'apparition. Par défaut 28
  // (comportement inchangé pour tous les usages existants — Home, Solutions
  // par secteur...). Une valeur plus faible réduit la distance parcourue,
  // pour une grille où l'élément part visuellement de trop bas.
  offset?: number;
}) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: offset }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
