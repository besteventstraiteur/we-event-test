
import React from "react";
import { Badge } from "@/components/ui/badge";

interface OpportunityStatusBadgeProps {
  stage: 'new' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
}

const stageConfig = {
  new: { label: "Nouveau", variant: "default" as const },
  qualified: { label: "Qualifié", variant: "secondary" as const },
  proposal: { label: "Proposition", variant: "outline" as const },
  negotiation: { label: "Négociation", variant: "default" as const },
  closed_won: { label: "Gagné", variant: "success" as const },
  closed_lost: { label: "Perdu", variant: "destructive" as const },
};

const OpportunityStatusBadge = ({ stage }: OpportunityStatusBadgeProps) => {
  const config = stageConfig[stage];
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default OpportunityStatusBadge;
