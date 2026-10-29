import type { Availability, Business, Highlight, ListingStats, Tone } from "./types";

// Listings from the client's mockups (Austin, TX). Main text in Spanish, with
// the mockup's English text as the English version.

type MockupInput = {
  id: string;
  slug: string;
  name: string;
  category: string;
  more?: string[]; // extra services shown as tags
  availability?: Availability;
  verified?: boolean;
  avatarTone?: Tone;
  since: string;
  rating: number;
  seed: number;
  phone: string;
  featured?: boolean;
  cities?: string[];
  photos?: string[];
  es: { tagline: string; description: string; services: string[]; highlights?: Highlight[] };
  en: { tagline: string; description: string; services: string[]; highlights?: Highlight[] };
};

export function mockupListings(stats: (seed: number, base: number) => ListingStats): Business[] {
  const listing = (m: MockupInput): Business => ({
    id: m.id,
    slug: m.slug,
    name: m.name,
    tagline: m.es.tagline,
    description: m.es.description,
    categories: [m.category, ...(m.more ?? [])],
    services: m.es.services,
    cities: m.cities ?? ["austin"],
    baseCity: "austin",
    address: "Austin, TX",
    phone: m.phone,
    whatsapp: `+1${m.phone.replace(/\D/g, "")}`,
    email: "hello@example.com",
    priceType: "a-convenir",
    priceNote: "",
    availability: m.availability,
    verified: m.verified ?? true,
    avatarTone: m.avatarTone,
    status: "aprobado",
    plan: m.featured ? "destacado" : "gratis",
    rating: m.rating,
    reviewCount: 20 + m.seed,
    stats: stats(m.seed, 30),
    createdAt: m.since,
    addedByAdmin: false,
    photos: m.photos,
    highlights: m.es.highlights,
    en: m.en,
  });

  return [
    listing({
      id: "a1",
      slug: "brightside-electrical",
      more: ["aire-acondicionado"],
      availability: "hoy",
      name: "Brightside Electrical",
      category: "electricistas",
      since: "2022-01-12",
      rating: 4.95,
      seed: 21,
      featured: true,
      cities: ["austin", "dallas", "houston"],
      phone: "(512) 555-0102",
      photos: ["/img/work-1.jpg", "/img/work-2.jpg", "/img/work-3.jpg"],
      es: {
        tagline: "Servicios eléctricos para casas y negocios",
        description:
          "Brightside Electrical ofrece servicios eléctricos confiables y de alta calidad para casas y pequeños negocios en el centro de Texas. Desde mejoras de iluminación hasta instalación de paneles, nos enfocamos en trabajo seguro, comunicación clara y resultados duraderos.",
        services: ["Cambio de panel", "Cargadores eléctricos", "Iluminación", "Diagnóstico de fallas"],
        highlights: [
          { icon: "bulb", title: "Instalación de iluminación", text: "Iluminación interior, exterior y de diseño" },
          { icon: "wrench", title: "Reparaciones eléctricas", text: "Diagnóstico y arreglos según el código" },
          { icon: "panel", title: "Cambio de panel", text: "Mejora y reemplazo del panel eléctrico" },
        ],
      },
      en: {
        tagline: "Electrical services for homes and businesses",
        description:
          "Brightside Electrical provides reliable, high-quality electrical services for homes and small businesses across Central Texas. From lighting upgrades to panel installations, we focus on safe work, clear communication, and lasting results. Our licensed electricians bring years of hands-on experience and a commitment to great service on every project.",
        services: ["Panel Upgrades", "EV Chargers", "Lighting", "Troubleshooting"],
        highlights: [
          { icon: "bulb", title: "Lighting installation", text: "Indoor, outdoor and design lighting" },
          { icon: "wrench", title: "Electrical repairs", text: "Troubleshooting and code-compliant fixes" },
          { icon: "panel", title: "Panel upgrades", text: "Service upgrades and replacements" },
        ],
      },
    }),
    listing({
      id: "a2",
      slug: "austin-circuit-co",
      availability: "esta-semana",
      avatarTone: "violet",
      name: "Austin Circuit Co.",
      category: "electricistas",
      since: "2021-03-08",
      rating: 4.9,
      seed: 22,
      phone: "(512) 555-0117",
      es: {
        tagline: "Contratista eléctrico integral",
        description: "Contratista eléctrico integral que ayuda a familias y negocios a dar el siguiente paso.",
        services: ["Instalaciones nuevas", "Cambio de panel", "Iluminación", "Reparaciones"],
      },
      en: {
        tagline: "Full-service electrical contractor",
        description: "Full-service electrical contractor helping homeowners and businesses power what's next.",
        services: ["New Installations", "Panel Upgrades", "Lighting", "Repairs"],
      },
    }),
    listing({
      id: "a3",
      slug: "northside-electric",
      availability: "ahora",
      name: "Northside Electric",
      category: "electricistas",
      since: "2023-06-03",
      rating: 4.8,
      seed: 23,
      phone: "(512) 555-0125",
      es: {
        tagline: "Electricistas residenciales y comerciales",
        description: "Electricistas locales para proyectos residenciales y comerciales ligeros. Conocidos por su rapidez y trabajo limpio.",
        services: ["Diagnóstico de fallas", "Iluminación", "Contactos", "Ventiladores de techo"],
      },
      en: {
        tagline: "Residential and light commercial electricians",
        description: "Local electricians for residential and light commercial projects. Known for responsive service and clean work.",
        services: ["Troubleshooting", "Lighting", "Outlets", "Ceiling Fans"],
      },
    }),
    listing({
      id: "a4",
      slug: "current-home-services",
      more: ["remodelacion", "aire-acondicionado"],
      availability: "esta-semana",
      name: "Current Home Services",
      category: "electricistas",
      since: "2022-11-14",
      rating: 4.7,
      seed: 24,
      phone: "(512) 555-0139",
      es: {
        tagline: "Reparaciones eléctricas y casa inteligente",
        description: "Reparaciones eléctricas, mejoras e instalaciones de casa inteligente para la vida moderna.",
        services: ["Casa inteligente", "Cambio de panel", "Iluminación", "Cargadores eléctricos"],
      },
      en: {
        tagline: "Electrical repairs and smart home",
        description: "Electrical repairs, upgrades and smart home installations for modern living.",
        services: ["Smart Home", "Panel Upgrades", "Lighting", "EV Chargers"],
      },
    }),
    listing({
      id: "a5",
      slug: "lone-star-lighting",
      verified: false,
      name: "Lone Star Lighting",
      category: "electricistas",
      since: "2021-02-20",
      rating: 4.6,
      seed: 25,
      phone: "(512) 555-0148",
      es: {
        tagline: "Iluminación interior y exterior",
        description: "Especialistas en iluminación interior y exterior, ventiladores de techo y mejoras eléctricas.",
        services: ["Diseño de iluminación", "Iluminación exterior", "Ventiladores de techo", "Contactos"],
      },
      en: {
        tagline: "Indoor and outdoor lighting",
        description: "Specializing in indoor and outdoor lighting, ceiling fans and electrical upgrades.",
        services: ["Lighting Design", "Outdoor Lighting", "Ceiling Fans", "Outlets"],
      },
    }),
    listing({
      id: "a6",
      slug: "livewire-local",
      availability: "ocupado",
      verified: false,
      avatarTone: "blue",
      name: "Livewire Local",
      category: "electricistas",
      since: "2023-08-09",
      rating: 4.5,
      seed: 26,
      phone: "(512) 555-0156",
      es: {
        tagline: "Servicio eléctrico rápido y amable",
        description: "Servicios eléctricos rápidos y amables para casas y pequeños negocios en todo Austin.",
        services: ["Reparaciones", "Cambio de panel", "Cargadores eléctricos", "Diagnóstico de fallas"],
      },
      en: {
        tagline: "Fast, friendly electrical service",
        description: "Fast, friendly electrical services for homes and small businesses across Austin.",
        services: ["Repairs", "Panel Upgrades", "EV Chargers", "Troubleshooting"],
      },
    }),
    listing({
      id: "a7",
      slug: "fresh-start-cleaning-co",
      more: ["limpieza-profunda", "limpieza-oficinas"],
      availability: "hoy",
      name: "Fresh Start Cleaning Co.",
      category: "limpieza",
      since: "2021-01-18",
      rating: 5,
      seed: 27,
      featured: true,
      phone: "(512) 555-0163",
      photos: ["/img/cover-cleaning.jpg"],
      es: {
        tagline: "Limpieza residencial y comercial",
        description: "Limpieza confiable y detallista para casas y pequeños negocios. Un espacio más limpio y luminoso para lo que más importa.",
        services: ["Limpieza", "Limpieza profunda", "Mudanzas"],
      },
      en: {
        tagline: "Residential and commercial cleaning",
        description: "Reliable, detail-oriented cleaning for homes and small businesses. A cleaner, brighter space for what matters most.",
        services: ["Cleaning", "Deep Cleaning", "Move In/Out"],
      },
    }),
    listing({
      id: "a8",
      slug: "rooted-garden-landscape",
      more: ["cesped", "arboles"],
      availability: "esta-semana",
      name: "Rooted Garden & Landscape",
      category: "jardineria",
      since: "2023-02-06",
      rating: 4.9,
      seed: 28,
      featured: true,
      phone: "(512) 555-0171",
      es: {
        tagline: "Jardinería sostenible",
        description: "Paisajismo y cuidado de jardines con criterio sostenible. Desde mantenimiento regular hasta renovaciones completas del jardín.",
        services: ["Paisajismo", "Cuidado del césped", "Diseño de jardines"],
      },
      en: {
        tagline: "Sustainable landscaping",
        description: "Thoughtful, sustainable landscaping and garden care. From regular maintenance to full yard makeovers.",
        services: ["Landscaping", "Lawn Care", "Garden Design"],
      },
    }),
  ];
}
