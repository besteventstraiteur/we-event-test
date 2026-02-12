
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DollarSign } from "lucide-react";

interface TotalBudgetInputProps {
  totalBudget: number;
  onBudgetChange: (budget: number) => void;
}

const TotalBudgetInput: React.FC<TotalBudgetInputProps> = ({ 
  totalBudget, 
  onBudgetChange 
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-end">
      <div className="flex-1 space-y-2">
        <Label htmlFor="total-budget">Budget Total de l'Événement</Label>
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-vip-gray-400" />
          <Input 
            id="total-budget"
            type="number" 
            min="0"
            className="pl-9"
            value={totalBudget || ''}
            onChange={(e) => onBudgetChange(Number(e.target.value))}
            placeholder="Entrez votre budget total"
          />
        </div>
      </div>
    </div>
  );
};

export default TotalBudgetInput;
