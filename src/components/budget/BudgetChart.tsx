
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface ChartData {
  name: string;
  value: number;
  category: string;
}

interface BudgetChartProps {
  chartData: ChartData[];
}

const BudgetChart: React.FC<BudgetChartProps> = ({ chartData }) => {
  if (chartData.length === 0) {
    return null;
  }

  // Couleurs pour le graphique
  const COLORS = ['#F97316', '#8B5CF6', '#0EA5E9', '#22C55E', '#EAB308', '#EC4899'];

  return (
    <div className="py-4">
      <h3 className="text-sm font-medium mb-2">Répartition du Budget</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `${Number(value).toLocaleString()} €`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BudgetChart;
