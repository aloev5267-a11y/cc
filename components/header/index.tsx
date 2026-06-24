"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { siteConfig } from "@/lib/config"
import { IconPhone, IconArrow } from "../icons"
import { navItems } from "./nav-config"
import { MessengerPill } from "./messenger-pill"
import { HamburgerIcon } from "./hamburger-icon"
import { MobileMenu } from "./mobile-menu"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16)
    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when navigating
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  const isActive = (href: string) => {
    if (href.startsWith("/#") || href.startsWith("#")) return false
    return pathname === href || pathname.startsWith(href + "/")
  }

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border/70 shadow-[0_2px_20px_-8px_oklch(0_0_0/0.15)]"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
              <div className="relative w-9 h-9 rounded-xl overflow-hidden ring-1 ring-border/60 group-hover:ring-primary/40 transition-all">
                <Image src="/logo.png" alt={siteConfig.name} fill className="object-cover" priority />
              </div>
              <span className="text-lg font-black tracking-tight text-foreground">
                {siteConfig.brandPrefix}
                <span className="text-primary">{siteConfig.brandSuffix}</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                      active
                        ? "text-primary"
                        : "text-foreground/70 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span className="absolute inset-x-4 -bottom-px h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                )
              })}
            </nav>

            {/* Right actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden xl:flex">
                <MessengerPill />
              </div>

              <a
                href={siteConfig.contact.phoneHref}
                className="hidden lg:flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <IconPhone className="w-4 h-4 text-primary" />
                </span>
                <span className="tabular-nums">{siteConfig.contact.phone}</span>
              </a>

              <Link
                href="/#find"
                className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 btn-primary text-primary-foreground text-sm font-bold rounded-full btn-shine transition-transform hover:scale-105"
              >
                Подобрать работу
                <IconArrow className="w-4 h-4" />
              </Link>

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
