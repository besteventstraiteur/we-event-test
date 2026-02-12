
import React, { useState } from "react";
import PresentationDialog from "./presentation-dialog/PresentationDialog";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import SlidesContainer from "./presentation-dialog/SlidesContainer";
import NavigationControls from "./presentation-dialog/NavigationControls";
import PresentationSlides from "./presentation-slides";

interface VideoPresentationProps {
  buttonText?: string;
  onClose?: () => void;
}

const VideoPresentation: React.FC<VideoPresentationProps> = ({
  buttonText = "Découvrir les fonctionnalités",
  onClose
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const isMobile = useIsMobile();
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open && onClose) {
      onClose();
    }
  };

  const handleNext = () => {
    if (currentSlide < PresentationSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const navigateToFeature = () => {
    // Implement navigation to feature based on current slide
    const currentPath = PresentationSlides[currentSlide].path;
    if (currentPath) {
      // Close dialog before navigating
      setIsOpen(false);
      // Could integrate with router for navigation if needed
      console.log(`Navigate to: ${currentPath}`);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className={`flex items-center gap-2 bg-vip-gold hover:bg-amber-600 text-white ${
          isMobile ? 'text-sm px-3 py-2' : ''
        }`}
      >
        <Play size={isMobile ? 16 : 18} />
        {buttonText}
      </Button>
      
      {isOpen && (
        <PresentationDialog 
          open={isOpen} 
          setOpen={setIsOpen}
          title="Découvrez We Event"
          description="Voici nos principales fonctionnalités"
          onClose={() => handleOpenChange(false)}
        >
          <div className="presentation-content">
            <SlidesContainer 
              slides={PresentationSlides} 
              currentSlide={currentSlide} 
              navigateToFeature={navigateToFeature}
            />
            <NavigationControls 
              isPlaying={isPlaying}
              togglePlayPause={togglePlayPause}
              currentSlide={currentSlide}
              totalSlides={PresentationSlides.length}
              goToSlide={goToSlide}
              handlePrevious={handlePrevious}
              handleNext={handleNext}
            />
          </div>
        </PresentationDialog>
      )}
    </>
  );
};

export default VideoPresentation;
