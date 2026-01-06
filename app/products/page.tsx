"use client"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/headers"
import { ProductCard } from "@/components/sections/products/product-card"
import { getProductsAction } from "@/lib/actions/products"
import { Product } from "@/lib/products/products-types"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"


export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const searchParams = useSearchParams()

  useEffect(() => {
    async function loadProducts() {
      const data = await getProductsAction()
      setProducts(data)

      const categoryParam = searchParams.get("category")
      if (categoryParam) {
        setSelectedCategory(categoryParam)
        setFilteredProducts(data.filter((p) => p.category === categoryParam))
      } else {
        setFilteredProducts(data)
      }
    }

    loadProducts()
  }, [searchParams])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    if (category === "all") {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter((p) => p.category === category))
    }
  }

  const categories = [
    { id: "all", name: "Todos" },
    { id: "running", name: "Running" },
    { id: "training", name: "Training" },
    { id: "outdoor", name: "Outdoor" },
    { id: "yoga", name: "Yoga & Wellness" },
    { id: "basketball", name: "Basketball" },
    { id: "swimming", name: "Swimming" },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black mb-4">TODOS LOS PRODUCTOS</h1>
          <p className="text-muted-foreground text-lg">Explora nuestra colección completa de equipamiento deportivo</p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-3">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${
                selectedCategory === category.id ? "bg-accent text-white" : "bg-muted hover:bg-muted/80 text-foreground"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? "producto" : "productos"}
          </p>
        </div>

        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-muted rounded-lg">
            <p className="text-muted-foreground text-lg">
              {selectedCategory === "all"
                ? "No hay productos disponibles en este momento"
                : "No hay productos en esta categoría"}
            </p>
          </div>
        )}

      </main>

      <Footer />
    </div>
  )
}
