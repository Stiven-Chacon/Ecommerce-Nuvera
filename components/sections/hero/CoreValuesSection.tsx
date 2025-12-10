'use client';

import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

interface BenefitsSectionProps {
  benefits?: Benefit[];
  className?: string;
}

const defaultBenefits: Benefit[] = [
  {
    icon: "Zap",
    title: "Alto Rendimiento",
    description: "Tecnología de punta para maximizar tu desempeño atlético"
  },
  {
    icon: "Sparkles",
    title: "Diseño Premium",
    description: "Estilo que destaca dentro y fuera del gimnasio"
  },
  {
    icon: "Globe",
    title: "Sostenible",
    description: "Compromiso con el planeta y producción responsable"
  }
];

// Convertimos LucideIcons con tipado seguro
const iconMap = LucideIcons as unknown as Record<string, LucideIcon>;

export default function BenefitsSection({
  benefits = defaultBenefits,
  className = ""
}: BenefitsSectionProps) {
  const getIcon = (iconName: string) => {
    const Icon = iconMap[iconName];
    return Icon ? <Icon className="w-8 h-8" strokeWidth={2} /> : null;
  };

  return (
    <section className={`container mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-section ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {benefits.map((benefit, index) => (
          <div
            key={index}
            className="benefit-card text-center p-8 rounded-lg border-2 border-border hover:border-accent transition-colors"
          >
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6 text-accent">
              {getIcon(benefit.icon)}
            </div>
            <h3 className="text-xl font-black mb-3 uppercase">
              {benefit.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}