
import React from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Talkshow } from '@/hooks/usePartnerTalkshows';

interface TalkshowPlayerProps {
  talkshow: Talkshow;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

const TalkshowPlayer: React.FC<TalkshowPlayerProps> = ({ talkshow, isPlaying, onTogglePlay }) => {
  const [isMuted, setIsMuted] = React.useState(false);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-vip-gray-900 border-t border-vip-gray-800 p-4 flex items-center">
      <button 
        className={`p-2 mr-4 rounded-full ${isPlaying ? 'bg-vip-gold text-vip-black' : 'bg-vip-gray-800 text-vip-gold'}`}
        onClick={onTogglePlay}
      >
        {isPlaying ? <Pause size={20} /> : <Play size={20} />}
      </button>
      <div className="flex-grow">
        <p className="font-medium text-vip-white">{talkshow.title}</p>
        <p className="text-sm text-vip-gray-400">Présenté par {talkshow.host}</p>
      </div>
      <button
        className="p-2 mr-2 rounded-full bg-vip-gray-800 text-vip-gray-300 hover:bg-vip-gray-700"
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
      </button>
      <span className="text-vip-gray-400 ml-2">{talkshow.duration}</span>
    </div>
  );
};

export default TalkshowPlayer;
