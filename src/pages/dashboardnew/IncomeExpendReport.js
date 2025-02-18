import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import Select from "react-select";
import { TitleComponent } from "../../components";
import { Form, Button } from "react-bootstrap";
import IncomeExpendatureChart from "./IncomeExpendatureChart";
import { COLOR_APP } from "../../constants";
import {
  END_POINT_SERVER_BUNSI,
  getLocalData,
  END_POINT_SEVER,
  PERMISSIONS_COUNTER,
} from "../../constants/api";
import { useStore } from "../../store";
import PaginationComponent from "../../components/PaginationComponent";
import { getHeadersAccount } from "../../services/auth";
import { useLocation, useParams } from "react-router-dom";
import { moneyCurrency } from "../../helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsFillCalendarWeekFill } from "react-icons/bs";
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
import PopUpManageCounter from "../../components/popup/PopUpManageCounter";
import { manageCounterService } from "../../services/manageCounterService";

import { useStoreStore } from "../../zustand/storeStore";
import { useShiftStore } from "../../zustand/ShiftStore";
import { getAllShift } from "./../../services/shift";
import theme from "../../theme";

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
  const today = new Date();
  const [dateStart, setDateStart] = useState(moment().format("YYYY/MM/DD"));
  const [dateEnd, setDateEnd] = useState(moment().format("YYYY/MM/DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
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

  const [openGetDate, setOpenGetDate] = useState(false);

  const [days, setDays] = useState(null);
  const [shiftData, setShiftData] = useState([]);
  const [shiftId, setShiftId] = useState(null);

  const { profile } = useStore();
  const { storeDetail } = useStoreStore();
  const { shiftCurrent } = useShiftStore();
  const storeId = storeDetail?._id;
  const user_role = profile.data?.role;

  const User_store = "APPZAP_COUNTER";
  //const User_store = "APPZAP_ADMIN";

  const fetchShift = async () => {
    await getAllShift()
      .then((res) => {
        setShiftData(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchShift();
    const time = new Date();
    const month = time.getMonth();
    const year = time.getFullYear();
    setDateStart(moment(new Date(year, month, 1)).format("YYYY-MM-DD"));
    setDateEnd(moment(new Date(year, month + 1, 0)).format("YYYY-MM-DD"));
  }, []);

  useEffect(() => {
    if (user_role === User_store) {
      // If user is store admin, set to current day only
      const startOfDay = moment(today).startOf("day").toDate();
      const endOfDay = moment(today).endOf("day").toDate();
      setDateStart(moment(startOfDay).format("YYYY/MM/DD"));
      setDateEnd(moment(endOfDay).format("YYYY/MM/DD"));
    } else {
      // For other users, set to current month
      const time = new Date();
      const month = time.getMonth();
      const year = time.getFullYear();
      setDateStart(moment(new Date(year, month, 1)).format("YYYY-MM-DD"));
      setDateEnd(moment(new Date(year, month + 1, 0)).format("YYYY-MM-DD"));
    }
  }, [user_role]);

  const fetchData = async () => {
    try {
      const response = await manageCounterService.getManageCounter(storeId);
      setDays(response?.data[0]?.manageCounter || null);
    } catch (error) {
      console.error(
        "Error fetching manage counter:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, [storeId]);

  //console.log("days:", days)

  useEffect(() => {
    if (dateStart && dateEnd && shiftId) {
      getIncomeExpendData();
    }
  }, [dateStart, dateEnd, shiftId]);

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
  const [series, setSeries] = useState([
    {
      name: `${t("expe_lak")}`,
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 9, 5, 4, 6, 6, 7, 8, 3, 2, 3, 4, 5, 6,
      ],
    },
    {
      name: `${t("recieve_lak")}`,
      data: [
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        2,
        4,
        ,
        9,
        5,
        3,
        6,
        6,
        6,
        9,
        4,
        4,
        5,
        4,
        7,
        8,
      ],
    },
  ]);

  const [options, setOptions] = useState(OPTION);

  useEffect(() => {
    getIncomeExpendData();
  }, []);

  useEffect(() => {
    getIncomeExpendData();
  }, [dateStart, dateEnd, shiftId]);

  useEffect(() => {
    if (!expendGraphData) return;
    modifyData();
  }, [expendGraphData, incomeGraphData]);

  useEffect(() => {
    if (!series || !options) return;
    // modifyData()
  }, [series, options]);

  const getIncomeExpendData = async () => {
    if (!dateStart || !dateEnd) return;

    try {
      const _localData = await getLocalData();
      let findby = `accountId=${
        _localData?.DATA?.storeId
      }&platform=APPZAPP&limit=${_limit}&skip=${(parame?.skip - 1) * _limit}`;

      if (dateStart && dateEnd)
        findby += `&date_gte=${dateStart}&date_lt=${dateEnd}`;

      const header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "get",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expend-report?${findby}`,
        headers: headers,
      })
        .then((res) => {
          setExpendGraphData(res?.data?.data?.chartExpend);
          //console.log("ExpendGraphData", res?.data);
        })
        .finally(() => {
          setIsLoading(false);
        });

      let findIncomeby = `${_localData?.DATA?.storeId}?`;
      if (profile?.data?.role === "APPZAP_ADMIN") {
        if (dateStart && dateEnd) {
          findIncomeby += `startDate=${dateStart}&`;
          findIncomeby += `endDate=${dateEnd}&`;
          findIncomeby += `startTime=${startTime}&`;
          findIncomeby += `endTime=${endTime}&`;
        }

        if (shiftId) {
          findIncomeby += `shiftId=${shiftId}&`;
        }
      } else {
        findIncomeby += `startDate=${dateStart}&`;
        findIncomeby += `endDate=${dateEnd}&`;
        findIncomeby += `startTime=${startTime}&`;
        findIncomeby += `endTime=${endTime}&`;
        if (shiftCurrent[0]) {
          findIncomeby += `shiftId=${shiftCurrent[0]?._id}&`;
        }
      }

      await axios({
        method: "post",
        url: `${END_POINT_SEVER}/v7/report-daily/${findIncomeby}`,
        headers: headers,
      })
        .then((res) => {
          console.log("IncomeGraphData", res?.data);
          setIncomeGraphData(res?.data);
          setIsLoading(false);
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

    const _createdAtGraph = expendGraphData?.createdAt;
    const _xAxisData = [];
    const bbb = [..._createdAtGraph];
    bbb.reverse();
    bbb.map((x) => _xAxisData.push(`${moment(x).format("YYYY-MM-DD")}`));
    const _options = OPTION;
    _options.xaxis.categories = _xAxisData;

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

  const optionsData = [
    {
      value: {
        shiftID: "ALL",
      },
      label: t("all_shifts"),
    },
    ...(shiftData ?? []).map((item) => {
      return {
        value: {
          shiftID: item._id,
        },
        label: item.shiftName,
      };
    }),
  ];

  const handleSearchInput = (option) => {
    if (option?.value?.shiftID === "ALL") {
      setShiftId(null);
      getIncomeExpendData();
    } else {
      setShiftId(option?.value?.shiftID);
    }
  };

  return (
    <div>
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
          {user_role === User_store ? (
            <Form.Group style={{ width: "100%" }}>
              <Form.Label>{t("date_time")}</Form.Label>
              <Button
                variant="outline-primary"
                size="small"
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  width: "100%",
                }}
                onClick={() => setOpenGetDate({ popupfiltter: true })}
              >
                <BsFillCalendarWeekFill />
                {/* <div>{dateStart ? dateStart : ""}</div> */}
                <div>
                  {dateStart ? moment(dateStart).format("YYYY-MM-DD") : ""}
                </div>

                {" ~ "}
                <div>{dateEnd ? moment(dateEnd).format("YYYY-MM-DD") : ""}</div>
                {/* <div>{dateEnd ? dateEnd : ""}</div> */}
              </Button>
            </Form.Group>
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <Form.Label>{t("date")}</Form.Label>
              <Form.Control
                type="date"
                value={dateStart ? dateStart : ""}
                onChange={(e) => setDateStart(e.target.value)}
                style={{ width: 150, marginLeft: "3px" }}
              />
              <span>~</span>
              <Form.Control
                type="date"
                value={dateEnd ? dateEnd : ""}
                onChange={(e) => setDateEnd(e.target.value)}
                style={{ width: 150 }}
              />
            </div>
          )}
          {profile?.data?.role === "APPZAP_ADMIN"
            ? storeDetail?.isShift && (
                <div className="flex gap-1 items-center">
                  <Select
                    placeholder={t("chose_shift")}
                    className="w-36 border-orange-500"
                    options={optionsData}
                    onChange={handleSearchInput}
                  />
                </div>
              )
            : ""}
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
              backgroundColor: theme.primaryColor,
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
                style={{ fontSize: "1.2rem", color: theme.primaryColor }}
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
              backgroundColor: theme.primaryColor,
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
                style={{ fontSize: "1.2rem", color: theme.primaryColor }}
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
              backgroundColor: theme.primaryColor,
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
                style={{ fontSize: "1.2rem", color: theme.primaryColor }}
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

      <PopUpManageCounter
        open={openGetDate?.popupfiltter}
        onClose={() => setOpenGetDate()}
        dateStart={dateStart}
        dateEnd={dateEnd}
        setDateStart={setDateStart}
        setDateEnd={setDateEnd}
        days={days}
        handlePresetDate
      />
    </div>
  );
}
