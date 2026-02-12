
import React from "react";
import { Loader2 } from "lucide-react";
import type { ServiceRequest } from "@/types/requests";
import GoldButton from "@/components/GoldButton";
import RequestCard from "./RequestCard";

interface RequestListProps {
  requests: ServiceRequest[];
  isLoading: boolean;
}

const RequestList: React.FC<RequestListProps> = ({ requests, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-vip-gold" />
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-vip-gray-400 mb-4">Vous n'avez pas encore de demandes</p>
        <GoldButton onClick={() => {
          const newTabTrigger = document.querySelector('[data-value="new"]');
          if (newTabTrigger) {
            (newTabTrigger as HTMLElement).click();
          }
        }}>
          Créer ma première demande
        </GoldButton>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map(request => (
        <RequestCard 
          key={request.id} 
          request={{
            id: Number(request.id),
            title: request.title,
            description: request.description || '',
            category: request.category,
            budget: request.budget?.toString() || '',
            deadline: request.deadline || '',
            status: request.status,
            createdAt: new Date(request.created_at).toLocaleDateString('fr-FR'),
            messages: []
          }} 
        />
      ))}
    </div>
  );
};

export default RequestList;
