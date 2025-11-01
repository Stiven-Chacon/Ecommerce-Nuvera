import Link from "next/link"
import { ShoppingBag, Search } from "lucide-react"

export function Header() {
  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
            NUVERA
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/productos" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Productos
            </Link>
            <Link href="/colecciones" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Colecciones
            </Link>
            <Link href="/nosotros" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              Nosotros
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden sm:flex">
              <Search className="h-5 w-5" />
              <span className="sr-only">Buscar</span>
            </button>
            <button>
              <Link href="/carrito">
                <ShoppingBag className="h-5 w-5" />
                <span className="sr-only">Carrito</span>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
