
import React, { useState } from 'react';
import { Check, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';

interface Guest {
  id: string;
  first_name: string;
  last_name: string;
  rsvp_status: 'pending' | 'confirmed' | 'declined';
  event_id: string;
}

interface Event {
  id: string;
  title: string;
  date: string;
}

interface GuestRSVPProps {
  guest: Guest;
  event: Event;
}

const GuestRSVP: React.FC<GuestRSVPProps> = ({ guest, event }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvpStatus, setRsvpStatus] = useState(guest.rsvp_status);
  const { toast } = useToast();
  
  const handleRSVP = async (status: 'confirmed' | 'declined') => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would update the guest's RSVP status in the database
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      setRsvpStatus(status);
      
      toast({
        title: "RSVP envoyé",
        description: status === 'confirmed' 
          ? "Merci d'avoir confirmé votre présence !" 
          : "Nous sommes désolés que vous ne puissiez pas venir.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi de votre RSVP",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Répondre à l'invitation</h3>
        
        {rsvpStatus === 'pending' ? (
          <p className="text-muted-foreground mb-4">
            Merci de confirmer votre présence à l'événement de {event.title} le {' '}
            {new Date(event.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
        ) : (
          <div className="bg-muted p-4 rounded-md mb-4">
            <p className="font-medium">
              {rsvpStatus === 'confirmed' 
                ? "Vous avez confirmé votre présence" 
                : "Vous avez décliné l'invitation"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Vous pouvez toujours changer votre réponse ci-dessous
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-4">
        <Button
          className="flex-1 bg-green-600 hover:bg-green-700"
          onClick={() => handleRSVP('confirmed')}
          disabled={isSubmitting}
        >
          <Check className="mr-2 h-4 w-4" />
          Je serai présent(e)
        </Button>
        
        <Button
          variant="outline"
          className="flex-1 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={() => handleRSVP('declined')}
          disabled={isSubmitting}
        >
          <X className="mr-2 h-4 w-4" />
          Je ne pourrai pas venir
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GuestRSVP;
