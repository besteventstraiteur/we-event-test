
import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description?: string;
  type: "client" | "partner" | "admin" | "guest";
  icon?: React.ReactNode;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
  title,
  description = "Cette page est en cours de développement",
  type,
  icon = <Construction className="h-20 w-20 text-muted-foreground" />
}) => {
  return (
    <DashboardLayout type={type}>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            {icon}
            <h2 className="mt-6 text-xl font-semibold">{title}</h2>
            <p className="mt-2 text-muted-foreground max-w-md">
              {description}
            </p>
            <Button className="mt-6" variant="outline">
              Retour au tableau de bord
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default PlaceholderPage;
