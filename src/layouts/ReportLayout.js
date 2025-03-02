import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, ButtonGroup } from "react-bootstrap";
import { MdDining, MdOutlinePieChartOutline, MdStore } from "react-icons/md";
import "./sidenav.css";
import useWindowDimension2 from "../helpers/useWindowDimension2";
import { COLOR_APP } from "../constants";
import { FaChartLine } from "react-icons/fa";
import { useTranslation } from "react-i18next";

import { useStoreStore } from "../zustand/storeStore";

export default function ReportLayout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { height, width } = useWindowDimension2();
  const [activeButton, setActiveButton] = useState("");
  const Location = useLocation();

  const { storeDetail } = useStoreStore();

  const onViewStocksPath = (patch) => {
    navigate(`/reports/${patch}`);
  };

  useEffect(() => {
    setActiveButton(Location.pathname);
  }, [Location.pathname]);

  return (
    <div className="flex flex-col w-[1250px] h-[60px] pt-2 mx-4">
      <div className="flex gap-2 justify-start items-center px-2">
        <Button
          onKeyDown={() => {}}
          className="menu-report-stocks"
          style={{
            background:
              activeButton === "/reports/sales-report" ? COLOR_APP : "white",
            color:
              activeButton === "/reports/sales-report" ? "white" : COLOR_APP,
            // width: width > 900 ? "100%" : "fit-content",
          }}
          onClick={() => onViewStocksPath("sales-report")}
        >
          <span className="flex gap-2 items-center">
            <MdOutlinePieChartOutline style={{ fontSize: 35 }} />
            <strong>{t("report_sell")}</strong>
          </span>
        </Button>
        <Button
          onKeyDown={() => {}}
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
            // width: width > 900 ? "100%" : "fit-content",
          }}
          onClick={() => navigate("/reports/income-expend-report")}
        >
          <span className="flex gap-2 items-center">
            <FaChartLine style={{ fontSize: 35 }} />
            <strong>{t("report_p_c")}</strong>
          </span>
        </Button>
        {/* <div
              onKeyDown={() => {}}
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
                // width: width > 900 ? "100%" : "fit-content",
              }}
              onClick={() => onViewStocksPath("reportStocks")}
            >
              <MdDining style={{ fontSize: 35 }} />
              <strong>{t("stoke_report")}</strong>
            </div> */}
        {storeDetail?.isCRM && (
          <Button
            onKeyDown={() => {}}
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
              // width: width > 900 ? "100%" : "fit-content",
            }}
            onClick={() => navigate("/reports/members-report")}
          >
            <span className="flex gap-2 items-center">
              <MdDining style={{ fontSize: 35 }} />
              <strong>{t("member_report")}</strong>
            </span>
          </Button>
        )}
      </div>
      <hr className="" />
      <div>
        <Outlet />
      </div>
    </div>
  );
}
