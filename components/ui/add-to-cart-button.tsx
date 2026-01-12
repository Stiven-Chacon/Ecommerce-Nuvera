"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Check } from "lucide-react"
import { addToCart } from "@/lib/actions/cart"

interface AddToCartButtonProps {
  productId: string
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  disabled?: boolean
}

export function AddToCartButton({ 
  productId, 
  variant = "default", 
  size = "default",
  disabled = false
}: AddToCartButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isAdded, setIsAdded] = useState(false)

  useEffect(() => {
    if (isAdded) {
      const timer = setTimeout(() => {
        setIsAdded(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [isAdded])

  function handleAddToCart() {
    setIsLoading(true)
    
    const result = addToCart(productId, 1)

    if (result.error) {
      alert(result.error)
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setIsAdded(true)
  }

  return (
    <Button 
      onClick={handleAddToCart} 
      disabled={isLoading || disabled || isAdded} 
      variant={isAdded ? "outline" : variant} 
      size={size} 
      className="w-full transition-all"
    >
      {isAdded ? (
        <>
          <Check className="mr-2 h-4 w-4" />
          ¡Agregado al carrito!
        </>
      ) : (
        <>
          <ShoppingBag className="mr-2 h-4 w-4" />
          {isLoading ? "Agregando..." : disabled ? "Sin stock" : "Agregar al Carrito"}
        </>
      )}
    </Button>
  )
}