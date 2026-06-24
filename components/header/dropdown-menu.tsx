"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import type { NavItem } from "./nav-config"

interface DropdownMenuProps {
  isOpen: boolean
  items: NavItem[]
  onClose: () => void
  onCalculatorClick?: (e: React.MouseEvent) => void
  position?: "left" | "right"
}

export function DropdownMenu({ 
  isOpen, 
  items, 
  onClose, 
  onCalculatorClick,
  position = "left" 
}: DropdownMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={`absolute top-12 w-48 bg-background border border-border rounded-xl shadow-xl overflow-hidden ${
            position === "left" ? "left-1/2 -translate-x-1/2" : "right-0"
          }`}
        >
          {items.map((item, i) => {
            const Icon = item.icon
            const isCalculator = item.label === "Калькулятор"
            
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                {isCalculator && onCalculatorClick ? (
                  <button
                    onClick={onCalculatorClick}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors w-full text-left"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                  </Link>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
