
import React, { useState } from "react";
import { Bot, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAIFloorPlan } from "@/hooks/useAIFloorPlan";
import { Guest, Table } from "@/types/floorPlanTypes";

interface AISeatingAssistantProps {
  guests: Guest[];
  tables: Table[];
  createTable: (name: string, seatCount: number) => string;
  assignGuestToSeat: (guestId: string, tableId: string, seatId: string) => boolean;
}

const AISeatingAssistant: React.FC<AISeatingAssistantProps> = ({
  guests,
  tables,
  createTable,
  assignGuestToSeat
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const { 
    isGenerating, 
    lastSuggestion, 
    generateOptimizedSeating 
  } = useAIFloorPlan({
    guests,
    tables,
    createTable,
    assignGuestToSeat
  });

  // Calculate some stats for the AI to provide insights
  const totalGuests = guests.length;
  const assignedGuests = guests.filter(g => g.table).length;
  const unassignedGuests = totalGuests - assignedGuests;
  
  const totalSeats = tables.reduce((acc, table) => acc + table.seats.length, 0);
  const totalTables = tables.length;
  
  const hasAllergies = guests.filter(g => g.notes?.includes("allergie") || g.dietaryRestrictions).length;
  const needsWheelchairAccess = guests.filter(g => g.needsWheelchairAccess).length;

  return (
    <Card className="border-2 border-blue-100">
      <CardHeader className="bg-blue-50/50 pb-2">
        <CardTitle className="text-base flex items-center gap-2 font-medium">
          <Bot className="h-5 w-5 text-blue-500" />
          Assistant IA - Plan de Salle
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-4 space-y-4">
        <div className="text-sm space-y-1">
          <p><strong>Invités:</strong> {totalGuests} total ({assignedGuests} placés, {unassignedGuests} non placés)</p>
          <p><strong>Tables:</strong> {totalTables} tables ({totalSeats} places)</p>
          
          {(hasAllergies > 0 || needsWheelchairAccess > 0) && (
            <p className="text-amber-600">
              <strong>Attention:</strong> {hasAllergies > 0 ? `${hasAllergies} invités avec restrictions alimentaires. ` : ''}
              {needsWheelchairAccess > 0 ? `${needsWheelchairAccess} invités nécessitant un accès pour fauteuil roulant.` : ''}
            </p>
          )}
        </div>

        {lastSuggestion && (
          <Alert className="bg-blue-50/50 border-blue-200">
            <Sparkles className="h-4 w-4 text-blue-500" />
            <AlertTitle>Suggestion de l'IA</AlertTitle>
            <AlertDescription>{lastSuggestion}</AlertDescription>
          </Alert>
        )}

        {showDetails && (
          <div className="space-y-2 text-sm bg-muted/30 p-3 rounded-md">
            <p className="font-medium">Suggestions d'optimisation:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Placez les familles des mariés à proximité de la table d'honneur</li>
              <li>Les invités avec des restrictions alimentaires devraient être proches du buffet</li>
              <li>Prévoyez un accès facile aux allées pour les invités à mobilité réduite</li>
              <li>Évitez de placer des personnes en conflit connu à la même table</li>
            </ul>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between flex-wrap gap-2 border-t pt-3">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? "Masquer les détails" : "Voir les recommandations"}
        </Button>
        
        <Button
          size="sm"
          onClick={generateOptimizedSeating}
          disabled={isGenerating || totalGuests === 0 || totalTables === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Génération en cours...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Générer plan automatique
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AISeatingAssistant;
