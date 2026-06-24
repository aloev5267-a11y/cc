"use client"

import { motion } from "framer-motion"
import { IconPhone, IconTruck } from "../icons"
import { Tooltip } from "./tooltip"
import { DropdownMenu } from "./dropdown-menu"
import { navItems, serviceItems } from "./nav-config"

interface DesktopNavProps {
  navOpen: boolean
  setNavOpen: (open: boolean) => void
  servicesOpen: boolean
  setServicesOpen: (open: boolean) => void
  onCalculatorClick: (e: React.MouseEvent) => void
}

export function DesktopNav({ 
  navOpen, 
  setNavOpen, 
  servicesOpen, 
  setServicesOpen,
  onCalculatorClick 
}: DesktopNavProps) {
  return (
    <div className="hidden md:flex items-center gap-1">
      {/* Nav Menu Button */}
      <div className="relative">
        <Tooltip label="Навигация">
          <motion.button
            onClick={() => {
              setNavOpen(!navOpen)
              setServicesOpen(false)
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              navOpen
                ? "bg-foreground text-background"
                : "bg-muted/60 text-foreground/70 hover:bg-muted hover:text-foreground"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
              <path d="M4 6h16M4 12h10M4 18h14" strokeLinecap="round" />
            </svg>
          </motion.button>
        </Tooltip>

        <DropdownMenu
          isOpen={navOpen}
          items={navItems}
          onClose={() => setNavOpen(false)}
          onCalculatorClick={onCalculatorClick}
          position="left"
        />
      </div>

      {/* Phone Button */}
      <Tooltip label="Позвонить">
        <motion.a
          href="tel:+78001234567"
          className="w-9 h-9 rounded-full bg-muted/60 flex items-center justify-center text-foreground/70 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
          whileTap={{ scale: 0.95 }}
        >
          <IconPhone className="w-4 h-4" />
        </motion.a>
      </Tooltip>

      {/* Services Menu Button */}
      <div className="relative">
        <Tooltip label="Услуги">
          <motion.button
            onClick={() => {
              setServicesOpen(!servicesOpen)
              setNavOpen(false)
            }}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
              servicesOpen
                ? "bg-primary text-white"
                : "bg-primary/10 text-primary hover:bg-primary/20"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <IconTruck className="w-4 h-4" />
          </motion.button>
        </Tooltip>

        <DropdownMenu
          isOpen={servicesOpen}
          items={serviceItems}
          onClose={() => setServicesOpen(false)}
          position="right"
        />
      </div>
    </div>
  )
}
