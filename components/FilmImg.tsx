import Image from "next/image";
import { ev } from "@/lib/images";

type FilmImgProps = {
  k: string;
  w?: number;
  alt?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
};

// Photo with the brand's cool, crisp film filter (applied via .film class).
// Fills its (relatively positioned) parent and covers.
export function FilmImg({
  k,
  w = 640,
  alt = "",
  className = "",
  sizes = "(max-width: 920px) 100vw, 50vw",
  priority = false,
}: FilmImgProps) {
  return (
    <Image
      src={ev(k, w)}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`film object-cover ${className}`}
    />
  );
}
