
import React, { useState } from "react";
import { VideoConferenceService } from "@/services/VideoConferenceService";
import { NewVideoConference, ConferenceProvider, AccessLevel } from "@/models/videoConference";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, Clock, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface VideoConferenceFormProps {
  relatedId?: string;
  relatedType?: 'talkshow' | 'event' | 'meeting';
  onSuccess?: (conferenceId: string) => void;
  onCancel?: () => void;
}

const VideoConferenceForm: React.FC<VideoConferenceFormProps> = ({
  relatedId,
  relatedType,
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("14:00");
  const [duration, setDuration] = useState(60);
  const [provider, setProvider] = useState<ConferenceProvider>("zoom");
  const [accessLevel, setAccessLevel] = useState<AccessLevel>("private");
  const [accessCode, setAccessCode] = useState("");
  const [hostName, setHostName] = useState("");
  const [hostEmail, setHostEmail] = useState("");
  const [participants, setParticipants] = useState<Array<{id: string; name: string; email: string; role: string}>>([]);
  const [newParticipantName, setNewParticipantName] = useState("");
  const [newParticipantEmail, setNewParticipantEmail] = useState("");
  const [newParticipantRole, setNewParticipantRole] = useState("attendee");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !date || !time || !hostName || !hostEmail) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Préparer la date et l'heure
      const [hours, minutes] = time.split(':').map(Number);
      const startDate = new Date(date);
      startDate.setHours(hours, minutes, 0);
      
      // Préparer les données de la conférence
      const newConference: NewVideoConference = {
        title,
        description,
        startTime: startDate.toISOString(),
        duration,
        provider,
        accessLevel,
        accessCode: accessLevel === 'password-protected' ? accessCode : undefined,
        hostId: `host-${Date.now()}`, // Simuler un ID d'hôte
        hostName,
        hostEmail,
        participants: participants.map(p => ({
          id: p.id,
          name: p.name,
          email: p.email,
          role: p.role as any,
          invitationSent: false
        })),
        relatedId,
        relatedType
      };
      
      // Créer la conférence
      const conference = VideoConferenceService.getInstance().createConference(newConference);
      
      toast({
        title: "Visioconférence créée",
        description: "La visioconférence a été créée avec succès."
      });
      
      // Envoyer les invitations
      VideoConferenceService.getInstance().sendInvitations(conference.id);
      
      if (onSuccess) {
        onSuccess(conference.id);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur s'est produite lors de la création de la visioconférence."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addParticipant = () => {
    if (!newParticipantName || !newParticipantEmail) {
      toast({
        variant: "destructive",
        title: "Informations manquantes",
        description: "Veuillez saisir le nom et l'email du participant."
      });
      return;
    }
    
    setParticipants([
      ...participants,
      {
        id: `part-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: newParticipantName,
        email: newParticipantEmail,
        role: newParticipantRole
      }
    ]);
    
    setNewParticipantName("");
    setNewParticipantEmail("");
    setNewParticipantRole("attendee");
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
  };

  return (
    <Card className="bg-vip-gray-900 border-vip-gray-800 w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Créer une nouvelle visioconférence</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Titre</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Titre de la visioconférence"
                  className="bg-vip-gray-800 border-vip-gray-700"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Description de la visioconférence"
                  className="bg-vip-gray-800 border-vip-gray-700 h-24"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full bg-vip-gray-800 border-vip-gray-700 justify-start text-left"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP', { locale: fr }) : <span>Choisir une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-vip-gray-800 border-vip-gray-700">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label htmlFor="time">Heure</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-vip-gray-500" size={16} />
                    <Input
                      id="time"
                      type="time"
                      value={time}
                      onChange={e => setTime(e.target.value)}
                      className="bg-vip-gray-800 border-vip-gray-700 pl-10"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="duration">Durée (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  min="15"
                  max="240"
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="bg-vip-gray-800 border-vip-gray-700"
                  required
                />
              </div>

              <div>
                <Label htmlFor="provider">Fournisseur</Label>
                <Select value={provider} onValueChange={(value: ConferenceProvider) => setProvider(value)}>
                  <SelectTrigger className="bg-vip-gray-800 border-vip-gray-700">
                    <SelectValue placeholder="Choisir un fournisseur" />
                  </SelectTrigger>
                  <SelectContent className="bg-vip-gray-800 border-vip-gray-700">
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="google-meet">Google Meet</SelectItem>
                    <SelectItem value="custom">Autre / Personnalisé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Niveau d'accès</Label>
                <RadioGroup
                  value={accessLevel}
                  onValueChange={(value: AccessLevel) => setAccessLevel(value)}
                  className="mt-2 space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="access-public" />
                    <Label htmlFor="access-public" className="cursor-pointer">Public (accessible à tous)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="access-private" />
                    <Label htmlFor="access-private" className="cursor-pointer">Privé (uniquement sur invitation)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="password-protected" id="access-password" />
                    <Label htmlFor="access-password" className="cursor-pointer">Protégé par mot de passe</Label>
                  </div>
                </RadioGroup>
              </div>

              {accessLevel === 'password-protected' && (
                <div>
                  <Label htmlFor="accessCode">Code d'accès</Label>
                  <Input
                    id="accessCode"
                    value={accessCode}
                    onChange={e => setAccessCode(e.target.value)}
                    placeholder="Code d'accès"
                    className="bg-vip-gray-800 border-vip-gray-700"
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="hostName">Nom de l'hôte</Label>
                <Input
                  id="hostName"
                  value={hostName}
                  onChange={e => setHostName(e.target.value)}
                  placeholder="Votre nom"
                  className="bg-vip-gray-800 border-vip-gray-700"
                  required
                />
              </div>

              <div>
                <Label htmlFor="hostEmail">Email de l'hôte</Label>
                <Input
                  id="hostEmail"
                  type="email"
                  value={hostEmail}
                  onChange={e => setHostEmail(e.target.value)}
                  placeholder="Votre email"
                  className="bg-vip-gray-800 border-vip-gray-700"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <Label>Participants</Label>
            <div className="mt-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={newParticipantName}
                  onChange={e => setNewParticipantName(e.target.value)}
                  placeholder="Nom du participant"
                  className="bg-vip-gray-800 border-vip-gray-700"
                />
                <Input
                  type="email"
                  value={newParticipantEmail}
                  onChange={e => setNewParticipantEmail(e.target.value)}
                  placeholder="Email du participant"
                  className="bg-vip-gray-800 border-vip-gray-700"
                />
                <div className="flex space-x-2">
                  <Select value={newParticipantRole} onValueChange={setNewParticipantRole}>
                    <SelectTrigger className="bg-vip-gray-800 border-vip-gray-700">
                      <SelectValue placeholder="Rôle" />
                    </SelectTrigger>
                    <SelectContent className="bg-vip-gray-800 border-vip-gray-700">
                      <SelectItem value="co-host">Co-présentateur</SelectItem>
                      <SelectItem value="attendee">Participant</SelectItem>
                      <SelectItem value="viewer">Spectateur</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    onClick={addParticipant}
                    className="border-vip-gray-700 hover:bg-vip-gray-800"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              {participants.length > 0 && (
                <div className="border border-vip-gray-700 rounded-md divide-y divide-vip-gray-700">
                  {participants.map(participant => (
                    <div key={participant.id} className="p-2 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{participant.name}</p>
                        <p className="text-xs text-vip-gray-400">{participant.email} · {participant.role === 'co-host' ? 'Co-présentateur' : participant.role === 'attendee' ? 'Participant' : 'Spectateur'}</p>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon"
                        onClick={() => removeParticipant(participant.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-900/20"
                      >
                        <Trash size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="border-vip-gray-700 hover:bg-vip-gray-800"
              >
                Annuler
              </Button>
            )}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-vip-gold hover:bg-vip-gold/90"
            >
              {isSubmitting ? "Création en cours..." : "Créer la visioconférence"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoConferenceForm;
