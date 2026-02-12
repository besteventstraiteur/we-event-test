
import React from "react";
import { Progress } from "@/components/ui/progress";

interface BudgetOverviewProps {
  totalBudget: number;
  allocatedBudget: number;
  remainingBudget: number;
  budgetPercentage: number;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ 
  totalBudget, 
  allocatedBudget, 
  remainingBudget, 
  budgetPercentage 
}) => {
  if (totalBudget === 0) {
    return null;
  }

  return (
    <div className="space-y-2 pt-2">
      <div className="flex justify-between text-sm">
        <span>Budget alloué: {allocatedBudget.toLocaleString()} €</span>
        <span className={remainingBudget < 0 ? "text-red-500 font-medium" : "text-green-600 font-medium"}>
          {remainingBudget >= 0 ? `Restant: ${remainingBudget.toLocaleString()} €` : `Dépassement: ${Math.abs(remainingBudget).toLocaleString()} €`}
        </span>
      </div>
      <Progress value={budgetPercentage} className="h-2" 
                color={remainingBudget < 0 ? "bg-red-500" : undefined} />
      <p className="text-xs text-vip-gray-500 text-right">{budgetPercentage}% de votre budget utilisé</p>
    </div>
  );
};

export default BudgetOverview;
