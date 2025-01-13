import React, { useState, useEffect } from "react";

interface PreloadedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const PreloadedImage: React.FC<PreloadedImageProps> = ({
  src,
  alt,
  className = "",
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true); // Set loaded when the image is fully fetched
  }, [src]);

  if (!isLoaded) {
    return (
      <div className="bg-primary bg-opacity-20 h-full w-full rounded-xl"></div>
    ); // Placeholder or skeleton while loading
  }

  return <img src={src} alt={alt} className={className} />;
};

export default PreloadedImage;
