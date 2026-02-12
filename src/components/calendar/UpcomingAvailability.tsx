
import React from "react";
import { AvailabilityDate, AvailabilityStatus } from "@/models/partnerAvailability";
import { format, parse } from "date-fns";

interface UpcomingAvailabilityProps {
  availability: AvailabilityDate[];
}

const UpcomingAvailability: React.FC<UpcomingAvailabilityProps> = ({ availability }) => {
  // Filter for upcoming availability dates and sort by date
  const upcomingDates = availability
    .filter(a => {
      const dateObj = parse(a.date, "yyyy-MM-dd", new Date());
      return dateObj >= new Date();
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 10);

  if (upcomingDates.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        Aucune disponibilité n'a été définie pour les dates à venir.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingDates.map((item, index) => {
        const itemDate = parse(item.date, "yyyy-MM-dd", new Date());
        return (
          <div 
            key={index} 
            className={`p-4 rounded-lg flex justify-between items-center ${
              item.status === AvailabilityStatus.AVAILABLE ? "bg-green-50" : 
              item.status === AvailabilityStatus.TENTATIVE ? "bg-blue-50" : 
              item.status === AvailabilityStatus.BUSY ? "bg-orange-50" : "bg-red-50"
            }`}
          >
            <div>
              <h3 className="font-medium">
                {format(itemDate, "dd MMMM yyyy")}
              </h3>
              {item.note && <p className="text-sm text-gray-600">{item.note}</p>}
            </div>
            <span className={`text-sm font-medium rounded-full px-2 py-1 ${
              item.status === AvailabilityStatus.AVAILABLE ? "bg-green-100 text-green-800" : 
              item.status === AvailabilityStatus.TENTATIVE ? "bg-blue-100 text-blue-800" : 
              item.status === AvailabilityStatus.BUSY ? "bg-orange-100 text-orange-800" : "bg-red-100 text-red-800"
            }`}>
              {item.status === AvailabilityStatus.AVAILABLE ? "Disponible" : 
               item.status === AvailabilityStatus.TENTATIVE ? "Provisoire" : 
               item.status === AvailabilityStatus.BUSY ? "Occupé" : "Indisponible"}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default UpcomingAvailability;
