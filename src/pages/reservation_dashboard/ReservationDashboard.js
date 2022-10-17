import React from "react";
import { MdBarChart, MdOutlineNotificationsActive } from "react-icons/md";
import { FaLink } from "react-icons/fa";
import styled from "styled-components";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

// import "@fullcalendar/core/main.css";
// import "@fullcalendar/daygrid/main.css";
// import "@fullcalendar/timegrid/main.css";

import events from "./events";

export default function ReservationDashboard() {
  return (
    <div>
      <div style={{ padding: 10 }}>ລາຍງານການຈອງ</div>
      <div style={{ padding: 10, display: "grid", gridGap: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gridGap: 10,
          }}
        >
          <StatisticCard />
          <StatisticCard color="#00ABB3" />
          <StatisticCard />
          <StatisticCard />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: 10,
          }}
        >
          <CalendarCard />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridGap: 10,
            }}
          >
            <StatisticCard />
            <StatisticCard />
          </div>
        </div>
      </div>
    </div>
  );
}
const StatisticCard = ({ color = "rgb(251, 110, 59)", ...ohter }) => {
  return (
    <div
      style={{
        border: `1px solid ${color}`,
        borderRadius: 8,
        overflow: "hidden",
      }}
      {...ohter}
    >
      <div
        style={{
          minHeight: 70,
          display: "grid",
          gridTemplateColumns: "2fr 50px",
          padding: 20,
        }}
      >
        <div style={{ display: "flax", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 18,
              color: color,
              fontFamily: "Arial",
              fontWeight: "bold",
            }}
          >
            123,000 Kip
          </div>
          <div>ເງິນລວມ</div>
        </div>
        <div>
          <MdOutlineNotificationsActive
            style={{ color: color, width: 50, height: 50 }}
          />
        </div>
      </div>
      <div
        style={{
          height: 30,
          backgroundColor: color,
          paddingLeft: 20,
          paddingRight: 20,
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: "2fr 20px",
        }}
      >
        <div style={{ fontSize: 14, color: "white" }}>
          <FaLink style={{ color: "white", width: 15, height: 15 }} />{" "}
          ອັບເດດລາສຸດ 23.10.2022
        </div>
        <div>
          <MdBarChart style={{ color: "white", width: 20, height: 20 }} />
        </div>
      </div>
    </div>
  );
};
const CalendarCard = ({ ...ohter }) => {
  const color = "rgb(251, 110, 59)";
  return (
    <div
      style={{
        border: `1px solid ${color}`,
        borderRadius: 8,
        overflow: "hidden",
        padding: 10,
      }}
      {...ohter}
    >
      <FullCalendar
        defaultView="dayGridMonth"
        header={{
          left: "prev,next",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        plugins={[dayGridPlugin, timeGridPlugin]}
        events={events}
      />
    </div>
  );
};
