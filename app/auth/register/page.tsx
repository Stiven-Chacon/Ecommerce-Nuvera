"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp } from "@/lib/actions/auth"
import { useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    setSuccess(false)

    const result = await signUp(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-black tracking-tighter">
            NUVERA
          </Link>
          <h1 className="text-3xl font-black mt-8 mb-2">CREAR CUENTA</h1>
          <p className="text-muted-foreground">Únete a la comunidad Nuvera</p>
        </div>

        <div className="bg-card border-2 border-border p-8 rounded-lg shadow-xl">
          {error && (
            <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-accent/10 border border-accent/30 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground">¡Cuenta creada exitosamente!</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Revisa tu correo para confirmar tu cuenta, o usa las credenciales de prueba en la página de login.
                </p>
              </div>
            </div>
          )}

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="font-bold">
                Nombre Completo
              </Label>
              <Input id="name" name="name" type="text" placeholder="Tu nombre" required className="h-12 border-2" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">
                Correo Electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="tu@email.com"
                required
                className="h-12 border-2"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                minLength={6}
                placeholder="Mínimo 6 caracteres"
                required
                className="h-12 border-2"
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold text-base bg-accent hover:bg-accent/90"
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Crear Cuenta"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
            <Link href="/auth/login" className="font-bold hover:text-accent transition-colors">
              Inicia sesión
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground font-medium">
            ← Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}
