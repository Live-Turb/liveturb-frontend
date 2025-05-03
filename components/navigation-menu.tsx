"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { startTrial } from "@/lib/fbpixel"

export default function NavigationMenu() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Sections for navigation
  const sections = [
    { name: "Recursos", href: "#recursos" },
    { name: "Como Funciona", href: "#como-funciona" },
    { name: "Análises", href: "#analises" },
    { name: "Depoimentos", href: "#depoimentos" },
    { name: "Preços", href: "#precos" },
    { name: "FAQ", href: "#faq" },
  ]

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Scroll to section smoothly
  const scrollToSection = (sectionId: string) => {
    setIsMobileMenuOpen(false)
    const element = document.getElementById(sectionId.replace("#", ""))
    if (element) {
      const yOffset = -80 // Header height + some padding
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
    }
  }

  // Função para rolar até a seção de preços
  const scrollToPrecos = () => {
    setIsMobileMenuOpen(false)
    const precosSection = document.getElementById("precos")
    if (precosSection) {
      const yOffset = -80 // Header height + some padding
      const y = precosSection.getBoundingClientRect().top + window.pageYOffset + yOffset
      window.scrollTo({ top: y, behavior: "smooth" })
      
      // Dispara o evento de início de teste gratuito para o Facebook Pixel
      startTrial()
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-black/80 backdrop-blur-md shadow-lg" : "bg-black/30 backdrop-blur-sm"
        } shadow-[0_4px_20px_rgba(59,130,246,0.3)]`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-24">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/images/logo_dark.webp"
                  alt="LiveTurb Logo"
                  width={180}
                  height={60}
                  className="h-16 w-auto"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {sections.map((section) => (
                <a
                  key={section.name}
                  href={section.href}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(section.href)
                  }}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  {section.name}
                </a>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                onClick={scrollToPrecos}
              >
                TESTE 7 DIAS GRATIS
              </Button>
              <Link href="https://liveturb.com/login" passHref legacyBehavior>
                <Button
                  className="bg-white hover:bg-gray-100 text-gray-800"
                >
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-24 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-gray-800"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {sections.map((section) => (
                  <a
                    key={section.name}
                    href={section.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(section.href)
                    }}
                    className="text-gray-300 hover:text-white py-2 transition-colors text-lg font-medium"
                  >
                    {section.name}
                  </a>
                ))}
                <Button
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white w-full mt-4"
                  onClick={scrollToPrecos}
                >
                  TESTE 7 DIAS GRATIS
                </Button>
                <Link href="https://liveturb.com/login" passHref legacyBehavior>
                  <Button
                    className="bg-white hover:bg-gray-100 text-gray-800 w-full mt-2"
                  >
                    Login
                  </Button>
                </Link>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-24"></div>
    </>
  )
}
