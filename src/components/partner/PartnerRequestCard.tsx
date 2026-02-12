
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, X, Calendar, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export interface PartnerRequestProps {
  id: string;
  clientName: string;
  date: string;
  message: string;
  status: "pending" | "accepted" | "rejected";
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
}

const PartnerRequestCard: React.FC<PartnerRequestProps> = ({
  id,
  clientName,
  date,
  message,
  status,
  onAccept,
  onReject
}) => {
  const { toast } = useToast();

  const handleAccept = () => {
    if (onAccept) {
      onAccept(id);
    } else {
      toast({
        title: "Demande acceptée",
        description: `Vous avez accepté la demande de ${clientName}`,
      });
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject(id);
    } else {
      toast({
        title: "Demande rejetée",
        description: `Vous avez rejeté la demande de ${clientName}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white border-gray-200 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-900">Demande de {clientName}</h3>
              {status === "pending" && (
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">
                  En attente
                </Badge>
              )}
              {status === "accepted" && (
                <Badge variant="success">
                  Acceptée
                </Badge>
              )}
              {status === "rejected" && (
                <Badge variant="destructive">
                  Rejetée
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
              <Calendar size={14} className="flex-shrink-0" />
              <span>{date}</span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-gray-300"></span>
              <User size={14} className="flex-shrink-0" />
              <span>{clientName}</span>
            </div>
          </div>
        </div>
        
        <p className="mt-3 text-gray-600 text-sm">{message}</p>
        
        {status === "pending" && (
          <div className="mt-4 flex justify-end gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="border-red-200 text-red-700 hover:bg-red-50"
              onClick={handleReject}
            >
              <X size={16} className="mr-1" /> Refuser
            </Button>
            <Button 
              size="sm" 
              className="bg-green-600 hover:bg-green-700"
              onClick={handleAccept}
            >
              <Check size={16} className="mr-1" /> Accepter
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PartnerRequestCard;
