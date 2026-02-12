
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Bell, Mail } from "lucide-react";

const CrmNotificationsSection: React.FC = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Rappels récents</CardTitle>
          <CardDescription>
            Vos derniers rappels et notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-8 text-center">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun rappel pour l'instant</h3>
            <p className="text-muted-foreground">
              Les rappels apparaîtront ici lorsque vous en créerez
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Emails récents</CardTitle>
          <CardDescription>
            Vos derniers emails envoyés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-8 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun email pour l'instant</h3>
            <p className="text-muted-foreground">
              Les emails envoyés apparaîtront ici
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrmNotificationsSection;
