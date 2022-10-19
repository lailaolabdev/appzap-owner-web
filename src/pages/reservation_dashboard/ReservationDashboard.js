import React, { useState, useEffect } from "react";
import { MdBarChart, MdPeopleAlt } from "react-icons/md";
import { BsCashCoin, BsFillCalendar2WeekFill } from "react-icons/bs";
import { TbRelationManyToMany } from "react-icons/tb";
import { FaLink } from "react-icons/fa";
import styled from "styled-components";
import moment from "moment";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";

import {
  getReservations,
  getReservationsCount,
} from "../../services/reservation";

export default function ReservationDashboard() {
  // state
  const [isLoading, setIsLoading] = useState(false);
  const [reservationsData, setReservationsData] = useState();
  const [reservationsCount, setReservationsCount] = useState();

  // variable
  const eventReservation = reservationsData?.map((e) => ({
    title: `(${e?.clientNumber}ຄົນ)`,
    start: moment(e?.startTime).format(),
  }));
  console.log("eventReservation", eventReservation);

  // func
  const getData = async () => {
    setIsLoading(true);
    let findBy = "";
    findBy += `&status=STAFF_CONFIRM`;
    const data = await getReservations(findBy);
    setReservationsData(data);
    setIsLoading(false);
    return;
  };
  const getDataCount = async (find) => {
    setIsLoading(true);
    let findBy = "";
    if (find) findBy += find;
    const data = await getReservationsCount(findBy);
    console.log("data", data);
    setReservationsCount(data?.all_reservations);
    setIsLoading(false);
    return;
  };
  //
  useEffect(() => {
    getData();
    getDataCount();
  }, []);
  return (
    <div>
      <div style={{ padding: 10, fontSize: 22, fontWeight: "bold" }}>
        ລາຍງານການຈອງ
      </div>
      <div style={{ padding: 10, display: "grid", gridGap: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gridGap: 10,
          }}
        >
          <StatisticCard
            value="0 ກີບ"
            name="ຈຳນວນເງິນທັງໝົດ"
            color="#967E76"
            icon={
              <BsCashCoin style={{ color: "#967E76", width: 50, height: 50 }} />
            }
          />
          <StatisticCard
            value="60 ຄົນ"
            name="ຈຳນວນຄົນຈອງທັງໝົດ"
            color="#00ABB3"
            icon={
              <MdPeopleAlt
                style={{ color: "#00ABB3", width: 50, height: 50 }}
              />
            }
          />
          <StatisticCard
            value={`${reservationsCount} ການຈອງ`}
            name="ຈຳນວນການຈອງທັງໝົດ"
            color="#E26868"
            icon={
              <TbRelationManyToMany
                style={{ color: "#E26868", width: 50, height: 50 }}
              />
            }
          />
          <StatisticCard
            value={`${reservationsCount} ຄິວຈອງ`}
            name="ຈຳນວນຄິວປະຈຸບັນ"
            color="#674747"
            icon={
              <BsFillCalendar2WeekFill
                style={{ color: "#674747", width: 50, height: 50 }}
              />
            }
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gridGap: 10,
          }}
        >
          <CalendarCard events={eventReservation} />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridGap: 10,
            }}
          >
            <ComingSoonCard />
            <ComingSoonCard />
          </div>
        </div>
      </div>
    </div>
  );
}
const StatisticCard = ({
  value = "",
  name = "",
  icon,
  color = "rgb(251, 110, 59)",
  ...ohter
}) => {
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
            {value}
          </div>
          <div>{name}</div>
        </div>
        <div>{icon}</div>
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
          <FaLink style={{ color: "white", width: 15, height: 15 }} />
          ອັບເດດລາສຸດ 23.10.2022
        </div>
        <div>
          <MdBarChart style={{ color: "white", width: 20, height: 20 }} />
        </div>
      </div>
    </div>
  );
};
const CalendarCard = ({ events, ...ohter }) => {
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
        timeZone="UTC"
        events={events}
      />
    </div>
  );
};

const ComingSoonCard = ({ color = "rgb(251, 110, 59)" }) => {
  return (
    <div
      style={{
        backgroundColor: "rgba(251, 110, 59,0.3)",
        border: `1px solid ${color}`,
        borderRadius: 8,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: color,
      }}
    >
      Coming soon...
    </div>
  );
};
