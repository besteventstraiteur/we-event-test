
import React from "react";
import BestAwardsBadgeForm from "./BestAwardsBadgeForm";
import { Trophy, Star, Award, CheckCircle } from "lucide-react";

const BestAwardsBadgeSection = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="text-amber-500 h-5 w-5" />
            <h3 className="font-medium">Reconnaissance de qualité</h3>
          </div>
          <p className="text-amber-700 text-sm">
            Le badge We Event Awards est un symbole d'excellence reconnu par les futurs mariés.
          </p>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <Star className="text-amber-500 h-5 w-5" />
            <h3 className="font-medium">Visibilité accrue</h3>
          </div>
          <p className="text-amber-700 text-sm">
            Les prestataires labellisés apparaissent en priorité dans notre annuaire VIP.
          </p>
        </div>
        
        <div className="p-4 bg-gradient-to-br from-amber-50 to-amber-100 rounded-lg border border-amber-200">
          <div className="flex items-center gap-2 mb-3">
            <Award className="text-amber-500 h-5 w-5" />
            <h3 className="font-medium">Kit de communication</h3>
          </div>
          <p className="text-amber-700 text-sm">
            Recevez un badge digital à utiliser sur votre site web, réseaux sociaux et supports marketing.
          </p>
        </div>
      </div>

      <div className="mt-8 max-w-3xl mx-auto">
        <BestAwardsBadgeForm />
      </div>
      
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-medium mb-4 text-center">Nos lauréats 2024</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['Château des Merveilles', 'Studio Photo Elite'].map((name, i) => (
            <div key={i} className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm text-center">
              <div className="flex justify-center mb-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-amber-500">
                  <CheckCircle className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="text-sm font-medium">{name}</div>
              <div className="text-xs text-gray-500">Lauréat We Event Awards</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BestAwardsBadgeSection;
