'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Category {
  id: string;
  href: string;
  image: string;
  alt: string;
  title: string;
  description: string;
}

interface CategoryGridProps {
  title?: string;
  categories?: Category[];
  className?: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'ropa',
    href: '/products?categoria=ropa',
    image: '/ropa-deportiva-moderna-colgada.jpg',
    alt: 'Ropa Deportiva',
    title: 'ROPA',
    description: 'Rendimiento y estilo'
  },
  {
    id: 'calzado',
    href: '/products?categoria=calzado',
    image: '/zapatillas-deportivas-premium.jpg',
    alt: 'Calzado',
    title: 'CALZADO',
    description: 'Tecnología avanzada'
  },
  {
    id: 'accesorios',
    href: '/products?categoria=accesorios',
    image: '/accesorios-deportivos-modernos.jpg',
    alt: 'Accesorios',
    title: 'ACCESORIOS',
    description: 'Completa tu look'
  }
];

export default function CategoryGrid({
  title = "COMPRA POR CATEGORÍA",
  categories = DEFAULT_CATEGORIES,
  className = ""
}: CategoryGridProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Animación del título
      gsap.from(titleRef.current, {
        opacity: 0,
        y: 50,
        scale: 0.9,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Animación escalonada de las cards
      cardsRef.current.forEach((card, index) => {
        if (!card) return;

        gsap.from(card, {
          opacity: 0,
          y: 100,
          scale: 0.8,
          duration: 0.8,
          delay: 0.2 + index * 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        });

        // Hover effect con GSAP
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            y: -10,
            duration: 0.4,
            ease: 'power2.out',
          });

          const img = card.querySelector('img');
          if (img) {
            gsap.to(img, {
              scale: 1.1,
              duration: 0.6,
              ease: 'power2.out',
            });
          }
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out',
          });

          const img = card.querySelector('img');
          if (img) {
            gsap.to(img, {
              scale: 1,
              duration: 0.6,
              ease: 'power2.out',
            });
          }
        });
      });

      // Hover effect para el título
      if (titleRef.current) {
        const titleEl = titleRef.current;
        titleEl.addEventListener('mouseenter', () => {
          gsap.to(titleEl, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
        titleEl.addEventListener('mouseleave', () => {
          gsap.to(titleEl, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      }
    }, section);

    return () => ctx.revert();
  }, [categories]);

  return (
    <section 
      ref={sectionRef}
      className={`bg-muted py-24 overflow-hidden ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12">
            <h2 
              ref={titleRef}
              className="text-4xl md:text-5xl font-black mb-4 cursor-default"
            >
              {title}
            </h2>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <Link
              key={category.id}
              href={category.href}
              ref={(el) => {
                cardsRef.current[index] = el;
              }}
              className="group relative h-80 rounded-lg overflow-hidden shadow-lg"
            >
              <Image
                src={category.image}
                alt={category.alt}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <h3 className="text-3xl font-black text-white mb-2">
                  {category.title}
                </h3>
                <p className="text-white/80">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}