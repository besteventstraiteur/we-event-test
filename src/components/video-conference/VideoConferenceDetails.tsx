
import React, { useState } from "react";
import { VideoConference } from "@/models/videoConference";
import { VideoConferenceService } from "@/services/VideoConferenceService";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, Users, Link, Copy, Lock, User, VideoIcon } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface VideoConferenceDetailsProps {
  conference: VideoConference;
  currentUserId?: string;
  isHost?: boolean;
  onStatusChange?: (status: 'scheduled' | 'live' | 'ended' | 'cancelled') => void;
}

const VideoConferenceDetails: React.FC<VideoConferenceDetailsProps> = ({
  conference,
  currentUserId = "",
  isHost = false,
  onStatusChange
}) => {
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState("");
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  
  const startDate = new Date(conference.startTime);
  const endDate = new Date(startDate.getTime() + conference.duration * 60000);
  
  const isStartingSoon = startDate.getTime() - new Date().getTime() < 15 * 60000; // 15 minutes
  const isLive = conference.status === 'live';
  const isEnded = conference.status === 'ended' || conference.status === 'cancelled';
  const canJoin = isStartingSoon || isLive;
  
  const getStatusBadgeColor = () => {
    switch (conference.status) {
      case 'scheduled': return "bg-amber-500 hover:bg-amber-600";
      case 'live': return "bg-green-600 hover:bg-green-700";
      case 'ended': return "bg-blue-600 hover:bg-blue-700";
      case 'cancelled': return "bg-red-600 hover:bg-red-700";
      default: return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  const getStatusText = () => {
    switch (conference.status) {
      case 'scheduled': return "Programmée";
      case 'live': return "En direct";
      case 'ended': return "Terminée";
      case 'cancelled': return "Annulée";
      default: return "Inconnu";
    }
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(conference.conferenceUrl);
    toast({
      title: "Lien copié",
      description: "Le lien de la visioconférence a été copié dans le presse-papier."
    });
  };
  
  const handleJoinConference = () => {
    // Si c'est protégé par mot de passe et que ce n'est pas l'hôte, ouvrir la boîte de dialogue
    if (conference.accessLevel === 'password-protected' && !isHost) {
      setJoinDialogOpen(true);
      return;
    }
    
    joinConference();
  };
  
  const joinConference = () => {
    try {
      const result = VideoConferenceService.getInstance().joinConference(
        conference.id,
        currentUserId,
        conference.accessLevel === 'password-protected' ? accessCode : undefined
      );
      
      if (result.success && result.url) {
        // Dans une application réelle, on redirigerait vers l'URL ou on ouvrirait
        // la visioconférence dans une iframe ou une fenêtre popup
        window.open(result.url, '_blank');
        
        if (conference.status === 'scheduled' && onStatusChange) {
          onStatusChange('live');
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.message || "Impossible de rejoindre la visioconférence."
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur s'est produite lors de la tentative de connexion."
      });
    }
  };
  
  const handleStatusChange = (status: 'scheduled' | 'live' | 'ended' | 'cancelled') => {
    try {
      VideoConferenceService.getInstance().updateStatus(conference.id, status);
      
      if (onStatusChange) {
        onStatusChange(status);
      }
      
      toast({
        title: "Statut mis à jour",
        description: `La visioconférence est maintenant ${getStatusText().toLowerCase()}.`
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le statut de la visioconférence."
      });
    }
  };
  
  return (
    <Card className="bg-vip-gray-900 border-vip-gray-800 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{conference.title}</CardTitle>
          <Badge className={getStatusBadgeColor()}>{getStatusText()}</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-vip-gray-300">{conference.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="h-5 w-5 text-vip-gray-400" />
            <div>
              <p className="text-vip-gray-400">Date</p>
              <p className="font-medium">{format(startDate, 'PPP', { locale: fr })}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <Clock className="h-5 w-5 text-vip-gray-400" />
            <div>
              <p className="text-vip-gray-400">Heure</p>
              <p className="font-medium">
                {format(startDate, 'HH:mm', { locale: fr })} - {format(endDate, 'HH:mm', { locale: fr })}
                <span className="text-vip-gray-400 ml-1">({conference.duration} min)</span>
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <User className="h-5 w-5 text-vip-gray-400" />
            <div>
              <p className="text-vip-gray-400">Organisateur</p>
              <p className="font-medium">{conference.hostName}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <VideoIcon className="h-5 w-5 text-vip-gray-400" />
            <div>
              <p className="text-vip-gray-400">Service</p>
              <p className="font-medium capitalize">{conference.provider}</p>
            </div>
          </div>
          
          {conference.accessLevel === 'password-protected' && (
            <div className="flex items-center gap-3 text-sm md:col-span-2">
              <Lock className="h-5 w-5 text-vip-gray-400" />
              <div>
                <p className="text-vip-gray-400">Accès protégé</p>
                <p className="font-medium">
                  {isHost ? (
                    <>Code d'accès: <span className="font-mono">{conference.accessCode}</span></>
                  ) : (
                    "Un code d'accès est requis pour rejoindre cette visioconférence"
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {conference.participants.length > 0 && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-vip-gray-400" />
              <p className="font-medium">Participants ({conference.participants.length})</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {conference.participants.map(participant => (
                <div 
                  key={participant.id} 
                  className="flex items-center gap-2 bg-vip-gray-800 p-2 rounded-md text-sm"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="bg-vip-gray-700 text-xs">
                      {participant.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{participant.name}</p>
                    <p className="text-xs text-vip-gray-400">
                      {participant.role === 'co-host' ? 'Co-présentateur' : 
                       participant.role === 'attendee' ? 'Participant' : 'Spectateur'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {(isHost && conference.status !== 'cancelled') && (
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-2">
              <Link className="h-5 w-5 text-vip-gray-400" />
              <p className="font-medium">Lien de la visioconférence</p>
            </div>
            
            <div className="flex items-center gap-2">
              <Input 
                value={conference.conferenceUrl} 
                readOnly 
                className="bg-vip-gray-800 border-vip-gray-700 font-mono text-sm" 
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleCopyLink}
                className="border-vip-gray-700 hover:bg-vip-gray-800"
              >
                <Copy size={16} />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <div className="flex gap-2">
          {isHost && (
            <>
              {conference.status === 'scheduled' && (
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange('cancelled')}
                  className="text-red-500 border-red-800 hover:bg-red-900/20"
                >
                  Annuler
                </Button>
              )}
              
              {conference.status === 'live' && (
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusChange('ended')}
                  className="border-vip-gray-700 hover:bg-vip-gray-800"
                >
                  Terminer
                </Button>
              )}
            </>
          )}
        </div>
        
        {canJoin && !isEnded && (
          <Button 
            onClick={handleJoinConference}
            className={`${isLive ? "bg-green-600 hover:bg-green-700" : "bg-vip-gold hover:bg-vip-gold/90"}`}
          >
            {isLive ? "Rejoindre maintenant" : "Rejoindre"}
          </Button>
        )}
      </CardFooter>
      
      {/* Dialogue pour saisir le code d'accès */}
      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent className="bg-vip-gray-900 border-vip-gray-800">
          <DialogHeader>
            <DialogTitle>Code d'accès requis</DialogTitle>
            <DialogDescription>
              Veuillez saisir le code d'accès pour rejoindre cette visioconférence.
            </DialogDescription>
          </DialogHeader>
          
          <Input
            value={accessCode}
            onChange={e => setAccessCode(e.target.value)}
            placeholder="Code d'accès"
            className="bg-vip-gray-800 border-vip-gray-700"
          />
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setJoinDialogOpen(false)}
              className="border-vip-gray-700 hover:bg-vip-gray-800"
            >
              Annuler
            </Button>
            <Button 
              onClick={() => {
                setJoinDialogOpen(false);
                joinConference();
              }}
              className="bg-vip-gold hover:bg-vip-gold/90"
              disabled={!accessCode}
            >
              Rejoindre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default VideoConferenceDetails;
