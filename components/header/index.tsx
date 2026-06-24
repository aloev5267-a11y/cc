"use client"

import { MessengerPill } from "./messenger-pill"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { siteConfig } from "@/lib/config"
import { HamburgerIcon } from "./hamburger-icon"
import { DesktopNav } from "./desktop-nav"
import { MobileMenu } from "./mobile-menu"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navOpen, setNavOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setNavOpen(false)
        setServicesOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Прокрутка к секции "Как это работает" (для соискателей)
  const handleCalculatorClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setNavOpen(false)
    setMobileMenuOpen(false)

    const element = document.getElementById('how')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.location.href = '/#how'
    }
  }

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-3 sm:top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${
          isScrolled ? "top-2" : ""
        }`}
      >
        {/* Pill-shaped container */}
        <div
          className={`animate-slide-down flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-full border transition-all duration-300 ${
            isScrolled
              ? "bg-background/95 backdrop-blur-xl shadow-lg border-border/50"
              : "bg-background/80 backdrop-blur-md border-border/30"
          }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 pl-1 pr-2 shrink-0">
            <div className="relative w-8 h-8 rounded-lg overflow-hidden">
              <Image
                src="/logo.png"
                alt={siteConfig.name}
                fill
                className="object-cover"
                priority
              />
            </div>
            <span className="hidden sm:block text-sm font-bold tracking-tight text-foreground">
              {siteConfig.brandPrefix}<span className="text-primary">{siteConfig.brandSuffix}</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <MessengerPill />
          <DesktopNav
            navOpen={navOpen}
            setNavOpen={setNavOpen}
            servicesOpen={servicesOpen}
            setServicesOpen={setServicesOpen}
            onCalculatorClick={handleCalculatorClick}
          />

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <HamburgerIcon 
              isOpen={mobileMenuOpen} 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onCalculatorClick={handleCalculatorClick}
      />
    </>
  )
}
