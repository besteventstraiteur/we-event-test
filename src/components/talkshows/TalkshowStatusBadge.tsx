
import React from 'react';
import { Badge } from "@/components/ui/badge";

interface TalkshowStatusBadgeProps {
  status: "approved" | "pending" | "rejected";
}

const TalkshowStatusBadge: React.FC<TalkshowStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case "approved":
      return (
        <Badge className="bg-green-600 text-white hover:bg-green-700">
          Approuvé
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-500 text-white hover:bg-amber-600">
          En attente
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-600 text-white hover:bg-red-700">
          Refusé
        </Badge>
      );
    default:
      return null;
  }
};

export default TalkshowStatusBadge;
