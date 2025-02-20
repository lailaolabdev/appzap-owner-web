import React, { useEffect, useState } from "react";
import moment from "moment";
import { useTranslation } from "react-i18next";

export default function DateTimeComponent({ onChange, value }) {
  const { t } = useTranslation();
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (!day) return;
    if (!month) return;
    if (!year) return;
    const date = `${year}-${month}-${day}`;
    onChange(date);
  }, [day, year, month]);

  useEffect(() => {
    if (value) {
      setDay(moment(value).format("D"));
      setMonth(moment(value).format("MM"));
      setYear(moment(value).format("YYYY"));
    }
  }, [value]);

  // console.log({ day, month, year });

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <select
        className="form-control"
        onChange={(e) => setDay(e.target.value)}
        value={day}
      >
        <option value="">{day ? day : t("day")}</option>
        {[...new Array(31)].map((e, i) => (
          <option value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select
        className="form-control"
        onChange={(e) => setMonth(e.target.value)}
        value={month}
      >
        <option value="">{month ? month : t("month")}</option>
        {[...new Array(12)].map((e, i) => (
          <option value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <select
        className="form-control"
        onChange={(e) => setYear(e.target.value)}
        value={year}
      >
        <option value="">{year ? year : t("year")}</option>
        {[...new Array(150)].map((e, i) => (
          <option value={2024 - i}>{2024 - i}</option>
        ))}
      </select>
    </div>
  );
}
