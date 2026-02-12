import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Upload, Star, StarOff } from "lucide-react";
import { PartnerImage } from "@/models/partnerProfile";
import { usePartnerProfile } from "@/hooks/usePartnerProfile";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { compressImage } from '@/utils/imageCompression';

interface ProfileGalleryProps {
  images: PartnerImage[];
  onUpdate: (images: PartnerImage[]) => void;
}

const ProfileGallery: React.FC<ProfileGalleryProps> = ({ images, onUpdate }) => {
  const { updateProfileImage, removeProfileImage } = usePartnerProfile();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState<'profile' | 'gallery' | 'logo' | 'background'>('gallery');

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    
    try {
      const file = files[0];
      
      // Vérification de la taille
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Fichier trop volumineux",
          description: "L'image ne doit pas dépasser 10Mo.",
          variant: "destructive",
        });
        return;
      }
      
      // Vérification du type
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Type de fichier non supporté",
          description: "Veuillez télécharger une image (JPG, PNG, WebP).",
          variant: "destructive",
        });
        return;
      }

      // Compression de l'image
      const { compressedFile, compressionRate } = await compressImage(file);
      
      await updateProfileImage(compressedFile, uploadType);
      
      toast({
        title: "Image optimisée",
        description: `Image compressée de ${compressionRate}% sans perte visible de qualité`,
      });
      
      // Réinitialiser l'input
      if (fileInputRef.current) fileInputRef.current.value = '';
      
    } catch (error) {
      toast({
        title: "Erreur lors du téléchargement",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
      console.error("Erreur de téléchargement:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (imageId: string) => {
    removeProfileImage(imageId);
  };

  const handleSetFeatured = (image: PartnerImage) => {
    // Update the images array with the new featured image
    const updatedImages = images.map(img => ({
      ...img,
      featured: img.id === image.id && img.type === image.type
    }));

    onUpdate(updatedImages);
  };

  // Group images by type
  const profileImages = images.filter(img => img.type === 'profile');
  const logoImages = images.filter(img => img.type === 'logo');
  const backgroundImages = images.filter(img => img.type === 'background');
  const galleryImages = images.filter(img => img.type === 'gallery');

  const uploadImage = (type: 'profile' | 'gallery' | 'logo' | 'background') => {
    setUploadType(type);
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/*"
      />

      {/* Profile Image Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Photo de profil</h3>
          <Button 
            onClick={() => uploadImage('profile')}
            disabled={isUploading}
            variant="outline"
            className="gap-2"
          >
            <Upload size={16} />
            {profileImages.length === 0 ? "Ajouter" : "Changer"}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {profileImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-square">
                <img 
                  src={image.url} 
                  alt={image.alt || "Image de profil"} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-red-500"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {profileImages.length === 0 && (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
              <Upload size={24} className="mb-2" />
              <p>Aucune photo de profil</p>
            </div>
          )}
        </div>
      </section>

      {/* Gallery Images Section */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Galerie de photos</h3>
          <Button 
            onClick={() => uploadImage('gallery')}
            disabled={isUploading}
            variant="outline"
            className="gap-2"
          >
            <Upload size={16} />
            Ajouter des photos
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {galleryImages.map((image) => (
            <Card key={image.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img 
                  src={image.url} 
                  alt={image.alt || "Image de galerie"} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 flex gap-2">
                  <Button
                    size="icon"
                    variant={image.featured ? "default" : "outline"}
                    className={`h-8 w-8 rounded-full ${image.featured ? 'bg-amber-500 text-white' : 'bg-white/80 hover:bg-white text-amber-500'}`}
                    onClick={() => handleSetFeatured(image)}
                  >
                    {image.featured ? <Star size={16} /> : <StarOff size={16} />}
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8 rounded-full bg-white/80 hover:bg-white text-red-500"
                    onClick={() => handleDelete(image.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                {image.featured && (
                  <Badge className="absolute bottom-2 left-2 bg-amber-500">
                    Photo mise en avant
                  </Badge>
                )}
              </div>
            </Card>
          ))}
          
          {galleryImages.length === 0 && (
            <div className="border border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center bg-gray-50 text-gray-500">
              <Upload size={24} className="mb-2" />
              <p>Aucune photo dans la galerie</p>
            </div>
          )}
        </div>
      </section>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-medium mb-2">Optimisation des images</h4>
        <p className="text-sm text-gray-600 mb-2">
          Vos images sont automatiquement optimisées pour le web, sans perte de qualité visible. Cela permet des temps de chargement plus rapides pour vos clients potentiels.
        </p>
        <ul className="text-sm text-gray-600 list-disc list-inside space-y-1">
          <li>Taille maximale: 5Mo par image</li>
          <li>Formats acceptés: JPG, PNG, WebP</li>
          <li>Résolution optimale: 2000px de large</li>
        </ul>
      </div>
    </div>
  );
};

export default ProfileGallery;
