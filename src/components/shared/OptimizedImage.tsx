
import React from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  role?: string;
}

const OptimizedImage = ({ src, alt, className, width, height, role = "img" }: OptimizedImageProps) => {
  // Convert image URL to WebP if it's not already
  const getWebPUrl = (url: string) => {
    if (url.includes('.webp')) return url;
    if (url.includes('storage.googleapis')) return url;
    return url.replace(/\.(jpe?g|png)$/i, '.webp');
  };

  return (
    <img
      src={getWebPUrl(src)}
      alt={alt}
      className={className}
      loading="lazy"
      width={width}
      height={height}
      decoding="async"
      role={role}
      aria-label={alt}
    />
  );
};

export default OptimizedImage;
