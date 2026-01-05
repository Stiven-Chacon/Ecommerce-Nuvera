'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonHref?: string;
  darkMode?: boolean;
}

export default function CTASection({
  title = "¿NO ENCUENTRAS LO QUE BUSCAS?",
  description = "Explora todos nuestros productos o contáctanos para asesoría personalizada",
  primaryButtonText = "Ver Todos los Productos",
  primaryButtonHref = "/products",
  darkMode = true
}: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Animación del título con efecto de entrada dramática
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

      // Animación de la descripción
      gsap.from(descriptionRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Animación de los botones
      gsap.from(buttonsRef.current?.children || [], {
        opacity: 0,
        y: 20,
        stagger: 0.2,
        duration: 0.6,
        delay: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Hover effect para el título
      if (titleRef.current) {
        const title = titleRef.current;
        title.addEventListener('mouseenter', () => {
          gsap.to(title, {
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
        title.addEventListener('mouseleave', () => {
          gsap.to(title, {
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
          });
        });
      }

    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      className={`py-24 ${darkMode ? 'bg-black text-white' : 'bg-gray-50'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 
          ref={titleRef}
          className="text-4xl md:text-6xl font-black mb-6 cursor-default"
        >
          {title}
        </h2>
        <p 
          ref={descriptionRef}
          className={`text-xl mb-8 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
        >
          {description}
        </p>
        <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href={primaryButtonHref}>
            <Button 
              size="lg" 
              className="h-14 px-8 text-base font-bold bg-accent hover:bg-accent/90 text-white"
            >
              {primaryButtonText}
            </Button>
          </Link>
         {/*  <Link href={secondaryButtonHref}>
            <Button
              size="lg"
              variant="outline"
              className={`h-14 px-8 text-base font-bold border-2 ${
                darkMode 
                  ? 'border-white text-white hover:bg-white hover:text-black bg-transparent' 
                  : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
              }`}
            >
              {secondaryButtonText}
            </Button>
          </Link> */}
        </div>
      </div>
    </section>
  );
}