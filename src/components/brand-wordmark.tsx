import Image from "next/image";
import pin from "../../public/brand/nearby-pin.png";
import word from "../../public/brand/nearby-text.png";

/** The nearby logo: pin mark + wordmark. The pin drops in on load and hops on hover, like a map marker. */
export function BrandWordmark({ size = "md" }: { size?: "md" | "sm" }) {
  const h = size === "md" ? "h-12" : "h-9";
  return (
    <span className="group/logo flex items-center">
      <Image
        src={pin}
        alt=""
        loading="eager"
        className={`${h} w-auto animate-pin transition-transform duration-300 ease-[cubic-bezier(0.3,1.6,0.6,1)] group-hover/logo:-translate-y-[3px]`}
      />
      <Image src={word} alt="nearby" loading="eager" className={`${h} w-auto`} />
    </span>
  );
}
