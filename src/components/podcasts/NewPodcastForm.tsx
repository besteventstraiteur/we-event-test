import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GoldButton from "@/components/GoldButton";
import { Upload, AlertCircle } from 'lucide-react';
import { NewPodcast } from '@/models/podcast';

interface NewPodcastFormProps {
  newPodcast: NewPodcast;
  audioFileName: string;
  imageFileName: string;
  isLoading: boolean;
  error?: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (value: string) => void;
  onAudioFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NewPodcastForm: React.FC<NewPodcastFormProps> = ({ 
  newPodcast,
  audioFileName,
  imageFileName,
  isLoading,
  error,
  onSubmit,
  onChange,
  onSelectChange,
  onAudioFileChange,
  onImageFileChange
}) => {
  return (
    <Card className="bg-vip-gray-900 border-vip-gray-800">
      <CardHeader>
        <CardTitle className="text-vip-white">Ajouter un nouveau podcast</CardTitle>
        <CardDescription className="text-vip-gray-400">
          Partagez votre expertise avec la communauté Best Events VIP
        </CardDescription>
      </CardHeader>
      
      {error && (
        <div className="px-6">
          <Alert variant="destructive" className="bg-red-900/20 border-red-900 mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-vip-gray-300 mb-1">
              Titre du podcast *
            </label>
            <Input 
              id="title"
              placeholder="Ex: Comment organiser un mariage parfait"
              className="bg-vip-gray-800 border-vip-gray-700"
              value={newPodcast.title}
              onChange={onChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-vip-gray-300 mb-1">
              Catégorie *
            </label>
            <Select 
              value={newPodcast.category} 
              onValueChange={onSelectChange}
              required
            >
              <SelectTrigger className="bg-vip-gray-800 border-vip-gray-700">
                <SelectValue placeholder="Sélectionner une catégorie" />
              </SelectTrigger>
              <SelectContent className="bg-vip-gray-800 border-vip-gray-700">
                <SelectItem value="Mariage">Mariage</SelectItem>
                <SelectItem value="Entreprise">Entreprise</SelectItem>
                <SelectItem value="Animation">Animation</SelectItem>
                <SelectItem value="Photographie">Photographie</SelectItem>
                <SelectItem value="Décoration">Décoration</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
                <SelectItem value="Conseils">Conseils</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-vip-gray-300 mb-1">
              Description *
            </label>
            <Textarea 
              id="description"
              placeholder="Décrivez le contenu de votre podcast..."
              className="bg-vip-gray-800 border-vip-gray-700 min-h-[150px]"
              value={newPodcast.description}
              onChange={onChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="audioFile" className="block text-sm font-medium text-vip-gray-300 mb-1">
              Fichier audio (MP3) *
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-vip-gray-800 border border-vip-gray-700 cursor-pointer hover:bg-vip-gray-700">
                <Upload size={18} className="text-vip-gold" />
                <span className="text-vip-gray-300">
                  {audioFileName || "Choisir un fichier audio"}
                </span>
                <input
                  id="audioFile"
                  type="file"
                  accept="audio/mp3,audio/mpeg"
                  className="hidden"
                  onChange={onAudioFileChange}
                  required
                />
              </label>
            </div>
            <p className="text-xs text-vip-gray-400 mt-1">
              Format MP3 uniquement. Taille maximale: 20MB.
            </p>
          </div>
          
          <div>
            <label htmlFor="imageFile" className="block text-sm font-medium text-vip-gray-300 mb-1">
              Image de couverture
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-vip-gray-800 border border-vip-gray-700 cursor-pointer hover:bg-vip-gray-700">
                <Upload size={18} className="text-vip-gold" />
                <span className="text-vip-gray-300">
                  {imageFileName || "Choisir une image"}
                </span>
                <input
                  id="imageFile"
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                  onChange={onImageFileChange}
                />
              </label>
            </div>
            <p className="text-xs text-vip-gray-400 mt-1">
              Formats JPG, JPEG ou PNG. Taille recommandée: 1200x800px
            </p>
            
            <div id="image-preview-container" className="hidden mt-4">
              <img 
                id="image-preview" 
                src="" 
                alt="Prévisualisation" 
                className="max-h-60 rounded-md border border-vip-gray-700"
              />
            </div>
          </div>
          
          <div className="pt-4 text-sm text-vip-gray-400">
            <p className="mb-2">
              <strong className="text-vip-gold">Notes importantes:</strong>
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Tous les podcasts sont soumis à validation par l'équipe Best Events VIP</li>
              <li>Les podcasts approuvés seront disponibles pour tous les clients VIP</li>
              <li>Assurez-vous que votre contenu est original et de qualité professionnelle</li>
              <li>Évitez tout contenu promotionnel direct - privilégiez le partage d'expertise</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <GoldButton type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>Envoi en cours...</>
            ) : (
              <>Soumettre le podcast</>
            )}
          </GoldButton>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NewPodcastForm;
