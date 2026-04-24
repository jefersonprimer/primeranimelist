import Image from 'next/image';
import React from 'react';

interface BannerProps {
  src: string;
  alt: string;
  width: number;
  height: number;
}

const Banner: React.FC<BannerProps> = ({ src, alt, width, height }) => {
  return (
    <div className="w-full h-auto my-2 cursor-pointer">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="w-full h-auto"
      />
    </div>
  );
};

export default Banner;

