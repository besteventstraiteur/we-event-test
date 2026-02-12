
import React from "react";
import { Song } from "@/models/playlist";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { 
  Play, Pause, Trash2, Music, Clock, User, Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlay: (song: Song) => void;
  onRemove: (songId: string) => void;
  onTogglePlay: () => void;
}

const SongList: React.FC<SongListProps> = ({
  songs,
  currentSong,
  isPlaying,
  onPlay,
  onRemove,
  onTogglePlay
}) => {
  // Formater la durée (secondes -> mm:ss)
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (songs.length === 0) {
    return (
      <div className="py-8 text-center">
        <Music className="mx-auto mb-3 h-10 w-10 text-vip-gray-600" />
        <p className="text-vip-gray-400">Aucun morceau dans cette playlist</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {songs.map((song) => {
        const isCurrentSong = currentSong?.id === song.id;
        
        return (
          <div 
            key={song.id}
            className={`p-3 rounded-lg border flex items-center gap-3 ${
              isCurrentSong 
                ? "bg-vip-gray-700 border-vip-gray-600" 
                : "bg-vip-gray-800 border-vip-gray-700"
            }`}
          >
            {/* Thumbnail et bouton play */}
            <div className="relative flex-shrink-0">
              {song.imageUrl ? (
                <img 
                  src={song.imageUrl} 
                  alt={song.title} 
                  className="w-12 h-12 rounded"
                />
              ) : (
                <div className="w-12 h-12 rounded bg-vip-gray-700 flex items-center justify-center">
                  <Music className="text-vip-gray-500" size={20} />
                </div>
              )}
              
              <button
                className={`absolute inset-0 flex items-center justify-center rounded bg-black/50 ${isCurrentSong ? "opacity-100" : "opacity-0 hover:opacity-100"} transition-opacity`}
                onClick={() => isCurrentSong ? onTogglePlay() : onPlay(song)}
              >
                {isCurrentSong && isPlaying ? (
                  <Pause className="text-white" size={20} />
                ) : (
                  <Play className="text-white" size={20} />
                )}
              </button>
            </div>
            
            {/* Infos de la chanson */}
            <div className="flex-grow min-w-0">
              <h4 className="text-white font-medium truncate">{song.title}</h4>
              <p className="text-vip-gray-400 text-sm truncate">{song.artist}</p>
              
              <div className="flex flex-wrap gap-x-3 mt-1 text-xs text-vip-gray-500">
                <div className="flex items-center">
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{formatDuration(song.duration)}</span>
                </div>
                
                <div className="flex items-center">
                  <User className="mr-1 h-3 w-3" />
                  <span>
                    {song.addedBy === "dj" ? "Ajouté par DJ" : "Ajouté par vous"}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  <span>
                    {formatDistance(new Date(song.addedAt), new Date(), { 
                      addSuffix: true,
                      locale: fr 
                    })}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Badge si c'est la chanson en cours */}
            {isCurrentSong && isPlaying && (
              <Badge className="bg-vip-gold text-vip-black">
                En lecture
              </Badge>
            )}
            
            {/* Bouton de suppression */}
            <button
              className="ml-2 p-1.5 text-vip-gray-500 hover:text-red-400 transition-colors"
              onClick={() => onRemove(song.id)}
              title="Supprimer"
            >
              <Trash2 size={18} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default SongList;
