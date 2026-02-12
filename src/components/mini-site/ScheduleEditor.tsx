
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { WeddingDetails, ScheduleItem } from "@/types/miniSiteTypes";
import { PlusCircle, Clock, AlignLeft, X, Calendar, Music, Utensils, Camera, Heart, Gift, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { v4 as uuidv4 } from "uuid";

interface ScheduleEditorProps {
  weddingDetails: WeddingDetails;
  setWeddingDetails: React.Dispatch<React.SetStateAction<WeddingDetails>>;
}

const iconOptions = [
  { value: "clock", label: "Horloge", icon: <Clock className="h-4 w-4" /> },
  { value: "calendar", label: "Calendrier", icon: <Calendar className="h-4 w-4" /> },
  { value: "music", label: "Musique", icon: <Music className="h-4 w-4" /> },
  { value: "utensils", label: "Repas", icon: <Utensils className="h-4 w-4" /> },
  { value: "camera", label: "Photos", icon: <Camera className="h-4 w-4" /> },
  { value: "heart", label: "Cœur", icon: <Heart className="h-4 w-4" /> },
  { value: "gift", label: "Cadeau", icon: <Gift className="h-4 w-4" /> },
  { value: "map-pin", label: "Lieu", icon: <MapPin className="h-4 w-4" /> },
];

const ScheduleEditor: React.FC<ScheduleEditorProps> = ({
  weddingDetails,
  setWeddingDetails
}) => {
  const [newItem, setNewItem] = useState<Partial<ScheduleItem>>({
    time: "",
    title: "",
    description: "",
    icon: "clock"
  });

  const addScheduleItem = () => {
    if (!newItem.time || !newItem.title) return;
    
    const item: ScheduleItem = {
      id: uuidv4(),
      time: newItem.time,
      title: newItem.title,
      description: newItem.description,
      icon: newItem.icon
    };
    
    setWeddingDetails(prev => ({
      ...prev,
      schedule: [...(prev.schedule || []), item]
    }));
    
    // Reset form
    setNewItem({
      time: "",
      title: "",
      description: "",
      icon: "clock"
    });
  };

  const removeScheduleItem = (id: string) => {
    setWeddingDetails(prev => ({
      ...prev,
      schedule: (prev.schedule || []).filter(item => item.id !== id)
    }));
  };

  const updateScheduleOrder = (items: ScheduleItem[]) => {
    setWeddingDetails(prev => ({
      ...prev,
      schedule: items
    }));
  };

  const renderIconComponent = (iconName?: string) => {
    switch (iconName) {
      case "clock": return <Clock className="h-4 w-4" />;
      case "calendar": return <Calendar className="h-4 w-4" />;
      case "music": return <Music className="h-4 w-4" />;
      case "utensils": return <Utensils className="h-4 w-4" />;
      case "camera": return <Camera className="h-4 w-4" />;
      case "heart": return <Heart className="h-4 w-4" />;
      case "gift": return <Gift className="h-4 w-4" />;
      case "map-pin": return <MapPin className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  // Sort schedule items by time
  const sortedSchedule = [...(weddingDetails.schedule || [])].sort((a, b) => {
    const timeA = a.time.replace(':', '').padEnd(4, '0');
    const timeB = b.time.replace(':', '').padEnd(4, '0');
    return timeA.localeCompare(timeB);
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-6">
        <h3 className="text-lg font-medium">Programme de la journée</h3>
        
        {sortedSchedule.length > 0 ? (
          <Card>
            <CardContent className="p-4">
              <ul className="space-y-4">
                {sortedSchedule.map((item, index) => (
                  <li key={item.id} className="flex items-start gap-3 p-3 border rounded-md bg-background/50">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      {renderIconComponent(item.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">{item.time} - {item.title}</p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeScheduleItem(item.id)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center p-6 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground mb-2">Aucun événement dans le programme</p>
            <p className="text-sm text-muted-foreground">Ajoutez des événements avec le formulaire ci-dessous</p>
          </div>
        )}
        
        <Card className="mt-6">
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium">Ajouter un événement</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-time">Heure</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={newItem.time}
                  onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                  placeholder="14:00"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-icon">Icône</Label>
                <Select 
                  value={newItem.icon} 
                  onValueChange={(value) => setNewItem({ ...newItem, icon: value })}
                >
                  <SelectTrigger id="event-icon" className="w-full">
                    <SelectValue placeholder="Choisir une icône" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          <span>{option.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-title">Titre de l'événement</Label>
              <Input
                id="event-title"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Cérémonie, Cocktail, Dîner..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-description">Description (optionnelle)</Label>
              <Textarea
                id="event-description"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                placeholder="Ajoutez des détails sur cet événement..."
                rows={3}
              />
            </div>
            
            <Button 
              onClick={addScheduleItem} 
              className="w-full"
              disabled={!newItem.time || !newItem.title}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Ajouter au programme
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ScheduleEditor;
