
import React, { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AvailabilityStatus } from "@/models/partnerAvailability";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePartnerAvailability } from "@/hooks/usePartnerAvailability";
import { fr } from "date-fns/locale";
import { CalendarX, CalendarCheck, CalendarClock, Calendar as CalendarIcon } from "lucide-react";

interface PartnerAvailabilityCalendarProps {
  partnerId: string;
  isEditable?: boolean;
  partnerName?: string;
}

const PartnerAvailabilityCalendar: React.FC<PartnerAvailabilityCalendarProps> = ({
  partnerId,
  isEditable = false,
  partnerName = "Partenaire",
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedStatus, setSelectedStatus] = useState<AvailabilityStatus>(AvailabilityStatus.AVAILABLE);
  const { availability, updateAvailability, getDateAvailability } = usePartnerAvailability();
  
  // Function to handle date selection
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  // Function to handle status update
  const handleStatusUpdate = () => {
    if (selectedDate && isEditable) {
      updateAvailability(selectedDate, selectedStatus);
      setSelectedDate(undefined);
    }
  };
  
  // Function to determine class for date cell
  const getDateClass = (date: Date): string => {
    const status = getDateAvailability(date);
    
    if (!status) return "";
    
    switch (status) {
      case AvailabilityStatus.AVAILABLE:
        return "bg-green-100 text-green-800 font-medium";
      case AvailabilityStatus.BUSY:
        return "bg-orange-100 text-orange-800 font-medium";
      case AvailabilityStatus.UNAVAILABLE:
        return "bg-red-100 text-red-800 font-medium";
      case AvailabilityStatus.TENTATIVE:
        return "bg-blue-100 text-blue-800 font-medium";
      default:
        return "";
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">
          {isEditable ? "Définir mes disponibilités" : `Disponibilités de ${partnerName}`}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <Calendar 
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              className="rounded-md border"
              modifiers={{
                available: (date) => getDateAvailability(date) === AvailabilityStatus.AVAILABLE,
                busy: (date) => getDateAvailability(date) === AvailabilityStatus.BUSY,
                unavailable: (date) => getDateAvailability(date) === AvailabilityStatus.UNAVAILABLE,
                tentative: (date) => getDateAvailability(date) === AvailabilityStatus.TENTATIVE,
              }}
              modifiersStyles={{
                available: { backgroundColor: 'rgb(220, 252, 231)', color: 'rgb(22, 101, 52)', fontWeight: '500' },
                busy: { backgroundColor: 'rgb(254, 240, 216)', color: 'rgb(154, 52, 18)', fontWeight: '500' },
                unavailable: { backgroundColor: 'rgb(254, 226, 226)', color: 'rgb(153, 27, 27)', fontWeight: '500' },
                tentative: { backgroundColor: 'rgb(224, 242, 254)', color: 'rgb(7, 88, 153)', fontWeight: '500' },
              }}
              locale={fr}
              disabled={{ before: new Date() }}
            />
          </div>
          
          {isEditable && (
            <div className="flex-1">
              <div className="bg-gray-50 p-4 rounded-md border">
                <h3 className="font-medium mb-4">
                  {selectedDate 
                    ? `Gérer la disponibilité pour le ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`
                    : "Sélectionnez une date pour définir votre disponibilité"}
                </h3>
                
                {selectedDate && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm text-gray-500">Statut de disponibilité</label>
                      <Select 
                        value={selectedStatus} 
                        onValueChange={(value) => setSelectedStatus(value as AvailabilityStatus)}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choisir un statut" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={AvailabilityStatus.AVAILABLE}>
                            <span className="flex items-center gap-2">
                              <CalendarCheck size={16} className="text-green-600" />
                              Disponible
                            </span>
                          </SelectItem>
                          <SelectItem value={AvailabilityStatus.TENTATIVE}>
                            <span className="flex items-center gap-2">
                              <CalendarClock size={16} className="text-blue-600" />
                              Provisoire
                            </span>
                          </SelectItem>
                          <SelectItem value={AvailabilityStatus.BUSY}>
                            <span className="flex items-center gap-2">
                              <CalendarIcon size={16} className="text-orange-600" />
                              Occupé
                            </span>
                          </SelectItem>
                          <SelectItem value={AvailabilityStatus.UNAVAILABLE}>
                            <span className="flex items-center gap-2">
                              <CalendarX size={16} className="text-red-600" />
                              Indisponible
                            </span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button className="w-full" onClick={handleStatusUpdate}>
                      Enregistrer la disponibilité
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-green-100 rounded-full mr-2"></div>
            <span className="text-sm">Disponible</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-100 rounded-full mr-2"></div>
            <span className="text-sm">Provisoire</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-100 rounded-full mr-2"></div>
            <span className="text-sm">Occupé</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-100 rounded-full mr-2"></div>
            <span className="text-sm">Indisponible</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PartnerAvailabilityCalendar;
