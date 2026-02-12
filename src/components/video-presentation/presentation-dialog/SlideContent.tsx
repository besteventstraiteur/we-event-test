
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlideType } from "../presentation-types";

interface SlideContentProps {
  slide: SlideType;
  currentIndex: number;
  totalSlides: number;
  onNavigate: () => void;
}

const SlideContent: React.FC<SlideContentProps> = ({
  slide,
  currentIndex,
  totalSlides,
  onNavigate
}) => {
  // Determine if the media is a gif based on file extension
  const isGif = slide.videoUrl?.toLowerCase().endsWith('.gif');

  return (
    <Card className="h-full border-0 rounded-none">
      <CardContent className="p-6 h-full flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-vip-gold">{slide.title}</h2>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {totalSlides}
          </span>
        </div>
        
        <div className="flex-1 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <div className="space-y-3">
              <p className="text-gray-700">{slide.description}</p>
              
              {slide.keyFeatures && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Fonctionnalités clés :</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {slide.keyFeatures.map((feature, i) => (
                      <li key={i} className="text-gray-700">{feature}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {slide.path && (
                <Button 
                  onClick={onNavigate}
                  className="mt-4 bg-vip-gold hover:bg-amber-600 text-white"
                >
                  Explorer cette fonctionnalité
                </Button>
              )}
            </div>
            
            <div className="flex items-center justify-center">
              {slide.image ? (
                <div className="h-full w-full flex items-center justify-center rounded-md overflow-hidden shadow-md">
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className="max-h-full w-full object-contain"
                    onError={(e) => {
                      // Fallback si l'image n'est pas trouvée
                      e.currentTarget.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";
                    }}
                  />
                </div>
              ) : slide.videoUrl ? (
                <div className="h-full w-full flex items-center justify-center rounded-md overflow-hidden shadow-md">
                  {isGif ? (
                    // Display GIF as an image
                    <img 
                      src={slide.videoUrl} 
                      alt={slide.title}
                      className="max-h-full w-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d";
                      }}
                    />
                  ) : (
                    // Display video with controls
                    <video 
                      src={slide.videoUrl}
                      controls
                      autoPlay
                      loop
                      muted
                      className="max-h-full w-full object-contain"
                      onError={(e) => {
                        // We can't set a fallback directly, so we'll hide the video
                        (e.target as HTMLVideoElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="h-full w-full bg-gray-100 rounded-md flex items-center justify-center">
                  <p className="text-gray-400">Aperçu non disponible</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SlideContent;
