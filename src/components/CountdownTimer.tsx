import { useState, useEffect } from "react";

function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Retrieve the target time from localStorage
    const shittyTime = JSON.parse(
      localStorage.getItem("liveConfig") as string,
    ).time;
    if (!shittyTime) {
      return;
    }

    const storedTime = new Date(shittyTime);

    const updateCountdown = () => {
      const now = new Date();
      console.log(now.toISOString());
      const timeDifference = storedTime - now; // in milliseconds

      if (timeDifference > 0) {
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60),
        );
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        setHours(hours);
        setMinutes(minutes);
        setSeconds(seconds);
      } else {
        // Clear the interval once the target time is reached
        clearInterval(interval);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    };

    const interval = setInterval(updateCountdown, 1000);

    // Initial update
    updateCountdown();

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="countdown-timer">
      <div className="time text-3xl">
        {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
        {String(seconds).padStart(2, "0")}
      </div>
    </div>
  );
}

export default CountdownTimer;
