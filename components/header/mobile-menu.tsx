"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { IconPhone, IconClose } from "../icons"
import { navItems, serviceItems, type NavItem } from "./nav-config"
import { siteConfig } from "@/lib/config"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onCalculatorClick: (e: React.MouseEvent) => void
}

function MobileNavItem({ 
  item, 
  index, 
  onClose, 
  onCalculatorClick,
  isService = false 
}: { 
  item: NavItem
  index: number
  onClose: () => void
  onCalculatorClick: (e: React.MouseEvent) => void
  isService?: boolean
}) {
  const Icon = item.icon
  const isCalculator = item.label === "Калькулятор"
  
  const iconContainerClass = isService 
    ? "w-9 h-9 rounded-lg bg-muted flex items-center justify-center"
    : "w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center"
  
  const iconClass = isService 
    ? "w-4 h-4 text-foreground/70"
    : "w-4 h-4 text-primary"
  
  const textClass = isService 
    ? "font-medium text-foreground/80"
    : "font-medium"
  
  const content = (
    <>
      <div className={iconContainerClass}>
        <Icon className={iconClass} />
      </div>
      <span className={textClass}>{item.label}</span>
    </>
  )
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {isCalculator ? (
        <button
          onClick={onCalculatorClick}
          className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors w-full"
        >
          {content}
        </button>
      ) : (
        <Link
          href={item.href}
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors"
        >
          {content}
        </Link>
      )}
    </motion.div>
  )
}

export function MobileMenu({ isOpen, onClose, onCalculatorClick }: MobileMenuProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          />

          {/* Menu */}
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 bottom-0 w-[280px] bg-background border-l border-border shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link href="/" className="flex items-center gap-2" onClick={onClose}>
                <div className="relative w-8 h-8 rounded-lg overflow-hidden">
                  <Image src="/logo.png" alt={siteConfig.name} fill className="object-cover" />
                </div>
                <span className="text-sm font-bold">
                  {siteConfig.brandPrefix}<span className="text-primary">{siteConfig.brandSuffix}</span>
                </span>
              </Link>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"
                aria-label="Закрыть меню"
              >
                <IconClose className="w-4 h-4" />
              </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto py-4">
              <div className="px-4 mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Навигация
                </span>
              </div>
              {navItems.map((item, i) => (
                <MobileNavItem 
                  key={item.href} 
                  item={item} 
                  index={i} 
                  onClose={onClose}
                  onCalculatorClick={onCalculatorClick}
                />
              ))}

              <div className="px-4 mt-6 mb-2">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Услуги
                </span>
              </div>
              {serviceItems.map((item, i) => (
                <MobileNavItem 
                  key={item.href} 
                  item={item} 
                  index={navItems.length + i} 
                  onClose={onClose}
                  onCalculatorClick={onCalculatorClick}
                  isService
                />
              ))}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border">
              <a
                href={siteConfig.contact.phoneHref}
                className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl"
              >
                <IconPhone className="w-4 h-4" />
                Позвонить
              </a>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
