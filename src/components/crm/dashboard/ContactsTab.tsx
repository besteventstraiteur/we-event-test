
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Users } from "lucide-react";
import { Link } from "react-router-dom";

interface ContactsTabProps {
  urlPrefix: string;
}

const ContactsTab: React.FC<ContactsTabProps> = ({ urlPrefix }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contacts clients</CardTitle>
        <CardDescription>
          Gérez votre liste de contacts clients et prospects
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-8 text-center">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun contact pour l'instant</h3>
          <p className="text-muted-foreground mb-4">
            Commencez à ajouter des contacts pour construire votre base clients
          </p>
          <Link 
            to={`${urlPrefix}/crm/contacts`} 
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2">
            Ajouter un contact
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactsTab;
