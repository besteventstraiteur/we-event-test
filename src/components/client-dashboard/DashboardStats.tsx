
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Users, Bell, Headphones, Clock } from "lucide-react";

const DashboardStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-vip-gold flex items-center gap-2 truncate">
            <Users size={18} /> Partenaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold truncate">23</p>
          <p className="text-sm text-muted-foreground truncate">Partenaires VIP disponibles</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-vip-gold flex items-center gap-2 truncate">
            <Bell size={18} /> Demandes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold truncate">3</p>
          <p className="text-sm text-muted-foreground truncate">Demandes en cours</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-vip-gold flex items-center gap-2 truncate">
            <Headphones size={18} /> Podcasts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold truncate">12</p>
          <p className="text-sm text-muted-foreground truncate">Nouveaux contenus exclusifs</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-vip-gold flex items-center gap-2 truncate">
            <Clock size={18} /> Compte
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold truncate">Illimité</p>
          <p className="text-sm text-muted-foreground truncate">Durée d'accès</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
