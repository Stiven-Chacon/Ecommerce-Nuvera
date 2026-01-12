"use client"

import { useState, useEffect } from "react"
import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/headers"
import { AddToCartButton } from "@/components/ui/add-to-cart-button"
import { getProductById } from "@/lib/products/products-local"
import Image from "next/image"
import { notFound, useParams } from "next/navigation"
import { getProductAvailableStock } from "@/lib/actions/cart"

export default function ProductPage() {
  const params = useParams()
  const id = params?.id as string
  
  const product = getProductById(id)
  
  if (!product) {
    notFound()
  }

  const [currentStock, setCurrentStock] = useState(() => getProductAvailableStock(id))

  // Escuchar actualizaciones del carrito
  useEffect(() => {
    const handleCartUpdate = () => {
      setCurrentStock(getProductAvailableStock(id))
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    return () => window.removeEventListener("cartUpdated", handleCartUpdate)
  }, [id])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-3/4 relative bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg?height=1200&width=900"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col">
            <div className="mb-8">
              <div className="inline-block px-3 py-1 bg-accent/10 rounded-full mb-4">
                <span className="text-accent font-bold text-xs tracking-wider uppercase">{product.category}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-accent mb-6">${product.price.toFixed(2)}</p>
              <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
            </div>

            <div className="space-y-4 mb-8 p-6 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Categoría</span>
                <span className="capitalize font-bold">{product.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground font-medium">Disponibilidad</span>
                <span className={`font-bold transition-colors ${currentStock > 0 ? "text-green-600" : "text-red-600"}`}>
                  {currentStock > 0 ? `${currentStock} en stock` : "Agotado"}
                </span>
              </div>
              {product.featured && (
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground font-medium">Estado</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                    Producto Destacado
                  </span>
                </div>
              )}
            </div>

            <AddToCartButton 
              productId={product.id} 
              size="lg" 
              disabled={currentStock === 0}
            />

            <div className="mt-12 pt-12 border-t border-border space-y-6">
              <div>
                <h3 className="font-bold mb-3 text-lg flex items-center">
                  <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                    />
                  </svg>
                  Envío y Devoluciones
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Envío gratuito en pedidos superiores a $150. Devoluciones gratuitas dentro de 30 días.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-lg flex items-center">
                  <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Cuidado del Producto
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Lavar a máquina en agua fría. No usar blanqueador. Secar en plano o colgar para secar.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-3 text-lg flex items-center">
                  <svg className="w-5 h-5 mr-2 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                    />
                  </svg>
                  Garantía de Calidad
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Todos nuestros productos están respaldados por nuestra garantía de calidad de 1 año.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}