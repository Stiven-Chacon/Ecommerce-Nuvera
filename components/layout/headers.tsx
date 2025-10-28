"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useEffect, useState, useRef } from "react"
import gsap from "gsap"

export function Header() {
  const [cartCount, setCartCount] = useState(0)
  const headerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Función para actualizar el contador del carrito
    const updateCartCount = () => {
      try {
        const cartData = window.localStorage.getItem("cart")
        if (!cartData) {
          setCartCount(0)
          return
        }

        const cart = JSON.parse(cartData)
        const total = Array.isArray(cart) 
          ? cart.reduce((sum, item) => sum + (item.cantidad || 0), 0)
          : 0
        
        setCartCount(total)
      } catch (error) {
        console.error("Error al leer el carrito:", error)
        setCartCount(0)
      }
    }

    // Inicializar contador
    updateCartCount()

    // Escuchar eventos de actualización del carrito
    window.addEventListener("cartUpdated", updateCartCount)

    // Animación de entrada del header
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      })
    }

    // Animación de hover del logo
    if (logoRef.current) {
      const logo = logoRef.current

      const handleMouseEnter = () => {
        gsap.to(logo, {
          scale: 1.1,
          duration: 0.3,
          ease: "back.out(1.7)",
        })
      }

      const handleMouseLeave = () => {
        gsap.to(logo, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out",
        })
      }

      logo.addEventListener("mouseenter", handleMouseEnter)
      logo.addEventListener("mouseleave", handleMouseLeave)

      return () => {
        window.removeEventListener("cartUpdated", updateCartCount)
        logo.removeEventListener("mouseenter", handleMouseEnter)
        logo.removeEventListener("mouseleave", handleMouseLeave)
      }
    }

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount)
    }
  }, [])

  return (
    <header 
      ref={headerRef} 
      className="sticky top-0 z-50 border-b border-primary/10 bg-background/95 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-24 items-center justify-between">
          {/* Logo y Navegación */}
          <div className="flex items-center gap-16">
              <div className="text-4xl font-black tracking-tighter text-primary transition-colors duration-300 hover:text-secondary">
                Nuvéra
              </div>

            <nav className="hidden items-center gap-10 md:flex">
              <Link
                href="/productos"
                className="group relative text-sm font-medium uppercase tracking-wider text-foreground transition-colors duration-300 hover:text-secondary"
              >
                Colección
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-secondary transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link
                href="/pedidos"
                className="group relative text-sm font-medium uppercase tracking-wider text-foreground transition-colors duration-300 hover:text-accent"
              >
                Pedidos
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>
          </div>

          {/* Acciones del usuario */}
          <div className="flex items-center gap-6">
            <button
              className="group relative transition-all duration-300 hover:bg-transparent hover:text-secondary"
            >
              <Link href="/carrito">
                <ShoppingCart className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center bg-secondary text-[10px] font-bold text-secondary-foreground">
                    {cartCount}
                  </span>
                )}
                <span className="sr-only">Carrito de compras</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}