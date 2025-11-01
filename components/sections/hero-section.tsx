"use client"
import { useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import atletaImg from "@/public/atleta-corriendo-en-ciudad-moderna-al-amanecer.jpg"
import { Button } from "../ui/button"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const heroRef = useRef(null)
  const imageRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animación de la imagen de fondo con parallax
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 1.5,
        ease: "power2.out",
      })

      gsap.to(imageRef.current, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })

      // Animación del overlay con efecto de fade
      gsap.from(overlayRef.current, {
        opacity: 0,
        duration: 1.2,
        ease: "power2.inOut",
      })

      // Timeline principal del hero
      const heroTimeline = gsap.timeline({ 
        defaults: { ease: "power3.out" }
      })

      heroTimeline
        .from(".hero-badge", {
          opacity: 0,
          scale: 0.5,
          y: -20,
          duration: 0.8,
          ease: "back.out(2)",
        })
        .from(
          ".hero-title",
          {
            opacity: 0,
            y: 80,
            duration: 1.2,
            ease: "power4.out",
          },
          "-=0.4"
        )
        .from(
          ".hero-title .text-gradient",
          {
            opacity: 0,
            x: -50,
            duration: 1,
            ease: "power3.out",
          },
          "-=0.7"
        )
        .from(
          ".hero-description",
          {
            opacity: 0,
            y: 40,
            duration: 0.9,
          },
          "-=0.6"
        )
        .from(
          ".hero-buttons",
          {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 0.7,
          },
          "-=0.5"
        )

      // Animación pulsante del badge
      gsap.to(".hero-badge", {
        scale: 1.05,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 2,
      })

      // Animación del gradiente de texto
      gsap.to(".text-gradient", {
        backgroundPosition: "200% center",
        duration: 3,
        repeat: -1,
        ease: "none",
      })


    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={heroRef}
      className="hero-section relative min-h-[90vh] flex items-center overflow-hidden"
    >
      <div className="absolute inset-0 hero-image">
        <div ref={imageRef} className="relative w-full h-full scale-100">
          <Image
            src={atletaImg}
            alt="Atleta en acción"
            fill
            className="object-cover object-center"
            style={{ objectPosition: '50% 40%' }}
            priority
            quality={90}
          />
        </div>
      </div>
      
      <div 
        ref={overlayRef}
        className="absolute inset-0 bg-linear-to-r from-black/85 via-black/60 to-transparent"
      />

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="hero-badge inline-block mb-4 px-4 py-2 bg-accent/20 border border-accent rounded-full">
            <span className="text-accent font-bold text-sm tracking-wider">NUEVA COLECCIÓN 2026</span>
          </div>
          
          <h1 className="hero-title text-5xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight text-balance">
            SUPERA TUS{" "}
            <span 
              className="text-gradient block bg-linear-to-r from-accent via-purple-500 to-accent bg-clip-text text-transparent"
              style={{ backgroundSize: '200% auto' }}
            >
              LÍMITES
            </span>
          </h1>
          
          <p className="hero-description text-lg md:text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl text-pretty">
            Ropa deportiva de alto rendimiento diseñada para atletas que no se conforman con menos. Tecnología
            avanzada, estilo inigualable.
          </p>
          
           <div className="hero-buttons flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="h-14 px-8 text-base font-bold bg-accent hover:bg-accent/90">
                  <Link href="/productos">Explorar Colección</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="h-14 px-8 text-base font-bold border-2 border-white text-white hover:bg-white hover:text-black bg-transparent"
                >
                  <Link href="/productos?categoria=nuevo">Ver Novedades</Link>
                </Button>
            </div>
        </div>
      </div>
    </section>
  )
}