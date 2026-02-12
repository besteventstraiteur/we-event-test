
import React, { useState } from "react";
import { WeddingPackage } from "@/models/weddingPackage";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ServicesTab from "./ServicesTab";
import DescriptionTab from "./DescriptionTab";
import ReviewsTab from "./ReviewsTab";
import PackageSummary from "./PackageSummary";

interface PackageDetailProps {
  package: WeddingPackage;
}

const PackageDetail: React.FC<PackageDetailProps> = ({ package: pkg }) => {
  const [selectedServices, setSelectedServices] = useState<string[]>(
    pkg.services.filter(s => s.included).map(s => s.id)
  );
  
  const handleServiceToggle = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    }
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Tabs defaultValue="services">
            <TabsList>
              <TabsTrigger value="services">Services inclus</TabsTrigger>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Avis clients</TabsTrigger>
            </TabsList>
            
            <TabsContent value="services" className="pt-4">
              <ServicesTab 
                pkg={pkg} 
                selectedServices={selectedServices} 
                handleServiceToggle={handleServiceToggle}
              />
            </TabsContent>
            
            <TabsContent value="description" className="pt-4">
              <DescriptionTab description={pkg.description} />
            </TabsContent>
            
            <TabsContent value="reviews" className="pt-4">
              <ReviewsTab rating={pkg.rating} reviewCount={pkg.reviewCount} />
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <PackageSummary pkg={pkg} selectedServices={selectedServices} />
        </div>
      </div>
    </div>
  );
};

export default PackageDetail;
