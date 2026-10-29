import { categories } from "./taxonomy";
import type { Availability, Business, ListingStats, PriceType, Tone } from "./types";

// More sample listings, one or more for every service group, so the preview
// shows the different kinds of services and pricing that can be listed
// (hourly, daily, fixed, by agreement, free estimate; with or without a
// description, verified or not, with or without stated availability).

type Entry = {
  id: string;
  slug: string;
  name: string;
  cats: string[];
  cities: string[];
  price: [PriceType, number?] | ["fijo", number | undefined, string, string];
  avail?: Availability;
  rating?: [number, number];
  verified?: boolean;
  tone?: Tone;
  since: string;
  es?: string;
  en?: string;
  whatsapp?: boolean;
};

const AREA: Record<string, string> = {
  houston: "713", dallas: "214", "san-antonio": "210", austin: "512", miami: "305",
  "los-angeles": "213", chicago: "312", "nueva-york": "212", phoenix: "602",
};

const entries: Entry[] = [
  { id: "c1", slug: "pinturas-ramirez", name: "Pinturas Ramírez", cats: ["pintores", "pisos"], cities: ["dallas"], price: ["hora", 45], avail: "hoy", rating: [4.8, 31], verified: true, since: "2025-03-14",
    es: "Pintura interior y exterior, reparación de paredes y acabados limpios. Trabajamos rápido y dejamos todo como lo encontramos.",
    en: "Interior and exterior painting, drywall patching and clean finishes. We work fast and leave your home as we found it." },
  { id: "c2", slug: "cerrajeria-express-24-7", name: "Cerrajería Express 24/7", cats: ["cerrajeros"], cities: ["houston"], price: ["fijo", undefined, "Servicio desde $65", "Service from $65"], avail: "ahora", rating: [4.6, 54], verified: true, since: "2024-11-02", whatsapp: true,
    es: "🔑 Aperturas de casas y autos, cambio de chapas y copias de llaves. Llegamos en 30 minutos.",
    en: "🔑 Home and car lockouts, lock changes and key copies. We arrive within 30 minutes." },
  { id: "c3", slug: "carpinteria-don-beto", name: "Carpintería Don Beto", cats: ["carpinteros", "remodelacion"], cities: ["san-antonio"], price: ["a-convenir"], avail: "esta-semana", rating: [4.9, 18], verified: true, since: "2023-06-20",
    es: "Muebles a la medida, closets, puertas y reparaciones de madera. Más de 20 años en el oficio.",
    en: "Custom furniture, closets, doors and wood repairs. More than 20 years in the trade." },
  { id: "c4", slug: "techos-solis-roofing", name: "Techos Solís Roofing", cats: ["techos", "remodelaciones"], cities: ["houston", "san-antonio"], price: ["presupuesto-gratis"], avail: "esta-semana", rating: [4.7, 40], verified: true, since: "2022-09-08",
    es: "Reparación y cambio de techos, inspección después de tormentas y ayuda con el reclamo al seguro.",
    en: "Roof repair and replacement, storm inspections and help with your insurance claim." },
  { id: "c5", slug: "hermanos-vega-concreto", name: "Hermanos Vega Concreto y Cercas", cats: ["concreto", "cercas"], cities: ["phoenix"], price: ["fijo", undefined, "Desde $8 por pie²", "From $8 per sq ft"], since: "2026-09-30" },
  { id: "c6", slug: "brillo-oficinas", name: "Brillo Oficinas", cats: ["limpieza-oficinas", "limpieza-profunda"], cities: ["chicago"], price: ["hora", 35], avail: "hoy", rating: [4.5, 12], verified: true, since: "2025-01-17",
    es: "Limpieza nocturna de oficinas, consultorios y locales. Personal asegurado y con referencias.",
    en: "After-hours cleaning for offices, clinics and shops. Insured staff with references." },
  { id: "c7", slug: "alfombras-como-nuevas", name: "Alfombras Como Nuevas", cats: ["alfombras", "limpieza-profunda"], cities: ["los-angeles"], price: ["fijo", undefined, "$35 por habitación", "$35 per room"], avail: "esta-semana", rating: [4.8, 66], verified: true, since: "2023-02-11",
    es: "Lavado profundo de alfombras, sillones y colchones con secado rápido.",
    en: "Deep cleaning for carpets, sofas and mattresses, with quick drying." },
  { id: "c8", slug: "plagastop", name: "PlagaStop", cats: ["control-plagas"], cities: ["miami"], price: ["presupuesto-gratis"], avail: "ahora", rating: [4.4, 23], verified: true, since: "2024-05-29",
    es: "Control de cucarachas, termitas y roedores con productos seguros para niños y mascotas.",
    en: "Roach, termite and rodent control with products that are safe for kids and pets." },
  { id: "c9", slug: "fletes-rapidos-luna", name: "Fletes Rápidos Luna", cats: ["fletes", "basura", "mudanzas"], cities: ["houston", "dallas"], price: ["hora", 60], avail: "hoy", rating: [4.6, 29], since: "2025-08-03", whatsapp: true,
    es: "🚚 Fletes con camioneta grande. ✔️ Muebles y electrodomésticos ✔️ Retiro de basura y escombro ✔️ Viajes dentro y fuera de la ciudad.",
    en: "🚚 Large-van transport. ✔️ Furniture and appliances ✔️ Junk and debris removal ✔️ Local and long-distance trips." },
  { id: "c10", slug: "albercas-azul-claro", name: "Albercas Azul Claro", cats: ["albercas"], cities: ["phoenix", "austin"], price: ["fijo", undefined, "Desde $120 al mes", "From $120 a month"], avail: "esta-semana", rating: [4.9, 15], verified: true, since: "2024-03-21",
    es: "Mantenimiento semanal de albercas, químicos, filtros y reparación de bombas.",
    en: "Weekly pool maintenance, chemicals, filters and pump repair." },
  { id: "c11", slug: "poda-arboles-castillo", name: "Poda y Árboles Castillo", cats: ["arboles", "cesped"], cities: ["dallas"], price: ["presupuesto-gratis"], avail: "ocupado", rating: [4.7, 21], verified: true, since: "2023-10-12",
    es: "Poda, tala y retiro de tocones con equipo profesional y seguro de responsabilidad.",
    en: "Tree trimming, removal and stump grinding with pro equipment and liability insurance." },
  { id: "c12", slug: "autospa-detallado-movil", name: "AutoSpa Detallado Móvil", cats: ["lavado-autos"], cities: ["houston", "austin"], price: ["fijo", 149, "Detallado completo $149", "Full detail $149"], avail: "hoy", rating: [4.8, 44], verified: true, since: "2025-04-09", whatsapp: true,
    es: "Vamos a tu casa u oficina: lavado, encerado y limpieza interior a fondo.",
    en: "We come to your home or office: wash, wax and a full interior clean." },
  { id: "c13", slug: "gruas-san-juan", name: "Grúas San Juan", cats: ["grua", "mecanicos"], cities: ["san-antonio", "austin"], price: ["a-convenir"], avail: "ahora", rating: [4.3, 37], since: "2024-07-15", whatsapp: true },
  { id: "c14", slug: "electrodomesticos-molina", name: "Electrodomésticos Molina", cats: ["electrodomesticos"], cities: ["chicago"], price: ["fijo", undefined, "Visita desde $70", "Service call from $70"], avail: "esta-semana", rating: [4.6, 48], verified: true, since: "2022-12-01",
    es: "Lavadoras, secadoras, refrigeradores y estufas de todas las marcas. Garantía de 90 días.",
    en: "Washers, dryers, fridges and stoves of every brand. 90-day warranty." },
  { id: "c15", slug: "celularfix", name: "CelularFix", cats: ["celulares"], cities: ["los-angeles"], price: ["fijo", undefined, "Pantallas desde $59", "Screens from $59"], avail: "ahora", rating: [4.7, 102], verified: true, since: "2023-05-05", tone: "teal",
    es: "Cambio de pantalla y batería, reparación de computadoras y recuperación de datos el mismo día.",
    en: "Same-day screen and battery replacement, computer repair and data recovery." },
  { id: "c16", slug: "paseos-patitas-felices", name: "Paseos Patitas Felices", cats: ["paseo-perros", "cuidado-mascotas"], cities: ["austin"], price: ["hora", 20], avail: "hoy", rating: [5, 19], verified: true, since: "2025-06-18", tone: "amber",
    es: "Paseos de 30 o 60 minutos y visitas a domicilio mientras estás fuera. Fotos en cada paseo.",
    en: "30- or 60-minute walks and home visits while you're away. Photos on every walk." },
  { id: "c17", slug: "estetica-canina-coco", name: "Estética Canina Coco", cats: ["estetica-canina"], cities: ["miami"], price: ["fijo", undefined, "Baño y corte desde $45", "Bath and cut from $45"], avail: "esta-semana", rating: [4.9, 58], verified: true, since: "2024-02-27",
    es: "Baño, corte de pelo y uñas para perros y gatos con mucho cariño.",
    en: "Baths, haircuts and nail trims for dogs and cats, with plenty of love." },
  { id: "c18", slug: "unas-by-yesenia", name: "Uñas by Yesenia", cats: ["unas", "maquillaje"], cities: ["houston"], price: ["fijo", undefined, "Manicure desde $30", "Manicure from $30"], avail: "hoy", rating: [4.8, 77], since: "2025-09-10", tone: "pink", whatsapp: true,
    es: "💅 Acrílicas, gel y pedicure. Atiendo en mi estudio o a domicilio.",
    en: "💅 Acrylics, gel and pedicures. In my studio or at your home." },
  { id: "c19", slug: "masajes-terapeuticos-alma", name: "Masajes Terapéuticos Alma", cats: ["masajes"], cities: ["nueva-york"], price: ["hora", 80], avail: "esta-semana", rating: [4.9, 33], verified: true, since: "2023-08-30",
    es: "Masaje relajante, descontracturante y prenatal con terapeuta certificada.",
    en: "Relaxing, deep-tissue and prenatal massage with a licensed therapist." },
  { id: "c20", slug: "cuidado-con-carino", name: "Cuidado con Cariño", cats: ["cuidado-adultos", "enfermeria"], cities: ["los-angeles", "phoenix"], price: ["hora", 28], avail: "esta-semana", rating: [4.8, 26], verified: true, since: "2022-04-14",
    es: "Cuidadoras bilingües para adultos mayores: compañía, medicamentos, comidas y aseo personal.",
    en: "Bilingual caregivers for seniors: companionship, medication reminders, meals and personal care." },
  { id: "c21", slug: "ninera-maria-jose", name: "María José — Niñera", cats: ["ninera"], cities: ["miami"], price: ["hora", 18], avail: "hoy", rating: [5, 9], since: "2026-07-22", tone: "rose",
    es: "Estudiante de educación con experiencia. Cuido niños por las tardes y fines de semana.",
    en: "Education student with experience. Babysitting afternoons and weekends." },
  { id: "c22", slug: "tutorias-exito-escolar", name: "Tutorías Éxito Escolar", cats: ["tutorias", "ingles"], cities: ["dallas", "houston"], price: ["hora", 30], avail: "esta-semana", rating: [4.9, 41], verified: true, since: "2024-01-08",
    es: "Matemáticas, lectura y tareas de primaria a preparatoria, en línea o presencial.",
    en: "Math, reading and homework help from elementary to high school, online or in person." },
  { id: "c23", slug: "profe-andres-musica", name: "Profe Andrés — Guitarra y Piano", cats: ["musica"], cities: ["chicago"], price: ["hora", 35], avail: "hoy", rating: [4.8, 14], verified: true, since: "2025-10-19", tone: "violet",
    es: "Músico con 15 años de experiencia. Clases de guitarra, piano y producción para todas las edades.",
    en: "Musician with 15 years of experience. Guitar, piano and music production lessons for all ages." },
  { id: "c24", slug: "academia-manejo-seguro", name: "Academia Manejo Seguro", cats: ["manejo"], cities: ["houston"], price: ["fijo", 220, "Paquete de 5 clases $220", "5-lesson package $220"], avail: "esta-semana", rating: [4.6, 52], verified: true, since: "2021-11-23",
    es: "Instructores bilingües, auto de doble pedal y preparación para el examen de manejo.",
    en: "Bilingual instructors, dual-brake car and road-test preparation." },
  { id: "c25", slug: "estudio-creativo-pixel", name: "Estudio Creativo Pixel", cats: ["diseno-grafico", "redes-sociales", "paginas-web"], cities: ["austin"], price: ["a-convenir"], rating: [4.7, 11], verified: true, since: "2025-02-02", tone: "blue",
    es: "Logos, tarjetas, menús y manejo de redes sociales para pequeños negocios latinos.",
    en: "Logos, business cards, menus and social media for small Latino businesses." },
  { id: "c26", slug: "web-facil-studio", name: "Web Fácil Studio", cats: ["paginas-web"], cities: ["nueva-york"], price: ["fijo", undefined, "Sitios desde $499", "Websites from $499"], avail: "esta-semana", rating: [4.5, 8], since: "2026-05-12",
    es: "¿Necesitas una página web o tienda en línea? Te ayudo a vender más. Consulta gratis.",
    en: "Need a website or online store? I'll help you sell more. Free consultation." },
  { id: "c27", slug: "foto-video-momentos", name: "Foto y Video Momentos", cats: ["fotografia"], cities: ["los-angeles", "phoenix"], price: ["fijo", undefined, "Sesiones desde $150", "Sessions from $150"], avail: "ocupado", rating: [4.9, 64], verified: true, since: "2022-07-07",
    es: "Bodas, quinceañeras, bautizos y retratos familiares. Entrega digital en una semana.",
    en: "Weddings, quinceañeras, baptisms and family portraits. Digital delivery within a week." },
  { id: "c28", slug: "traducciones-ortiz", name: "Traducciones Certificadas Ortiz", cats: ["traducciones", "notario"], cities: ["miami", "nueva-york"], price: ["fijo", undefined, "$25 por página", "$25 per page"], avail: "ahora", rating: [4.8, 90], verified: true, since: "2021-09-15",
    es: "Traducciones certificadas para USCIS, escuelas y tribunales. Servicio de notario el mismo día.",
    en: "Certified translations for USCIS, schools and courts. Same-day notary service." },
  { id: "c29", slug: "dj-fuego-latino", name: "DJ Fuego Latino", cats: ["dj", "fiestas"], cities: ["dallas", "houston"], price: ["dia", 450], avail: "esta-semana", rating: [4.7, 38], verified: true, since: "2023-03-03", tone: "red",
    es: "Música para bodas, quinceañeras y fiestas: sonido, luces y animación.",
    en: "Music for weddings, quinceañeras and parties: sound, lights and MC." },
  { id: "c30", slug: "mariachi-real-san-antonio", name: "Mariachi Real de San Antonio", cats: ["mariachi"], cities: ["san-antonio", "austin"], price: ["a-convenir"], avail: "ocupado", rating: [5, 47], verified: true, since: "2020-05-10",
    es: "🎺 Serenatas, bodas, cumpleaños y eventos. ¡Reserva con tiempo!",
    en: "🎺 Serenades, weddings, birthdays and events. Book early!" },
  { id: "c31", slug: "pasteles-dulce-tentacion", name: "Pasteles Dulce Tentación", cats: ["pasteles", "catering"], cities: ["chicago"], price: ["fijo", undefined, "Pasteles desde $40", "Cakes from $40"], avail: "hoy", rating: [4.9, 73], since: "2024-12-12", tone: "pink",
    es: "Pasteles de tres leches, cupcakes y mesas de postres para toda ocasión.",
    en: "Tres leches cakes, cupcakes and dessert tables for every occasion." },
  { id: "c32", slug: "brincolines-fiesta", name: "Brincolines y Mesas Fiesta", cats: ["fiestas"], cities: ["phoenix"], price: ["dia", 120], avail: "esta-semana", rating: [4.6, 20], verified: true, since: "2025-05-25" },
  { id: "c33", slug: "pisos-azulejos-guzman", name: "Pisos y Azulejos Guzmán", cats: ["pisos", "remodelaciones"], cities: ["miami"], price: ["presupuesto-gratis"], rating: [4.7, 17], verified: true, since: "2024-08-19",
    es: "Instalación de porcelanato, laminado y madera. Baños y cocinas con acabado perfecto.",
    en: "Porcelain, laminate and hardwood installation. Bathrooms and kitchens with a perfect finish." },
];

