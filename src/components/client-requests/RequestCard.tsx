import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import GoldButton from "@/components/GoldButton";
import RequestMessage from "./RequestMessage";
interface Request {
  id: number;
  title: string;
  description: string;
  category: string;
  budget: string;
  deadline: string;
  status: string;
  createdAt: string;
  messages: {
    id: number;
    sender: string;
    content: string;
    date: string;
  }[];
}
interface RequestCardProps {
  request: Request;
}
const RequestCard: React.FC<RequestCardProps> = ({
  request
}) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-amber-500">En attente</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-500">En cours</Badge>;
      case "completed":
        return <Badge className="bg-green-500">Complété</Badge>;
      case "cancelled":
        return <Badge className="bg-red-500">Annulé</Badge>;
      default:
        return <Badge>Inconnu</Badge>;
    }
  };
  return <Card className="bg-vip-gray-900 border-vip-gray-800">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-vip-white">{request.title}</CardTitle>
            <CardDescription className="text-vip-gray-400">
              Créée le {request.createdAt} • Catégorie: {request.category}
            </CardDescription>
          </div>
          {getStatusBadge(request.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-vip-gray-300 mb-4">{request.description}</p>
        <div className="flex gap-4 text-sm text-vip-gray-400">
          <span>Budget: {request.budget}€</span>
          <span>Échéance: {request.deadline}</span>
        </div>
        
        <div className="mt-6 border-t border-vip-gray-800 pt-4">
          <h4 className="text-vip-gold font-semibold mb-3">Messages ({request.messages.length})</h4>
          <div className="space-y-3">
            {request.messages.map(message => <RequestMessage key={message.id} message={message} />)}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <GoldButton variant="outline" className="w-full text-slate-50">
          Répondre
        </GoldButton>
      </CardFooter>
    </Card>;
};
export default RequestCard;