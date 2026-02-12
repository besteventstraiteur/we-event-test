
import React from "react";

const CalendarLegend = () => {
  return (
    <div className="mt-6 flex flex-wrap gap-4">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-100 rounded-full mr-2"></div>
        <span>Disponible</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-blue-100 rounded-full mr-2"></div>
        <span>Provisoire</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-orange-100 rounded-full mr-2"></div>
        <span>Occupé</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-red-100 rounded-full mr-2"></div>
        <span>Indisponible</span>
      </div>
    </div>
  );
};

export default CalendarLegend;
