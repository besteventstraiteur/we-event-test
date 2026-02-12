
import React from "react";
import { Playlist } from "@/models/playlist";
import { PlayCircle, Calendar, Clock, Music, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";

interface PlaylistItemProps {
  playlist: Playlist;
  isActive?: boolean;
  onClick: () => void;
}

// Mapper pour les types d'événements
const eventTypeLabels: Record<string, string> = {
  wedding: "Mariage",
  birthday: "Anniversaire",
  corporate: "Entreprise",
  other: "Autre"
};

// Mapper pour les moments
const momentLabels: Record<string, string> = {
  entrance: "Entrée",
  first_dance: "Première danse",
  cake_cutting: "Gâteau",
  party: "Soirée dansante",
  closing: "Clôture",
  other: "Autre"
};

const PlaylistItem: React.FC<PlaylistItemProps> = ({ 
  playlist, 
  isActive = false,
  onClick 
}) => {
  // Formater la date de mise à jour
  const formattedDate = formatDistanceToNow(new Date(playlist.updatedAt), { 
    addSuffix: true,
    locale: fr
  });
  
  // Nombre de chansons ajoutées par le DJ vs client
  const djSongs = playlist.songs.filter(song => song.addedBy === "dj").length;
  const clientSongs = playlist.songs.filter(song => song.addedBy === "client").length;
  
  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer transition-colors ${
        isActive 
          ? "bg-vip-gray-700 border-vip-gray-600" 
          : "bg-vip-gray-800 border-vip-gray-700 hover:bg-vip-gray-750"
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-white font-medium">{playlist.name}</h3>
        <div className="flex gap-1">
          <Badge variant="outline" className="bg-vip-gray-700">
            {eventTypeLabels[playlist.eventType] || playlist.eventType}
          </Badge>
          <Badge variant="outline" className="bg-vip-gray-700">
            {momentLabels[playlist.moment] || playlist.moment}
          </Badge>
        </div>
      </div>
      
      {playlist.description && (
        <p className="text-vip-gray-400 text-sm mb-3">{playlist.description}</p>
      )}
      
      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-vip-gray-400">
        <div className="flex items-center">
          <Music className="mr-1.5 h-4 w-4" />
          <span>{playlist.songs.length} morceaux</span>
        </div>
        
        <div className="flex items-center">
          <Users className="mr-1.5 h-4 w-4" />
          <span>{djSongs} DJ / {clientSongs} client</span>
        </div>
        
        <div className="flex items-center">
          <Clock className="mr-1.5 h-4 w-4" />
          <span>
            {Math.round(playlist.songs.reduce((acc, song) => acc + song.duration, 0) / 60)} min
          </span>
        </div>
        
        <div className="flex items-center">
          <Calendar className="mr-1.5 h-4 w-4" />
          <span>Mise à jour {formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default PlaylistItem;
