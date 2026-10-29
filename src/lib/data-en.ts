import type { BusinessTranslation } from "./types";

// English version of each sample listing. In production this is the optional
// "English version" a business fills in on its profile; pages fall back to the
// main text when a business hasn't added one.

export const englishContent: Record<string, BusinessTranslation> = {
  b1: {
    tagline: "Licensed plumbers, 24/7 emergency service",
    description:
      "A family business with more than 15 years fixing pipes, water heaters and drains across the Houston area. We speak Spanish and English, give free no-obligation quotes and guarantee our work in writing.",
    services: ["Drain cleaning", "Water heaters", "Leak repair", "Bathroom installation", "24/7 emergencies"],
  },
  b2: {
    tagline: "Residential and commercial electrical work",
    description:
      "Certified electricians for homes and businesses. Panels, rewiring, lighting and pre-inspection checks. We work in Houston and Dallas with same-day appointments.",
    services: ["Panel upgrades", "Wiring", "LED lighting", "EV chargers", "Inspections"],
  },
  b3: {
    tagline: "AC repair and installation",
    description:
      "EPA-certified technicians. We repair and maintain central systems and mini-splits. Financing available for new equipment.",
    services: ["AC repair", "Mini-split installation", "Preventive maintenance", "Heating"],
    priceNote: "Service call from $79",
  },
  b4: {
    tagline: "House, office and move-out cleaning",
    description:
      "A reliable, insured cleaning team. Weekly, deep and move-out cleanings. We bring all the supplies.",
    services: ["House cleaning", "Deep cleaning", "Offices", "Move-out cleaning", "Airbnb"],
    priceNote: "From $120 per visit",
  },
  b5: {
    tagline: "Lawn care and landscape design",
    description:
      "Lawn mowing, tree trimming, irrigation systems and garden design. Monthly plans for homes and businesses.",
    services: ["Lawn mowing", "Tree trimming", "Sprinkler systems", "Landscape design"],
    priceNote: "Monthly plans",
  },
  b6: {
    tagline: "Kitchens, bathrooms, floors and painting",
    description:
      "Licensed and insured general contractor. We remodel kitchens and bathrooms from start to finish, install floors and paint interiors and exteriors.",
    services: ["Kitchen remodeling", "Bathrooms", "Flooring", "Painting", "Drywall"],
  },
  b7: {
    tagline: "Local and long-distance moving",
    description:
      "House and apartment moves with our own trucks. We pack, load and assemble furniture. Hourly pricing with no surprises.",
    services: ["Local moves", "Long distance", "Packing", "Furniture assembly"],
  },
  b8: {
    tagline: "General repair, brakes and diagnostics",
    description:
      "A shop with more than 20 years of experience. Computer diagnostics, brakes, suspension, oil changes and state inspection prep.",
    services: ["Diagnostics", "Brakes", "Oil change", "Suspension", "State inspection"],
    priceNote: "Diagnostics from $60",
  },
  b9: {
    tagline: "Haircuts, color, nails and makeup",
    description:
      "A beauty salon for the whole family. Haircuts, color, keratin, acrylic nails and makeup for quinceañeras and weddings.",
    services: ["Haircuts", "Color and highlights", "Keratin", "Nails", "Event makeup"],
  },
  b10: {
    tagline: "Honduran and Latin food for events",
    description:
      "Baleadas, pupusas, tamales and traditional dishes for parties, baptisms and company events. Waiter service available.",
    services: ["Party catering", "Tamales to order", "Corporate events", "Waiters"],
    priceNote: "Price per guest",
  },
  b11: {
    tagline: "Personal and business taxes, ITIN",
    description:
      "Tax preparation, ITIN applications, small business bookkeeping and LLC formation. Spanish-speaking service all year round.",
    services: ["Tax returns", "ITIN applications", "Bookkeeping", "LLC formation", "Payroll"],
    priceNote: "From $75",
  },
  b12: {
    tagline: "Immigration, family and accident law",
    description:
      "Attorney licensed in New York. Immigration cases, family petitions, DACA, citizenship and workplace accidents. First consultation free.",
    services: ["Immigration", "Citizenship", "DACA", "Family law", "Workplace accidents"],
    priceNote: "First consultation free",
  },
  b13: {
    tagline: "Residential and commercial painting",
    description: "Interior and exterior painting, roof sealing and stucco. Free estimates.",
    services: ["Interior painting", "Exterior painting", "Stucco", "Roof sealing"],
  },
  b14: {
    tagline: "Carpet and upholstery cleaning",
    description: "Professional steam cleaning for carpets, sofas and mattresses.",
    services: ["Carpets", "Upholstery", "Mattresses"],
  },
  b15: {
    tagline: "Classic and modern cuts",
    description: "Barbershop for men and kids. Fades, designs and beard trims.",
    services: ["Haircuts", "Fades", "Beard"],
  },
  b16: {
    tagline: "Small hauling jobs and moves",
    description: "Van hauling and small moves in Los Angeles.",
    services: ["Hauling", "Small moves"],
  },
};
