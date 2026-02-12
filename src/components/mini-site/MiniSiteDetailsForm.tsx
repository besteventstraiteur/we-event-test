
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, MapPin, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { WeddingDetails, Accommodation } from "@/types/miniSiteTypes";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface MiniSiteDetailsFormProps {
  weddingDetails: WeddingDetails;
  setWeddingDetails: React.Dispatch<React.SetStateAction<WeddingDetails>>;
}

const MiniSiteDetailsForm: React.FC<MiniSiteDetailsFormProps> = ({
  weddingDetails,
  setWeddingDetails
}) => {
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setWeddingDetails(prev => ({ ...prev, date }));
    }
  };

  const handlePartnerNameChange = (partner: 'partner1' | 'partner2', value: string) => {
    setWeddingDetails(prev => ({
      ...prev,
      coupleNames: {
        ...prev.coupleNames,
        [partner]: value
      }
    }));
  };

  const handleLocationChange = (
    locationType: 'ceremony' | 'reception',
    field: string,
    value: string
  ) => {
    setWeddingDetails(prev => ({
      ...prev,
      locations: {
        ...prev.locations,
        [locationType]: {
          ...prev.locations[locationType],
          [field]: value
        }
      }
    }));
  };

  const addAccommodation = () => {
    const newAccommodation: Accommodation = {
      name: "",
      address: "",
      description: ""
    };
    
    setWeddingDetails(prev => ({
      ...prev,
      accommodations: [...prev.accommodations, newAccommodation]
    }));
  };

  const updateAccommodation = (index: number, field: keyof Accommodation, value: string) => {
    setWeddingDetails(prev => {
      const updatedAccommodations = [...prev.accommodations];
      updatedAccommodations[index] = {
        ...updatedAccommodations[index],
        [field]: value
      };
      return {
        ...prev,
        accommodations: updatedAccommodations
      };
    });
  };

  const removeAccommodation = (index: number) => {
    setWeddingDetails(prev => {
      const updatedAccommodations = [...prev.accommodations];
      updatedAccommodations.splice(index, 1);
      return {
        ...prev,
        accommodations: updatedAccommodations
      };
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Informations générales</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="site-title">Titre du site</Label>
            <Input
              id="site-title"
              value={weddingDetails.title}
              onChange={(e) => setWeddingDetails(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Notre Mariage"
            />
          </div>
          
          <div>
            <Label htmlFor="wedding-date">Date du mariage</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="wedding-date"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !weddingDetails.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {weddingDetails.date ? (
                    format(weddingDetails.date, "PPP", { locale: fr })
                  ) : (
                    <span>Sélectionner une date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={weddingDetails.date}
                  onSelect={handleDateChange}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
          <div>
            <Label htmlFor="partner1">Prénom du premier partenaire</Label>
            <Input
              id="partner1"
              value={weddingDetails.coupleNames.partner1}
              onChange={(e) => handlePartnerNameChange('partner1', e.target.value)}
              placeholder="Prénom"
            />
          </div>
          
          <div>
            <Label htmlFor="partner2">Prénom du second partenaire</Label>
            <Input
              id="partner2"
              value={weddingDetails.coupleNames.partner2}
              onChange={(e) => handlePartnerNameChange('partner2', e.target.value)}
              placeholder="Prénom"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="story">Votre histoire</Label>
          <Textarea
            id="story"
            value={weddingDetails.story || ""}
            onChange={(e) => setWeddingDetails(prev => ({ ...prev, story: e.target.value }))}
            placeholder="Racontez votre histoire..."
            className="min-h-[100px]"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Lieux</h3>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-500" />
              Cérémonie
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="ceremony-name">Nom du lieu</Label>
              <Input
                id="ceremony-name"
                value={weddingDetails.locations.ceremony?.name || ""}
                onChange={(e) => handleLocationChange('ceremony', 'name', e.target.value)}
                placeholder="Église, Mairie, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="ceremony-address">Adresse</Label>
              <Input
                id="ceremony-address"
                value={weddingDetails.locations.ceremony?.address || ""}
                onChange={(e) => handleLocationChange('ceremony', 'address', e.target.value)}
                placeholder="1 Rue de l'Église, 75001 Paris"
              />
            </div>
            
            <div>
              <Label htmlFor="ceremony-time">Heure</Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="ceremony-time"
                  value={weddingDetails.locations.ceremony?.time || ""}
                  onChange={(e) => handleLocationChange('ceremony', 'time', e.target.value)}
                  placeholder="14:00"
                />
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="ceremony-maps">Lien Google Maps (optionnel)</Label>
              <Input
                id="ceremony-maps"
                value={weddingDetails.locations.ceremony?.googleMapsUrl || ""}
                onChange={(e) => handleLocationChange('ceremony', 'googleMapsUrl', e.target.value)}
                placeholder="https://goo.gl/maps/..."
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-500" />
              Réception
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label htmlFor="reception-name">Nom du lieu</Label>
              <Input
                id="reception-name"
                value={weddingDetails.locations.reception?.name || ""}
                onChange={(e) => handleLocationChange('reception', 'name', e.target.value)}
                placeholder="Château, Domaine, etc."
              />
            </div>
            
            <div>
              <Label htmlFor="reception-address">Adresse</Label>
              <Input
                id="reception-address"
                value={weddingDetails.locations.reception?.address || ""}
                onChange={(e) => handleLocationChange('reception', 'address', e.target.value)}
                placeholder="15 Avenue du Parc, 75001 Paris"
              />
            </div>
            
            <div>
              <Label htmlFor="reception-time">Heure</Label>
              <div className="flex w-full items-center space-x-2">
                <Input
                  id="reception-time"
                  value={weddingDetails.locations.reception?.time || ""}
                  onChange={(e) => handleLocationChange('reception', 'time', e.target.value)}
                  placeholder="16:00"
                />
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div>
              <Label htmlFor="reception-maps">Lien Google Maps (optionnel)</Label>
              <Input
                id="reception-maps"
                value={weddingDetails.locations.reception?.googleMapsUrl || ""}
                onChange={(e) => handleLocationChange('reception', 'googleMapsUrl', e.target.value)}
                placeholder="https://goo.gl/maps/..."
              />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Hébergements</h3>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addAccommodation}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" /> Ajouter
          </Button>
        </div>
        
        {weddingDetails.accommodations.length === 0 ? (
          <div className="text-center p-6 border border-dashed rounded-md text-muted-foreground">
            Ajoutez des hébergements pour vos invités
          </div>
        ) : (
          <div className="space-y-4">
            {weddingDetails.accommodations.map((accommodation, index) => (
              <Card key={index}>
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <CardTitle className="text-base">
                    {accommodation.name || `Hébergement ${index + 1}`}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeAccommodation(index)}
                    className="h-8 w-8 p-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label>Nom</Label>
                    <Input
                      value={accommodation.name}
                      onChange={(e) => updateAccommodation(index, 'name', e.target.value)}
                      placeholder="Hôtel, Gîte, etc."
                    />
                  </div>
                  
                  <div>
                    <Label>Adresse</Label>
                    <Input
                      value={accommodation.address}
                      onChange={(e) => updateAccommodation(index, 'address', e.target.value)}
                      placeholder="25 Rue des Fleurs, 75001 Paris"
                    />
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={accommodation.description}
                      onChange={(e) => updateAccommodation(index, 'description', e.target.value)}
                      placeholder="Informations sur l'hébergement..."
                      className="min-h-[60px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <Label>Fourchette de prix</Label>
                      <Input
                        value={accommodation.priceRange || ""}
                        onChange={(e) => updateAccommodation(index, 'priceRange', e.target.value)}
                        placeholder="ex: 80-120€ / nuit"
                      />
                    </div>
                    
                    <div>
                      <Label>Distance du lieu</Label>
                      <Input
                        value={accommodation.distanceToVenue || ""}
                        onChange={(e) => updateAccommodation(index, 'distanceToVenue', e.target.value)}
                        placeholder="ex: 5 km / 10 min"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Autres informations</h3>
        
        <div>
          <Label htmlFor="dress-code">Code vestimentaire</Label>
          <Input
            id="dress-code"
            value={weddingDetails.dressCode || ""}
            onChange={(e) => setWeddingDetails(prev => ({ ...prev, dressCode: e.target.value }))}
            placeholder="Tenue de cocktail, Chic décontracté, etc."
          />
        </div>
        
        <div>
          <Label htmlFor="contact-email">Email de contact</Label>
          <Input
            id="contact-email"
            type="email"
            value={weddingDetails.contactEmail || ""}
            onChange={(e) => setWeddingDetails(prev => ({ ...prev, contactEmail: e.target.value }))}
            placeholder="email@exemple.com"
          />
        </div>
        
        <div>
          <Label htmlFor="rsvp-deadline">Date limite de RSVP</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="rsvp-deadline"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !weddingDetails.rsvpDeadline && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {weddingDetails.rsvpDeadline ? (
                  format(weddingDetails.rsvpDeadline, "PPP", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={weddingDetails.rsvpDeadline}
                onSelect={(date) => date && setWeddingDetails(prev => ({ ...prev, rsvpDeadline: date }))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default MiniSiteDetailsForm;
