"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "@/lib/actions/auth"
import { useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await signIn(formData)

    if (result?.error) {
      let errorMessage = result.error

      if (result.error.includes("Email not confirmed")) {
        errorMessage =
          "Tu email no ha sido confirmado. Por favor, revisa tu correo y confirma tu cuenta, o usa las credenciales de prueba proporcionadas abajo."
      } else if (result.error.includes("Invalid login credentials")) {
        errorMessage = "Credenciales incorrectas. Verifica tu email y contraseña, o usa las credenciales de prueba."
      }

      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-linear-to-br from-background via-muted/30 to-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-4xl font-black tracking-tighter">
            NUVERA
          </Link>
          <h1 className="text-3xl font-black mt-8 mb-2">INICIAR SESIÓN</h1>
          <p className="text-muted-foreground">Accede a tu cuenta para continuar</p>
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

          <form action={handleSubmit} className="space-y-6">
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
              <Input id="password" name="password" type="password" required className="h-12 border-2" />
            </div>

            <Button
              type="submit"
              className="w-full h-12 font-bold text-base bg-accent hover:bg-accent/90"
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-accent/10 border-2 border-accent/30 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="h-5 w-5 text-accent" />
              <p className="text-sm font-bold text-foreground uppercase tracking-wider">
                Credenciales de Prueba Listas
              </p>
            </div>
            <div className="space-y-3">
              <div className="bg-background/50 p-3 rounded border border-border">
                <p className="text-xs font-bold text-muted-foreground mb-1">USUARIO REGULAR:</p>
                <p className="font-mono text-sm">
                  <span className="font-bold">Email:</span> demo@nuvera.com
                </p>
                <p className="font-mono text-sm">
                  <span className="font-bold">Contraseña:</span> demo123456
                </p>
              </div>
              <div className="bg-background/50 p-3 rounded border border-border">
                <p className="text-xs font-bold text-muted-foreground mb-1">ADMINISTRADOR:</p>
                <p className="font-mono text-sm">
                  <span className="font-bold">Email:</span> admin@nuvera.com
                </p>
                <p className="font-mono text-sm">
                  <span className="font-bold">Contraseña:</span> admin123456
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">¿No tienes cuenta? </span>
            <Link href="/auth/registro" className="font-bold hover:text-accent transition-colors">
              Regístrate
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
