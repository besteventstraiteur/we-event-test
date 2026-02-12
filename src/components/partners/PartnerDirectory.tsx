
import React, { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PartnerCard from "./PartnerCard";
import { useIsMobile } from "@/hooks/use-mobile";

interface PartnerDirectoryProps {
  partners: any[];
  partnerCategories: { id: string; name: string }[];
  onContactPartner: (partner: any) => void;
}

const PartnerDirectory: React.FC<PartnerDirectoryProps> = ({
  partners,
  partnerCategories,
  onContactPartner,
}) => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  // Filtrer les prestataires en fonction de la catégorie active et de la recherche
  const filteredPartners = partners.filter((partner) => {
    const matchesCategory = activeCategory === "all" || partner.category === activeCategory;
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         partner.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-4">
      <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
        <p className="text-amber-700 font-medium text-sm">
          En tant que membre VIP, vous bénéficiez des réductions exclusives indiquées pour chaque prestataire.
        </p>
      </div>

      <div className="flex justify-between items-center">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <Input
            type="search"
            placeholder="Rechercher un prestataire..."
            className="pl-9 bg-white border-gray-200 h-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <div className="overflow-x-auto -mx-2 px-2">
          <TabsList className="bg-white border border-gray-200 flex w-full space-x-1 p-1">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-amber-500 data-[state=active]:text-white text-xs flex-shrink-0"
            >
              Tous
            </TabsTrigger>
            {partnerCategories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-amber-500 data-[state=active]:text-white whitespace-nowrap text-xs flex-shrink-0"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeCategory} className="mt-4">
          <div className="grid grid-cols-1 gap-3">
            {filteredPartners.length > 0 ? (
              filteredPartners.map((partner) => (
                <PartnerCard 
                  key={partner.id}
                  partner={partner}
                  categoryName={partnerCategories.find(c => c.id === partner.category)?.name || ""}
                  onContact={onContactPartner}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Aucun prestataire ne correspond à votre recherche.</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnerDirectory;
