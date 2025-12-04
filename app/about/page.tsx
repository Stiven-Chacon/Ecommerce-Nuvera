"use client"


import Image from "next/image"
import { useEffect, useRef } from "react"
import { Header } from "@/components/layout/headers"
import { Footer } from "@/components/layout/footer"
import { StorySection } from "@/components/sections/about/StorySection"
import StatsSection from "@/components/sections/Stats-Section"
import ValuesSection from "@/components/sections/about/CoreValuesSection"
import CTASection from "@/components/sections/about/CTASection"


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

      <main className="flex-1 overflow-x-hidden">
        {/* Hero Section */}
        <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center overflow-hidden overflow-x-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <Image src="/athletes-training-together-team-spirit.jpg" alt="Equipo Nuvera" fill className="object-cover opacity-30"/>
          </div>
          <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/50 to-background" />

          <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center overflow-x-hidden">
            <h1 className="hero-title text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black mb-6 text-white">
              NUESTRA <span className="text-gradient">HISTORIA</span>
            </h1>
            <p className="hero-text text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-2">
              Nacimos de la pasión por el deporte y el deseo de crear equipamiento que inspire a los atletas a superar
              sus límites
            </p>
          </div>
        </section>

        {/* Story Section */}
        <StorySection />

        {/* Stats Section */}
        <StatsSection 
          stats={[
                { value: 7500, suffix: '+', label: 'Atletas Activos' },
                { value: 120, suffix: '+', label: 'Países' },
                { value: 300, suffix: '+', label: 'Productos' },
                { value: 99, suffix: '%', label: 'Satisfacción' },
              ]}
        />

        {/* Values Section */}
        <ValuesSection />

        {/* CTA Section */}
        <CTASection />
        
      </main>
    <Footer />
    </div>
  )
}
