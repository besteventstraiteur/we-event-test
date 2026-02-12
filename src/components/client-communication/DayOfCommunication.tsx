
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Bell, Wifi, WifiOff, Share2, Signal } from 'lucide-react';
import TaskReminderManager from '@/components/tasks/TaskReminderManager';

// This component will be used in the client dashboard to manage day-of communications
const DayOfCommunication: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Communication Jour J</h1>
      <p className="text-vip-gray-400">
        Gérez vos communications avec les invités et prestataires pour le jour J
      </p>

      <Alert className="bg-vip-gold/10 border-vip-gold">
        <Signal className="h-4 w-4" />
        <AlertTitle>Mode basse consommation</AlertTitle>
        <AlertDescription>
          Les notifications sont optimisées pour fonctionner même avec une connexion réseau limitée. 
          Les messages sont mis en file d'attente et envoyés dès que possible.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-vip-gray-900 border-vip-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bell className="mr-2 h-4 w-4 text-vip-gray-400" />
              Rappels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-vip-gray-400">Programmés pour aujourd'hui</p>
          </CardContent>
        </Card>
        
        <Card className="bg-vip-gray-900 border-vip-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Wifi className="mr-2 h-4 w-4 text-vip-gray-400" />
              Live Streaming
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1</p>
            <p className="text-xs text-vip-gray-400">En cours actuellement</p>
          </CardContent>
        </Card>
        
        <Card className="bg-vip-gray-900 border-vip-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <WifiOff className="mr-2 h-4 w-4 text-vip-gray-400" />
              Mode hors ligne
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
              Activé
            </Badge>
            <p className="text-xs text-vip-gray-400 mt-1">Synchro automatique</p>
          </CardContent>
        </Card>
        
        <Card className="bg-vip-gray-900 border-vip-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Share2 className="mr-2 h-4 w-4 text-vip-gray-400" />
              Partages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">24</p>
            <p className="text-xs text-vip-gray-400">Photos partagées aujourd'hui</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="reminders" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="reminders">Notifications & Rappels</TabsTrigger>
          <TabsTrigger value="streaming">Live Streaming</TabsTrigger>
        </TabsList>
        
        <TabsContent value="reminders">
          <TaskReminderManager taskId="wedding-day" />
        </TabsContent>
        
        <TabsContent value="streaming">
          <Card>
            <CardHeader>
              <CardTitle>Diffusion en direct</CardTitle>
              <CardDescription>
                Créez des live streams pour partager des moments importants avec les invités qui n'ont pas pu être présents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">
                Pour configurer une diffusion en direct, veuillez vous rendre sur la page 
                <a href="/client/live-streaming" className="text-vip-gold font-medium ml-1">
                  Vidéo & Streaming en Direct
                </a>
              </p>
              <Alert>
                <WifiOff className="h-4 w-4" />
                <AlertTitle>Mode réseau faible</AlertTitle>
                <AlertDescription>
                  Le streaming sera automatiquement ajusté pour fonctionner avec une connexion limitée. 
                  La qualité vidéo sera réduite mais la diffusion restera stable.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DayOfCommunication;
