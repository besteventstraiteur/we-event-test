
import React from "react";
import { PiggyBank } from "lucide-react";

const EmptyBudgetState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <PiggyBank className="h-12 w-12 text-vip-gray-300 mb-3" />
      <h3 className="text-lg font-medium text-vip-gray-600">Commencez votre planification budgétaire</h3>
      <p className="text-sm text-vip-gray-500 max-w-md mt-1">
        Définissez votre budget total pour visualiser la répartition de vos dépenses entre les différents prestataires
      </p>
    </div>
  );
};

export default EmptyBudgetState;
