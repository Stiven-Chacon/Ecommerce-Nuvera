"use client"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const collections = [
  {
    id: "running",
    name: "Running",
    description: "Equipamiento técnico para corredores de alto rendimiento",
    image: "/running-shoes-and-athletic-wear.jpg",
    products: 120,
    color: "from-orange-500/20 to-red-500/20",
  },
  {
    id: "training",
    name: "Training",
    description: "Ropa y accesorios para entrenamientos intensos",
    image: "/gym-training-equipment-and-sportswear.jpg",
    products: 95,
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    id: "outdoor",
    name: "Outdoor",
    description: "Aventura y exploración sin límites",
    image: "/outdoor-hiking-gear-and-clothing.jpg",
    products: 78,
    color: "from-green-500/20 to-emerald-500/20",
  },
  {
    id: "yoga",
    name: "Yoga & Wellness",
    description: "Comodidad y flexibilidad para tu práctica",
    image: "/yoga-mat-and-wellness-clothing.jpg",
    products: 65,
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    id: "basketball",
    name: "Basketball",
    description: "Estilo urbano y rendimiento en la cancha",
    image: "/basketball-shoes-and-urban-sportswear.jpg",
    products: 88,
    color: "from-yellow-500/20 to-orange-500/20",
  },
  {
    id: "swimming",
    name: "Swimming",
    description: "Tecnología acuática de vanguardia",
    image: "/swimming-goggles-and-swimwear.jpg",
    products: 52,
    color: "from-cyan-500/20 to-blue-500/20",
  },
]

export function CollectionsGrid() {
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación stagger de las tarjetas
      gsap.utils.toArray(".collection-card").forEach((card, index) => {
        const el = card as HTMLElement

        gsap.from(el, {
          opacity: 0,
          y: 80,
          scale: 0.9,
          duration: 0.8,
          delay: index * 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      })

      // Efecto parallax al hacer hover
      gsap.utils.toArray(".collection-card").forEach((card) => {
        const el = card as HTMLElement
        const image = el.querySelector(".collection-image") as HTMLElement | null
        const content = el.querySelector(".collection-content") as HTMLElement | null

        if (!image || !content) return

        el.addEventListener("mouseenter", () => {
          gsap.to(image, {
            scale: 1.1,
            duration: 0.6,
            ease: "power2.out",
          })
          gsap.to(content, {
            y: -10,
            duration: 0.4,
            ease: "power2.out",
          })
        })

        el.addEventListener("mouseleave", () => {
          gsap.to(image, {
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          })
          gsap.to(content, {
            y: 0,
            duration: 0.4,
            ease: "power2.out",
          })
        })
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/productos?categoria=${collection.id}`}
            className="collection-card group block"
          >
            <div className="relative h-96 rounded-2xl overflow-hidden bg-black">
              {/* Image */}
              <div className="collection-image absolute inset-0">
                <Image
                  src={collection.image}
                  alt={collection.name}
                  fill
                  className="object-cover opacity-60"
                />
              </div>

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-linear-to-t ${collection.color} to-black/80`} />

              {/* Content */}
              <div className="collection-content absolute inset-0 p-8 flex flex-col justify-end">
                <div className="mb-4">
                  <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-4">
                    <span className="text-white text-xs font-bold">{collection.products} PRODUCTOS</span>
                  </div>
                </div>
                <h3 className="text-4xl font-black text-white mb-3 group-hover:text-orange-600 transition-colors">
                  {collection.name}
                </h3>
                <p className="text-white/80 text-sm leading-relaxed mb-4">{collection.description}</p>
                <div className="flex items-center text-orange-600 font-bold text-sm group-hover:translate-x-2 transition-transform">
                  EXPLORAR COLECCIÓN
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}