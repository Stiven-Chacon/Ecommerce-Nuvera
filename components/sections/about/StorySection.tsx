"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function StorySection() {
  const sectionRef = useRef(null)
  const contentRef = useRef(null)
  const imageRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación del texto
      gsap.from(contentRef.current, {
        opacity: 0,
        x: -80,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })

      // Animación de la imagen
      gsap.from(imageRef.current, {
        opacity: 0,
        x: 80,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: imageRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* CONTENIDO */}
        <div ref={contentRef}>
          <div className="inline-block mb-4 px-4 py-1 bg-accent/10 rounded-full">
            <span className="text-accent font-bold text-xs tracking-widest uppercase">
              Desde 2020
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-black mb-6">
            EL INICIO DE NUVERA
          </h2>

          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Todo comenzó en 2020, cuando un grupo de atletas profesionales se dio cuenta
              de que faltaba algo en el mercado: ropa deportiva que combinara verdadero
              rendimiento técnico con diseño excepcional.
            </p>
            <p>
              Fundamos Nuvera con una misión clara: crear equipamiento que no solo se vea
              bien, sino que ayude a los atletas a alcanzar su máximo potencial. Cada
              producto es el resultado de años de investigación, pruebas rigurosas y
              feedback de atletas profesionales.
            </p>
            <p>
              Hoy, Nuvera es más que una marca de ropa deportiva. Somos una comunidad
              global de atletas que se apoyan mutuamente para superar límites y alcanzar
              nuevas metas.
            </p>
          </div>
        </div>

        {/* IMAGEN */}
        <div ref={imageRef}>
          <div className="relative h-[500px] rounded-2xl overflow-hidden">
            <Image
              src="/modern-athletic-brand-headquarters-office.jpg"
              alt="Oficinas Nuvera"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

      </div>
    </section>
  )
}  