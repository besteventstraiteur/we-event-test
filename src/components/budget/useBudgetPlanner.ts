
import { useState, useEffect } from "react";
import { VendorBudget } from "./VendorsList";

interface BudgetData {
  totalBudget: number;
  vendors: VendorBudget[];
  allocatedBudget: number;
  remainingBudget: number;
  budgetPercentage: number;
  chartData: any[];
}

export const useBudgetPlanner = () => {
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [vendors, setVendors] = useState<VendorBudget[]>([
    { id: "v1", name: "Domaine des Roses", category: "Lieu", budget: 0 },
    { id: "v2", name: "Traiteur Deluxe", category: "Traiteur", budget: 0 },
    { id: "v3", name: "Fleurs & Merveilles", category: "Fleuriste", budget: 0 },
    { id: "v4", name: "DJ Platine", category: "Musique", budget: 0 },
    { id: "v5", name: "Studio Lumière", category: "Photographe", budget: 0 },
  ]);
  
  const [allocatedBudget, setAllocatedBudget] = useState<number>(0);
  const [chartData, setChartData] = useState<any[]>([]);
  
  // Calcul du budget alloué et des données du graphique
  useEffect(() => {
    const allocated = vendors.reduce((sum, vendor) => sum + vendor.budget, 0);
    setAllocatedBudget(allocated);
    
    const data = vendors
      .filter(vendor => vendor.budget > 0)
      .map(vendor => ({
        name: vendor.name,
        value: vendor.budget,
        category: vendor.category
      }));
    setChartData(data);
  }, [vendors]);
  
  // Pourcentage du budget total utilisé
  const budgetPercentage = totalBudget > 0 
    ? Math.min(Math.round((allocatedBudget / totalBudget) * 100), 100) 
    : 0;
  
  const remainingBudget = totalBudget - allocatedBudget;

  return {
    totalBudget,
    setTotalBudget,
    vendors,
    setVendors,
    allocatedBudget,
    remainingBudget,
    budgetPercentage,
    chartData
  };
};
