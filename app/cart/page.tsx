"use client"

import { Button } from "@/components/ui/button"
import { getCartItems } from "@/lib/actions/cart"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Header } from "@/components/layout/headers"
import { Footer } from "@/components/layout/footer"
import { CartItemComponent } from "@/components/ui/cart-item"
import { useEffect, useState } from "react"
import type { CartWithProducts } from "@/lib/actions/cart"

export default function CartPage() {
  const [cartData, setCartData] = useState<CartWithProducts>({ items: [], total: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Función para cargar datos del carrito
    function loadCart() {
      const data = getCartItems()
      setCartData(data)
      setLoading(false)
    }

    // Cargar inicialmente
    loadCart()

    // Escuchar cambios en el carrito
    function handleCartUpdate() {
      setCartData(getCartItems())
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-12">
          <div className="text-center">Cargando carrito...</div>
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
        <h1 className="font-serif text-3xl md:text-4xl font-bold mb-8">Carrito de Compras</h1>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-serif text-2xl font-bold mb-2">Tu carrito está vacío</h2>
            <p className="text-muted-foreground mb-6">Agrega productos para comenzar tu compra</p>
            <Button asChild>
              <Link href="/products">Explorar Productos</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-card border border-border p-6">
                {items.map((item) => (
                  <CartItemComponent key={item.id} item={item} />
                ))}
              </div>
            </div>

            <div>
              <div className="bg-card border border-border p-6 sticky top-4">
                <h2 className="font-serif text-xl font-bold mb-6">Resumen del Pedido</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Envío</span>
                    <span>Calculado en checkout</span>
                  </div>
                  <div className="border-t border-border pt-3 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                <Button asChild className="w-full mb-3">
                  <Link href="/checkout">Proceder al Pago</Link>
                </Button>

                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/products">Continuar Comprando</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}