"use server"

import { revalidatePath } from "next/cache"

export async function revalidateCheckout() {
  revalidatePath("/cart")
  revalidatePath("/account/orders")
  revalidatePath("/checkout")
}