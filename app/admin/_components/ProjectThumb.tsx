import { ImageOff } from "lucide-react";
import { messages } from "@/content/en";

type ProjectThumbProps = Readonly<{
  imageSrc?: string | null;
  className: string;
}>;

export default function ProjectThumb({ imageSrc, className }: ProjectThumbProps) {
  const hasImage = Boolean(imageSrc);

  if (hasImage) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={imageSrc!} alt={messages.admin.item.imageAlt} className={className} />
    );
  }

  return (
    <div
      className={`${className} flex items-center justify-center bg-neutral-950 text-neutral-600`}
    >
      <ImageOff size={24} />
    </div>
  );
}
