"use client"

import Link from "next/link"
import { ShoppingBag, Search, Menu, X } from "lucide-react"
import { Button } from "../ui/button"
import { UserMenu } from "../user-menu"
import { useEffect, useState } from "react"
import gsap from "gsap"

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (mobileMenuOpen) {
      gsap.fromTo(".mobile-menu", { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" })
      gsap.fromTo(
        ".mobile-menu-item",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.1, ease: "power2.out" },
      )
    }
  }, [mobileMenuOpen])

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
            NUVERA
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              Productos
            </Link>
            <Link href="/collections" className="text-sm font-medium hover:text-primary transition-colors">
              Colecciones
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition-colors">
              Nosotros
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </Button>

            <div className="hidden sm:block">
              <UserMenu />
            </div>

            <Button variant="ghost" size="icon" asChild>
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Carrito</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              <span className="sr-only">Menú</span>
            </Button>
          </div>
        </div>

          {mobileMenuOpen && (
            <div className="mobile-menu md:hidden py-4 border-t border-border">
              <nav className="flex flex-col gap-4">
                <Link
                  href="/products"
                  className="mobile-menu-item text-base font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Productos
                </Link>
                <Link
                  href="/collections"
                  className="mobile-menu-item text-base font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Colecciones
                </Link>
                <Link
                  href="/about"
                  className="mobile-menu-item text-base font-medium hover:text-primary transition-colors py-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Nosotros
                </Link>

                <div className="mobile-menu-item sm:hidden pt-4 border-t border-border">
                  <UserMenu />
                </div>
              </nav>
            </div>
          )}                  
      </div>
    </header>
  )
}
