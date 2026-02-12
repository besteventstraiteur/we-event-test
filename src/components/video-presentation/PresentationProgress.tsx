
import React from "react";

interface PresentationProgressProps {
  totalSlides: number;
  currentSlide: number;
  goToSlide: (index: number) => void;
}

const PresentationProgress: React.FC<PresentationProgressProps> = ({
  totalSlides,
  currentSlide,
  goToSlide
}) => {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: totalSlides }).map((_, index) => (
        <button
          key={index}
          className={`h-2 rounded-full transition-all ${
            index === currentSlide
              ? "w-6 bg-vip-gold"
              : "w-2 bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => goToSlide(index)}
          aria-label={`Aller au slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default PresentationProgress;
