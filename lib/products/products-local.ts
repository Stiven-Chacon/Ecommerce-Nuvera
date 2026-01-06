import productsData from "@/data/products.json"
import { Product } from "./products-types"

export function getProducts(): Product[] {
  return productsData as Product[]
}

export function getProductById(id: string): Product | undefined {
  return productsData.find((p) => p.id === id) as Product | undefined
}

export function getProductsByCategory(category: string): Product[] {
  return productsData.filter((p) => p.category.toLowerCase() === category.toLowerCase()) as Product[]
}

export function getFeaturedProducts(): Product[] {
  return productsData.filter((p) => p.featured) as Product[]
}