import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import OptimizedImage from "@/components/shared/OptimizedImage";

export interface InspirationImage {
  id: string;
  imageUrl: string;
  title: string;
  description?: string;
  tags: string[];
  width: number;
  height: number;
  contributor: {
    name: string;
    role: string;
    avatarUrl?: string;
  };
  likes: number;
  isSaved?: boolean;
}

interface PinterbestGalleryProps {
  images: InspirationImage[];
}

const PinterbestGallery: React.FC<PinterbestGalleryProps> = ({ images }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
      {images.map((image) => {
        const aspectRatio = image.height / image.width;
        const rowSpan = Math.max(1, Math.min(3, Math.round(aspectRatio * 1.5)));
        
        return (
          <Card 
            key={image.id} 
            className={`overflow-hidden hover:shadow-lg transition-all duration-300 group ${
              rowSpan === 1 ? "" : rowSpan === 2 ? "sm:row-span-2" : "sm:row-span-3"
            }`}
          >
            <div className="relative">
              <OptimizedImage 
                src={image.imageUrl} 
                alt={image.title}
                className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                width={image.width}
                height={image.height}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <div className="flex justify-between w-full text-white">
                  <Button size="sm" variant="ghost" className="text-white hover:bg-black/30">
                    <Heart className="h-4 w-4 mr-1" />
                    <span className="text-xs">{image.likes}</span>
                  </Button>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" className="text-white hover:bg-black/30 h-8 w-8 p-0">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-black/30 h-8 w-8 p-0">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <CardContent className="p-3">
              <h3 className="font-medium truncate mb-1">{image.title}</h3>
              
              {image.description && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                  {image.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-1 mb-3">
                {image.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs py-0 px-2">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={image.contributor.avatarUrl} />
                    <AvatarFallback>{image.contributor.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium">{image.contributor.name}</p>
                    <p className="text-xs text-muted-foreground">{image.contributor.role}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default PinterbestGallery;
