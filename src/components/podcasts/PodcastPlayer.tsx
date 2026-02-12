
import React from 'react';
import { Play, Pause } from 'lucide-react';
import { Podcast } from '@/hooks/usePartnerPodcasts';

interface PodcastPlayerProps {
  podcast: Podcast;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const PodcastPlayer: React.FC<PodcastPlayerProps> = ({ podcast, isPlaying, onTogglePlay }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-vip-gray-900 border-t border-vip-gray-800 p-4 flex items-center">
      <button 
        className={`p-2 mr-4 rounded-full ${isPlaying ? 'bg-vip-gold text-vip-black' : 'bg-vip-gray-800 text-vip-gold'}`}
        onClick={onTogglePlay}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <div className="flex-grow">
        <p className="font-medium text-vip-white">{podcast.title}</p>
        <p className="text-sm text-vip-gray-400">{podcast.category}</p>
      </div>
      <span className="text-vip-gray-400 ml-4">{podcast.duration}</span>
    </div>
  );
};

export default PodcastPlayer;
