"use client"
import { useEffect, useRef } from "react"
import gsap from "gsap"

export function CollectionsHero() {
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
    <section
      ref={heroRef}
      className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black"
    >
      <div className="absolute inset-0 bg-linear-to-br from-orange-600/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,69,0,0.1),transparent_50%)]" />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 
          ref={titleRef} 
          className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 text-white"
        >
          COLECCIONES
        </h1>
        <p className="hero-subtitle text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Descubre nuestras colecciones especializadas diseñadas para cada disciplina deportiva
        </p>
      </div>

      {/* Decorative elements */}
      <div className="decorative-blob absolute top-20 left-10 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl" />
      <div className="decorative-blob absolute bottom-20 right-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl" />
    </section>
  )
}