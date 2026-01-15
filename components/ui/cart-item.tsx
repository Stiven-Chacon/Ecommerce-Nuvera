"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateCartItemQuantity, removeFromCart } from "@/lib/actions/cart"
import type { CartItem } from "@/lib/actions/cart"
import type { Product } from "@/lib/products/products-types"

interface CartItemProps {
  item: CartItem & { product: Product }
}

export function CartItemComponent({ item }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  function handleUpdateQuantity(newQuantity: number) {
    setIsUpdating(true)
    updateCartItemQuantity(item.id, newQuantity)
    setIsUpdating(false)
  }

  function handleRemove() {
    setIsUpdating(true)
    removeFromCart(item.id)
    setIsUpdating(false)
  }

  if (!item.product) return null

  return (
    <div className="flex gap-4 py-6 border-b border-border">
      <Link href={`/products/${item.product.id}`} className="relative w-24 h-32 flex-shrink-0 bg-muted">
        <Image
          src={item.product.images[0] || "/placeholder.svg?height=200&width=150"}
          alt={item.product.name}
          fill
          className="object-cover"
        />
      </Link>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <Link href={`/products/${item.product.id}`} className="font-medium hover:text-muted-foreground">
            {item.product.name}
          </Link>
          <p className="text-sm text-muted-foreground mt-1">${item.product.price.toFixed(2)}</p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => handleUpdateQuantity(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={() => handleUpdateQuantity(item.quantity + 1)}
            disabled={isUpdating}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRemove} disabled={isUpdating}>
          <X className="h-4 w-4" />
        </Button>
        <p className="font-medium">${(item.product.price * item.quantity).toFixed(2)}</p>
      </div>
    </div>
  )
}