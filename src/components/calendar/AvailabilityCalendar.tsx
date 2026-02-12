
import React from "react";
import { Calendar } from "@/components/ui/calendar";
import { AvailabilityDate } from "@/models/partnerAvailability";
import { parse } from "date-fns";
import CalendarLegend from "./CalendarLegend";

interface AvailabilityCalendarProps {
  availability: AvailabilityDate[];
  selectedDate: Date | undefined;
  onDateSelect: (date: Date | undefined) => void;
  getDateAvailability: (date: Date) => string | undefined;
}

const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  availability,
  selectedDate,
  onDateSelect,
  getDateAvailability,
}) => {
  // Convert availability dates to Date objects
  const availabilityDates = availability.map(a => parse(a.date, "yyyy-MM-dd", new Date()));

  return (
    <>
      <div className="flex justify-center">
        <Calendar 
          mode="single"
          selected={selectedDate}
          onSelect={onDateSelect}
          className="rounded-md bg-white pointer-events-auto"
          modifiers={{
            availability: availabilityDates
          }}
          modifiersClassNames={{
            availability: "custom-availability-day"
          }}
          disabled={{ before: new Date() }}
        />
      </div>
      
      <CalendarLegend />
    </>
  );
};

export default AvailabilityCalendar;
