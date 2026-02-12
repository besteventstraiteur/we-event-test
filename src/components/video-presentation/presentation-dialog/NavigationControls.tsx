
import React from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import PresentationProgress from "../PresentationProgress";

interface NavigationControlsProps {
  isPlaying: boolean;
  togglePlayPause: () => void;
  currentSlide: number;
  totalSlides: number;
  goToSlide: (index: number) => void;
  handlePrevious: () => void;
  handleNext: () => void;
}

const NavigationControls: React.FC<NavigationControlsProps> = ({
  isPlaying,
  togglePlayPause,
  currentSlide,
  totalSlides,
  goToSlide,
  handlePrevious,
  handleNext
}) => {
  return (
    <div className="border-t border-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={togglePlayPause}
          className="h-8 w-8"
        >
          {isPlaying ? (
            <Pause size={16} />
          ) : (
            <Play size={16} />
          )}
        </Button>
        
        <span className="text-sm text-gray-500 mx-2">
          {isPlaying ? "Lecture automatique" : "Lecture en pause"}
        </span>
      </div>
      
      <PresentationProgress
        totalSlides={totalSlides}
        currentSlide={currentSlide}
        goToSlide={goToSlide}
      />
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={handlePrevious}
          disabled={currentSlide === 0}
          className="h-8 w-8"
        >
          <ChevronLeft size={16} />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          onClick={handleNext}
          className="h-8 w-8"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default NavigationControls;
