"use client"

import { Header } from "@/components/layout/headers"
import { Footer } from "@/components/layout/footer"
import { CollectionsHero } from "@/components/sections/collections/CollectionsHero-section"
import { CollectionsGrid } from "@/components/sections/collections/ColletionsCategoryGrid"

export default function ColeccionesPage() {


  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <CollectionsHero />

        {/* Collections Grid */}
        <CollectionsGrid/>
      </main>

      <Footer />
    </div>
  )
}
