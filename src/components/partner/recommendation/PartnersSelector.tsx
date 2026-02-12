
import React from "react";
import { Check, ChevronsUpDown, UserPlus, X } from "lucide-react";
import { FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { categories, CategoryType, RecommendationFormValues } from "./types";
import { usePartnerSelection } from "./usePartnerSelection";

interface PartnersSelectorProps {
  form: UseFormReturn<RecommendationFormValues>;
}

const PartnersSelector: React.FC<PartnersSelectorProps> = ({ form }) => {
  const { 
    selectedCategory,
    selectedPartners,
    selectAll,
    onSelectCategory,
    toggleSelectAll,
    togglePartner,
    getPartnerName,
    removePartner
  } = usePartnerSelection(form);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Prestataires</h2>
      
      <FormField
        control={form.control}
        name="partners"
        render={() => (
          <FormItem className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <FormLabel>Catégorie de prestataires</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-full justify-between"
                    >
                      {selectedCategory
                        ? categories.find((category) => category.value === selectedCategory)?.label
                        : "Sélectionner une catégorie"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Rechercher une catégorie..." />
                      <CommandEmpty>Aucune catégorie trouvée.</CommandEmpty>
                      <CommandGroup>
                        {categories.map((category) => (
                          <CommandItem
                            key={category.value}
                            value={category.value}
                            onSelect={() => onSelectCategory(category.value)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedCategory === category.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {category.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              
              {selectedCategory && (
                <div>
                  <div className="flex items-center justify-between">
                    <FormLabel>Prestataires</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={toggleSelectAll}
                      className="text-xs h-8"
                    >
                      {selectAll ? "Désélectionner tout" : "Sélectionner tout"}
                    </Button>
                  </div>
                  <div className="border rounded-md p-3 mt-1.5 h-[180px] overflow-y-auto">
                    {categories
                      .find(c => c.value === selectedCategory)
                      ?.partners.map(partner => (
                        <div key={partner.id} className="flex items-center space-x-2 py-1">
                          <input
                            type="checkbox"
                            id={partner.id}
                            checked={selectedPartners.includes(partner.id)}
                            onChange={() => togglePartner(partner.id)}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label htmlFor={partner.id} className="text-sm flex-1 cursor-pointer">
                            {partner.name}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Prestataires sélectionnés</div>
              <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                {selectedPartners.length === 0 ? (
                  <div className="text-sm text-gray-500 flex items-center">
                    <UserPlus size={14} className="mr-1" /> Sélectionnez des prestataires
                  </div>
                ) : (
                  selectedPartners.map(partnerId => (
                    <Badge key={partnerId} variant="secondary" className="flex items-center gap-1">
                      {getPartnerName(partnerId)}
                      <button
                        type="button"
                        onClick={() => removePartner(partnerId)}
                        className="hover:text-red-500 focus:outline-none"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>
            
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default PartnersSelector;
