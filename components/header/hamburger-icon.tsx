"use client"

import { motion } from "framer-motion"

// Animated hamburger icon for mobile menu
export function HamburgerIcon({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative w-10 h-10 rounded-xl bg-muted/80 flex items-center justify-center group hover:bg-muted transition-colors"
      aria-label={isOpen ? "Закрыть меню" : "Открыть меню"}
    >
      <div className="w-5 h-4 flex flex-col justify-between">
        <motion.span
          animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
          className="w-full h-0.5 bg-foreground rounded-full origin-center"
        />
        <motion.span
          animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
          className="w-3/4 h-0.5 bg-foreground rounded-full"
        />
        <motion.span
          animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
          className="w-full h-0.5 bg-foreground rounded-full origin-center"
        />
      </div>
    </button>
  )
}
