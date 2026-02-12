
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface QuotesInvoicesTabProps {
  urlPrefix: string;
}

const QuotesInvoicesTab: React.FC<QuotesInvoicesTabProps> = ({ urlPrefix }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Devis et Factures</CardTitle>
        <CardDescription>
          Gérez vos documents commerciaux
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun document pour l'instant</h3>
          <p className="text-muted-foreground mb-4">
            Commencez à créer des devis et factures pour vos clients
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Link 
              to={`${urlPrefix}/crm/quotes`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2">
              Créer un devis
            </Link>
            <Link 
              to={`${urlPrefix}/crm/invoices`}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/90 px-4 py-2">
              Créer une facture
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuotesInvoicesTab;
