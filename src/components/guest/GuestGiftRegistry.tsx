
import React from 'react';
import { Gift, Heart, CreditCard } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
  title: string;
}

interface GuestGiftRegistryProps {
  event: Event;
}

const GuestGiftRegistry: React.FC<GuestGiftRegistryProps> = ({ event }) => {
  const gifts = [
    { 
      id: '1', 
      name: 'Service à vaisselle', 
      price: 249, 
      image: 'https://images.unsplash.com/photo-1517222567310-0c0a7d42b69e?w=500&auto=format&fit=crop&q=60',
      reserved: true 
    },
    { 
      id: '2', 
      name: 'Robot de cuisine', 
      price: 399, 
      image: 'https://images.unsplash.com/photo-1586495985096-787929ae8c3c?w=500&auto=format&fit=crop&q=60',
      reserved: false 
    },
    { 
      id: '3', 
      name: 'Voyage de noces', 
      price: 1500, 
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60',
      reserved: false 
    }
  ];
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Liste de cadeaux
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Les mariés ont préparé une liste de cadeaux pour leur nouvelle vie ensemble. 
            Vous pouvez contribuer à un cadeau ou en offrir un complet.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            {gifts.map(gift => (
              <Card key={gift.id} className="overflow-hidden">
                <div className="aspect-video w-full overflow-hidden">
                  <img 
                    src={gift.image} 
                    alt={gift.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <h4 className="font-medium">{gift.name}</h4>
                  <p className="text-muted-foreground">{gift.price} €</p>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full"
                    variant={gift.reserved ? "outline" : "default"}
                    disabled={gift.reserved}
                  >
                    {gift.reserved 
                      ? <Heart className="mr-2 h-4 w-4 text-red-500 fill-red-500" /> 
                      : <CreditCard className="mr-2 h-4 w-4" />
                    }
                    {gift.reserved ? "Déjà réservé" : "Offrir ce cadeau"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Cagnotte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Si vous préférez, vous pouvez contribuer à la cagnotte des mariés.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button variant="outline">50 €</Button>
            <Button variant="outline">100 €</Button>
            <Button variant="outline">200 €</Button>
          </div>
          <Button className="w-full mt-2">Contribuer à la cagnotte</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GuestGiftRegistry;
