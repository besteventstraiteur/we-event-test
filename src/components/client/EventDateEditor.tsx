
import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface EventDateEditorProps {
  currentDate: Date;
  onDateChange: (newDate: Date) => void;
  eventName?: string;
}

const EventDateEditor: React.FC<EventDateEditorProps> = ({ 
  currentDate,
  onDateChange,
  eventName = "Mon Événement"
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(currentDate);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveDate = () => {
    onDateChange(selectedDate);
    setIsEditing(false);
    toast.success("Date de l'événement mise à jour");
  };

  return (
    <Card className="shadow-sm hover:shadow transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5 text-vip-gold" />
          Date de l'événement
        </CardTitle>
        <CardDescription>
          {eventName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-1.5">
          <p className="text-sm text-muted-foreground">Date actuelle</p>
          <p className="text-xl font-semibold">
            {format(currentDate, "EEEE dd MMMM yyyy", { locale: fr })}
          </p>
        </div>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-2">Changer la date</p>
          <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? (
                  format(selectedDate, "dd MMMM yyyy", { locale: fr })
                ) : (
                  <span>Sélectionner une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSaveDate} 
          disabled={
            selectedDate.getTime() === currentDate.getTime() || 
            selectedDate < new Date()
          }
          className="w-full bg-vip-gold hover:bg-vip-gold/90 text-vip-black"
        >
          <Save className="mr-2 h-4 w-4" />
          Enregistrer la nouvelle date
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventDateEditor;
