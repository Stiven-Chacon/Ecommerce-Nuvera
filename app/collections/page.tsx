"use client"

import { Header } from "@/components/layout/headers"
import { Footer } from "@/components/layout/footer"
import { CollectionsGrid } from "@/components/sections/collections/ColletionsCategoryGrid"
import { useEffect, useRef } from "react"

export default function ColeccionesPage() {
  const heroRef = useRef(null)
  const titleRef = useRef(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap) {
      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      gsap.registerPlugin(ScrollTrigger)

      // Hero animations
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: "power4.out",
      })

      gsap.from(".hero-subtitle", {
        opacity: 0,
        y: 50,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      })

    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          ref={heroRef}
          className="relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[80vh] flex items-center justify-center overflow-hidden bg-black"
        >
          <div className="absolute inset-0 bg-linear-to-br from-orange-600/20 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,69,0,0.1),transparent_50%)]" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 
              ref={titleRef} 
              className=" text-4xl sm:text-5xl md:text-7xl lg:text-8xl xl:text-9xl font-black mb-4 sm:mb-6 text-white tracking-tight"
            >
              COLECCIONES
            </h1>
            <p className="hero-subtitle text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed px-2">
              Descubre nuestras colecciones especializadas diseñadas para cada disciplina deportiva
            </p>
          </div>

          {/* Decorative elements */}
          <div className="decorative-blob absolute top-10 left-5 w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="decorative-blob absolute bottom-10 right-5 w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 bg-orange-600/10 rounded-full blur-3xl" />
        </section>

        {/* Collections Grid */}
        <CollectionsGrid/>
      </main>

      <Footer />
    </div>
  )
}
