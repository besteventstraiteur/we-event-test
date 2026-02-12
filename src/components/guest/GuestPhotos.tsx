
import React from 'react';
import { Upload, Camera } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Event {
  id: string;
}

interface GuestPhotosProps {
  event: Event;
}

const GuestPhotos: React.FC<GuestPhotosProps> = ({ event }) => {
  const photos = [
    { 
      id: '1', 
      url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=500&auto=format&fit=crop&q=60',
      author: 'Marie D.'
    },
    { 
      id: '2', 
      url: 'https://images.unsplash.com/photo-1519741347686-c1e0aadf4611?w=500&auto=format&fit=crop&q=60',
      author: 'Jean P.'
    },
    { 
      id: '3', 
      url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&auto=format&fit=crop&q=60',
      author: 'Sophie M.'
    },
    { 
      id: '4', 
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&auto=format&fit=crop&q=60',
      author: 'Thomas L.'
    }
  ];
  
  const handleFileUpload = () => {
    // In a real app, this would open a file picker and upload photos
    alert("Cette fonctionnalité serait implémentée dans une vraie application");
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Photos de l'événement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Partagez vos photos de l'événement et consultez celles des autres invités.
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
            {photos.map(photo => (
              <div key={photo.id} className="relative aspect-square overflow-hidden rounded-md">
                <img 
                  src={photo.url} 
                  alt={`Photo par ${photo.author}`} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/50 text-white text-xs">
                  {photo.author}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleFileUpload}>
            <Upload className="mr-2 h-4 w-4" />
            Ajouter des photos
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GuestPhotos;
