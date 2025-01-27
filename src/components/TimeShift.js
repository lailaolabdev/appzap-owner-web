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

  // Update `onChange` with the formatted time
  useEffect(() => {
    if (hour === "" || minute === "") return;
    const formattedTime = `${hour}:${minute}`;
    onChange(formattedTime);
  }, [hour, minute]);

  // Set initial values when `value` prop changes
  useEffect(() => {
    if (value) {
      const parsedMoment = moment(value, "HH:mm", true); // Strict parsing
      if (parsedMoment.isValid()) {
        setHour(parsedMoment.format("HH"));
        setMinute(parsedMoment.format("mm"));
      } else {
        setHour("");
        setMinute("");
      }
    }
  }, [value]);

  return (
    <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
      {/* Hour Dropdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label htmlFor={`${name}-hour`} style={{ fontWeight: "bold" }}>
          ໂມງ (Hour)
        </label>
        <select
          id={`${name}-hour`}
          style={{
            width: "230px",
          }}
          className={`form-control ${isInvalid ? "is-invalid" : ""}`}
          onChange={(e) => setHour(e.target.value)}
          value={hour}
        >
          <option value="" disabled>
            ໂມງ
          </option>
          {[...Array(24).keys()].map((i) => (
            <option key={i} value={String(i).padStart(2, "0")}>
              {String(i).padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>

      {/* Minute Dropdown */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <label htmlFor={`${name}-minute`} style={{ fontWeight: "bold" }}>
          ນາທີ (Minute)
        </label>
        <select
          id={`${name}-minute`}
          style={{
            width: "230px",
          }}
          className={`form-control ${isInvalid ? "is-invalid" : ""}`}
          onChange={(e) => setMinute(e.target.value)}
          value={minute}
        >
          <option value="" disabled>
            ນາທີ
          </option>
          {[...Array(60).keys()].map((i) => (
            <option key={i} value={String(i).padStart(2, "0")}>
              {String(i).padStart(2, "0")}
            </option>
          ))}
        </select>
      </div>

      {/* Error Message
      {isInvalid && (
        <div style={{ color: "red", marginTop: "5px", fontSize: "12px" }}>
          {name === "startTime"
            ? "ປ້ອນເວລາເປີດ" // "Please enter the start time"
            : "ປ້ອນເວລາປີດ"}{" "}
        </div>
      )} */}
    </div>
  );
}
