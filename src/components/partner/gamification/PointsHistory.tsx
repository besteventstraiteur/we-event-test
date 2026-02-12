
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PointsTransaction } from "@/models/partnerGamification";
import { TrendingUp, TrendingDown } from "lucide-react";

interface PointsHistoryProps {
  transactions: PointsTransaction[];
}

const PointsHistory = ({ transactions }: PointsHistoryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historique des points</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                {transaction.type === 'earned' ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <div>
                  <p className="font-medium">{transaction.reason}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
              <div className={`font-bold ${transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'}`}>
                {transaction.type === 'earned' ? '+' : '-'}{transaction.points} pts
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsHistory;
