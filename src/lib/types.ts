export type City = {
  slug: string;
  name: string;
  nameEn?: string; // only when the English name differs ("Nueva York" -> "New York")
  state: string; // two-letter code, e.g. "TX"
  lat?: number; // for "use my location" (nearest city)
  lng?: number;
  active: boolean;
};

export const CATEGORY_ICONS = [
  "wrench", "droplet", "zap", "air", "paint", "hammer", "key", "tiles", "hard-hat", "house", "brick", "fence",
  "brush", "sparkles", "building", "sofa", "bug", "package", "truck", "trash", "leaf", "sprout", "trees", "waves",
  "car", "spray", "monitor", "washer", "phone", "paw", "scissors", "hand", "flower", "heart", "care", "baby",
  "stethoscope", "book", "languages", "guitar", "globe", "palette", "code", "megaphone", "camera", "calculator",
  "scale", "stamp", "party", "utensils", "music", "mic", "cake", "briefcase",
] as const;
export type CategoryIcon = (typeof CATEGORY_ICONS)[number];

/** Color family of a category group: tiles and service tags use it. */
export type Tone =
  | "blue" | "amber" | "sky" | "indigo" | "emerald" | "red" | "teal"
  | "orange" | "pink" | "rose" | "violet" | "cyan" | "slate" | "purple";

export type Category = {
  slug: string; // used in URLs: /houston/plomeros
  name: string; // "Plomería"
  seoName?: string; // "Plomeros" -> "Plomeros en Houston, TX" (defaults to name)
  nameEn: string; // "Plumbing"
  seoNameEn?: string; // "Plumbers" -> "Plumbers in Houston, TX"
  icon: CategoryIcon;
  active: boolean;
};

/** Group of categories ("Home trades" -> plumbing, electrical…): sidebar sections and home tiles. */
export type CategoryGroup = { slug: string; name: string; nameEn: string; icon: CategoryIcon; tone: Tone; categories: string[] };

export type ListingStatus = "pendiente" | "aprobado" | "rechazado" | "suspendido";

// Reserved for future monetization (subscriptions / featured listings).
export type ListingPlan = "gratis" | "destacado";

export type ListingStats = {
  views: number;
  phoneReveals: number;
  callClicks: number;
  whatsappClicks: number;
  // Last 14 days of profile views, oldest first.
  viewsByDay: number[];
};

export type Availability = "ahora" | "hoy" | "esta-semana" | "ocupado";

/** Featured service cards on the profile ("Lighting installation — Indoor, outdoor…"). */
export type Highlight = { icon: "bulb" | "wrench" | "panel"; title: string; text: string };

// "hora" / "dia" use `price` (USD); "fijo" shows the price note ("Desde $120 por visita") or `price`.
export type PriceType = "hora" | "dia" | "fijo" | "a-convenir" | "presupuesto-gratis";

/** Optional English version of a listing's text. */
export type BusinessTranslation = {
  tagline?: string;
  description?: string;
  services?: string[];
  priceNote?: string;
  highlights?: Highlight[];
};

export type Business = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  categories: string[]; // category slugs
  services: string[];
  cities: string[]; // city slugs the business serves (one profile, many cities)
  baseCity: string; // physical location
  address?: string;
  phone: string; // never sent to the browser until revealed
  whatsapp?: string;
  email?: string;
  website?: string;
  priceType: PriceType;
  price?: number; // USD, for hourly / daily / fixed prices
  priceNote: string; // fixed-price text, e.g. "Desde $120 por visita"
  availability?: Availability; // not every business states it
  verified?: boolean; // identity checked by the team ("Verified" badge and filter)
  status: ListingStatus;
  plan: ListingPlan;
  rating: number; // 0 when there are no reviews yet
  reviewCount: number;
  avatarTone?: Tone; // colored letter avatar instead of gray initials
  stats: ListingStats;
  createdAt: string;
  addedByAdmin: boolean;
  photos?: string[]; // "Recent work" gallery
  highlights?: Highlight[];
  en?: BusinessTranslation;
};

/** Business fields that are safe to render publicly (no phone numbers). */
export type PublicBusiness = Omit<Business, "phone" | "whatsapp" | "stats"> & {
  phoneMasked: string;
  hasWhatsapp: boolean;
};
