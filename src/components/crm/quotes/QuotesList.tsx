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
import { Edit, MoreHorizontal, Trash2, PlusCircle, FileText, Calendar, User, Search, Filter, FileUp, Printer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import QuoteFormDialog from "./QuoteFormDialog";
import { useToast } from "@/hooks/use-toast";

export interface Quote {
  id: string;
  reference: string;
  clientName: string;
  totalAmount: number;
  status: "draft" | "sent" | "accepted" | "rejected" | "expired";
  issueDate: string;
  expiryDate: string;
  eventDate?: Date;
}

const mockQuotes: Quote[] = [
  {
    id: "q1",
    reference: "DEVIS-2025-001",
    clientName: "Entreprise Martin",
    totalAmount: 2500,
    status: "draft",
    issueDate: "15/04/2025",
    expiryDate: "15/05/2025"
  },
  {
    id: "q2",
    reference: "DEVIS-2025-002",
    clientName: "Société Dupont",
    totalAmount: 1800,
    status: "sent",
    issueDate: "12/04/2025",
    expiryDate: "12/05/2025"
  },
  {
    id: "q3",
    reference: "DEVIS-2025-003",
    clientName: "Restaurant Le Gourmet",
    totalAmount: 3200,
    status: "accepted",
    issueDate: "10/04/2025",
    expiryDate: "10/05/2025"
  },
  {
    id: "q4",
    reference: "DEVIS-2025-004",
    clientName: "Boutique Élégance",
    totalAmount: 950,
    status: "rejected",
    issueDate: "05/04/2025",
    expiryDate: "05/05/2025"
  },
  {
    id: "q5",
    reference: "DEVIS-2025-005",
    clientName: "Café de Paris",
    totalAmount: 1500,
    status: "expired",
    issueDate: "01/03/2025",
    expiryDate: "01/04/2025"
  }
];

const QuotesList = () => {
  const [quotes, setQuotes] = useState<Quote[]>(mockQuotes);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | undefined>(undefined);
  const { toast } = useToast();
  
  const handleDelete = (id: string) => {
    setQuotes(quotes.filter(quote => quote.id !== id));
    toast({
      title: "Devis supprimé",
      description: "Le devis a été supprimé avec succès",
    });
  };

  const handleEdit = (quote: Quote) => {
    setEditingQuote(quote);
    setIsFormOpen(true);
  };

  const handleNewQuote = () => {
    setEditingQuote(undefined);
    setIsFormOpen(true);
  };
  
  const handleSaveQuote = (quoteData: Omit<Quote, "id">) => {
    if (editingQuote) {
      setQuotes(quotes.map(q => 
        q.id === editingQuote.id 
          ? { ...quoteData, id: editingQuote.id } 
          : q
      ));
      
      if (quoteData.status === "accepted") {
        createCalendarEvent({
          title: `Devis accepté - ${quoteData.reference}`,
          description: `Client: ${quoteData.clientName}\nMontant: ${quoteData.totalAmount}€`,
          date: quoteData.eventDate,
        });
      }
      
      toast({
        title: "Devis mis à jour",
        description: `Le devis ${quoteData.reference} a été mis à jour`,
      });
    } else {
      const newQuote: Quote = {
        ...quoteData,
        id: `q${quotes.length + 1}`,
      };
      setQuotes([...quotes, newQuote]);
      toast({
        title: "Devis créé",
        description: `Le devis ${newQuote.reference} a été créé avec succès`,
      });
    }
    setIsFormOpen(false);
  };
  
  const filteredQuotes = quotes.filter(quote => 
    quote.reference.toLowerCase().includes(searchQuery.toLowerCase()) || 
    quote.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const getStatusBadge = (status: Quote["status"]) => {
    const statusConfig = {
      draft: { label: "Brouillon", variant: "outline" as const },
      sent: { label: "Envoyé", variant: "default" as const },
      accepted: { label: "Accepté", variant: "success" as const },
      rejected: { label: "Refusé", variant: "destructive" as const },
      expired: { label: "Expiré", variant: "default" as const },
    };
    
    return <Badge variant={statusConfig[status].variant}>{statusConfig[status].label}</Badge>;
  };
  
  const createCalendarEvent = async (eventData: {
    title: string;
    description: string;
    date: Date;
  }) => {
    try {
          
      toast({
        title: "Événement créé",
        description: "L'événement a été ajouté à votre calendrier",
      });
    } catch (error) {
      
      toast({
        title: "Erreur",
        description: "Impossible de créer l'événement dans le calendrier",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un devis..."
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
          <Button size="sm" onClick={handleNewQuote}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Nouveau devis
          </Button>
        </div>
      </div>
      
      {filteredQuotes.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Référence</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Montant</TableHead>
              <TableHead>Statut</TableHead>
              <TableHead>Date d'émission</TableHead>
              <TableHead>Date d'expiration</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuotes.map((quote) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                    {quote.reference}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-muted-foreground" />
                    {quote.clientName}
                  </div>
                </TableCell>
                <TableCell>{quote.totalAmount.toLocaleString()} €</TableCell>
                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                <TableCell>{quote.issueDate}</TableCell>
                <TableCell>{quote.expiryDate}</TableCell>
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
                      <DropdownMenuItem onClick={() => handleEdit(quote)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Modifier
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Printer className="h-4 w-4 mr-2" />
                        Imprimer
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileUp className="h-4 w-4 mr-2" />
                        Convertir en facture
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(quote.id)}>
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
          <h3 className="text-lg font-medium mb-2">Aucun devis trouvé</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Aucun devis ne correspond à votre recherche" : "Commencez par créer votre premier devis"}
          </p>
          <Button onClick={handleNewQuote}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Créer un devis
          </Button>
        </div>
      )}

      <QuoteFormDialog 
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        quote={editingQuote}
        onSave={handleSaveQuote}
      />
    </div>
  );
};

export default QuotesList;
