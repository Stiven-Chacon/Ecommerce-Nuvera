"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveOrderLocally } from "@/lib/products/orders-local"
import { getCartItems, clearCart } from "@/lib/actions/cart"

export function CheckoutForm({ total }: { total: number }) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsProcessing(true)
    setErrorMessage(null)

    try {
      // Obtener items del carrito antes de limpiar
      const { items } = getCartItems()

      if (items.length === 0) {
        setErrorMessage("El carrito está vacío")
        setIsProcessing(false)
        return
      }

      // Generar ID de orden
      const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Guardar orden localmente
      saveOrderLocally(orderId, "", shippingAddress, items, total)

      // Limpiar carrito
      clearCart()

      // Redirigir a página de éxito
      router.push(`/checkout/success?order_id=${orderId}`)
    } catch (error) {
      console.error("Error al procesar la orden:", error)
      setErrorMessage("Error al procesar la orden. Por favor, intenta de nuevo.")
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-card border border-border p-6">
        <h2 className="font-serif text-xl font-bold mb-6">Información de Envío</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input
              id="name"
              value={shippingAddress.name}
              onChange={(e) => setShippingAddress({ ...shippingAddress, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              value={shippingAddress.address}
              onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Ciudad</Label>
              <Input
                id="city"
                value={shippingAddress.city}
                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="postalCode">Código Postal</Label>
              <Input
                id="postalCode"
                value={shippingAddress.postalCode}
                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">País</Label>
            <Input
              id="country"
              value={shippingAddress.country}
              onChange={(e) => setShippingAddress({ ...shippingAddress, country: e.target.value })}
              required
            />
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 text-sm">
          {errorMessage}
        </div>
      )}

      <Button type="submit" disabled={isProcessing} className="w-full" size="lg">
        {isProcessing ? "Procesando..." : `Confirmar Pedido - $${total.toFixed(2)}`}
      </Button>
    </form>
  )
}