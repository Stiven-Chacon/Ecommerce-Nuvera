'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface ValuesSectionProps {
  values?: Value[];
  title?: string;
  subtitle?: string;
}

const defaultValues: Value[] = [
  {
    icon: "🏆",
    title: "Excelencia",
    description: "Buscamos la perfección en cada producto que creamos",
  },
  {
    icon: "🌱",
    title: "Sostenibilidad",
    description: "Compromiso con el planeta y producción responsable",
  },
  {
    icon: "💪",
    title: "Rendimiento",
    description: "Tecnología avanzada para maximizar tu potencial",
  },
  {
    icon: "🤝",
    title: "Comunidad",
    description: "Construimos una familia de atletas apasionados",
  },
];

export default function ValuesSection({
  values = defaultValues,
  title = "NUESTROS VALORES",
  subtitle = "Los principios que guían cada decisión que tomamos"
}: ValuesSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const valuesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Animación del título y subtítulo
      gsap.from(titleRef.current, {
        opacity: 0,
        y: -50,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(subtitleRef.current, {
        opacity: 0,
        y: -30,
        duration: 0.8,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
          toggleActions: 'play none none none',
        },
      });

      // Animación de entrada para cada value card con stagger
      gsap.from(valuesRef.current, {
        y: 80,
        opacity: 0,
        scale: 0.8,
        rotationY: 45,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none none',
        },
      });

      // Efecto de hover para cada value card
      valuesRef.current.forEach((valueCard) => {
        const hoverTimeline = gsap.timeline({ paused: true });
        const icon = valueCard.querySelector('.value-icon');
        
        hoverTimeline
          .to(valueCard, {
            y: -15,
            scale: 1.05,
            duration: 0.4,
            ease: 'power2.out',
          }, 0)
          .to(icon, {
            scale: 1.2,
            rotation: 10,
            duration: 0.3,
            ease: 'back.out(2)',
          }, 0);

        valueCard.addEventListener('mouseenter', () => hoverTimeline.play());
        valueCard.addEventListener('mouseleave', () => hoverTimeline.reverse());
      });

    }, section);

    return () => ctx.revert();
  }, [values]);

  return (
    <section ref={sectionRef} className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 overflow-hidden">
      <div className="text-center mb-16">
        <h2 ref={titleRef} className="text-4xl md:text-5xl font-black mb-4">
          {title}
        </h2>
        <p ref={subtitleRef} className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {values.map((value, index) => (
          <div
            key={index}
            ref={(el) => {
              if (el) valuesRef.current[index] = el;
            }}
            className="value-card text-center p-8 rounded-2xl border-2 border-border hover:border-accent transition-colors cursor-pointer"
          >
            <div className="value-icon text-6xl mb-4 inline-block">
              {value.icon}
            </div>
            <h3 className="text-xl font-black mb-3 uppercase">
              {value.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}