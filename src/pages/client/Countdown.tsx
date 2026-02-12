import { useState, useEffect } from "react";
import Countdown from "../../assets/images/countdown-2.webp";

const CountdownTimer = ({ startDate, endDate }) => {
  const [status, setStatus] = useState("loading");
  const [time, setTime] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const formatDate = (iso) => {
    if (!iso) return "-";
    return new Date(iso).toLocaleString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  useEffect(() => {
    if (!startDate || !endDate) return;

    const startTime = Date.parse(startDate);
    const endTime = Date.parse(endDate);

    const updateCountdown = () => {
      const now = Date.now();

      if (now < startTime) {
        setStatus("upcoming");
        setTime({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      // After event ended
      if (now > endTime) {
        setStatus("ended");
        setTime({
          days: "00",
          hours: "00",
          minutes: "00",
          seconds: "00",
        });
        return;
      }

      setStatus("running");
      const distance = endTime - now;

      const totalSeconds = Math.floor(distance / 1000);
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = totalSeconds % 60;

      setTime({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [startDate, endDate]);

  return (
    <div
      className="flex justify-center items-center text-center text-white bg-white p-8 rounded-2xl relative overflow-hidden"
      style={{
        backgroundImage: `url(${Countdown})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/40 rounded-2xl z-0"></div>

      <div className="relative z-10 flex flex-col items-center gap-3">
        {status === "upcoming" ? (
          <>
            <h2 className="text-2xl font-semibold text-white">
              L’événement commencera le
            </h2>
            <p className="text-lg font-medium text-yellow-300">
              {formatDate(startDate)}
            </p>
          </>
        ) : status === "ended" ? (
          <h2 className="text-2xl font-semibold text-red-400">
            The event has passed!
          </h2>
        ) : status === "running" ? (
          <div className="flex justify-center items-center gap-5">
            {[
              { label: "Days", value: time.days },
              { label: "Hours", value: time.hours },
              { label: "Min", value: time.minutes },
              { label: "Sec", value: time.seconds },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="text-2xl sm:text-5xl font-semibold">:</span>
                )}
                <div className="flex flex-col items-center gap-2 sm:w-28">
                  <span className="text-2xl sm:text-5xl font-semibold">
                    {item.value}
                  </span>
                  <span className="text-xs sm:text-sm uppercase tracking-wide">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h2 className="text-lg text-gray-200">Loading...</h2>
        )}
      </div>
    </div>
  );
};

export default CountdownTimer;
