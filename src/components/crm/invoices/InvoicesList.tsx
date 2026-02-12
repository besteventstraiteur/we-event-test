
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, MoreHorizontal, Trash2, PlusCircle, FileText, Calendar, CreditCard, Search, Filter, Printer, Send } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Invoice {
  id: string;
  reference: string;
  clientName: string;
  totalAmount: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  issueDate: string;
  dueDate: string;
}

// Données de démo pour l'interface
const mockInvoices: Invoice[] = [];

const InvoicesList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleDelete = (id: string) => {
    setInvoices(invoices.filter(invoice => invoice.id !== id));
  };
  
  const filteredInvoices = invoices.filter(invoice => 
    invoice.reference.toLowerCase().includes(searchQuery.toLowerCase()) || 
    invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: Invoice["status"]) => {
    const statusConfig = {
      draft: { label: "Brouillon", variant: "outline" as const },
      sent: { label: "Envoyée", variant: "default" as const },
      paid: { label: "Payée", variant: "success" as const },
      overdue: { label: "En retard", variant: "destructive" as const },
      cancelled: { label: "Annulée", variant: "secondary" as const },
    };
    
    return <Badge variant={statusConfig[status].variant}>{statusConfig[status].label}</Badge>;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher une facture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
          <Button size="sm">
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouvelle facture
          </Button>
        </div>
      </div>
      
      {filteredInvoices.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d'émission</TableHead>
              <TableHead>Date d'échéance</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {invoice.reference}
                  </div>
                </TableCell>
                <TableCell>{invoice.clientName}</TableCell>
                <TableCell>{invoice.totalAmount.toLocaleString()} €</TableCell>
                <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                <TableCell>{invoice.issueDate}</TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Ouvrir le menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Send className="h-4 w-4 mr-2" />
                        Envoyer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Enregistrer un paiement
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(invoice.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="border rounded-md p-8 text-center">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune facture trouvée</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Aucune facture ne correspond à votre recherche" : "Commencez par créer votre première facture"}
          </p>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Créer une facture
          </Button>
        </div>
      )}
    </div>
  );
};

export default InvoicesList;
