
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Play, Pause, SkipBack, SkipForward, Volume2, Maximize, X } from "lucide-react";

interface OnlineTraining {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  category: string;
  videoUrl: string;
  thumbnail: string;
  progress: number;
  completed: boolean;
  instructor: string;
  rating: number;
}

interface TrainingVideoPlayerProps {
  training: OnlineTraining;
  onClose: () => void;
}

const TrainingVideoPlayer: React.FC<TrainingVideoPlayerProps> = ({ training, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [volume, setVolume] = useState(50);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Débutant': return 'bg-green-100 text-green-800';
      case 'Intermédiaire': return 'bg-yellow-100 text-yellow-800';
      case 'Avancé': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="relative">
          {/* Header */}
          <DialogHeader className="p-4 border-b">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <DialogTitle className="text-xl">{training.title}</DialogTitle>
                <div className="flex items-center space-x-2">
                  <Badge className={getLevelColor(training.level)}>
                    {training.level}
                  </Badge>
                  <Badge variant="outline">{training.category}</Badge>
                  <span className="text-sm text-gray-600">par {training.instructor}</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={training.thumbnail} 
                alt={training.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                <Button
                  size="lg"
                  className="rounded-full w-16 h-16"
                  onClick={handlePlayPause}
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8" />
                  )}
                </Button>
              </div>
            </div>

            {/* Video Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
              <div className="space-y-3">
                {/* Progress Bar */}
                <div className="space-y-1">
                  <Progress 
                    value={(currentTime / duration) * 100} 
                    className="h-2 cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-white">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handlePlayPause} className="text-white hover:bg-white/20">
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-4 w-4 text-white" />
                    <div className="w-20">
                      <Progress value={volume} className="h-1" />
                    </div>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Training Info */}
          <div className="p-4 space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{training.description}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium">Durée:</span>
                <p className="text-gray-600">{training.duration}</p>
              </div>
              <div>
                <span className="font-medium">Niveau:</span>
                <p className="text-gray-600">{training.level}</p>
              </div>
              <div>
                <span className="font-medium">Catégorie:</span>
                <p className="text-gray-600">{training.category}</p>
              </div>
              <div>
                <span className="font-medium">Note:</span>
                <p className="text-gray-600">⭐ {training.rating}/5</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Progression globale</span>
                <span>{training.progress}%</span>
              </div>
              <Progress value={training.progress} className="h-2" />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TrainingVideoPlayer;
