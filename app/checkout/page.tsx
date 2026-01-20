"use client"

import { Footer } from "@/components/layout/footer"
import { Header } from "@/components/layout/headers"
import { CheckoutForm } from "@/components/ui/checkout-form"
import { getCartItems } from "@/lib/actions/cart"
import type { CartWithProducts } from "@/lib/actions/cart"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function CheckoutPage() {
  const router = useRouter()
  const [cartData, setCartData] = useState<CartWithProducts | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Función interna para cargar el carrito
    function loadCart() {
      const data = getCartItems()
      
      if (data.items.length === 0) {
        router.push("/cart")
        return
      }
      
      setCartData(data)
      setLoading(false)
    }

    loadCart()
  }, [router])

  if (loading || !cartData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center">
          <p className="text-muted-foreground">Cargando...</p>
        </main>
        <Footer />
      </div>
    )
  }

  const { items, total } = cartData

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Finalizar Compra</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutForm total={total} />
          </div>

          <div>
            <div className="bg-card border border-border p-6 sticky top-4">
              <h2 className="font-serif text-xl font-bold mb-6">Resumen del Pedido</h2>

              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span>${((item.product?.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Envío</span>
                  <span>Gratis</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between font-medium">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}