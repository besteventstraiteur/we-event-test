
import React from "react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarIcon, Filter, SlidersHorizontal } from "lucide-react";
import { ComparisonParams, ServiceType } from "@/models/weddingPackage";

interface PackageFilterBarProps {
  onFilterChange: (params: Partial<ComparisonParams>) => void;
  currentFilters: ComparisonParams;
}

const PackageFilterBar: React.FC<PackageFilterBarProps> = ({ onFilterChange, currentFilters }) => {
  const serviceOptions: { value: ServiceType; label: string }[] = [
    { value: 'photography', label: 'Photographe' },
    { value: 'videography', label: 'Vidéaste' },
    { value: 'catering', label: 'Traiteur' },
    { value: 'dj', label: 'DJ / Musique' },
    { value: 'decoration', label: 'Décoration' },
    { value: 'venue', label: 'Lieu de réception' },
    { value: 'car', label: 'Voiture' },
  ];

  const handleServiceToggle = (serviceType: ServiceType, checked: boolean) => {
    if (checked) {
      onFilterChange({ 
        services: [...currentFilters.services, serviceType] 
      });
    } else {
      onFilterChange({ 
        services: currentFilters.services.filter(s => s !== serviceType) 
      });
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    onFilterChange({ date: date ? date.toISOString() : undefined });
  };

  return (
    <Card className="p-4 bg-white border-vip-gray-200">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-vip-gray-400" />
            <span className="font-medium">Filtres:</span>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 border-vip-gray-300">
                <Filter size={14} />
                Services
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[240px] p-4 bg-white border-vip-gray-200">
              <div className="space-y-4">
                <h4 className="font-medium">Services inclus</h4>
                <div className="space-y-2">
                  {serviceOptions.map((service) => (
                    <div key={service.value} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`service-${service.value}`} 
                        checked={currentFilters.services.includes(service.value)}
                        onCheckedChange={(checked) => 
                          handleServiceToggle(service.value, checked as boolean)
                        }
                      />
                      <Label htmlFor={`service-${service.value}`} className="cursor-pointer">
                        {service.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 gap-1 border-vip-gray-300">
                <CalendarIcon size={14} />
                {currentFilters.date 
                  ? format(new Date(currentFilters.date), "d MMMM yyyy", { locale: fr })
                  : "Date du mariage"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-white border-vip-gray-200">
              <Calendar
                mode="single"
                selected={currentFilters.date ? new Date(currentFilters.date) : undefined}
                onSelect={handleDateChange}
                locale={fr}
                className="border border-vip-gray-200"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-sm">Trier par prix:</span>
          <RadioGroup 
            defaultValue={currentFilters.price} 
            className="flex"
            onValueChange={(value) => onFilterChange({ price: value as 'asc' | 'desc' })}
          >
            <div className="flex items-center space-x-1">
              <RadioGroupItem value="asc" id="price-asc" />
              <Label htmlFor="price-asc" className="cursor-pointer">Croissant</Label>
            </div>
            <div className="flex items-center space-x-1 ml-4">
              <RadioGroupItem value="desc" id="price-desc" />
              <Label htmlFor="price-desc" className="cursor-pointer">Décroissant</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </Card>
  );
};

export default PackageFilterBar;
