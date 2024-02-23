import React, { useEffect, useState } from "react";

export default function DateTimeComponent({ onChange }) {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (!day) return;
    if (!month) return;
    if (!year) return;

    const date = `${day}/${month}/${year}`;
    onChange(date);
  }, [day,year,month]);
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <select className="form-control" onChange={(e) => setDay(e.target.value)}>
        <option value="">ວັນ</option>
        {[...new Array(31)].map((e, i) => (
          <option value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select
        className="form-control"
        onChange={(e) => setMonth(e.target.value)}
      >
        <option value="">ເດືອນ</option>
        {[...new Array(12)].map((e, i) => (
          <option value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select
        className="form-control"
        onChange={(e) => setYear(e.target.value)}
      >
        <option value="">ປີ</option>
        {[...new Array(150)].map((e, i) => (
          <option value={2024 - i}>{2024 - i}</option>
        ))}
      </select>
    </div>
  );
}
