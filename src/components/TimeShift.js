import React, { useEffect, useState } from "react";
import moment from "moment";

export default function TimeShift({
  onChange = () => {},
  value = "",
  name = "",
  isInvalid,
}) {
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");

  // Update `onChange` with formatted time
  useEffect(() => {
    if (hour === "" || minute === "") return;
    const formattedTime = `${hour}:${minute}`;
    onChange(formattedTime); // Ensure `onChange` is called with a formatted value
  }, [hour, minute]);

  // Set initial values when `value` prop changes
  useEffect(() => {
    if (value) {
      setHour(moment(value, "HH:mm").format("HH")); // Parse and format correctly
      setMinute(moment(value, "HH:mm").format("mm"));
    }
  }, [value]);

  return (
    <div style={{ display: "flex", gap: 10 }}>
      {/* Hour Dropdown */}
      <select
        className="form-control"
        onChange={(e) => setHour(e.target.value)}
        value={hour}
        aria-label="Hour"
        isInvalid={isInvalid}
      >
        <option value="">{hour || "ໂມງ"}</option>
        {[...Array(24).keys()].map((i) => (
          <option key={i} value={String(i).padStart(2, "0")}>
            {String(i).padStart(2, "0")}
          </option>
        ))}
      </select>

      {/* Minute Dropdown */}
      <select
        className="form-control"
        onChange={(e) => setMinute(e.target.value)}
        value={minute}
        aria-label="Minute"
        isInvalid={isInvalid}
      >
        <option value="">{minute || "ນາທີ"}</option>
        {[...Array(60).keys()].map((i) => (
          <option key={i} value={String(i).padStart(2, "0")}>
            {String(i).padStart(2, "0")}
          </option>
        ))}
      </select>
    </div>
  );
}
