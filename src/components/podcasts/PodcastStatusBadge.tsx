
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface PodcastStatusBadgeProps {
  status: "approved" | "pending" | "rejected";
}

const PodcastStatusBadge: React.FC<PodcastStatusBadgeProps> = ({ status }) => {
  switch(status) {
    case "approved":
      return <Badge variant="success">Approuvé</Badge>;
    case "pending":
      return <Badge variant="secondary" className="bg-amber-500">En attente</Badge>;
    case "rejected":
      return <Badge variant="destructive">Refusé</Badge>;
    default:
      return <Badge>Inconnu</Badge>;
  }
};

export default PodcastStatusBadge;
