
import React from "react";
import { Key } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const PasswordCard: React.FC = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Key className="h-8 w-8 text-primary" />
        <div>
          <CardTitle>Mot de passe et sécurité</CardTitle>
          <CardDescription>
            Gérez votre mot de passe et les options de récupération
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium">Changer de mot de passe</h4>
              <p className="text-sm text-muted-foreground">
                Mettez à jour régulièrement votre mot de passe pour plus de sécurité
              </p>
            </div>
            <Button variant="outline" size="sm">
              Modifier
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <div>
              <h4 className="text-sm font-medium">Email de récupération</h4>
              <p className="text-sm text-muted-foreground">
                Utilisé pour réinitialiser votre mot de passe
              </p>
            </div>
            <Button variant="outline" size="sm">
              Configurer
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PasswordCard;
