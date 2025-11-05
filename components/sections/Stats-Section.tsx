'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Stat {
  value: number;
  suffix: string;
  label: string;
}

interface StatsSectionProps {
  stats?: Stat[];
}

const defaultStats: Stat[] = [
  { value: 50000, suffix: '+', label: 'Atletas Confían' },
  { value: 500, suffix: '+', label: 'Productos' },
  { value: 98, suffix: '%', label: 'Satisfacción' },
  { value: 24, suffix: '/7', label: 'Soporte' },
];

export default function StatsSection({ stats = defaultStats }: StatsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Animación de entrada para cada stat card con stagger
      gsap.from(statsRef.current, {
        y: 50,
        opacity: 0,
        scale: 0.8,
        duration: 0.8,
        stagger: 0.15,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      // Animación de números contador
      statsRef.current.forEach((statCard, index) => {
        const numberElement = statCard.querySelector('.stat-number');
        if (!numberElement) return;

        const target = stats[index].value;
        const obj = { value: 0 };

        gsap.to(obj, {
          value: target,
          duration: 2,
          ease: 'power2.out',
          delay: 0.3 + index * 0.15,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            numberElement.textContent = Math.floor(obj.value).toLocaleString();
          },
        });
      });

      // Efecto de hover para cada stat card
      statsRef.current.forEach((statCard) => {
        const hoverTimeline = gsap.timeline({ paused: true });
        
        hoverTimeline.to(statCard, {
          y: -10,
          scale: 1.05,
          duration: 0.3,
          ease: 'power2.out',
        });

        statCard.addEventListener('mouseenter', () => hoverTimeline.play());
        statCard.addEventListener('mouseleave', () => hoverTimeline.reverse());
      });

    }, section);

    return () => ctx.revert();
  }, [stats]);

  return (
    <section ref={sectionRef} className="bg-black text-white py-16 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              ref={(el) => {
                if (el) statsRef.current[index] = el;
              }}
              className="text-center cursor-pointer"
            >
              <div className="text-4xl md:text-5xl font-black text-accent mb-2">
                <span className="stat-number inline-block" data-target={stat.value}>
                  0
                </span>
                {stat.suffix}
              </div>
              <p className="text-sm text-gray-400 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}