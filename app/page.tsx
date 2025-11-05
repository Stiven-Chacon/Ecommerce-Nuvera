"use client"
import { Header } from "@/components/layout/headers"
import { HeroSection } from "@/components/sections/hero-section"
import  StatsSection  from "@/components/sections/Stats-Section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
      </main>
    </div>
  )
}