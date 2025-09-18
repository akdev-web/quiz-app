import { useState, useEffect } from "react";

function formatDateTimeLocal(date) {
  const pad = (n) => String(n).padStart(2, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function PublishInput({ onUTCChange ,init,published}) {
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    let date = new Date();
    if (init) date = new Date(init);
    
    const formattedNow = formatDateTimeLocal(date);
    setLocalTime(formattedNow);
    if (onUTCChange) {
      onUTCChange(new Date(formattedNow).toISOString());
    }
  }, []);

  const handleChange = (e) => {
    const value = e.target.value;
    setLocalTime(value);

    const utc = new Date(value).toISOString();
    if (onUTCChange) {
      onUTCChange(utc);
    }
  };


  // Min = now, Max = now + 1 month
  const now = new Date();
  const oneMonthLater = new Date();
  oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

  const minTime = formatDateTimeLocal(now);
  const maxTime = formatDateTimeLocal(oneMonthLater);

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="publish-time" className="font-medium">
        Publish Time (Local)
      </label>
      <input
       
        type="datetime-local"
        id="publish-time"
        value={localTime}
        onChange={handleChange}
        min={minTime}
        max={maxTime}
        disabled={published}
         className={`border text-[var(---color-text-light)] dark:border-gray-700 p-2 rounded-md w-full ${published ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800" : ""}`}
      />
      {published ? (
        <p className="text-sm text-gray-500">
          This quiz is already published. You cannot change the publish time.
        </p>
      ) :
      <p className="text-xs text-gray-500">Allowed range: now to {maxTime.replace("T", " ")}</p>
      }
    </div>
  );
}
