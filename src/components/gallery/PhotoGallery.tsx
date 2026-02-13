import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, Download, Heart } from 'lucide-react';
import { Photo } from '../../types/photo';

interface PhotoGalleryProps {
  photos: Photo[];
  maxPreview?: number;
  showLightbox?: boolean;
  onPhotoClick?: (photo: Photo, index: number) => void;
  className?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  maxPreview = 6,
  showLightbox = true,
  onPhotoClick,
  className = '',
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState<{ [key: number]: boolean }>({});

  const displayPhotos = photos.slice(0, maxPreview);
  const remainingCount = photos.length - maxPreview;

  const openLightbox = (index: number) => {
    if (showLightbox) {
      setCurrentIndex(index);
      setLightboxOpen(true);
      document.body.style.overflow = 'hidden';
    }
    if (onPhotoClick) {
      onPhotoClick(photos[index], index);
    }
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className={`grid gap-2 ${className}`} style={{
        gridTemplateColumns: maxPreview === 6 
          ? 'repeat(3, 1fr)' 
          : maxPreview === 4 
          ? 'repeat(2, 1fr)' 
          : 'repeat(auto-fill, minmax(200px, 1fr))'
      }}>
        {displayPhotos.map((photo, index) => (
          <div
            key={photo.id || index}
            className={`relative group cursor-pointer overflow-hidden rounded-lg ${
              index === 0 && maxPreview === 6 ? 'col-span-2 row-span-2' : ''
            }`}
            onClick={() => openLightbox(index)}
          >
            {/* Image */}
            <div className={`w-full ${index === 0 && maxPreview === 6 ? 'h-96' : 'h-48'} bg-gray-200`}>
              <img
                src={photo.url}
                alt={photo.title || `Photo ${index + 1}`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                onLoad={() => setImageLoaded({ ...imageLoaded, [index]: true })}
              />
            </div>

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
              <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* "More" indicator on last image */}
            {index === maxPreview - 1 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  +{remainingCount}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-95 flex items-center justify-center"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToPrevious();
            }}
            className="absolute left-4 z-10 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              goToNext();
            }}
            className="absolute right-4 z-10 p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full transition"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Image */}
          <div
            className="max-w-7xl max-h-[90vh] mx-auto px-16"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={photos[currentIndex].url}
              alt={photos[currentIndex].title || 'Photo'}
              className="max-w-full max-h-[90vh] object-contain"
            />
            
            {/* Image info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-20 backdrop-blur-sm px-6 py-3 rounded-full">
              <p className="text-white text-sm font-medium">
                {currentIndex + 1} / {photos.length}
              </p>
            </div>

            {/* Photo details */}
            {photos[currentIndex].title && (
              <div className="absolute bottom-20 left-0 right-0 text-center">
                <h3 className="text-white text-xl font-bold mb-1">
                  {photos[currentIndex].title}
                </h3>
                {photos[currentIndex].description && (
                  <p className="text-gray-300 text-sm">
                    {photos[currentIndex].description}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 overflow-x-auto max-w-3xl px-4">
            {photos.map((photo, index) => (
              <button
                key={photo.id || index}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(index);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                  index === currentIndex
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={photo.url}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default PhotoGallery;
