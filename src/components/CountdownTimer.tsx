import { useState, useEffect } from "react";

function CountdownTimer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Retrieve the target time from localStorage
    const liveConfigData = localStorage.getItem("liveConfig") as string;
    if (!liveConfigData) {
      return;
    }
    const shittyTime = JSON.parse(liveConfigData).time;
    if (!shittyTime) {
      return;
    }

    const storedTime = new Date(shittyTime);

    const updateCountdown = () => {
      const now = new Date();
      const timeDifference = storedTime.getTime() - now.getTime(); // in milliseconds

      if (timeDifference > 0) {
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
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
    // <div className="">
    //   <div className="text-3xl">
    //     {String(hours).padStart(2, "0")}:{String(minutes).padStart(2, "0")}:
    //     {String(seconds).padStart(2, "0")}
    //   </div>
    // </div>
    <div className="flex flex-row justify-around items-center max-w-sm w-full">
      <div className="p-3 border rounded-md">
        <p className="text-3xl">{String(hours).padStart(2, "0")}</p>
      </div>
      <p className="text-3xl">:</p>
      <div className="p-3 border rounded-md">
        <p className="text-3xl">{String(minutes).padStart(2, "0")}</p>
      </div>
      <p className="text-3xl">:</p>
      <div className="p-3 border rounded-md">
        <p className="text-3xl">{String(seconds).padStart(2, "0")}</p>
      </div>
    </div>
  );
}

export default CountdownTimer;