function names(slugs: string[], lang: "es" | "en") {
  return slugs.map((s) => categories.find((c) => c.slug === s)).filter((c) => c !== undefined).map((c) => (lang === "en" ? c.nameEn : c.name));
}

export function moreListings(stats: (seed: number, base: number) => ListingStats): Business[] {
  return entries.map((e, i): Business => {
    const [priceType, price, noteEs = "", noteEn] = e.price;
    const phone = `(${AREA[e.cities[0]] ?? "555"}) 555-0${(140 + i).toString().padStart(3, "0")}`;
    const [es, en] = [names(e.cats, "es"), names(e.cats, "en")];
    return {
      id: e.id,
      slug: e.slug,
      name: e.name,
      tagline: es[0] ?? e.name,
      description: e.es ?? "",
      categories: e.cats,
      services: es,
      cities: e.cities,
      baseCity: e.cities[0],
      phone,
      whatsapp: e.whatsapp ? `+1${phone.replace(/\D/g, "")}` : undefined,
      priceType,
      price,
      priceNote: noteEs,
      availability: e.avail,
      verified: e.verified,
      status: "aprobado",
      plan: "gratis",
      rating: e.rating?.[0] ?? 0,
      reviewCount: e.rating?.[1] ?? 0,
      avatarTone: e.tone,
      stats: stats(40 + i, 12),
      createdAt: e.since,
      addedByAdmin: i % 4 === 0,
      en: { tagline: en[0], description: e.en, services: en, priceNote: noteEn },
    };
  });
}
