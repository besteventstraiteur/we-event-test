
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PackagesList from "./PackagesList";
import PackageComparisonTable from "./PackageComparisonTable";
import PackageFilterBar from "./PackageFilterBar";
import { ServiceType, ComparisonParams, WeddingPackage } from "@/models/weddingPackage";
import { mockWeddingPackages } from "./mockPackagesData";
import { CartProvider } from "@/contexts/CartContext";
import CartSummary from "./CartSummary";

const WeddingPackagesMarketplace = () => {
  const [packages, setPackages] = useState<WeddingPackage[]>(mockWeddingPackages);
  const [filterParams, setFilterParams] = useState<ComparisonParams>({
    price: 'asc',
    services: []
  });
  
  const handleFilterChange = (newParams: Partial<ComparisonParams>) => {
    setFilterParams(prev => ({ ...prev, ...newParams }));
  };
  
  // Filtrer et trier les packages en fonction des paramètres
  const filteredPackages = packages.filter(pkg => {
    // Si aucun service n'est sélectionné dans le filtre, montrer tous les packages
    if (filterParams.services.length === 0) return true;
    
    // Vérifier que le package contient tous les services demandés
    return filterParams.services.every(serviceType => 
      pkg.services.some(service => service.type === serviceType)
    );
  }).sort((a, b) => {
    if (filterParams.price === 'asc') {
      return a.totalPrice - b.totalPrice;
    } else {
      return b.totalPrice - a.totalPrice;
    }
  });

  return (
    <CartProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Marketplace</h1>
            <p className="text-vip-gray-400">Découvrez nos formules groupées pour simplifier l'organisation de votre mariage</p>
          </div>
          <CartSummary />
        </div>
        
        <PackageFilterBar 
          onFilterChange={handleFilterChange} 
          currentFilters={filterParams} 
        />
        
        <Tabs defaultValue="grid" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="grid">Vignettes</TabsTrigger>
            <TabsTrigger value="comparison">Tableau comparatif</TabsTrigger>
          </TabsList>
          
          <TabsContent value="grid" className="mt-0">
            <PackagesList packages={filteredPackages} />
          </TabsContent>
          
          <TabsContent value="comparison" className="mt-0">
            <PackageComparisonTable packages={filteredPackages} />
          </TabsContent>
        </Tabs>
      </div>
    </CartProvider>
  );
};

export default WeddingPackagesMarketplace;
