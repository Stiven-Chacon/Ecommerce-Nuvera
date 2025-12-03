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
  buttonText?: string;
  buttonHref?: string;
  variant?: 'default' | 'gradient' | 'outlined';
}

export default function CTASection({
  title = "ÚNETE A LA FAMILIA NUVERA",
  description = "Descubre por qué miles de atletas confían en nosotros para alcanzar sus metas",
  buttonText = "Explorar Productos",
  buttonHref = "/productos",
  variant = 'default'
}: CTASectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Animación del título con efecto de split
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

      // Efecto de pulso continuo en el botón
      gsap.to(buttonRef.current, {
        scale: 1.05,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: 1.5,
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

  const getVariantClasses = () => {
    switch (variant) {
      case 'gradient':
        return 'bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70';
      case 'outlined':
        return 'bg-transparent border-2 border-accent text-accent hover:bg-accent hover:text-white';
      default:
        return 'bg-accent hover:bg-accent/90';
    }
  };

  return (
    <section 
      ref={sectionRef} 
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center overflow-hidden"
    >
      <h2 
        ref={titleRef}
        className="text-4xl md:text-6xl font-black mb-6 cursor-default"
      >
        {title}
      </h2>
      <p 
        ref={descriptionRef}
        className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
      >
        {description}
      </p>
      <div ref={buttonRef} className="inline-block">
        <Button 
          size="lg" 
          asChild 
          className={`h-14 px-8 text-base font-bold ${getVariantClasses()}`}
        >
          <Link href={buttonHref}>{buttonText}</Link>
        </Button>
      </div>
    </section>
  );
}