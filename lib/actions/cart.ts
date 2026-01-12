"use client"

import { getProductById } from "../products/products-local"

export interface CartItem {
  id: string
  productId: string
  quantity: number
  addedAt: string
  updatedAt: string
}

export interface CartWithProducts {
  items: Array<CartItem & { product: ReturnType<typeof getProductById> }>
  total: number
}

// Clase Singleton para manejar el carrito
class CartManager {
  private static instance: CartManager
  private readonly CART_STORAGE_KEY = "shopping_cart"
  private readonly STOCK_STORAGE_KEY = "products_stock"
  private cart: CartItem[] = []
  private stockAdjustments: Record<string, number> = {}
  private initialized = false

  private constructor() {
    this.initialize()
  }

  static getInstance(): CartManager {
    if (!CartManager.instance) {
      CartManager.instance = new CartManager()
    }
    return CartManager.instance
  }

  private initialize(): void {
    if (typeof window === "undefined" || this.initialized) return

    try {
      const storedCart = localStorage.getItem(this.CART_STORAGE_KEY)
      this.cart = storedCart ? JSON.parse(storedCart) : []

      const storedStock = localStorage.getItem(this.STOCK_STORAGE_KEY)
      this.stockAdjustments = storedStock ? JSON.parse(storedStock) : {}

      this.initialized = true
    } catch (error) {
      console.error("Error initializing cart:", error)
      this.cart = []
      this.stockAdjustments = {}
    }
  }

  private persist(): void {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.cart))
      localStorage.setItem(this.STOCK_STORAGE_KEY, JSON.stringify(this.stockAdjustments))
      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: this.cart }))
    } catch (error) {
      console.error("Error persisting cart:", error)
    }
  }

  private generateId(): string {
    return `cart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private adjustStock(productId: string, change: number): void {
    if (!this.stockAdjustments[productId]) {
      this.stockAdjustments[productId] = 0
    }
    this.stockAdjustments[productId] += change
  }

  getCart(): CartItem[] {
    return [...this.cart]
  }

  getStockAdjustment(productId: string): number {
    return this.stockAdjustments[productId] || 0
  }

  addItem(productId: string, quantity = 1): { success: boolean; error?: string } {
    try {
      const product = getProductById(productId)
      if (!product) {
        return { success: false, error: "Producto no encontrado" }
      }

      const currentAdjustment = this.getStockAdjustment(productId)
      const availableStock = product.stock + currentAdjustment

      if (availableStock < quantity) {
        return { success: false, error: "Stock insuficiente" }
      }

      const existingIndex = this.cart.findIndex(item => item.productId === productId)
      const now = new Date().toISOString()

      if (existingIndex > -1) {
        this.cart[existingIndex].quantity += quantity
        this.cart[existingIndex].updatedAt = now
      } else {
        this.cart.push({
          id: this.generateId(),
          productId,
          quantity,
          addedAt: now,
          updatedAt: now
        })
      }

      this.adjustStock(productId, -quantity)
      this.persist()
      return { success: true }
    } catch (error) {
      return { success: false, error: "Error al agregar al carrito" }
    }
  }

  updateQuantity(itemId: string, quantity: number): { success: boolean; error?: string } {
    try {
      if (quantity <= 0) {
        return this.removeItem(itemId)
      }

      const itemIndex = this.cart.findIndex(item => item.id === itemId)
      if (itemIndex === -1) {
        return { success: false, error: "Item no encontrado" }
      }

      const item = this.cart[itemIndex]
      const product = getProductById(item.productId)
      
      if (!product) {
        return { success: false, error: "Producto no encontrado" }
      }

      const currentAdjustment = this.getStockAdjustment(item.productId)
      const availableStock = product.stock + currentAdjustment + item.quantity
      
      if (availableStock < quantity) {
        return { success: false, error: "Stock insuficiente" }
      }

      const quantityDiff = quantity - item.quantity
      this.cart[itemIndex].quantity = quantity
      this.cart[itemIndex].updatedAt = new Date().toISOString()
      
      this.adjustStock(item.productId, -quantityDiff)
      this.persist()
      return { success: true }
    } catch (error) {
      return { success: false, error: "Error al actualizar cantidad" }
    }
  }

  removeItem(itemId: string): { success: boolean; error?: string } {
    try {
      const itemIndex = this.cart.findIndex(item => item.id === itemId)
      if (itemIndex === -1) {
        return { success: false, error: "Item no encontrado" }
      }

      const item = this.cart[itemIndex]
      this.adjustStock(item.productId, item.quantity)
      this.cart = this.cart.filter(item => item.id !== itemId)
      
      this.persist()
      return { success: true }
    } catch (error) {
      return { success: false, error: "Error al eliminar del carrito" }
    }
  }

  getItemsWithProducts(): CartWithProducts {
    try {
      const items = this.cart.map(item => ({
        ...item,
        product: getProductById(item.productId)
      }))

      const total = items.reduce((sum, item) => {
        return sum + (item.product?.price || 0) * item.quantity
      }, 0)

      return { items, total }
    } catch (error) {
      console.error("Error fetching cart items:", error)
      return { items: [], total: 0 }
    }
  }

  clear(): { success: boolean; error?: string } {
    try {
      // Restaurar stock de todos los items
      this.cart.forEach(item => {
        this.adjustStock(item.productId, item.quantity)
      })
      
      this.cart = []
      this.persist()
      return { success: true }
    } catch (error) {
      return { success: false, error: "Error al limpiar el carrito" }
    }
  }

  getItemCount(): number {
    return this.cart.reduce((total, item) => total + item.quantity, 0)
  }

  getItem(itemId: string): CartItem | undefined {
    return this.cart.find(item => item.id === itemId)
  }

  hasProduct(productId: string): boolean {
    return this.cart.some(item => item.productId === productId)
  }

  getProductAvailableStock(productId: string): number {
    const product = getProductById(productId)
    if (!product) return 0
    
    const adjustment = this.getStockAdjustment(productId)
    return product.stock + adjustment
  }
}

// API pública - Funciones wrapper para mantener compatibilidad
const cart = CartManager.getInstance()

export function addToCart(productId: string, quantity = 1) {
  return cart.addItem(productId, quantity)
}

export function updateCartItemQuantity(itemId: string, quantity: number) {
  return cart.updateQuantity(itemId, quantity)
}

export function removeFromCart(itemId: string) {
  return cart.removeItem(itemId)
}

export function getCartItems(): CartWithProducts {
  return cart.getItemsWithProducts()
}

export function clearCart() {
  return cart.clear()
}

export function getCartItemCount(): number {
  return cart.getItemCount()
}

export function getCartItem(itemId: string): CartItem | undefined {
  return cart.getItem(itemId)
}

export function hasProductInCart(productId: string): boolean {
  return cart.hasProduct(productId)
}

export function getProductAvailableStock(productId: string): number {
  return cart.getProductAvailableStock(productId)
}

// Exportar instancia para casos avanzados
export { cart as cartManager }