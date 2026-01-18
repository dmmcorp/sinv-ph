import Image from "next/image";
import LOGO from "@/public/assets/Logo.webp";
import Link from "next/link";

function SinvphLogo({ width, height }: { width?: number; height?: number }) {
  return (
    <Link href={"/"}>
      <Image
        src={LOGO}
        alt="SINVPH"
        className="b bg-blend-lighten  pointer-events-none"
        width={width || 100}
        height={height || 100}
      />
    </Link>
  );
}

export default SinvphLogo;
