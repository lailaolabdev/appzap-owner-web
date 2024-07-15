import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "react-bootstrap";
import { MdDining, MdOutlinePieChartOutline, MdStore } from "react-icons/md";
import "./sidenav.css";
import useWindowDimension2 from "../helpers/useWindowDimension2";
import { COLOR_APP } from "../constants";
import { FaChartLine } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function ReportLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { height, width } = useWindowDimension2();
  const [activeButton, setActiveButton] = useState("");
  const Location = useLocation();

  const onViewStocksPath = (patch) => {
    navigate(`/reports/${patch}`);
  };

  useEffect(() => {
    setActiveButton(Location.pathname);
  }, [Location.pathname]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: width > 900 ? "190px 1fr" : "",
        background: "#fafafa",
        width: "100%",
      }}
    >
      {width > 900 ? (
        <div
          style={{
            borderRight: "1px solid #f2f2f2",
            position: "relative",
            height: "auto",
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              padding: 5,
              // display: "flex",
              // flexDirection: "column",
              // gap: 10,
              height: "90vh",
            }}
          >
            <ButtonGroup vertical className="card-left-report">
              <div
                className="menu-report-stocks"
                style={{
                  background:
                    activeButton === "/reports/sales-report"
                      ? COLOR_APP
                      : "white",
                  color:
                    activeButton === "/reports/sales-report"
                      ? "white"
                      : COLOR_APP,
                }}
                onClick={() => onViewStocksPath("sales-report")}
              >
                <MdOutlinePieChartOutline style={{ fontSize: 35 }} />
                <strong>{t('report_sell')}</strong>
              </div>
              <div
                className="menu-report-stocks mt-1"
                style={{
                  background:
                    activeButton === "/reports/income-expend-report"
                      ? COLOR_APP
                      : "white",
                  color:
                    activeButton === "/reports/income-expend-report"
                      ? "white"
                      : COLOR_APP,
                }}
                onClick={() => navigate("/reports/income-expend-report")}
              >
                <FaChartLine style={{ fontSize: 35 }} />
                <strong>{t('report_p_c')}</strong>
              </div>
              <div
                className="menu-report-stocks mt-1"
                style={{
                  background:
                    activeButton === "/reports/reportStocks"
                      ? COLOR_APP
                      : "white",
                  color:
                    activeButton === "/reports/reportStocks"
                      ? "white"
                      : COLOR_APP,
                }}
                onClick={() => onViewStocksPath("reportStocks")}
              >
                <MdDining style={{ fontSize: 35 }} />
                <strong>{t('stoke_report')}</strong>
              </div>

              <div
                className="menu-report-stocks mt-1"
                disabled
              // onClick={() => navigate("/reports/members-report")}
              >
                {t('rp_build')} <br />
                ({t('dping')})
              </div>
              <div
                className="menu-report-stocks mt-1"
                style={{
                  background:
                    activeButton === "/reports/members-report"
                      ? COLOR_APP
                      : "white",
                  color:
                    activeButton === "/reports/members-report"
                      ? "white"
                      : COLOR_APP,
                }}
                onClick={() => navigate("/reports/members-report")}
              >
                <MdDining style={{ fontSize: 35 }} />
                <strong>{t('member_report')}</strong>
              </div>
              <div
                className="menu-report-stocks mt-1"
                style={{
                  background:
                    activeButton === "/reports/ChildStores-report"
                      ? COLOR_APP
                      : "white",
                  color:
                    activeButton === "/reports/ChildStores-report"
                      ? "white"
                      : COLOR_APP,
                }}
                onClick={() => navigate("/reports/ChildStores-report")}
              >
                <MdStore style={{ fontSize: 35 }} />
                <strong>{t('report_sub')}</strong>
              </div>
            </ButtonGroup>
          </div>
        </div>
      ) : (
        <div className="d-flex w-100 ">
          <div
            className=" d-flex justify-content-center align-items-center cursor-pointer p-2 w-100"
            style={{
              background: activeButton === "/reports" ? COLOR_APP : "white",
              color: activeButton === "/reports" ? "white" : COLOR_APP,
            }}
            onClick={() => onViewStocksPath("sales-report")}
          >
            {/* <MdOutlinePieChartOutline style={{ fontSize: 35 }} /> */}
            <strong>{t('report_sell')}</strong>
          </div>
          <div
            className="d-flex justify-content-center align-items-center cursor-pointer  p-2 w-100"
            style={{
              background:
                activeButton === "/reports/reportstocks" ? COLOR_APP : "white",
              color:
                activeButton === "/reports/reportstocks" ? "white" : COLOR_APP,
            }}
            onClick={() => onViewStocksPath("reportStocks")}
          >
            {/* <MdDining style={{ fontSize: 35 }} /> */}
            <strong>{t('stoke_report')}</strong>
          </div>

          <div
            className="d-flex justify-content-center align-items-center cursor-pointer p-2 w-100"
            disabled
          // onClick={() => navigate("/reports/members-report")}
          >
            {t('rp_build')} <br />
            {/* (ກຳລັງພັດທະນາ)  */}
          </div>
          <div
            className="d-flex justify-content-center align-items-center cursor-pointer p-2 w-100"
            style={{
              background:
                activeButton === "/reports/members-report"
                  ? COLOR_APP
                  : "white",
              color:
                activeButton === "/reports/members-report"
                  ? "white"
                  : COLOR_APP,
            }}
            // disabled
            onClick={() => navigate("/reports/members-report")}
          >
            <MdDining style={{ fontSize: 35 }} />
            <strong>{t('member_report')}</strong>
            {/* (ກຳລັງພັດທະນາ)  */}
          </div>

        </div>
      )}
      <div>
        <Outlet />
      </div>
    </div>
  );
}
