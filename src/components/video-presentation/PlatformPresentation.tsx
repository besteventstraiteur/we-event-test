
import React, { useState, useEffect } from 'react';
import PresentationDialog from './presentation-dialog/PresentationDialog';
import SlidesContainer from './presentation-dialog/SlidesContainer';
import NavigationControls from './presentation-dialog/NavigationControls';
import PresentationSlides from './presentation-slides';
import clientSlides from './presentation-slides/client-slides';
import partnerSlides from './presentation-slides/partner-slides';
import introductionSlides from './presentation-slides/introduction-slides';
import conclusionSlides from './presentation-slides/conclusion-slides';

interface PlatformPresentationProps {
  onClose?: () => void;
  title?: string;
  description?: string;
  clientOnly?: boolean;
  partnerOnly?: boolean;
}

const PlatformPresentation: React.FC<PlatformPresentationProps> = ({ 
  onClose,
  title = "Bienvenue sur We Event",
  description = "Découvrez nos fonctionnalités principales",
  clientOnly = false,
  partnerOnly = false 
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Sélection des slides à montrer en fonction des props
  const slidesToShow = React.useMemo(() => {
    if (clientOnly) {
      // Pour les clients : intro + slides client + conclusion
      return [...introductionSlides.slice(0, 1), ...clientSlides, ...conclusionSlides.slice(-1)];
    } else if (partnerOnly) {
      // Pour les prestataires : intro + slides prestataire + conclusion
      return [...introductionSlides.slice(0, 1), ...partnerSlides, ...conclusionSlides.slice(-1)];
    } else {
      // Par défaut, tous les slides
      return PresentationSlides;
    }
  }, [clientOnly, partnerOnly]);
  
  useEffect(() => {
    // Prevent scrolling on the background when dialog is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Call onClose callback if provided
      if (onClose) {
        onClose();
      }
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleDialogClose = () => {
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentSlide < slidesToShow.length - 1) {
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
    const currentPath = slidesToShow[currentSlide].path;
    if (currentPath) {
      // Close dialog before navigating
      setIsOpen(false);
      // Could integrate with router for navigation if needed
      console.log(`Navigate to: ${currentPath}`);
    }
  };

  return (
    <PresentationDialog 
      open={isOpen} 
      setOpen={setIsOpen}
      title={title}
      description={description}
      onClose={handleDialogClose}
    >
      <div className="presentation-content">
        <SlidesContainer 
          slides={slidesToShow} 
          currentSlide={currentSlide} 
          navigateToFeature={navigateToFeature}
        />
        <NavigationControls 
          isPlaying={isPlaying}
          togglePlayPause={togglePlayPause}
          currentSlide={currentSlide}
          totalSlides={slidesToShow.length}
          goToSlide={goToSlide}
          handlePrevious={handlePrevious}
          handleNext={handleNext}
        />
      </div>
    </PresentationDialog>
  );
};

export default PlatformPresentation;
