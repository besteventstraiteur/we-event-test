
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import PinterbestGallery, { InspirationImage } from "@/components/pinterbest/PinterbestGallery";

interface PinterbestTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  filteredImages: InspirationImage[];
}

const PinterbestTabs: React.FC<PinterbestTabsProps> = ({ 
  activeTab, 
  setActiveTab, 
  filteredImages 
}) => {
  return (
    <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
      <div className="flex justify-between items-center mb-4">
        <TabsList>
          <TabsTrigger value="all">Tout</TabsTrigger>
          <TabsTrigger value="favorites">Favoris</TabsTrigger>
          <TabsTrigger value="wedding">Mariage</TabsTrigger>
          <TabsTrigger value="party">Réception</TabsTrigger>
        </TabsList>
        
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>
      
      <TabsContent value="all" className="mt-0">
        <PinterbestGallery images={filteredImages} />
      </TabsContent>
      
      <TabsContent value="favorites" className="mt-0">
        <PinterbestGallery images={filteredImages.filter(img => img.isSaved)} />
      </TabsContent>
      
      <TabsContent value="wedding" className="mt-0">
        <PinterbestGallery images={filteredImages.filter(img => 
          img.tags.some(tag => ["cérémonie", "mariage", "bouquet"].includes(tag))
        )} />
      </TabsContent>
      
      <TabsContent value="party" className="mt-0">
        <PinterbestGallery images={filteredImages.filter(img => 
          img.tags.some(tag => ["réception", "fête", "table"].includes(tag))
        )} />
      </TabsContent>
    </Tabs>
  );
};

export default PinterbestTabs;
