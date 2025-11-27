"use client"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/headers"
import { HeroSection } from "@/components/sections/hero-section"
import CategoryGrid from "@/components/sections/hero/CategoryGrid"
import ValuesSection from "@/components/sections/hero/CoreValuesSection"
import  StatsSection  from "@/components/sections/Stats-Section"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <CategoryGrid/>
        
        {/* Values Section */}
        <ValuesSection />

      </main>
        <Footer />
    </div>
  )
}