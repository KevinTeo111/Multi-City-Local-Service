import {
  AirVent,
  Baby,
  BookOpen,
  BrickWall,
  Briefcase,
  BrushCleaning,
  Bug,
  Building2,
  Cake,
  Calculator,
  Camera,
  Car,
  Code,
  Droplet,
  Fence,
  Flower2,
  Globe,
  Grid2x2,
  Guitar,
  Hammer,
  Hand,
  HardHat,
  Heart,
  HeartHandshake,
  House,
  KeyRound,
  Languages,
  Leaf,
  Megaphone,
  Mic,
  Monitor,
  Music,
  Package,
  PaintRoller,
  Palette,
  PartyPopper,
  PawPrint,
  Scale,
  Scissors,
  Smartphone,
  Sofa,
  Sparkles,
  SprayCan,
  Sprout,
  Stamp,
  Stethoscope,
  Trash2,
  Trees,
  Truck,
  UtensilsCrossed,
  WashingMachine,
  Waves,
  Wrench,
  Zap,
  type LucideProps,
} from "lucide-react";
import type { CategoryIcon as IconName, Tone } from "@/lib/types";

const icons: Record<IconName, React.ComponentType<LucideProps>> = {
  wrench: Wrench, droplet: Droplet, zap: Zap, air: AirVent, paint: PaintRoller, hammer: Hammer, key: KeyRound,
  tiles: Grid2x2, "hard-hat": HardHat, house: House, brick: BrickWall, fence: Fence, brush: BrushCleaning,
  sparkles: Sparkles, building: Building2, sofa: Sofa, bug: Bug, package: Package, truck: Truck, trash: Trash2,
  leaf: Leaf, sprout: Sprout, trees: Trees, waves: Waves, car: Car, spray: SprayCan, monitor: Monitor,
  washer: WashingMachine, phone: Smartphone, paw: PawPrint, scissors: Scissors, hand: Hand, flower: Flower2,
  heart: Heart, care: HeartHandshake, baby: Baby, stethoscope: Stethoscope, book: BookOpen, languages: Languages,
  guitar: Guitar, globe: Globe, palette: Palette, code: Code, megaphone: Megaphone, camera: Camera,
  calculator: Calculator, scale: Scale, stamp: Stamp, party: PartyPopper, utensils: UtensilsCrossed, music: Music,
  mic: Mic, cake: Cake, briefcase: Briefcase,
};

// Full class strings (not built from parts) so Tailwind can see them.
const tiles: Record<Tone, string> = {
  blue: "bg-blue-50 text-blue-600", amber: "bg-amber-50 text-amber-600", sky: "bg-sky-50 text-sky-600",
  indigo: "bg-indigo-50 text-indigo-600", emerald: "bg-emerald-50 text-emerald-600", red: "bg-red-50 text-red-600",
  teal: "bg-teal-50 text-teal-600", orange: "bg-orange-50 text-orange-600", pink: "bg-pink-50 text-pink-600",
  rose: "bg-rose-50 text-rose-600", violet: "bg-violet-50 text-violet-600", cyan: "bg-cyan-50 text-cyan-600",
  slate: "bg-slate-100 text-slate-600", purple: "bg-purple-50 text-purple-600",
};
const tags: Record<Tone, string> = {
  blue: "border-blue-200 bg-blue-50 text-blue-700", amber: "border-amber-200 bg-amber-50 text-amber-700",
  sky: "border-sky-200 bg-sky-50 text-sky-700", indigo: "border-indigo-200 bg-indigo-50 text-indigo-700",
  emerald: "border-emerald-200 bg-emerald-50 text-emerald-700", red: "border-red-200 bg-red-50 text-red-700",
  teal: "border-teal-200 bg-teal-50 text-teal-700", orange: "border-orange-200 bg-orange-50 text-orange-700",
  pink: "border-pink-200 bg-pink-50 text-pink-700", rose: "border-rose-200 bg-rose-50 text-rose-700",
  violet: "border-violet-200 bg-violet-50 text-violet-700", cyan: "border-cyan-200 bg-cyan-50 text-cyan-700",
  slate: "border-slate-200 bg-slate-50 text-slate-700", purple: "border-purple-200 bg-purple-50 text-purple-700",
};
const solid: Record<Tone, string> = {
  blue: "bg-blue-600", amber: "bg-amber-500", sky: "bg-sky-600", indigo: "bg-indigo-600", emerald: "bg-emerald-600",
  red: "bg-red-600", teal: "bg-teal-600", orange: "bg-orange-500", pink: "bg-pink-600", rose: "bg-rose-600",
  violet: "bg-violet-600", cyan: "bg-cyan-600", slate: "bg-slate-600", purple: "bg-purple-600",
};

/** Pale tile for a group icon (home tiles, services page). */
export const toneTile = (tone: Tone) => tiles[tone];
/** Bordered pill for a service tag. */
export const toneTag = (tone: Tone) => tags[tone];
/** Solid circle for a colored letter avatar. */
export const toneSolid = (tone: Tone) => solid[tone];

export function CategoryIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon aria-hidden strokeWidth={1.75} {...props} />;
}

/** Service tag: icon + name in the group's color. */
export function ServiceTag({ label, icon, tone, size = "sm" }: { label: string; icon: IconName; tone: Tone; size?: "sm" | "md" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 whitespace-nowrap rounded-full border font-medium ${toneTag(tone)} ${
        size === "md" ? "px-2.5 py-1 text-[13px]" : "px-2 py-0.5 text-xs"
      }`}
    >
      <CategoryIcon name={icon} className={size === "md" ? "size-3.5" : "size-3"} strokeWidth={2.25} />
      {label}
    </span>
  );
}
