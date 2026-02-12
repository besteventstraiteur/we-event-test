
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerGamification } from "@/models/partnerGamification";
import { Clock, Star, Users, CheckCircle, MessageSquare, TrendingUp } from "lucide-react";

interface GamificationStatsProps {
  stats: PartnerGamification['stats'];
}

const GamificationStats = ({ stats }: GamificationStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            Temps de réponse moyen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.averageResponseTime}h</p>
          <p className="text-xs text-gray-500">Objectif: &lt; 2h</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Taux de réponse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.responseRate}%</p>
          <p className="text-xs text-gray-500">Objectif: &gt; 90%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-yellow-500" />
            Satisfaction client
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.clientSatisfaction}/5</p>
          <p className="text-xs text-gray-500">{stats.totalRatings} avis</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-purple-500" />
            Événements réalisés
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.completedEvents}</p>
          <p className="text-xs text-gray-500">Cette année</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-indigo-500" />
            Recommandations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.recommendationsGiven}</p>
          <p className="text-xs text-gray-500">Données / {stats.recommendationsReceived} reçues</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Star className="h-4 w-4 text-orange-500" />
            Note moyenne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{stats.averageRating}/5</p>
          <p className="text-xs text-gray-500">Sur {stats.totalRatings} avis</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationStats;
