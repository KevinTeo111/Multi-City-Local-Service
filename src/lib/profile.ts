import type { Locale } from "@/i18n/config";
import type { Availability, Business, ListingStatus, PriceType } from "./types";

export type ProfileValues = {
  name: string;
  description: string;
  categories: string[];
  services: string[];
  cities: string[];
  baseCity: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  priceType: PriceType;
  price: string;
  priceNote: string;
  availability: Availability;
  status: ListingStatus;
  // The same text in the other language (English when editing in Spanish, and vice versa).
  descriptionAlt: string;
  servicesAlt: string;
};

export const emptyProfile: ProfileValues = {
  name: "",
  description: "",
  categories: [],
  services: [],
  cities: [],
  baseCity: "",
  address: "",
  phone: "",
  whatsapp: "",
  email: "",
  website: "",
  priceType: "presupuesto-gratis",
  price: "",
  priceNote: "",
  availability: "esta-semana",
  status: "pendiente",
  descriptionAlt: "",
  servicesAlt: "",
};

/** Main fields hold the text in the editor's language; the other language goes in the *Alt fields. */
export function toProfileValues(b: Business, lang: Locale): ProfileValues {
  const english = { description: b.en?.description ?? "", services: b.en?.services ?? [] };
  const spanish = { description: b.description, services: b.services };
  const [main, alt] = lang === "en" && english.description ? [english, spanish] : [spanish, english];
  return {
    name: b.name,
    description: main.description,
    categories: b.categories,
    services: main.services,
    cities: b.cities,
    baseCity: b.baseCity,
    address: b.address ?? "",
    phone: b.phone,
    whatsapp: b.whatsapp ?? "",
    email: b.email ?? "",
    website: b.website ?? "",
    priceType: b.priceType,
    price: b.price !== undefined ? String(b.price) : "",
    priceNote: b.priceNote,
    availability: b.availability ?? "esta-semana",
    status: b.status,
    descriptionAlt: alt.description,
    servicesAlt: alt.services.join(", "),
  };
}
