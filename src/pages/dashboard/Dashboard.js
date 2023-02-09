import React, { useEffect, useState } from "react";
import moment from "moment";
import { Nav } from "react-bootstrap";
import Box from "../../components/Box";
import { useTranslation } from "react-i18next";

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
  const [currency, setcurrency] = useState()
  const [selectedCurrency, setSelectedCurrency] = useState("LAK");
  const { storeDetail } = useStore()
  // console.log("storeDetail==>", { storeDetail })
  const newDate = new Date();

  const [startDate, setStartDate] = useState(
    moment(moment(newDate)).format("YYYY-MM-DD")
  );
  const [endDate, setEndDate] = useState(
    moment(moment(newDate)).format("YYYY-MM-DD")
  );
  const [changeUi, setChangeUi] = useState("CHECKBILL");

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
      let u = await fetch(
        END_POINT_SEVER + `/v3/currencies?storeId=${storeDetail?._id}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => setcurrency(json));
      // console.log("------------>", u)
    } catch (err) {
      console.log(err);
    }
  };

  
  useEffect(() => {
    getcurrency()
  }, [])

  // console.log("=================", currency)

  return (
    <div style={{ padding: 10 }}>
      <div
        style={{
          marginRight: "30px",
          backgroundColor: "orange",
          boxShadow: "2px 2px 2px 4px rgba(0, 0, 0, 0.06)",
        }}
      >
        <select onChange={(e) => setSelectedCurrency(e.target.value)}>
          <option selected value="LAK">ກີບ</option>
          {
            currency?.map((cur, index) => (
              <option key={cur + index} value={cur?.currencyCode}>{cur?.currencyName}</option>
            ))
          }
        </select>
      </div>
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
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("CHECKBILL")}
          >
            {" "}
            <FontAwesomeIcon icon={faTable}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div> {t('tableStatus')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/finance"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("MONEY_CHART")}
          >
            <FontAwesomeIcon icon={faCoins}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div> {t('financialStatic')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/best-category"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("CATEGORY")}
          >
            <FontAwesomeIcon icon={faTable}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div> {t('famousType')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/best-menu"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("MENUS")}
          >
            <FontAwesomeIcon icon={faCertificate}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div> {t('famousMenu')}
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link
            eventKey="/staff-history"
            style={{
              color: "#FB6E3B",
              border: "none",
              height: 60,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            onClick={() => setChangeUi("STAFF")}
          >
            <FontAwesomeIcon icon={faPeopleArrows}></FontAwesomeIcon>{" "}
            <div style={{ width: 8 }}></div> {t('waitstaffReport')}
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
            className="btn btn-outline-info"
            onClick={() => _click1day()}
          >
            {t('theLastList')}
          </button>
          <div style={{ width: 10 }}></div>
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={() => _click7days()}
          >
            {t('last7days')}
          </button>
          <div style={{ width: 10 }}></div>
          <button
            type="button"
            className="btn btn-outline-info"
            onClick={() => _click30days()}
          >
            {t('last30days')}
          </button>
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
            className="btn btn-outline-info"
            style={{ width: "100%" }}
            value={startDate}
            onChange={(e) => {
              // alert(e?.target?.value);
              setStartDate(e?.target?.value);
            }}
          />
          <input
            type="date"
            className="btn btn-outline-info"
            value={endDate}
            style={{ width: "100%" }}
            onChange={(e) => {
              // alert(e?.target?.value);
              setEndDate(e?.target?.value);
            }}
          />
        </div>
      </Box>

      {changeUi === "MONEY_CHART" && (
        <MoneyChart startDate={startDate} endDate={endDate} 
        selectedCurrency={selectedCurrency} 
        />
      )}
      {changeUi === "CHECKBILL" && (
        <DashboardFinance startDate={startDate} endDate={endDate} selectedCurrency={selectedCurrency} />
      )}
      {changeUi === "MENUS" && (
        <DashboardMenu startDate={startDate} endDate={endDate} selectedCurrency={selectedCurrency} />
      )}
      {changeUi === "CATEGORY" && (
        <DashboardCategory startDate={startDate} endDate={endDate} selectedCurrency={selectedCurrency} />
      )}
      {changeUi === "STAFF" && (
        <DashboardUser startDate={startDate} endDate={endDate} selectedCurrency={selectedCurrency} />
      )}
    </div>
  );
}
