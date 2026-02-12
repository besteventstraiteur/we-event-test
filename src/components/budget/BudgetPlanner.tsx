
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet } from "lucide-react";
import { useBudgetPlanner } from "./useBudgetPlanner";
import TotalBudgetInput from "./TotalBudgetInput";
import BudgetOverview from "./BudgetOverview";
import BudgetChart from "./BudgetChart";
import VendorsSection from "./VendorsSection";
import EmptyBudgetState from "./EmptyBudgetState";

const BudgetPlanner = () => {
  const {
    totalBudget,
    setTotalBudget,
    vendors,
    setVendors,
    allocatedBudget,
    remainingBudget,
    budgetPercentage,
    chartData
  } = useBudgetPlanner();
  
  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-vip-gold" />
          Planificateur de Budget
        </CardTitle>
        <CardDescription>
          Définissez votre budget global et répartissez-le entre vos prestataires
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TotalBudgetInput 
          totalBudget={totalBudget} 
          onBudgetChange={setTotalBudget} 
        />
        
        {totalBudget > 0 ? (
          <>
            <BudgetOverview 
              totalBudget={totalBudget}
              allocatedBudget={allocatedBudget}
              remainingBudget={remainingBudget}
              budgetPercentage={budgetPercentage}
            />
            
            {chartData.length > 0 && (
              <BudgetChart chartData={chartData} />
            )}
            
            <VendorsSection 
              vendors={vendors}
              onUpdateVendor={setVendors}
            />
          </>
        ) : (
          <EmptyBudgetState />
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetPlanner;
