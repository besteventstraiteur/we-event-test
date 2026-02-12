
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MiniSiteTheme } from "@/types/miniSiteTypes";
import { Upload, Image as ImageIcon, Plus, Trash2 } from "lucide-react";

interface ImagesEditorProps {
  theme: MiniSiteTheme;
  setTheme: React.Dispatch<React.SetStateAction<MiniSiteTheme>>;
}

export const ImagesEditor: React.FC<ImagesEditorProps> = ({
  theme,
  setTheme
}) => {
  const handleImageUpload = (imageType: keyof MiniSiteTheme["images"], event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // In a real app, this would upload the file to a server
    // For now, we'll use a local URL
    const imageUrl = URL.createObjectURL(file);
    
    setTheme(prev => ({
      ...prev,
      images: {
        ...prev.images,
        [imageType]: imageType === 'gallery' 
          ? [...(prev.images.gallery || []), imageUrl]
          : imageUrl
      }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Label className="text-base font-medium">Image d'en-tête</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          {theme.images.hero ? (
            <div className="relative">
              <img 
                src={theme.images.hero} 
                alt="Hero preview" 
                className="max-h-48 mx-auto rounded"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setTheme(prev => ({ 
                  ...prev, 
                  images: { ...prev.images, hero: undefined } 
                }))}
              >
                Supprimer
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-center">
                <Upload className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground pb-2">
                Téléchargez une image pour l'en-tête de votre site
              </p>
              <Label 
                htmlFor="hero-image" 
                className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Parcourir
              </Label>
              <Input
                id="hero-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload('hero', e)}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <Label className="text-base font-medium">Motif d'arrière-plan</Label>
        <div className="border-2 border-dashed rounded-lg p-6 text-center">
          {theme.images.backgroundPattern ? (
            <div className="relative">
              <img 
                src={theme.images.backgroundPattern} 
                alt="Background pattern preview" 
                className="max-h-48 mx-auto rounded"
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2"
                onClick={() => setTheme(prev => ({ 
                  ...prev, 
                  images: { ...prev.images, backgroundPattern: undefined } 
                }))}
              >
                Supprimer
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-center">
                <Upload className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground pb-2">
                Téléchargez une image qui sera utilisée comme motif d'arrière-plan
              </p>
              <Label 
                htmlFor="pattern-image" 
                className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
              >
                Parcourir
              </Label>
              <Input
                id="pattern-image"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload('backgroundPattern', e)}
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <Label className="text-base font-medium">Galerie d'images</Label>
          <Label 
            htmlFor="gallery-image" 
            className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            <Plus className="h-4 w-4 mr-2" /> Ajouter une image
          </Label>
          <Input
            id="gallery-image"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleImageUpload('gallery', e)}
          />
        </div>
        
        {(!theme.images.gallery || theme.images.gallery.length === 0) ? (
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <div className="flex justify-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Ajoutez des photos pour la galerie de votre mini-site
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {theme.images.gallery.map((image, index) => (
              <div key={index} className="relative group">
                <img 
                  src={image} 
                  alt={`Gallery image ${index+1}`} 
                  className="h-24 w-full object-cover rounded"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setTheme(prev => {
                    const newGallery = [...(prev.images.gallery || [])];
                    newGallery.splice(index, 1);
                    return { 
                      ...prev, 
                      images: { ...prev.images, gallery: newGallery } 
                    };
                  })}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
