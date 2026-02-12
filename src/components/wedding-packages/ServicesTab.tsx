
import React from "react";
import { WeddingPackage } from "@/models/weddingPackage";
import ServiceItem from "./ServiceItem";

interface ServicesTabProps {
  pkg: WeddingPackage;
  selectedServices: string[];
  handleServiceToggle: (serviceId: string, checked: boolean) => void;
}

const ServicesTab: React.FC<ServicesTabProps> = ({ 
  pkg, 
  selectedServices, 
  handleServiceToggle 
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pkg.services.map((service) => (
          <ServiceItem 
            key={service.id} 
            service={service} 
            isSelected={selectedServices.includes(service.id)}
            onToggle={handleServiceToggle}
            packageId={pkg.id}
          />
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;
