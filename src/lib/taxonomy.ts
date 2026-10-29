import type { Category, CategoryGroup, CategoryIcon, Tone } from "./types";

// Service catalog: groups (sidebar sections, home tiles) and the services
// inside them (checkboxes, tags, SEO pages). The original 12 slugs are kept so
// existing /city/service URLs keep working.

type Service = [slug: string, name: string, nameEn: string, icon: CategoryIcon, seoName?: string, seoNameEn?: string];
type Group = { slug: string; name: string; nameEn: string; icon: CategoryIcon; tone: Tone; services: Service[] };

const tree: Group[] = [
  {
    slug: "oficios-hogar", name: "Oficios del hogar", nameEn: "Home trades & repairs", icon: "wrench", tone: "blue",
    services: [
      ["plomeros", "Plomería", "Plumbing", "droplet", "Plomeros", "Plumbers"],
      ["electricistas", "Electricidad", "Electrical", "zap", "Electricistas", "Electricians"],
      ["aire-acondicionado", "Aire acondicionado", "AC & heating", "air", "Técnicos de aire acondicionado", "AC technicians"],
      ["remodelacion", "Reparaciones del hogar", "Handyman", "wrench", "Reparaciones y remodelación", "Handymen & remodelers"],
      ["pintores", "Pintura", "Painting", "paint", "Pintores", "Painters"],
      ["carpinteros", "Carpintería", "Carpentry", "hammer", "Carpinteros", "Carpenters"],
      ["cerrajeros", "Cerrajería", "Locksmith", "key", "Cerrajeros", "Locksmiths"],
      ["pisos", "Pisos y azulejos", "Flooring & tile", "tiles", "Instaladores de pisos", "Flooring installers"],
    ],
  },
  {
    slug: "construccion", name: "Construcción y remodelación", nameEn: "Construction & remodeling", icon: "hard-hat", tone: "amber",
    services: [
      ["remodelaciones", "Cocinas y baños", "Kitchen & bath remodeling", "house", "Remodelación de cocinas y baños", "Kitchen & bath remodelers"],
      ["techos", "Techos", "Roofing", "house", "Techeros", "Roofers"],
      ["concreto", "Concreto y albañilería", "Concrete & masonry", "brick", "Albañiles", "Masons"],
      ["cercas", "Cercas y portones", "Fences & gates", "fence", "Instaladores de cercas", "Fence installers"],
    ],
  },
  {
    slug: "limpieza-grupo", name: "Limpieza", nameEn: "Cleaning", icon: "sparkles", tone: "sky",
    services: [
      ["limpieza", "Limpieza de casas", "House cleaning", "brush", "Servicios de limpieza", "Cleaning services"],
      ["limpieza-profunda", "Limpieza profunda", "Deep cleaning", "sparkles"],
      ["limpieza-oficinas", "Limpieza de oficinas", "Office cleaning", "building"],
      ["alfombras", "Alfombras y tapicería", "Carpet & upholstery", "sofa"],
      ["control-plagas", "Control de plagas", "Pest control", "bug", "Control de plagas", "Pest control"],
    ],
  },
  {
    slug: "mudanzas-transporte", name: "Mudanzas y transporte", nameEn: "Moving & transport", icon: "truck", tone: "indigo",
    services: [
      ["mudanzas", "Mudanzas", "Moving", "package", "Mudanzas", "Movers"],
      ["fletes", "Fletes con camioneta", "Van transport", "truck"],
      ["basura", "Retiro de basura", "Junk removal", "trash"],
    ],
  },
  {
    slug: "jardin-exteriores", name: "Jardín y exteriores", nameEn: "Garden & outdoor", icon: "leaf", tone: "emerald",
    services: [
      ["jardineria", "Jardinería", "Landscaping", "leaf", "Jardineros", "Landscapers"],
      ["cesped", "Corte de césped", "Lawn care", "sprout"],
      ["arboles", "Poda de árboles", "Tree service", "trees"],
      ["albercas", "Albercas", "Pool service", "waves"],
    ],
  },
  {
    slug: "autos", name: "Autos", nameEn: "Auto services", icon: "car", tone: "red",
    services: [
      ["mecanicos", "Mecánica automotriz", "Auto repair", "car", "Mecánicos", "Mechanics"],
      ["lavado-autos", "Lavado y detallado", "Car detailing", "spray"],
      ["grua", "Grúa y auxilio vial", "Towing", "truck"],
    ],
  },
  {
    slug: "aparatos", name: "Reparación de aparatos", nameEn: "Appliance & device repair", icon: "monitor", tone: "teal",
    services: [
      ["electrodomesticos", "Electrodomésticos", "Appliance repair", "washer"],
      ["celulares", "Celulares y computadoras", "Phone & computer repair", "phone"],
    ],
  },
  {
    slug: "mascotas", name: "Mascotas", nameEn: "Pet services", icon: "paw", tone: "orange",
    services: [
      ["paseo-perros", "Paseo de perros", "Dog walking", "paw"],
      ["estetica-canina", "Estética canina", "Pet grooming", "scissors"],
      ["cuidado-mascotas", "Cuidado de mascotas", "Pet sitting", "heart"],
    ],
  },
  {
    slug: "belleza-bienestar", name: "Belleza y bienestar", nameEn: "Beauty & wellness", icon: "scissors", tone: "pink",
    services: [
      ["belleza", "Salón y barbería", "Hair & barber", "scissors", "Salones y barberías", "Salons & barbershops"],
      ["unas", "Uñas", "Nails", "hand"],
      ["maquillaje", "Maquillaje", "Makeup", "sparkles"],
      ["masajes", "Masajes", "Massage", "flower"],
    ],
  },
  {
    slug: "salud-cuidado", name: "Salud y cuidado", nameEn: "Health & care", icon: "heart", tone: "rose",
    services: [
      ["cuidado-adultos", "Cuidado de adultos mayores", "Senior care", "care"],
      ["ninera", "Niñeras", "Babysitting", "baby"],
      ["enfermeria", "Enfermería a domicilio", "Home nursing", "stethoscope"],
    ],
  },
  {
    slug: "clases", name: "Clases y tutorías", nameEn: "Tutoring & lessons", icon: "book", tone: "violet",
    services: [
      ["tutorias", "Tutorías escolares", "School tutoring", "book"],
      ["ingles", "Clases de inglés", "English classes", "languages"],
      ["musica", "Clases de música", "Music lessons", "guitar"],
      ["manejo", "Clases de manejo", "Driving lessons", "car"],
    ],
  },
  {
    slug: "digital", name: "Servicios digitales", nameEn: "Digital services", icon: "globe", tone: "cyan",
    services: [
      ["diseno-grafico", "Diseño gráfico", "Graphic design", "palette"],
      ["paginas-web", "Páginas web", "Web development", "code"],
      ["redes-sociales", "Redes sociales", "Social media marketing", "megaphone"],
      ["fotografia", "Fotografía y video", "Photo & video", "camera"],
    ],
  },
  {
    slug: "negocios-legal", name: "Negocios y trámites", nameEn: "Business & legal", icon: "briefcase", tone: "slate",
    services: [
      ["impuestos", "Impuestos y contabilidad", "Taxes & accounting", "calculator", "Preparadores de impuestos", "Tax preparers"],
      ["abogados", "Abogados e inmigración", "Lawyers & immigration", "scale", "Abogados", "Lawyers"],
      ["traducciones", "Traducciones", "Translation", "languages"],
      ["notario", "Notario público", "Notary public", "stamp"],
    ],
  },
  {
    slug: "eventos", name: "Eventos", nameEn: "Events", icon: "party", tone: "purple",
    services: [
      ["catering", "Comida y catering", "Food & catering", "utensils", "Catering y comida", "Caterers"],
      ["pasteles", "Pasteles y postres", "Cakes & desserts", "cake"],
      ["dj", "DJ y sonido", "DJ & sound", "music"],
      ["mariachi", "Mariachi y música en vivo", "Mariachi & live music", "mic"],
      ["fiestas", "Renta para fiestas", "Party rentals", "party"],
    ],
  },
];

export const categoryGroups: CategoryGroup[] = tree.map(({ services, ...g }) => ({ ...g, categories: services.map((s) => s[0]) }));

export const categories: Category[] = tree.flatMap((g) =>
  g.services.map(([slug, name, nameEn, icon, seoName, seoNameEn]) => ({ slug, name, nameEn, icon, seoName, seoNameEn, active: true })),
);
