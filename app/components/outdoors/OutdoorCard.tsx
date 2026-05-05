import React from "react";
import Link from "next/link";
import Image from "next/image";

interface OutdoorCardProps {
  link: string;
  imageUrl: string;
  altText?: string;
}

const OutdoorCard: React.FC<OutdoorCardProps> = ({
  link,
  imageUrl,
  altText = "Outdoor do Anime",
}) => {
  return (
    <div className="mx-auto relative w-[390px] h-[174.64px] sm:w-full sm:h-[260px] sm:px-4 md:px-8 lg:w-[1230px] md:h-[317px] lg:h-[340px] xl:h-[400px] lg:px-12 xl:px-0 max-w-full overflow-hidden mx-auto">
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full"
      >
        <div className="relative w-full h-full">
          <Image
            src={imageUrl}
            alt={altText}
            width={1230}
            height={400}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-full h-full bg-[#141519] animate-pulse" />
      </Link>
    </div>
  );
};

export default OutdoorCard;
