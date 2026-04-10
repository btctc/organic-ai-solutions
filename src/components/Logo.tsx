import Image from "next/image";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  variant?: "default" | "white";
}

export default function Logo({
  width = 180,
  height = 60,
  className,
  priority = false,
  variant = "default",
}: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="Organic AI Solutions logo"
      width={width}
      height={height}
      priority={priority}
      quality={100}
      className={className}
      style={{
        ...(variant === "white" ? { filter: "brightness(0) invert(1)" } : {}),
        objectFit: "contain",
        imageRendering: "-webkit-optimize-contrast",
      }}
    />
  );
}
