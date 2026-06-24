"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/lib/config"
import { HamburgerIcon } from "./hamburger-icon"
import { MobileMenu } from "./mobile-menu"
import { MessengerPill } from "./messenger-pill"
import { RegionPicker } from "./region-picker"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  // Переключатель режимов: соискатель (главная) / работодатель (partners)
  const employerMode = pathname.startsWith("/partners")

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center gap-3 sm:gap-5">
            {/* Logo — красный круг-марк + вордмарк */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group" aria-label={siteConfig.name}>
              <span className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-black text-sm lowercase tracking-tight">
                {siteConfig.brandPrefix.slice(0, 2)}
              </span>
              <span className="hidden sm:inline text-lg font-extrabold tracking-tight text-foreground">
                {siteConfig.brandPrefix}
                <span className="text-accent">{siteConfig.brandSuffix}</span>
              </span>
            </Link>

            {/* Сегментированный переключатель — как на hh */}
            <div className="hidden md:flex items-center p-1 rounded-full bg-secondary shrink-0">
              <Link
                href="/"
                className={`px-4 lg:px-6 py-2 text-sm font-semibold rounded-full transition-all ${
                  !employerMode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Ищу работу
              </Link>
              <Link
                href="/partners"
                className={`px-4 lg:px-6 py-2 text-sm font-semibold rounded-full transition-all ${
                  employerMode ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Ищу сотрудника
              </Link>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-4 ml-auto">
              {/* Автоопределение региона + выбор города (как на hh.ru) */}
              <div className="hidden md:block">
                <RegionPicker />
              </div>

              {/* Мессенджеры — единый стиль с остальным сайтом */}
              <div className="hidden sm:block">
                <MessengerPill />
              </div>

              {/* Mobile hamburger */}
              <div className="lg:hidden">
                <HamburgerIcon isOpen={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  )
}
