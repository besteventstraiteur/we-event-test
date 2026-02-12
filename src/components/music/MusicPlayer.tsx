
import React, { useRef, useEffect, useState } from "react";
import { Song } from "@/models/playlist";
import { 
  Play, Pause, SkipBack, SkipForward, 
  Volume2, VolumeX, Music 
} from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface MusicPlayerProps {
  song: Song | null;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrevious: () => void;
  onNext: () => void;
  compact?: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  song,
  isPlaying,
  onTogglePlay,
  onPrevious,
  onNext,
  compact = false
}) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);

  // Gérer la lecture/pause
  useEffect(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.error("Erreur lors de la lecture:", error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, song]);

  // Mettre à jour la durée lorsque le média est chargé
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // Mettre à jour le temps actuel pendant la lecture
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  // Gérer la fin de la chanson
  const handleEnded = () => {
    onNext();
  };

  // Contrôle du temps de lecture
  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  // Contrôle du volume
  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      const newVolume = value[0];
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
    }
  };

  // Toggle mute
  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume;
        setIsMuted(false);
      } else {
        audioRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  // Formater le temps (secondes -> mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!song) {
    return (
      <div className={`bg-vip-gray-800 border border-vip-gray-700 rounded-lg p-3 ${compact ? "h-20" : "h-32"}`}>
        <div className="flex items-center justify-center h-full text-vip-gray-500">
          <Music className="mr-2 h-5 w-5" />
          <p>Aucune chanson sélectionnée</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-vip-gray-800 border border-vip-gray-700 rounded-lg p-3 ${compact ? "h-20" : ""}`}>
      <audio
        ref={audioRef}
        src={song.audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      
      <div className="flex items-center gap-3">
        {/* Image de la chanson ou icône par défaut */}
        <div className="flex-shrink-0">
          {song.imageUrl ? (
            <img src={song.imageUrl} alt={song.title} className={`rounded ${compact ? "w-14 h-14" : "w-20 h-20"}`} />
          ) : (
            <div className={`flex items-center justify-center rounded bg-vip-gray-700 ${compact ? "w-14 h-14" : "w-20 h-20"}`}>
              <Music className="text-vip-gray-500" size={compact ? 24 : 32} />
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          {/* Infos de la chanson */}
          <div className="mb-2">
            <h3 className="text-white font-medium truncate">
              {song.title}
            </h3>
            <p className="text-vip-gray-400 text-sm truncate">
              {song.artist}
            </p>
          </div>
          
          {!compact && (
            <>
              {/* Slider de temps */}
              <div className="mb-2">
                <Slider 
                  value={[currentTime]} 
                  min={0} 
                  max={duration || song.duration} 
                  step={1} 
                  onValueChange={handleSeek}
                  className="my-1.5"
                />
                <div className="flex justify-between text-xs text-vip-gray-400">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration || song.duration)}</span>
                </div>
              </div>
            </>
          )}
          
          {/* Contrôles de lecture */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button 
                onClick={onPrevious}
                className="p-1.5 text-vip-gray-400 hover:text-white transition-colors"
              >
                <SkipBack size={18} />
              </button>
              
              <button 
                onClick={onTogglePlay}
                className="p-1.5 bg-vip-gold text-vip-black rounded-full hover:bg-vip-gold/90 transition-colors"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>
              
              <button 
                onClick={onNext}
                className="p-1.5 text-vip-gray-400 hover:text-white transition-colors"
              >
                <SkipForward size={18} />
              </button>
            </div>
            
            {!compact && (
              <div className="flex items-center gap-2 w-32">
                <button 
                  onClick={toggleMute}
                  className="text-vip-gray-400 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <Slider 
                  value={[isMuted ? 0 : volume]} 
                  min={0} 
                  max={1} 
                  step={0.01} 
                  onValueChange={handleVolumeChange}
                  className="ml-1"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
