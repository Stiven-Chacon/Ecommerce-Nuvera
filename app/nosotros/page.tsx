"use client"


import Image from "next/image"
import { useEffect, useRef } from "react"
import { Header } from "@/components/layout/headers"





export default function NosotrosPage() {
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && window.gsap) {
      const gsap = window.gsap
      const ScrollTrigger = window.ScrollTrigger

      gsap.registerPlugin(ScrollTrigger)

      // Hero animations
      gsap.from(".hero-title", {
        opacity: 0,
        y: 100,
        duration: 1.2,
        ease: "power4.out",
      })

      gsap.from(".hero-text", {
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
        <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0">
            <Image src="/athletes-training-together-team-spirit.jpg" alt="Equipo Nuvera" fill className="object-cover opacity-30" />
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-background" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="hero-title text-6xl md:text-8xl lg:text-9xl font-black mb-6 text-white">
              NUESTRA <span className="text-gradient">HISTORIA</span>
            </h1>
            <p className="hero-text text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Nacimos de la pasión por el deporte y el deseo de crear equipamiento que inspire a los atletas a superar
              sus límites
            </p>
          </div>
        </section>

      </main>

    </div>
  )
}
