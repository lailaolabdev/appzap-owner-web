import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import { TitleComponent } from "../../components";
import { Form } from "react-bootstrap";
import IncomeExpendatureChart from "./IncomeExpendatureChart";
import { COLOR_APP } from "../../constants";
import {
  END_POINT_SERVER_BUNSI,
  getLocalData,
  END_POINT_SEVER,
} from "../../constants/api";
import PaginationComponent from "../../components/PaginationComponent";
import { getHeadersAccount } from "../../services/auth";
import { useLocation, useParams } from "react-router-dom";
import { moneyCurrency } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBalanceScaleRight,
  faDollarSign,
  faFunnelDollar,
  faMoneyBillWave,
} from "@fortawesome/free-solid-svg-icons";
import Filter from "../expend/component/filter";
import queryString from "query-string";
import { useTranslation } from "react-i18next";
import useWindowDimensions2 from "../../helpers/useWindowDimension2";
import { useStore } from "../../store";

export default function IncomeExpendExport() {
  const { t } = useTranslation();
  const parame = useParams();
  const location = useLocation();
  const time = new Date();
  const month = time.getMonth();
  const year = time.getFullYear();
  const parsed = queryString?.parse(location?.state);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  // const [dateStart, setDateStart] = useState(new Date(year, month, 1));
  // const [dateEnd, setDateEnd] = useState(new Date(year, month + 1, 0));
  const { profile } = useStore();

  // console.log("dateStart::", dateStart, "dateEnd::", dateEnd);

  const { width, height } = useWindowDimensions2();

  //filter
  const [filterByYear, setFilterByYear] = useState(
    !parsed?.filterByYear ? currentYear : parsed?.filterByYear
  );
  const [filterByMonth, setFilterByMonth] = useState(
    !parsed?.filterByMonth ? currentMonth : parsed?.filterByMonth
  );
  const { _limit, _skip, Pagination_component } = PaginationComponent();
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [expendGraphData, setExpendGraphData] = useState();
  const [incomeGraphData, setIncomeGraphData] = useState();
  const [graphData, setGraphData] = useState();
  const [incomeExpendData, setIncomeExpendData] = useState([]);
  const [days, setDays] = useState(null)
  
 
  // console.log("incomeExpendData::", incomeExpendData);

  const role = "counter";
  //const user_role = profile.data?.role;
  const user_role = role;

  console.log(user_role);
  let day = days ;

  useEffect(() => {
    const fetchPermissionCounters = async () => {
        try {
            const response = await axios.get('http://localhost:7070/permissionCounter');
            setDays(response.data[0].permissionsCounter
            );
        } catch (err) {
            console.log(err.message);
        } 
    };
    fetchPermissionCounters();
}, [days]);

console.log("days:", days);



  
 

  // Calculate initial dates based on user role
  const calculateInitialDates = () => {
    if (user_role === role && day) {
      // ใช้ค่า day แทนการกำหนดตายตัว
      return {
        start: new Date(new Date().setDate(new Date().getDate() - day)),
        end: new Date(),
      };
    } else {
      // For other users, show full month
      return {
        start: new Date(year, month, 1),
        end: new Date(year, month + 1, 0),
      };
    }
  };

  // Initialize date states
  const initialDates = calculateInitialDates();
  const [dateStart, setDateStart] = useState(initialDates.start);
  const [dateEnd, setDateEnd] = useState(initialDates.end);

  const OPTION = {
    chart: {
      height: 350,
      type: "area",
    },
    stroke: {
      curve: "straight",
    },
    colors: [COLOR_APP, "#00ABB3"],
    dataLabels: {
      enabled: false,
      formatter: (value) => (value ? value?.toLocaleString("en-US") : 0),
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5,
      },
    },
    yaxis: {
      labels: {
        formatter: (value) => (value ? value?.toLocaleString("en-US") : 0),
      },
    },
    fontSize: "3px",
    xaxis: {
      labels: {
        formatter: (value) =>
          value
            ? `${moment(value).format("DD-MM-YYYY")} (${convertWeekDay(
                moment(value).weekday()
              )})`
            : 0,
        style: {
          fontSize: "10px",
        },
      },
      categories: [],
    },
  };
  // Initialize series data
  const [series, setSeries] = useState([
    {
      name: `${t("expe_lak")}`,
      data: [0],
    },
    {
      name: `${t("recieve_lak")}`,
      data: [0],
    },
  ]);

  const [options, setOptions] = useState(OPTION);

  useEffect(() => {
    getIncomeExpendData();
  }, []);

  useEffect(() => {
    getIncomeExpendData();
  }, [dateStart, dateEnd]);

  useEffect(() => {
    if (!expendGraphData) return;
    modifyData();
  }, [expendGraphData, incomeGraphData]);

  useEffect(() => {
    if (!series || !options) return;
    // modifyData()
  }, [series, options]);

  const getIncomeExpendData = async () => {
    try {
      const _localData = await getLocalData();
      let findby = `accountId=${
        _localData?.DATA?.storeId
      }&platform=APPZAPP&limit=${_limit}&skip=${(parame?.skip - 1) * _limit}`;

      if (user_role === role && day) {
        // ใช้ค่า day แทนการกำหนดตายตัว
        const endDate = new Date();
        const startDate = new Date(
          new Date().setDate(new Date().getDate() - day)
        );
        findby += `&date_gte=${moment(startDate).format(
          "YYYY/MM/DD"
        )}&date_lt=${moment(endDate).format("YYYY/MM/DD")}`;
      } else {
        if (dateStart && dateEnd) {
          findby += `&date_gte=${moment(dateStart).format(
            "YYYY/MM/DD"
          )}&date_lt=${moment(dateEnd).format("YYYY/MM/DD")}`;
        }
      }

      const header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      // Fetch expenditure data
      await axios({
        method: "get",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expend-report?${findby}`,
        headers: headers,
      })
        .then((res) => {
          setExpendGraphData(res?.data?.data?.chartExpend);
        })
        .finally(() => {
          setIsLoading(false);
        });

      // Fetch income data
      let findIncomeby = `${_localData?.DATA?.storeId}?`;
      if (user_role === role && day) {
        const endDate = new Date();
        const startDate = new Date(
          new Date().setDate(new Date().getDate() - day)
        );
        findIncomeby += `startDate=${moment(startDate).format(
          "YYYY-MM-DD"
        )}&endDate=${moment(endDate).format("YYYY-MM-DD")}`;
      } else if (dateStart && dateEnd) {
        findIncomeby += `startDate=${moment(dateStart).format(
          "YYYY-MM-DD"
        )}&endDate=${moment(dateEnd).format("YYYY-MM-DD")}`;
      }
      findIncomeby = findIncomeby + `&endTime=23:59:59&startTime=00:00:00`;

      await axios({
        method: "post",
        url: `${END_POINT_SEVER}/v4/report-daily/${findIncomeby}`,
        headers: headers,
      })
        .then((res) => {
          setIncomeGraphData(res?.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (err) {
      console.log("err:::", err);
    }
  };

  const modifyData = () => {
    if (!incomeGraphData) return;

    setSeries([]);
    setOptions(null);
    setGraphData(null);

    let _createdAtGraph = expendGraphData?.createdAt;

    if (user_role === role && day) {
      // ใช้ค่า day แทนการกำหนดตายตัว
      const endDate = new Date();
      const startDate = new Date(
        new Date().setDate(new Date().getDate() - day)
      );
      _createdAtGraph = _createdAtGraph.filter((date) => {
        const dateObj = new Date(date);
        return dateObj >= startDate && dateObj <= endDate;
      });
    }

    const _xAxisData = [];
    const bbb = [..._createdAtGraph];
    bbb.reverse();
    bbb.map((x) => _xAxisData.push(`${moment(x).format("YYYY-MM-DD")}`));

    const _dataAtGraph = expendGraphData?.totalExpendLAK;
    const _lakData = [];
    const ccc = [..._dataAtGraph];
    ccc.reverse();
    ccc.map((x) => _lakData.push(x));

    const _incomeData = [];
    _xAxisData.map((y) => {
      const _isMatchDate = incomeGraphData.filter((z) => z?.date == y);
      if (_isMatchDate.length > 0)
        _incomeData.push(_isMatchDate[0]?.billAmount);
      else _incomeData.push(0);
    });

    const _series = [...series];
    _series[0] = {
      name: `${t("recieve_lak")}`,
      data: [..._incomeData],
    };

    _series[1] = {
      name: `${t("paid_lak")}`,
      data: [..._lakData],
    };

    const _options = OPTION;
    _options.xaxis.categories = _xAxisData;

    const _graphData = {};
    _graphData.options = _options;
    _graphData.series = _series;
    setGraphData(_graphData);

    const _incomeExpendData = [];
    _xAxisData.map((t, index) => {
      _incomeExpendData.push({
        date: t,
        income: _series[0]?.data[index],
        expend: _series[1]?.data[index],
      });
    });
    setIncomeExpendData(_incomeExpendData);
  };

  const calculateSummaryIncome = (type) => {
    let _summaryAmount = 0;
    incomeExpendData.map((x) => {
      if (type == "INCOME") _summaryAmount = _summaryAmount + x.income;
      else if (type == "EXPEND") _summaryAmount = _summaryAmount + x.expend;
      else _summaryAmount = _summaryAmount + (x.income - x.expend);
    });
    return moneyCurrency(_summaryAmount);
  };

  const convertWeekDay = (day) => {
    switch (day) {
      case 0:
        return `${t("sun")}`;
      case 1:
        return `${t("Mon")}`;
      case 2:
        return `${t("tues")}`;
      case 3:
        return `${t("wed")}`;
      case 4:
        return `${t("thurs")}`;
      case 5:
        return `${t("fri")}`;
      case 6:
        return `${t("set")}`;
      default:
        return "";
    }
  };

  const calculateDateRange = () => {
    if (user_role === role && day) {
      const endDate = new Date();
      const startDate = new Date(
        new Date().setDate(new Date().getDate() - day)
      );
      return {
        min: moment(startDate).format("YYYY-MM-DD"),
        max: moment(endDate).format("YYYY-MM-DD"),
      };
    }
    return {
      min: null,
      max: null,
    };
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 5,
          padding: 8,
        }}
      >
        <TitleComponent title={t("inc_expe")} />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "end",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Form.Label>{t("date")}</Form.Label>
          <Form.Control
            type="date"
            value={moment(dateStart).format("YYYY-MM-DD")}
            min={
              user_role === role && day
                ? calculateDateRange().min
                : undefined
            }
            max={
              user_role === role && day
                ? calculateDateRange().max
                : undefined
            }
            onChange={(e) => setDateStart(new Date(e.target.value))}
            style={{ width: 150 }}
          />{" "}
          ~{" "}
          <Form.Control
            type="date"
            value={moment(dateEnd).format("YYYY-MM-DD")}
            min={
              user_role === role && day
                ? calculateDateRange().min
                : undefined
            }
            max={
              user_role === role && day
                ? calculateDateRange().max
                : undefined
            }
            onChange={(e) => setDateEnd(new Date(e.target.value))}
            style={{ width: 150 }}
          />
        </div>
      </div>
      {/* <Filter
        filterByYear={filterByYear}
        setFilterByYear={setFilterByYear}
        filterByMonth={filterByMonth}
        setFilterByMonth={setFilterByMonth}
        dateStart={dateStart}
        setDateStart={setDateStart}
        dateEnd={dateEnd}
        setDateEnd={setDateEnd}
      /> */}
      {graphData && <IncomeExpendatureChart graphData={graphData} />}
      <div
        style={{
          display: "flex",
          flexDirection: width > 900 ? "row" : "column",
          padding: width > 900 ? "" : "0 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            // justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div
            className="p-2 hover-me"
            style={{
              backgroundColor: "#fb6e3b",
              width: width > 900 ? "25vw" : "100%",
              height: 80,
              borderRadius: 8,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              margin: 12,
            }}
          >
            <div
              style={{
                backgroundColor: "#eeeeee",
                padding: 12,
                borderRadius: 100,
              }}
            >
              <FontAwesomeIcon
                style={{ fontSize: "1.2rem", color: "#fb6e3b" }}
                icon={faMoneyBillWave}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: 30,
                  textAlign: "right",
                }}
              >
                {" "}
                {t("all_recieve")}
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: "white",
                  fontSize: 30,
                  textAlign: "right",
                }}
              >
                {calculateSummaryIncome("INCOME")}
              </div>
            </div>
          </div>
          <div
            className="p-2 hover-me"
            style={{
              backgroundColor: "#fb6e3b",
              width: width > 900 ? "25vw" : "100%",
              height: 80,
              borderRadius: 8,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              margin: 12,
            }}
          >
            <div
              style={{
                backgroundColor: "#eeeeee",
                padding: 12,
                borderRadius: 100,
              }}
            >
              <FontAwesomeIcon
                style={{ fontSize: "1.2rem", color: "#fb6e3b" }}
                icon={faFunnelDollar}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: 30,
                  textAlign: "right",
                }}
              >
                {" "}
                {t("all_paid")}
              </div>
              <div style={{ fontSize: 24, color: "white", textAlign: "right" }}>
                {calculateSummaryIncome("EXPEND")}
              </div>
            </div>
          </div>
          <div
            className="p-2 hover-me"
            style={{
              backgroundColor: "#fb6e3b",
              width: width > 900 ? "25vw" : "100%",
              height: 80,
              borderRadius: 8,
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              margin: 12,
            }}
          >
            <div
              style={{
                backgroundColor: "#eeeeee",
                padding: 12,
                borderRadius: 100,
              }}
            >
              <FontAwesomeIcon
                style={{ fontSize: "1.2rem", color: "#fb6e3b" }}
                icon={faBalanceScaleRight}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  fontWeight: "bold",
                  color: "white",
                  fontSize: 30,
                  textAlign: "right",
                }}
              >
                {" "}
                {t("accounting")}
              </div>
              <div style={{ fontSize: 24, color: "white", textAlign: "right" }}>
                {calculateSummaryIncome("")}
              </div>
            </div>
          </div>
        </div>
        <table
          style={{ width: width > 900 ? "60%" : "100%" }}
          className="table-bordered"
        >
          <tr style={{ backgroundColor: COLOR_APP, color: "white" }}>
            <th style={{ textAlign: "left" }}>{t("date")}່</th>
            <th style={{ textAlign: "right" }}>{t("total_recieve")}</th>
            <th style={{ textAlign: "right" }}>{t("total_paid")}</th>
            <th style={{ textAlign: "right" }}>{t("other_")}</th>
          </tr>
          {incomeExpendData?.map((e) => (
            <tr>
              <td style={{ textAlign: "left" }}>
                {e?.date} ({convertWeekDay(moment(e?.date).weekday())})
              </td>
              <td style={{ textAlign: "right" }}>{moneyCurrency(e?.income)}</td>
              <td style={{ textAlign: "right" }}>{moneyCurrency(e?.expend)}</td>
              <td style={{ textAlign: "right", fontWeight: "bold" }}>
                {moneyCurrency(e?.income - e?.expend)}
              </td>
            </tr>
          ))}
        </table>
      </div>
    </>
  );
}
