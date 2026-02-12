
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GoldButton from "@/components/GoldButton";
import { Upload, AlertCircle } from 'lucide-react';
import { NewTalkshow } from '@/hooks/usePartnerTalkshows';

interface NewTalkshowFormProps {
  newTalkshow: NewTalkshow;
  videoFileName: string;
  imageFileName: string;
  isLoading: boolean;
  error?: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (value: string) => void;
  onVideoFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const NewTalkshowForm: React.FC<NewTalkshowFormProps> = ({ 
  newTalkshow,
  videoFileName,
  imageFileName,
  isLoading,
  error,
  onSubmit,
  onChange,
  onSelectChange,
  onVideoFileChange,
  onImageFileChange
}) => {
  return (
    <Card className="bg-vip-gray-900 border-vip-gray-800">
      <CardHeader>
        <CardTitle className="text-vip-white">Ajouter un nouveau talkshow</CardTitle>
        <CardDescription className="text-vip-gray-400">
          Partagez votre expertise vidéo avec la communauté We Event
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
              Titre du talkshow *
            </label>
            <Input 
              id="title"
              placeholder="Ex: Les tendances en décoration d'événements"
              className="bg-vip-gray-800 border-vip-gray-700"
              value={newTalkshow.title}
              onChange={onChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-vip-gray-300 mb-1">
              Catégorie *
            </label>
            <Select 
              value={newTalkshow.category} 
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
            <label htmlFor="host" className="block text-sm font-medium text-vip-gray-300 mb-1">
              Présentateur / Hôte *
            </label>
            <Input 
              id="host"
              placeholder="Ex: Marie Durand"
              className="bg-vip-gray-800 border-vip-gray-700"
              value={newTalkshow.host}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-vip-gray-300 mb-1">
              Invités (séparés par des virgules)
            </label>
            <Input 
              id="guests"
              placeholder="Ex: Jean Dupont, Sophie Martin, Paul Bernard"
              className="bg-vip-gray-800 border-vip-gray-700"
              value={newTalkshow.guests}
              onChange={onChange}
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-vip-gray-300 mb-1">
              Description *
            </label>
            <Textarea 
              id="description"
              placeholder="Décrivez le contenu de votre talkshow..."
              className="bg-vip-gray-800 border-vip-gray-700 min-h-[150px]"
              value={newTalkshow.description}
              onChange={onChange}
              required
            />
          </div>
          
          <div>
            <label htmlFor="videoFile" className="block text-sm font-medium text-vip-gray-300 mb-1">
              Fichier vidéo (MP4) *
            </label>
            <div className="flex items-center gap-2">
              <label className="flex-1 flex items-center gap-2 px-4 py-3 rounded-md bg-vip-gray-800 border border-vip-gray-700 cursor-pointer hover:bg-vip-gray-700">
                <Upload size={18} className="text-vip-gold" />
                <span className="text-vip-gray-300">
                  {videoFileName || "Choisir un fichier vidéo"}
                </span>
                <input
                  id="videoFile"
                  type="file"
                  accept="video/mp4,video/mpeg,video/quicktime"
                  className="hidden"
                  onChange={onVideoFileChange}
                  required
                />
              </label>
            </div>
            <p className="text-xs text-vip-gray-400 mt-1">
              Formats MP4, MOV ou MPEG. Taille maximale: 50MB.
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
            
            <div id="talkshow-image-preview-container" className="hidden mt-4">
              <img 
                id="talkshow-image-preview" 
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
              <li>Tous les talkshows sont soumis à validation par l'équipe We Event</li>
              <li>Les talkshows approuvés seront disponibles pour tous les clients VIP</li>
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
              <>Soumettre le talkshow</>
            )}
          </GoldButton>
        </CardFooter>
      </form>
    </Card>
  );
};

export default NewTalkshowForm;
