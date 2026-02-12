
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import GoldButton from '@/components/GoldButton';

interface TableCreationProps {
  onCreateTable: (name: string, seatCount: number) => void;
}

const TableCreation: React.FC<TableCreationProps> = ({ onCreateTable }) => {
  const [tableName, setTableName] = useState("");
  const [seatCount, setSeatCount] = useState("8");
  const { toast } = useToast();
  
  const handleCreateTable = () => {
    if (!tableName.trim()) {
      toast({
        title: "Nom requis",
        description: "Veuillez donner un nom à votre table",
        variant: "destructive"
      });
      return;
    }
    
    const count = parseInt(seatCount, 10);
    onCreateTable(tableName.trim(), count);
    
    toast({
      title: "Table créée",
      description: `La table "${tableName}" avec ${count} sièges a été créée`
    });
    
    setTableName("");
  };
  
  return (
    <Card className="bg-white border-gray-200">
      <CardHeader>
        <CardTitle>Ajouter une table</CardTitle>
        <CardDescription>Créez une nouvelle table pour votre plan de salle</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="table-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nom de la table
            </label>
            <Input
              id="table-name"
              placeholder="Ex: Table Famille"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="seat-count" className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de sièges
            </label>
            <Select value={seatCount} onValueChange={setSeatCount}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez un nombre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="4">4 sièges</SelectItem>
                <SelectItem value="6">6 sièges</SelectItem>
                <SelectItem value="8">8 sièges</SelectItem>
                <SelectItem value="10">10 sièges</SelectItem>
                <SelectItem value="12">12 sièges</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <GoldButton
            onClick={handleCreateTable}
            className="w-full"
          >
            <PlusCircle size={16} className="mr-2" />
            Créer la table
          </GoldButton>
        </div>
      </CardContent>
    </Card>
  );
};

export default TableCreation;
