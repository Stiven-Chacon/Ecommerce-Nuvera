import Link from "next/link"
import Image from "next/image"
import { Product } from "@/lib/products/products-types"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/productos/${product.id}`} className="group">
      <div className="aspect-3/4 relative overflow-hidden bg-muted mb-4">
        <Image
          src={product.images[0] || "/placeholder.svg?height=800&width=600"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="space-y-1">
        <h3 className="font-medium text-sm group-hover:text-muted-foreground transition-colors">{product.name}</h3>
        <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
      </div>
    </Link>
  )
}
