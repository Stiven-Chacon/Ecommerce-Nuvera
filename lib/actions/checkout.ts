"use server"

import { revalidatePath } from "next/cache"

export async function revalidateCheckout() {
  revalidatePath("/cart")
  revalidatePath("/cuenta/pedidos")
  revalidatePath("/checkout")
}