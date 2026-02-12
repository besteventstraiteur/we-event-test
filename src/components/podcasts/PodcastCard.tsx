
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import PodcastStatusBadge from './PodcastStatusBadge';
import { AlertCircle, Edit, Play, Pause, Trash2 } from 'lucide-react';
import { Podcast } from '@/hooks/usePartnerPodcasts';

interface PodcastCardProps {
  podcast: Podcast;
  currentPodcast: Podcast | null;
  isPlaying: boolean;
  onTogglePlay: (podcast: Podcast) => void;
  onDelete: (id: number) => void;
}

const PodcastCard: React.FC<PodcastCardProps> = ({ 
  podcast, 
  currentPodcast, 
  isPlaying, 
  onTogglePlay, 
  onDelete 
}) => {
  return (
    <Card key={podcast.id} className="bg-vip-gray-900 border-vip-gray-800">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4">
          <img 
            src={podcast.imageUrl} 
            alt={podcast.title}
            className="w-full h-56 md:h-full object-cover"
          />
        </div>
        <div className="w-full md:w-3/4 flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-vip-white">{podcast.title}</CardTitle>
                <CardDescription className="text-vip-gray-400">
                  {podcast.category} • {podcast.duration} • {podcast.status === "pending" ? "Soumis" : "Publié"} le {podcast.date}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <PodcastStatusBadge status={podcast.status} />
                {podcast.status === "approved" && (
                  <span className="text-xs text-vip-gray-400">{podcast.views} vues</span>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <p className="text-vip-gray-300 line-clamp-3">{podcast.description}</p>
            
            {podcast.status === "pending" && (
              <div className="mt-4 flex items-center p-3 bg-amber-500/10 rounded-md">
                <AlertCircle size={18} className="text-amber-500 mr-2" />
                <p className="text-sm text-amber-300">
                  Ce podcast est en cours de validation par l'équipe Best Events VIP. 
                  Vous serez notifié par email dès qu'il sera approuvé.
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t border-vip-gray-800 pt-4 flex justify-between">
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                currentPodcast && currentPodcast.id === podcast.id && isPlaying
                  ? 'bg-vip-gold text-vip-black'
                  : 'bg-vip-gray-800 text-vip-gold hover:bg-vip-gold/20'
              }`}
              onClick={() => onTogglePlay(podcast)}
            >
              {currentPodcast && currentPodcast.id === podcast.id && isPlaying 
                ? <><Pause size={18} /> Pause</>
                : <><Play size={18} /> Écouter</>
              }
            </button>
            
            <div className="flex gap-2">
              <button 
                className="p-2 rounded-md bg-vip-gray-800 text-vip-gray-300 hover:bg-vip-gray-700"
                onClick={() => console.log("Edit podcast", podcast.id)}
              >
                <Edit size={18} />
              </button>
              <button 
                className="p-2 rounded-md bg-vip-gray-800 text-red-500 hover:bg-vip-gray-700"
                onClick={() => onDelete(podcast.id)}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default PodcastCard;
