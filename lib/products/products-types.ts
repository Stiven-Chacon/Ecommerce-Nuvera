export interface Product {
  id: string
  name: string
  description: string | null
  price: number
  images: string[]
  category: string
  stock: number
  featured: boolean
  created_at?: string
  updated_at?: string
}

export interface CartItem {
  id: string
  user_id: string
  product_id: string
  quantity: number
  product?: Product
}

export interface Order {
  id: string
  user_id: string
  total: number
  status: string
  stripe_payment_intent_id: string | null
  //shipping_address: any
  created_at: string
  updated_at: string
}
