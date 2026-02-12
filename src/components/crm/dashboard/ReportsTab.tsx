
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

interface ReportsTabProps {
  urlPrefix: string;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ urlPrefix }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rapports</CardTitle>
        <CardDescription>
          Consultez les rapports et statistiques de votre activité
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-8 text-center">
          <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune donnée disponible</h3>
          <p className="text-muted-foreground mb-4">
            Les rapports seront générés lorsque vous aurez des données dans votre CRM
          </p>
          <Link 
            to={`${urlPrefix}/crm/reports`}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2">
            Voir les rapports
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportsTab;
