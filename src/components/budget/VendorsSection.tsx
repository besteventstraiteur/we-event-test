
import React, { useState } from "react";
import GoldButton from "@/components/GoldButton";
import VendorsList, { VendorBudget } from "./VendorsList";
import AddVendorForm from "./AddVendorForm";

interface VendorsSectionProps {
  vendors: VendorBudget[];
  onUpdateVendor: (updatedVendors: VendorBudget[]) => void;
}

const VendorsSection: React.FC<VendorsSectionProps> = ({ vendors, onUpdateVendor }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddVendor = (vendor: Omit<VendorBudget, 'id'>) => {
    const newVendor: VendorBudget = {
      id: `v${Date.now()}`,
      ...vendor
    };
    
    onUpdateVendor([...vendors, newVendor]);
    setShowAddForm(false);
  };

  const handleUpdateBudget = (id: string, budget: number) => {
    const updatedVendors = vendors.map(vendor => 
      vendor.id === id ? { ...vendor, budget } : vendor
    );
    onUpdateVendor(updatedVendors);
  };
  
  const handleRemoveVendor = (id: string) => {
    const updatedVendors = vendors.filter(vendor => vendor.id !== id);
    onUpdateVendor(updatedVendors);
  };

  return (
    <div className="space-y-3 pt-2">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Prestataires</h3>
        <GoldButton 
          variant="outline" 
          size="sm" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? "Annuler" : "Ajouter un prestataire"}
        </GoldButton>
      </div>
      
      <AddVendorForm 
        showAddForm={showAddForm} 
        onAddVendor={handleAddVendor}
        onCancel={() => setShowAddForm(false)}
      />
      
      <VendorsList 
        vendors={vendors} 
        onUpdateBudget={handleUpdateBudget} 
        onRemoveVendor={handleRemoveVendor} 
      />
    </div>
  );
};

export default VendorsSection;
