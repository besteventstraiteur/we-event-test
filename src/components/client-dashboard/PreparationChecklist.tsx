
import React from "react";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { ClipboardCheck } from "lucide-react";
import GoldButton from "@/components/GoldButton";

const PreparationChecklist = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-vip-gold flex items-center gap-2 truncate">
            <ClipboardCheck size={18} /> Checklist de préparation
          </CardTitle>
          <CardDescription className="truncate">Suivez vos tâches et celles de vos témoins</CardDescription>
        </div>
        <Link to="/client/todolist">
          <GoldButton size="sm">
            Voir tout
          </GoldButton>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {['Choisir la date et le lieu', 'Sélectionner les témoins', 'Établir la liste d\'invités'].map((task, i) => (
            <div key={i} className="flex items-center gap-2 py-2 border-b last:border-0">
              <div className="w-5 h-5 rounded-full border border-vip-gold flex items-center justify-center">
                {i === 2 && <div className="w-3 h-3 rounded-full bg-vip-gold" />}
              </div>
              <span className={`truncate ${i === 2 ? 'line-through text-gray-400' : ''}`}>{task}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PreparationChecklist;
