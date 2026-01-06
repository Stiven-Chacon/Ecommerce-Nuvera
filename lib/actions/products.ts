"use server"

import { getProducts, getProductById, getProductsByCategory, getFeaturedProducts } from "../products/products-local"

export async function getProductsAction() {
  return getProducts()
}

export async function getProductByIdAction(id: string) {
  return getProductById(id)
}

export async function getProductsByCategoryAction(category: string) {
  return getProductsByCategory(category)
}

export async function getFeaturedProductsAction() {
  return getFeaturedProducts()
}