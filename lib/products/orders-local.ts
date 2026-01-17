"use client"

interface ShippingAddress {
  name: string
  address: string
  city: string
  postalCode: string
  country: string
}

interface CartItem {
  productId: string
  quantity: number
  product?: {
    name?: string
    price?: number
  }
}

interface Order {
  id: string
  total: number
  status: string
  shipping_address: ShippingAddress
  items: Array<{
    product_id: string
    quantity: number
    price: number
    product_name?: string
  }>
  created_at: string
}

const ORDERS_STORAGE_KEY = "orders_local"

function getOrders(): Order[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(ORDERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveOrder(order: Order): void {
  if (typeof window === "undefined") return

  try {
    const orders = getOrders()
    orders.push(order)
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
  } catch (error) {
    console.error("Error saving order:", error)
  }
}

export function saveOrderLocally(
  orderId: string,
  paymentIntentId: string,
  shippingAddress: ShippingAddress,
  cartItems: CartItem[],
  total: number
) {
  const order: Order = {
    id: orderId,
    total,
    status: "completed",
    shipping_address: shippingAddress,
    items: cartItems.map((item) => ({
      product_id: item.productId,
      quantity: item.quantity,
      price: item.product?.price || 0,
      product_name: item.product?.name || "Producto desconocido",
    })),
    created_at: new Date().toISOString(),
  }

  saveOrder(order)
}

export function getOrderById(orderId: string): Order | undefined {
  const orders = getOrders()
  return orders.find((order) => order.id === orderId)
}

export function getAllOrders(): Order[] {
  return getOrders()
}

export function clearAllOrders(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(ORDERS_STORAGE_KEY)
}