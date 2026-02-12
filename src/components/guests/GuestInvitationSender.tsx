
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Mail, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Guest } from '@/types/floorPlanTypes';

interface GuestInvitationSenderProps {
  guests: Guest[];
}

const GuestInvitationSender: React.FC<GuestInvitationSenderProps> = ({ guests }) => {
  const [template, setTemplate] = useState<string>("standard");
  const [message, setMessage] = useState<string>(
    "Nous sommes heureux de vous convier à notre mariage qui aura lieu le [DATE]. " +
    "Merci de confirmer votre présence en cliquant sur le lien ci-dessous."
  );
  const [sending, setSending] = useState<boolean>(false);
  const [selectedGuests, setSelectedGuests] = useState<string[]>([]);
  const { toast } = useToast();

  const templates = [
    { id: 'standard', name: 'Invitation standard' },
    { id: 'rappel', name: 'Rappel' },
    { id: 'changement', name: 'Changement de lieu/date' },
    { id: 'confirmation', name: 'Confirmation de présence' },
  ];

  const handleTemplateChange = (value: string) => {
    setTemplate(value);
    
    // Update message based on template
    switch(value) {
      case 'standard':
        setMessage("Nous sommes heureux de vous convier à notre mariage qui aura lieu le [DATE]. " +
          "Merci de confirmer votre présence en cliquant sur le lien ci-dessous.");
        break;
      case 'rappel':
        setMessage("N'oubliez pas de confirmer votre présence à notre mariage. " +
          "Il ne vous reste que quelques jours pour nous faire part de votre réponse.");
        break;
      case 'changement':
        setMessage("Nous vous informons d'un changement concernant notre mariage. " +
          "Veuillez consulter les nouvelles informations en cliquant sur le lien ci-dessous.");
        break;
      case 'confirmation':
        setMessage("Nous avons bien reçu votre confirmation de présence à notre mariage. " +
          "Nous nous réjouissons de vous y retrouver.");
        break;
      default:
        setMessage("");
    }
  };

  const handleGuestSelection = (guestId: string) => {
    setSelectedGuests(prev => 
      prev.includes(guestId)
        ? prev.filter(id => id !== guestId)
        : [...prev, guestId]
    );
  };

  const handleSelectAll = () => {
    if (selectedGuests.length === guests.length) {
      setSelectedGuests([]);
    } else {
      setSelectedGuests(guests.map(g => g.id));
    }
  };

  const handleSendInvitations = async () => {
    if (selectedGuests.length === 0) {
      toast({
        title: "Aucun invité sélectionné",
        description: "Veuillez sélectionner au moins un invité pour envoyer l'invitation.",
        variant: "destructive",
      });
      return;
    }

    setSending(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would be an API call to send invitations
      const selectedGuestNames = guests
        .filter(g => selectedGuests.includes(g.id))
        .map(g => `${g.prenom} ${g.nom}`)
        .join(', ');
      
      toast({
        title: "Invitations envoyées",
        description: `Les invitations ont été envoyées avec succès à ${selectedGuests.length} invité(s).`,
      });
      
      // Reset selection after successful send
      setSelectedGuests([]);
    } catch (error) {
      toast({
        title: "Erreur d'envoi",
        description: "Une erreur est survenue lors de l'envoi des invitations.",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Envoyer des invitations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="template">Modèle d'invitation</Label>
          <Select value={template} onValueChange={handleTemplateChange}>
            <SelectTrigger id="template">
              <SelectValue placeholder="Sélectionner un modèle" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(t => (
                <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="message">Message personnalisé</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px]"
            placeholder="Votre message personnalisé pour les invités..."
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Sélectionner les invités</Label>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
            >
              {selectedGuests.length === guests.length ? "Désélectionner tout" : "Sélectionner tout"}
            </Button>
          </div>
          
          <div className="max-h-48 overflow-y-auto border rounded-md p-2">
            {guests.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Aucun invité disponible</p>
            ) : (
              <div className="space-y-1">
                {guests.map(guest => (
                  <div 
                    key={guest.id} 
                    className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                      selectedGuests.includes(guest.id) ? 'bg-amber-50' : ''
                    }`}
                    onClick={() => handleGuestSelection(guest.id)}
                  >
                    <input 
                      type="checkbox" 
                      checked={selectedGuests.includes(guest.id)}
                      onChange={() => {}} // Handled by div click
                      className="mr-2"
                    />
                    <span>{guest.prenom} {guest.nom}</span>
                    <span className="text-xs text-gray-500 ml-2">({guest.email})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <p className="text-sm text-gray-500">
            {selectedGuests.length} invité(s) sélectionné(s) sur {guests.length}
          </p>
        </div>
        
        <Button 
          className="w-full bg-vip-gold hover:bg-vip-gold/90 text-white" 
          onClick={handleSendInvitations}
          disabled={sending || selectedGuests.length === 0}
        >
          {sending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Envoyer les invitations
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default GuestInvitationSender;
