
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";
import GoldButton from "@/components/GoldButton";
import { VendorBudget } from "./VendorsList";

interface AddVendorFormProps {
  showAddForm: boolean;
  onAddVendor: (vendor: Omit<VendorBudget, 'id'>) => void;
  onCancel: () => void;
}

const AddVendorForm: React.FC<AddVendorFormProps> = ({ 
  showAddForm, 
  onAddVendor, 
  onCancel 
}) => {
  const [newVendorName, setNewVendorName] = useState("");
  const [newVendorCategory, setNewVendorCategory] = useState("");
  const [newVendorBudget, setNewVendorBudget] = useState<number>(0);

  if (!showAddForm) {
    return null;
  }

  const handleAddVendor = () => {
    if (newVendorName && newVendorCategory && newVendorBudget > 0) {
      onAddVendor({
        name: newVendorName,
        category: newVendorCategory,
        budget: newVendorBudget
      });
      
      setNewVendorName("");
      setNewVendorCategory("");
      setNewVendorBudget(0);
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 border rounded-md">
      <div>
        <Label htmlFor="new-vendor-name" className="text-xs">Nom du prestataire</Label>
        <Input
          id="new-vendor-name"
          value={newVendorName}
          onChange={(e) => setNewVendorName(e.target.value)}
          placeholder="Nom"
          className="h-8 mt-1"
        />
      </div>
      <div>
        <Label htmlFor="new-vendor-category" className="text-xs">Catégorie</Label>
        <Input
          id="new-vendor-category"
          value={newVendorCategory}
          onChange={(e) => setNewVendorCategory(e.target.value)}
          placeholder="Catégorie"
          className="h-8 mt-1"
        />
      </div>
      <div>
        <Label htmlFor="new-vendor-budget" className="text-xs">Budget (€)</Label>
        <div className="relative mt-1">
          <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-vip-gray-400" />
          <Input
            id="new-vendor-budget"
            type="number"
            min="0"
            value={newVendorBudget || ''}
            onChange={(e) => setNewVendorBudget(Number(e.target.value))}
            placeholder="Montant"
            className="h-8 pl-7"
          />
        </div>
      </div>
      <div className="sm:col-span-3 flex justify-end mt-2">
        <GoldButton size="sm" onClick={handleAddVendor}>
          Ajouter
        </GoldButton>
      </div>
    </div>
  );
};

export default AddVendorForm;
