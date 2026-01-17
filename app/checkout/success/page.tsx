
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Header } from "@/components/layout/headers"
import { Footer } from "@/components/layout/footer"

export default function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="h-16 w-16 mx-auto text-green-600 mb-6" />
          <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Pago Exitoso</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Tu pedido ha sido procesado correctamente. Recibirás un correo de confirmación en breve.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/cuenta/pedidos">Ver Mis Pedidos</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="/products">Volver a la Tienda</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
