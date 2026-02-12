
import React from "react";
import { Input } from "@/components/ui/input";
import { DollarSign } from "lucide-react";

export interface VendorBudget {
  id: string;
  name: string;
  category: string;
  budget: number;
}

interface VendorsListProps {
  vendors: VendorBudget[];
  onUpdateBudget: (id: string, budget: number) => void;
  onRemoveVendor: (id: string) => void;
}

const VendorsList: React.FC<VendorsListProps> = ({ 
  vendors, 
  onUpdateBudget, 
  onRemoveVendor 
}) => {
  return (
    <div className="space-y-2">
      {vendors.map((vendor) => (
        <div 
          key={vendor.id}
          className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
        >
          <div>
            <p className="font-medium">{vendor.name}</p>
            <p className="text-xs text-vip-gray-500">{vendor.category}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-32">
              <DollarSign className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-vip-gray-400" />
              <Input
                type="number"
                min="0"
                value={vendor.budget || ''}
                onChange={(e) => onUpdateBudget(vendor.id, Number(e.target.value))}
                className="h-8 pl-7 text-right pr-2"
              />
            </div>
            <button 
              onClick={() => onRemoveVendor(vendor.id)}
              className="text-red-500 hover:text-red-700 text-xs"
            >
              Supprimer
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VendorsList;
