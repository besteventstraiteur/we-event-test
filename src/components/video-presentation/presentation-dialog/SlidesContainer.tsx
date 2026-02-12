
import React from "react";
import { SlideType } from "../presentation-types";
import SlideContent from "./SlideContent";

interface SlidesContainerProps {
  slides: SlideType[];
  currentSlide: number;
  navigateToFeature: () => void;
}

const SlidesContainer: React.FC<SlidesContainerProps> = ({
  slides,
  currentSlide,
  navigateToFeature
}) => {
  return (
    <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-white">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
          style={{
            transform: index === currentSlide ? 'translateX(0)' : 
                      index < currentSlide ? 'translateX(-100%)' : 'translateX(100%)',
            transition: 'opacity 500ms ease, transform 500ms ease'
          }}
        >
          <SlideContent 
            slide={slide} 
            currentIndex={currentSlide} 
            totalSlides={slides.length} 
            onNavigate={navigateToFeature} 
          />
        </div>
      ))}
    </div>
  );
};

export default SlidesContainer;
