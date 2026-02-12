
import React, { useState } from 'react';
import VenuesList from '@/components/venues/VenuesList';
import VenuesMap from '@/components/venues/VenuesMap';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, List } from 'lucide-react';
import { Venue } from '@/types/venueTypes';

interface VenuesTabProps {
  venues: Venue[];
}

const VenuesTab: React.FC<VenuesTabProps> = ({ venues }) => {
  const [activeTab, setActiveTab] = useState<string>("map");
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  const handleVenueSelect = (venueId: string) => {
    setSelectedVenueId(venueId);
    if (activeTab !== "list") {
      // Switch to list tab to show selected venue details
      setActiveTab("list");
    }
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4 w-full bg-vip-gray-900 border-vip-gray-800">
          <TabsTrigger 
            value="map" 
            className="flex-1 data-[state=active]:bg-vip-gold data-[state=active]:text-vip-black"
          >
            <MapPin className="mr-2 h-4 w-4" />
            Carte
          </TabsTrigger>
          <TabsTrigger 
            value="list" 
            className="flex-1 data-[state=active]:bg-vip-gold data-[state=active]:text-vip-black"
          >
            <List className="mr-2 h-4 w-4" />
            Liste
          </TabsTrigger>
        </TabsList>

        <TabsContent value="map" className="mt-0">
          <VenuesMap venues={venues} onVenueSelect={handleVenueSelect} />
        </TabsContent>

        <TabsContent value="list" className="mt-0">
          <VenuesList venues={venues} selectedVenueId={selectedVenueId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VenuesTab;
