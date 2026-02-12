import { useState, useEffect } from "react";
import Countdown from "../../assets/images/countdown-2.webp";

const CountdownTimer = ({ targetDate }) => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const countdown = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(targetDate).getTime() - now;

      if (distance <= 0) {
        clearInterval(countdown);
        return;
      }

      setTime({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [targetDate]);

  return (
    <div className="flex justify-center gap-5 text-center text-white bg-white p-8 rounded-2xl" style={{ backgroundImage: `url(${Countdown})`,backgroundSize:"cover" }}>
      <div className="flex flex-col items-center gap-2 w-28 "><span className="text-5xl font-semibold">{time.days}</span> <span className="text-sm">Days</span></div>
      <div className="flex flex-col items-center gap-2"><span className="text-5xl font-semibold">:</span></div>
      <div className="flex flex-col items-center gap-2 w-28"><span className="text-5xl font-semibold">{time.hours}</span> <span className="text-sm">Hours</span></div>
      <div className="flex flex-col items-center gap-2"><span className="text-5xl font-semibold">:</span></div>
      <div className="flex flex-col items-center gap-2 w-28"><span className="text-5xl font-semibold">{time.minutes}</span> <span className="text-sm">Min</span></div>
      <div className="flex flex-col items-center gap-2"><span className="text-5xl font-semibold">:</span></div>
      <div className="flex flex-col items-center gap-2 w-28"><span className="text-5xl font-semibold">{time.seconds}</span> <span className="text-sm">Sec</span></div>
    </div>
  );
};

export default CountdownTimer;
