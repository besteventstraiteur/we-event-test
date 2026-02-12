
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock, CalendarIcon, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface EventCountdownProps {
  eventDate: Date;
  eventName: string;
  eventLocation?: string;
}

const EventCountdown: React.FC<EventCountdownProps> = ({ 
  eventDate, 
  eventName,
  eventLocation 
}) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft());
  
  // Calculer le temps restant
  function calculateTimeLeft() {
    const difference = eventDate.getTime() - new Date().getTime();
    
    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }
    
    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
      isPast: false,
      total: difference
    };
  }

  // Calculer le pourcentage de temps écoulé (pour la barre de progression)
  const calculateProgress = () => {
    const now = new Date().getTime();
    const creationDate = new Date();
    creationDate.setMonth(creationDate.getMonth() - 3); // Simuler une date de création à 3 mois dans le passé
    
    const totalDuration = eventDate.getTime() - creationDate.getTime();
    const elapsed = now - creationDate.getTime();
    
    return Math.min(Math.floor((elapsed / totalDuration) * 100), 100);
  };
  
  const [progress, setProgress] = useState(calculateProgress);
  
  // Mettre à jour le temps restant toutes les secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
      setProgress(calculateProgress());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{eventName}</CardTitle>
            <CardDescription>{eventLocation}</CardDescription>
          </div>
          <CalendarIcon className="h-5 w-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-3">
          <CalendarClock className="h-4.5 w-4.5 text-muted-foreground mr-2" />
          <span className="text-sm text-muted-foreground">{formatDate(eventDate)}</span>
        </div>
        
        {timeLeft.isPast ? (
          <div className="text-center py-2">
            <p className="font-semibold text-lg">Événement terminé</p>
            <p className="text-sm text-muted-foreground">Nous espérons que vous avez passé un moment inoubliable !</p>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Préparatifs</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <p className="text-sm mb-3 text-muted-foreground flex items-center">
              <Clock className="h-4 w-4 mr-1 animate-pulse text-vip-gold" />
              Temps restant avant votre événement :
            </p>
            
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-gray-50 rounded-md p-2 relative overflow-hidden group hover:bg-gray-100 transition-colors">
                <div className="text-xl font-bold relative z-10 group-hover:scale-110 transition-transform">{timeLeft.days}</div>
                <div className="text-xs text-muted-foreground relative z-10">Jours</div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-vip-gold transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
              <div className="bg-gray-50 rounded-md p-2 relative overflow-hidden group hover:bg-gray-100 transition-colors">
                <div className="text-xl font-bold relative z-10 group-hover:scale-110 transition-transform">{timeLeft.hours}</div>
                <div className="text-xs text-muted-foreground relative z-10">Heures</div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-vip-gold transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
              <div className="bg-gray-50 rounded-md p-2 relative overflow-hidden group hover:bg-gray-100 transition-colors">
                <div className="text-xl font-bold relative z-10 group-hover:scale-110 transition-transform animate-pulse">{timeLeft.minutes}</div>
                <div className="text-xs text-muted-foreground relative z-10">Minutes</div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-vip-gold transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
              <div className="bg-gray-50 rounded-md p-2 relative overflow-hidden group hover:bg-gray-100 transition-colors">
                <div className="text-xl font-bold relative z-10 group-hover:scale-110 transition-transform animate-pulse">{timeLeft.seconds}</div>
                <div className="text-xs text-muted-foreground relative z-10">Secondes</div>
                <div className="absolute bottom-0 left-0 w-full h-1 bg-vip-gold transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventCountdown;
