
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import TalkshowStatusBadge from './TalkshowStatusBadge';
import { AlertCircle, Edit, Play, Pause, Trash2, Users } from 'lucide-react';
import { Talkshow } from '@/hooks/usePartnerTalkshows';

interface TalkshowCardProps {
  talkshow: Talkshow;
  currentTalkshow: Talkshow | null;
  isPlaying: boolean;
  onTogglePlay: (talkshow: Talkshow) => void;
  onDelete: (id: number) => void;
}

const TalkshowCard: React.FC<TalkshowCardProps> = ({ 
  talkshow, 
  currentTalkshow, 
  isPlaying, 
  onTogglePlay, 
  onDelete 
}) => {
  return (
    <Card key={talkshow.id} className="bg-vip-gray-900 border-vip-gray-800">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/4">
          <img 
            src={talkshow.imageUrl} 
            alt={talkshow.title}
            className="w-full h-56 md:h-full object-cover"
          />
        </div>
        <div className="w-full md:w-3/4 flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-vip-white">{talkshow.title}</CardTitle>
                <CardDescription className="text-vip-gray-400">
                  {talkshow.category} • {talkshow.duration} • {talkshow.status === "pending" ? "Soumis" : "Publié"} le {talkshow.date}
                </CardDescription>
                <div className="flex items-center gap-2 mt-2 text-sm text-vip-gray-400">
                  <span>Présenté par: {talkshow.host}</span>
                  {talkshow.guests.length > 0 && (
                    <div className="flex items-center gap-1">
                      <Users size={14} className="text-vip-gold" />
                      <span>Invités: {talkshow.guests.join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <TalkshowStatusBadge status={talkshow.status} />
                {talkshow.status === "approved" && (
                  <span className="text-xs text-vip-gray-400">{talkshow.views} vues</span>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="flex-grow">
            <p className="text-vip-gray-300 line-clamp-3">{talkshow.description}</p>
            
            {talkshow.status === "pending" && (
              <div className="mt-4 flex items-center p-3 bg-amber-500/10 rounded-md">
                <AlertCircle size={18} className="text-amber-500 mr-2" />
                <p className="text-sm text-amber-300">
                  Ce talkshow est en cours de validation par l'équipe We Event. 
                  Vous serez notifié par email dès qu'il sera approuvé.
                </p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="border-t border-vip-gray-800 pt-4 flex justify-between">
            <button 
              className={`flex items-center gap-2 px-4 py-2 rounded-md ${
                currentTalkshow && currentTalkshow.id === talkshow.id && isPlaying
                  ? 'bg-vip-gold text-vip-black'
                  : 'bg-vip-gray-800 text-vip-gold hover:bg-vip-gold/20'
              }`}
              onClick={() => onTogglePlay(talkshow)}
            >
              {currentTalkshow && currentTalkshow.id === talkshow.id && isPlaying 
                ? <><Pause size={18} /> Pause</>
                : <><Play size={18} /> Regarder</>
              }
            </button>
            
            <div className="flex gap-2">
              <button 
                className="p-2 rounded-md bg-vip-gray-800 text-vip-gray-300 hover:bg-vip-gray-700"
                onClick={() => console.log("Edit talkshow", talkshow.id)}
              >
                <Edit size={18} />
              </button>
              <button 
                className="p-2 rounded-md bg-vip-gray-800 text-red-500 hover:bg-vip-gray-700"
                onClick={() => onDelete(talkshow.id)}
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

export default TalkshowCard;
