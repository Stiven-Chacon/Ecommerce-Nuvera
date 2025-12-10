"use server"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { clearUserSession, setUserSession, validateCredentials } from "../auth-simple"

export async function signUp(_formData: FormData) {
  return { error: "El registro está deshabilitado. Use las credenciales de prueba para iniciar sesión." }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const user = await validateCredentials(email, password)

  if (!user) {
    return { error: "Credenciales inválidas. Verifica tu email y contraseña." }
  }

  await setUserSession(user)

  revalidatePath("/", "layout")
  redirect("/")
}

export async function signOut() {
  await clearUserSession()
  revalidatePath("/", "layout")
  redirect("/")
}

export async function getUser() {
  const { getUserSession } = await import("../auth-simple");
  return await getUserSession();
}
