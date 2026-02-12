
import React, { useState, useEffect } from "react";
import { VideoConference } from "@/models/videoConference";
import { VideoConferenceService } from "@/services/VideoConferenceService";
import VideoConferenceDetails from "./VideoConferenceDetails";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import VideoConferenceForm from "./VideoConferenceForm";
import { PlusCircle } from "lucide-react";

interface VideoConferenceListProps {
  relatedId?: string;
  relatedType?: 'talkshow' | 'event' | 'meeting';
  title?: string;
  currentUserId?: string;
  isAdmin?: boolean;
}

const VideoConferenceList: React.FC<VideoConferenceListProps> = ({
  relatedId,
  relatedType,
  title = "Visioconférences",
  currentUserId = "",
  isAdmin = false
}) => {
  const [conferences, setConferences] = useState<VideoConference[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadConferences();
  }, [relatedId]);
  
  const loadConferences = () => {
    setIsLoading(true);
    try {
      const service = VideoConferenceService.getInstance();
      
      // Si un ID associé est fourni, récupérer les conférences liées
      const data = relatedId 
        ? service.getConferencesByRelatedId(relatedId) 
        : service.getAllConferences();
      
      setConferences(data);
    } catch (error) {
      console.error("Erreur lors du chargement des visioconférences", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCreateSuccess = (conferenceId: string) => {
    setIsCreateDialogOpen(false);
    loadConferences();
  };
  
  const handleStatusChange = (conferenceId: string, status: 'scheduled' | 'live' | 'ended' | 'cancelled') => {
    setConferences(prevConferences => 
      prevConferences.map(conf => 
        conf.id === conferenceId 
          ? { ...conf, status } 
          : conf
      )
    );
  };
  
  // Trier les conférences: En direct, Programmées (les plus proches d'abord), Terminées, Annulées
  const sortedConferences = [...conferences].sort((a, b) => {
    // Ordre de priorité des statuts
    const statusOrder: Record<string, number> = {
      'live': 0,
      'scheduled': 1,
      'ended': 2,
      'cancelled': 3
    };
    
    // D'abord trier par statut
    if (statusOrder[a.status] !== statusOrder[b.status]) {
      return statusOrder[a.status] - statusOrder[b.status];
    }
    
    // Pour les conférences programmées, trier par date (les plus proches d'abord)
    if (a.status === 'scheduled') {
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
    }
    
    // Pour les autres statuts, trier par date (les plus récentes d'abord)
    return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">{title}</h2>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-vip-gold hover:bg-vip-gold/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nouvelle visioconférence
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-vip-gray-900 border-vip-gray-800 max-w-4xl">
            <VideoConferenceForm
              relatedId={relatedId}
              relatedType={relatedType}
              onSuccess={handleCreateSuccess}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      {isLoading ? (
        <div className="py-12 text-center text-vip-gray-400">
          Chargement des visioconférences...
        </div>
      ) : sortedConferences.length === 0 ? (
        <div className="py-12 text-center text-vip-gray-400">
          <p>Aucune visioconférence programmée.</p>
          <p className="text-sm mt-2">Cliquez sur "Nouvelle visioconférence" pour en créer une.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sortedConferences.map(conference => (
            <VideoConferenceDetails
              key={conference.id}
              conference={conference}
              currentUserId={currentUserId}
              isHost={isAdmin || conference.hostId === currentUserId}
              onStatusChange={(status) => handleStatusChange(conference.id, status)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoConferenceList;
