"use server"

import { cookies } from "next/headers"

const VALID_CREDENTIALS = {
  "demo@nuvera.com": {
    password: "demo123456",
    role: "user",
    name: "Usuario Demo",
  },
  "admin@nuvera.com": {
    password: "admin123456",
    role: "admin",
    name: "Administrador",
  },
}

export type User = {
  email: string
  role: "user" | "admin"
  name: string
}

export async function validateCredentials(email: string, password: string): Promise<User | null> {
  const credential = VALID_CREDENTIALS[email as keyof typeof VALID_CREDENTIALS]

  if (!credential || credential.password !== password) {
    return null
  }

  return {
    email,
    role: credential.role,
    name: credential.name,
  }
}

export async function setUserSession(user: User) {
  const cookieStore = await cookies()

  // Almacenar datos del usuario en cookies
  cookieStore.set("user_email", user.email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  })

  cookieStore.set("user_role", user.role, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })

  cookieStore.set("user_name", user.name, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function getUserSession(): Promise<User | null> {
  const cookieStore = await cookies()

  const email = cookieStore.get("user_email")?.value
  const role = cookieStore.get("user_role")?.value as "user" | "admin" | undefined
  const name = cookieStore.get("user_name")?.value

  if (!email || !role || !name) {
    return null
  }

  return { email, role, name }
}

export async function clearUserSession() {
  const cookieStore = await cookies()

  cookieStore.delete("user_email")
  cookieStore.delete("user_role")
  cookieStore.delete("user_name")
}

export async function isAdmin(): Promise<boolean> {
  const user = await getUserSession()
  return user?.role === "admin"
}
