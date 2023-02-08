import React, { useState, useEffect } from "react";
import { MdBarChart, MdPeopleAlt } from "react-icons/md";
import { BsCashCoin, BsFillCalendar2WeekFill } from "react-icons/bs";
import { TbRelationManyToMany } from "react-icons/tb";
import { FaLink } from "react-icons/fa";
import styled from "styled-components";
import Box from "../../components/Box";
import moment from "moment";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import { useTranslation } from "react-i18next";

import {
  getReservations,
  getReservationsCount,
} from "../../services/reservation";

export default function ReservationDashboard() {
  //language
  const { t } = useTranslation();
  // state
  const [isLoading, setIsLoading] = useState(false);
  const [reservationsData, setReservationsData] = useState();
  const [reservationsCount, setReservationsCount] = useState();
  const [updateNow, setUpdateNow] = useState();

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
  const getUpdateNow = async () => {
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
        {t('bookingReport')}
      </div>
      <div style={{ padding: 10, display: "grid", gridGap: 20 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { md: "repeat(4,1fr)", xs: "1fr 1fr" },
            gridGap: 10,
          }}
        >
          <StatisticCard
            value="- ກີບ"
            name={t('totalAmount')}
            color="#967E76"
            icon={
              <Box
                sx={{ width: { xs: 30, md: 50 }, height: { xs: 30, md: 50 } }}
              >
                <BsCashCoin
                  style={{ color: "#967E76", width: "100%", height: "100%" }}
                />
              </Box>
            }
          />
          <StatisticCard
            value={`- ຄົນ`}
            name={t('totalNumberOfPeopleBooked')}
            color="#00ABB3"
            icon={
              <Box
                sx={{ width: { xs: 30, md: 50 }, height: { xs: 30, md: 50 } }}
              >
                <MdPeopleAlt
                  style={{ color: "#00ABB3", width: "100%", height: "100%" }}
                />
              </Box>
            }
          />
          <StatisticCard
            value={`${reservationsCount} ການຈອງ`}
            name={t('totalNumberOfBooking')}
            color="#E26868"
            icon={
              <Box
                sx={{ width: { xs: 30, md: 50 }, height: { xs: 30, md: 50 } }}
              >
                <TbRelationManyToMany
                  style={{ color: "#E26868", width: "100%", height: "100%" }}
                />
              </Box>
            }
          />
          <StatisticCard
            value={`${reservationsCount} ຄິວຈອງ`}
            name={t('currentQueueNumber')}
            color="#674747"
            icon={
              <Box
                sx={{ width: { xs: 30, md: 50 }, height: { xs: 30, md: 50 } }}
              >
                <BsFillCalendar2WeekFill
                  style={{ color: "#674747", width: "100%", height: "100%" }}
                />
              </Box>
            }
          />
        </Box>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
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
            {/* <ComingSoonCard />
            <ComingSoonCard /> */}
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
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        border: `1px solid ${color}`,
        borderRadius: 8,
        overflow: "hidden",
      }}
      {...ohter}
    >
      <Box
        sx={{
          minHeight: 70,
          display: "grid",
          gridTemplateColumns: "2fr 50px",
          padding: { md: 20, xs: 10 },
        }}
      >
        <div style={{ display: "flax", flexDirection: "column" }}>
          <Box
            sx={{
              fontSize: { md: 18, xs: 12 },
              color: color,
              fontFamily: "Arial",
              fontWeight: "bold",
            }}
          >
            {value}
          </Box>
          <Box
            sx={{
              fontSize: { md: 18, xs: 12 },
            }}
          >
            {name}
          </Box>
        </div>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {icon}
        </Box>
      </Box>
      <Box
        sx={{
          height: 30,
          backgroundColor: color,
          xs: {
            paddingLeft: 10,
            paddingRight: 10,
          },
          md: {
            paddingLeft: 20,
            paddingRight: 20,
          },
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: "2fr 20px",
        }}
      >
        <Box
          sx={{
            fontSize: { md: 14, xs: 10 },
            color: "white",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <Box sx={{ width: { md: 15, xs: 12 }, height: { md: 15, xs: 12 } }}>
            <FaLink style={{ color: "white", width: "100%", height: "100%" }} />
          </Box>
          {t('lastUpdated')} {moment().format("DD.MM.yyyy")}
        </Box>
        <div>
          <MdBarChart style={{ color: "white", width: 20, height: 20 }} />
        </div>
      </Box>
    </Box>
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
