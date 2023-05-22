import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import moment from "moment";
import { Nav } from "react-bootstrap";
import Box from "../../components/Box";
import { useTranslation } from "react-i18next";
import axios from "axios";

import {
  faCertificate,
  faCoins,
  faPeopleArrows,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DashboardMenu from "./DashboardMenu";
import DashboardCategory from "./DashboardCategory";
import DashboardFinance from "./DashboardFinance";
import MoneyChart from "./MoneyChart";
import DashboardUser from "./DashboardUser";
import "./index.css";
import useQuery from "../../helpers/useQuery";
import { COLOR_APP } from "../../constants";
import ButtonDownloadCSV from "../../components/button/ButtonDownloadCSV";
import { END_POINT_SEVER } from "../../constants/api";
import { useStore } from "../../store";

export default function Dashboard() {
  const { accessToken } = useQuery();
  const [currency, setcurrency] = useState();
  const [selectedCurrency, setSelectedCurrency] = useState("LAK");
  const { storeDetail } = useStore();
  const newDate = new Date();

  const [startDate, setStartDate] = useState(
    moment(moment(newDate)).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(moment(newDate)).format("YYYY-MM-DD")
  );
  const [changeUi, setChangeUi] = useState("CHECKBILL");
  const [changeText, setChangeText] = useState('CLICK1');


  const _click1day = () => {
    setStartDate(moment(moment(newDate).add(-1, "days")).format("YYYY-MM-DD"));
    setEndDate(moment(moment(newDate)).format("YYYY-MM-DD"));
  };

  const _click7days = () => {
    setStartDate(moment(moment(newDate).add(-7, "days")).format("YYYY-MM-DD"));
    setEndDate(moment(moment(newDate)).format("YYYY-MM-DD"));
  };
  const _click30days = () => {
    setStartDate(moment(moment(newDate).add(-30, "days")).format("YYYY-MM-DD"));
    setEndDate(moment(moment(newDate)).format("YYYY-MM-DD"));
  };

  const { t } = useTranslation();

  const getcurrency = async () => {
    try {
      let res = await axios.get(
        END_POINT_SEVER + `/v3/currencies?storeId=${storeDetail?._id}`
      );
      setcurrency(res.data ?? []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getcurrency();
  }, []);

  return (
    <div style={{ padding: 10 }}>
      <Box
        sx={{
          fontWeight: "bold",
          backgroundColor: "#f8f8f8",
          border: "none",
          display: "grid",
          gridTemplateColumns: {
            md: "repeat(5,1fr)",
            sm: "repeat(3,1fr)",
            xs: "repeat(2,1fr)",
          },
        }}
      >
        <Nav.Item>
          <Nav.Link
            eventKey="/home"
            style={{
              color: "#FB6E3B",
              backgroundColor: changeUi === "CHECKBILL" ?'#FFDBD0' : '',
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("CHECKBILL")}
          >
            <FontAwesomeIcon icon={faTable}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div> {t("tableStatus")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/finance"
            style={{
              color: "#FB6E3B",
              backgroundColor: changeUi === "MONEY_CHART" ?'#FFDBD0' : '',
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("MONEY_CHART")}
          >
            <FontAwesomeIcon icon={faCoins}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div> {t("financialStatic")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/best-category"
            style={{
              color: "#FB6E3B",
              backgroundColor: changeUi === "CATEGORY" ?'#FFDBD0' : '',
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("CATEGORY")}
          >
            <FontAwesomeIcon icon={faTable}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div> {t("famousType")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/best-menu"
            style={{
              color: "#FB6E3B",
              backgroundColor: changeUi === "MENUS" ?'#FFDBD0' : '',
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("MENUS")}
          >
            <FontAwesomeIcon icon={faCertificate}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div> {t("famousMenu")}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/staff-history"
            style={{
              color: "#FB6E3B",
              backgroundColor: changeUi === "STAFF" ?'#FFDBD0' : '',
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("STAFF")}
          >
            <FontAwesomeIcon icon={faPeopleArrows}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div> {t("waitstaffReport")}
          </Nav.Link>
        </Nav.Item>
      </Box>
      <div style={{ height: 10 }}></div>
      <Box
        sx={{
          display: "flex",
          gap: 10,
          justifyContent: "space-between ",
          flexDirection: { md: "row", xs: "column" },
        }}
      >
        <div style={{ display: "flex" }}>
          <button
            type="button"
            className="text-name"
            style={{
              backgroundColor:changeText == 'CLICK1' ? '#fb6e3b' : '#D9D9D9',
              color: changeText == 'CLICK1'? '#ffffff' : '#686868',
              border: 'none',
              width: 125,
              height:48
            }}
            onClick={() => { _click1day(''); setChangeText('CLICK1')}}
          >
            {t("theLastList")}
          </button>
          <div style={{ width: 10 }}></div>
          <button
            type="button"
            className="text-name"
            style={{
              backgroundColor: changeText == 'CLICK7' ? '#fb6e3b' : '#D9D9D9',
              color: changeText == 'CLICK7' ? '#ffffff' : '#686868',
              border: 'none',
              width: 125,
              height:48
            }}
            onClick={() => { _click7days(); setChangeText('CLICK7')}}
          >
            {t("last7days")}
          </button>
          <div style={{ width: 10 }}></div>
          <button
            type="button"
            className="text-name"
            style={{
              backgroundColor:changeText == 'CLICK30' ? '#fb6e3b' : '#D9D9D9',
              color: changeText == 'CLICK30' ? '#ffffff' : '#686868',
              border: 'none',
              width: 125,
              height:48
            }}
            onClick={() => { _click30days(); setChangeText('CLICK30')}}
          >
            {t("last30days")}
          </button>

          <div style={{ width: 10 }}></div>
          <select
            onChange={(e) => setSelectedCurrency(e.target.value)}
            className="btn btn-outline-info"
          >
            <option value="LAK" className="option" >ກີບ</option>
            {currency?.map((cur, index) => (
              <option key={cur + index} value={cur?.currencyCode}>
                {cur?.currencyName}
              </option>
            ))}
            </select>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gridGap: 10,
          }}
        >
          <input
            type="date"
            className="px-2"
            style={{
              color: "#003049",
              border: '2px solid #fb6e3b',
              borderRadius: '5px',
              fontWeight:'bold'
            }}
            value={startDate}
            onChange={(e) => {
              setStartDate(e?.target?.value);
            }}
          />
          <input
            type="date"
            className="px-2"
            style={{
              color: "#003049",
              border: '2px solid #fb6e3b',
              borderRadius: '5px',
              fontWeight:'bold'
            }}
            value={endDate}
            onChange={(e) => {
              setEndDate(e?.target?.value);
            }}
          />
        </div>
      </Box>

      {changeUi === "MONEY_CHART" && (
        <MoneyChart
          startDate={startDate}
          endDate={endDate}
          selectedCurrency={selectedCurrency}
        />
      )}
      {changeUi === "CHECKBILL" && (
        <DashboardFinance
          startDate={startDate}
          endDate={endDate}
          selectedCurrency={selectedCurrency}
        />
      )}
      {changeUi === "MENUS" && (
        <DashboardMenu
          startDate={startDate}
          endDate={endDate}
          selectedCurrency={selectedCurrency}
        />
      )}
      {changeUi === "CATEGORY" && (
        <DashboardCategory
          startDate={startDate}
          endDate={endDate}
          selectedCurrency={selectedCurrency}
        />
      )}
      {changeUi === "STAFF" && (
        <DashboardUser
          startDate={startDate}
          endDate={endDate}
          selectedCurrency={selectedCurrency}
        />
      )}
    </div>
  );
}



const Option = styled.option`
  cursor: pointer;
  padding: 10px;
  &:hover {
    background-color: #ffffff!important;
  }
`;
