
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CircleAlert, CircleHelp, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VendorItem {
  id: string;
  name: string;
  category: string;
  status: "pending" | "confirmed" | "paid";
  notes?: string;
}

const VendorChecklist = () => {
  const [vendors, setVendors] = useState<VendorItem[]>([
    { id: "v1", name: "Domaine des Roses", category: "Lieu", status: "confirmed" },
    { id: "v2", name: "Traiteur Deluxe", category: "Traiteur", status: "confirmed" },
    { id: "v3", name: "Fleurs & Merveilles", category: "Fleuriste", status: "pending" },
    { id: "v4", name: "DJ Platine", category: "Musique", status: "pending" },
    { id: "v5", name: "Studio Lumière", category: "Photographe", status: "paid" },
  ]);

  const [newVendor, setNewVendor] = useState<Partial<VendorItem>>({
    name: "",
    category: "",
    status: "pending"
  });

  const [dialogOpen, setDialogOpen] = useState(false);

  const addVendor = () => {
    if (newVendor.name && newVendor.category) {
      setVendors([
        ...vendors,
        {
          id: `v${Date.now()}`,
          name: newVendor.name,
          category: newVendor.category,
          status: newVendor.status as "pending" | "confirmed" | "paid",
          notes: newVendor.notes
        }
      ]);
      setNewVendor({ name: "", category: "", status: "pending" });
      setDialogOpen(false);
    }
  };

  const updateVendorStatus = (id: string, status: "pending" | "confirmed" | "paid") => {
    setVendors(vendors.map(vendor => 
      vendor.id === id ? { ...vendor, status } : vendor
    ));
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-blue-500">Confirmé</Badge>;
      case "paid":
        return <Badge className="bg-green-500">Payé</Badge>;
      default:
        return <Badge variant="outline">En attente</Badge>;
    }
  };

  const getProgress = () => {
    const confirmed = vendors.filter(v => v.status === "confirmed" || v.status === "paid").length;
    const total = vendors.length;
    const percentage = total > 0 ? Math.floor((confirmed / total) * 100) : 0;
    
    return {
      confirmed,
      total,
      percentage
    };
  };

  const progress = getProgress();

  const categories = [
    "Lieu", "Traiteur", "Photographe", "Vidéaste", "Fleuriste", 
    "Musique", "Animation", "Décoration", "Transport", "Robe/Costume",
    "Maquillage", "Coiffure", "Gâteau", "Faire-part", "Autre"
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Prestataires</CardTitle>
            <CardDescription>Suivez vos prestataires pour votre événement</CardDescription>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" /> Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un prestataire</DialogTitle>
                <DialogDescription>
                  Ajoutez un nouveau prestataire à votre liste pour suivre son statut.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vendor-name" className="text-right">
                    Nom
                  </Label>
                  <Input
                    id="vendor-name"
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vendor-category" className="text-right">
                    Catégorie
                  </Label>
                  <Select 
                    value={newVendor.category} 
                    onValueChange={(value) => setNewVendor({...newVendor, category: value})}
                  >
                    <SelectTrigger id="vendor-category" className="col-span-3">
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vendor-status" className="text-right">
                    Statut
                  </Label>
                  <Select 
                    value={newVendor.status} 
                    onValueChange={(value: any) => setNewVendor({...newVendor, status: value})}
                  >
                    <SelectTrigger id="vendor-status" className="col-span-3">
                      <SelectValue placeholder="Sélectionner un statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">En attente</SelectItem>
                      <SelectItem value="confirmed">Confirmé</SelectItem>
                      <SelectItem value="paid">Payé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="vendor-notes" className="text-right">
                    Notes
                  </Label>
                  <Input
                    id="vendor-notes"
                    value={newVendor.notes || ""}
                    onChange={(e) => setNewVendor({...newVendor, notes: e.target.value})}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDialogOpen(false)}>Annuler</Button>
                <Button onClick={addVendor}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Progression: {progress.confirmed}/{progress.total} confirmés</span>
            <span className="text-sm">{progress.percentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full" 
              style={{ width: `${progress.percentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid gap-3">
          {vendors.map(vendor => (
            <div 
              key={vendor.id} 
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  {vendor.status === "paid" ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : vendor.status === "confirmed" ? (
                    <CheckCircle2 className="h-5 w-5 text-blue-500" />
                  ) : (
                    <CircleHelp className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{vendor.name}</p>
                  <p className="text-xs text-muted-foreground">{vendor.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(vendor.status)}
                <Select 
                  value={vendor.status} 
                  onValueChange={(value: any) => updateVendorStatus(vendor.id, value)}
                >
                  <SelectTrigger className="h-8 w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmé</SelectItem>
                    <SelectItem value="paid">Payé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          {vendors.length === 0 && (
            <div className="text-center py-6">
              <CircleAlert className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="font-medium">Aucun prestataire</p>
              <p className="text-sm text-muted-foreground mt-1">
                Ajoutez des prestataires pour suivre leur statut
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VendorChecklist;
