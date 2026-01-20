"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { saveOrderLocally } from "@/lib/products/orders-local"
import { getCartItems, clearCart } from "@/lib/actions/cart"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface ShippingAddress {
  name: string
  address: string
  city: string
  postalCode: string
  country: string
}

function CheckoutFormContent({ total }: { total: number }) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setErrorMessage(null)

    try {
      // Validar el formulario de pago
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setErrorMessage(submitError.message || "Error al procesar el pago")
        setIsProcessing(false)
        return
      }

      // Confirmar el pago
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: "if_required",
      })

      if (error) {
        setErrorMessage(error.message || "Error al procesar el pago")
        setIsProcessing(false)
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Obtener items del carrito
        const { items } = getCartItems()

        // Generar ID de orden
        const orderId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

        // Guardar orden localmente
        saveOrderLocally(orderId, paymentIntent.id, shippingAddress, items, total)

        // Limpiar carrito
        clearCart()

        // Redirigir a página de éxito
        router.push(`/checkout/success?order_id=${orderId}&payment_intent=${paymentIntent.id}`)
      }
    } catch (err) {
      console.error("Error en el proceso de pago:", err)
      setErrorMessage("Error inesperado al procesar el pago")
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
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                }
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

      <div className="bg-card border border-border p-6">
        <h2 className="font-serif text-xl font-bold mb-6">Información de Pago</h2>
        <PaymentElement />
      </div>

      {errorMessage && (
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 text-sm rounded">
          {errorMessage}
        </div>
      )}

      <Button type="submit" disabled={!stripe || isProcessing} className="w-full" size="lg">
        {isProcessing ? "Procesando..." : `Pagar $${total.toFixed(2)}`}
      </Button>
    </form>
  )
}

export function CheckoutForm({ total }: { total: number }) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function createPaymentIntent() {
      try {
        const response = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: total }),
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()

        if (data.error) {
          setError(data.error)
        } else if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        } else {
          setError("No se recibió el client secret")
        }
      } catch (err) {
        console.error("Error fetching client secret:", err)
        setError("Error al inicializar el pago. Por favor, intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    createPaymentIntent()
  }, [total])

  if (loading) {
    return (
      <div className="bg-card border border-border p-6">
        <p className="text-center text-muted-foreground">Cargando formulario de pago...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-card border border-border p-6">
        <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 text-sm rounded">
          {error}
        </div>
      </div>
    )
  }

  if (!clientSecret) {
    return (
      <div className="bg-card border border-border p-6">
        <p className="text-center text-muted-foreground">Error al cargar el formulario de pago</p>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: "stripe",
          variables: {
            colorPrimary: "#000000",
            colorBackground: "#ffffff",
            colorText: "#000000",
            colorDanger: "#df1b41",
            fontFamily: "system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "0px",
          },
        },
      }}
    >
      <CheckoutFormContent total={total} />
    </Elements>
  )
}