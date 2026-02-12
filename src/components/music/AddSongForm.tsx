
import React, { useState } from "react";
import { NewSong } from "@/models/playlist";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X, Music, Image } from "lucide-react";
import { Label } from "@/components/ui/label";

interface AddSongFormProps {
  onAddSong: (song: NewSong) => void;
  onCancel: () => void;
}

const AddSongForm: React.FC<AddSongFormProps> = ({ onAddSong, onCancel }) => {
  const { toast } = useToast();
  const [songData, setSongData] = useState<NewSong>({
    title: "",
    artist: "",
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSongData(prev => ({ ...prev, [name]: value }));
  };

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Vérifier si c'est un fichier audio
      if (!file.type.includes('audio/')) {
        toast({
          variant: "destructive",
          title: "Type de fichier non valide",
          description: "Veuillez sélectionner un fichier audio."
        });
        return;
      }
      
      setAudioFile(file);
      
      // Si le titre n'est pas encore défini, utilisez le nom du fichier
      if (!songData.title) {
        const fileName = file.name.replace(/\.[^/.]+$/, ""); // Enlever l'extension
        setSongData(prev => ({ ...prev, title: fileName }));
      }
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Vérifier si c'est une image
      if (!file.type.includes('image/')) {
        toast({
          variant: "destructive",
          title: "Type de fichier non valide",
          description: "Veuillez sélectionner une image."
        });
        return;
      }
      
      setImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!songData.title || !songData.artist) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Le titre et l'artiste sont requis."
      });
      return;
    }
    
    if (!audioFile) {
      toast({
        variant: "destructive",
        title: "Fichier audio manquant",
        description: "Veuillez sélectionner un fichier audio."
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Dans une application réelle, ici nous téléchargerions les fichiers
      // Pour cette simulation, nous créons des URL fictives
      
      const newSong: NewSong = {
        ...songData,
        // Simuler une URL pour le fichier audio
        audioUrl: URL.createObjectURL(audioFile),
        // Durée estimée (dans une application réelle, nous extrairions la durée du fichier)
        duration: Math.floor(Math.random() * 300) + 120, // Entre 2 et 7 minutes
      };
      
      // Si une image a été fournie, ajouter l'URL
      if (imageFile) {
        newSong.imageUrl = URL.createObjectURL(imageFile);
      }
      
      // Ajouter la chanson
      onAddSong(newSong);
      
      // Réinitialiser le formulaire
      setSongData({ title: "", artist: "" });
      setAudioFile(null);
      setImageFile(null);
      
      toast({
        title: "Chanson ajoutée",
        description: `"${newSong.title}" a été ajoutée à la playlist.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'ajout de la chanson."
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          name="title"
          value={songData.title}
          onChange={handleInputChange}
          placeholder="Titre du morceau"
          className="bg-vip-gray-800 border-vip-gray-700"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="artist">Artiste</Label>
        <Input
          id="artist"
          name="artist"
          value={songData.artist}
          onChange={handleInputChange}
          placeholder="Nom de l'artiste"
          className="bg-vip-gray-800 border-vip-gray-700"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Fichier audio</Label>
        <div className="flex items-center gap-3">
          <div className="flex-grow">
            {audioFile ? (
              <div className="flex items-center p-2 bg-vip-gray-800 border border-vip-gray-700 rounded">
                <Music className="text-vip-gray-400 mr-2" size={18} />
                <span className="text-vip-gray-300 truncate">{audioFile.name}</span>
                <button
                  type="button"
                  onClick={() => setAudioFile(null)}
                  className="ml-auto text-vip-gray-500 hover:text-red-400"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  id="audio-file"
                  type="file"
                  accept="audio/*"
                  onChange={handleAudioFileChange}
                  className="opacity-0 absolute inset-0 cursor-pointer"
                  required
                />
                <div className="flex items-center gap-2 p-2 bg-vip-gray-800 border border-dashed border-vip-gray-700 rounded text-vip-gray-400 hover:border-vip-gold/70 transition-colors">
                  <Upload size={18} />
                  <span>Sélectionner un fichier audio</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Image (optionnelle)</Label>
        <div className="flex items-center gap-3">
          <div className="flex-grow">
            {imageFile ? (
              <div className="flex items-center p-2 bg-vip-gray-800 border border-vip-gray-700 rounded">
                <Image className="text-vip-gray-400 mr-2" size={18} />
                <span className="text-vip-gray-300 truncate">{imageFile.name}</span>
                <button
                  type="button"
                  onClick={() => setImageFile(null)}
                  className="ml-auto text-vip-gray-500 hover:text-red-400"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Input
                  id="image-file"
                  type="file"
                  accept="image/*"
                  onChange={handleImageFileChange}
                  className="opacity-0 absolute inset-0 cursor-pointer"
                />
                <div className="flex items-center gap-2 p-2 bg-vip-gray-800 border border-dashed border-vip-gray-700 rounded text-vip-gray-400 hover:border-vip-gold/70 transition-colors">
                  <Upload size={18} />
                  <span>Sélectionner une image</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-vip-gray-700"
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          className="bg-vip-gold hover:bg-vip-gold/90 text-vip-black"
          disabled={isUploading}
        >
          {isUploading ? "Ajout en cours..." : "Ajouter le morceau"}
        </Button>
      </div>
    </form>
  );
};

export default AddSongForm;
