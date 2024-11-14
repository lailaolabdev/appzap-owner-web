import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import { TitleComponent } from "../../components";
import { Form, Button } from "react-bootstrap";
import IncomeExpendatureChart from "./IncomeExpendatureChart";
import { COLOR_APP } from "../../constants";
import {
  END_POINT_SERVER_BUNSI,
  getLocalData,
  END_POINT_SEVER,
  PERMISSIONS_COUNTER
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
import PopUpPermissonCounter from "../../components/popup/PopUpPermissionCounter";

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
  const [dateStart, setDateStart] = useState(new Date(year, month, 1));
  const [dateEnd, setDateEnd] = useState(new Date(year, month + 1, 0));

  

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
  const { profile, storeDetail } = useStore();
  const [openGetDate, setOpenGetDate] = useState(false);
  const storeId = storeDetail?._id;
  const user_role = profile.data?.role;
  const [days , setDays] = useState(null)
  const today = new Date();

  //console.log("profile:", profile);
  console.log("user_role:", user_role);

  const User_store = "APPZAP_ADMIN";
  console.log("days: ", days)
  console.log("datestart: ", dateStart)
  console.log("dateEnd: ", dateEnd)

  // console.log("incomeExpendData::", incomeExpendData);
  

  useEffect(() => {
    const fetchInitialSwitchState = async () => {
      try {
        const response = await axios.get(`${PERMISSIONS_COUNTER}/${storeId}`);
        if (response.data) {
          const currentCounter = response.data.permissionsCounter;
          if (currentCounter) {
            setDays(currentCounter);
          }
        }
      } catch (error) {
        console.error('Error fetching initial switch state:', error);
      }
    };

    if (storeId) {
      fetchInitialSwitchState();
    }
  }, [storeId , days]);


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
    // title: {
    //   text: "ລາຍຮັບ ແລະ ລາຍຈ່າຍ",
    //   align: "left",
    // },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
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
      const today = moment().format("YYYY-MM-DD");
  
      // ตรวจสอบเงื่อนไข User_store และ user_role
      if (User_store === user_role) {
        setDateStart(new Date());
        setDateEnd(new Date());
      } else {
        setDateStart(new Date(year, month, 1));
        setDateEnd(new Date(year, month + 1, 0));
      }
  
      let findby = `accountId=${
        _localData?.DATA?.storeId
      }&platform=APPZAPP&limit=${_limit}&skip=${(parame?.skip - 1) * _limit}`;
  
      if (dateStart && dateEnd) {
        findby += `&date_gte=${moment(dateStart).format(
          "YYYY/MM/DD"
        )}&date_lt=${moment(dateEnd).format("YYYY/MM/DD")}`;
      }
  
      const header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
  
      // ดึงข้อมูลค่าใช้จ่าย (Expenditure)
      await axios({
        method: "get",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expend-report?${findby}`,
        headers: headers,
      })
        .then((res) => {
          setExpendGraphData(res?.data?.data?.chartExpend);
          console.log("ExpendGraphData", res?.data);
        })
        .finally(() => {
          setIsLoading(false);
        });
  
      // ดึงข้อมูลรายรับ (Income)
      let findIncomeby = `${_localData?.DATA?.storeId}?`;
      if (dateStart && dateEnd) {
        findIncomeby += `startDate=${moment(dateStart).format(
          "YYYY-MM-DD"
        )}&endDate=${moment(dateEnd).format("YYYY-MM-DD")}`;
      }
      
      findIncomeby += `&endTime=23:59:59&startTime=00:00:00`;
      await axios({
        method: "post",
        url: `${END_POINT_SEVER}/v4/report-daily/${findIncomeby}`,
        headers: headers,
      })
        .then((res) => {
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
            <Form.Group style={{ width: "100%"}}>
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
                <div>{moment(dateStart).format("YYYY-MM-DD")}</div>
                {" ~ "}
                <div>{moment(dateEnd).format("YYYY-MM-DD")}</div>
              </Button>
            </Form.Group>
          ) : (
            <div style={{display:"flex", alignItems:'center'}}>
              <Form.Label>{t("date")}</Form.Label>
              <Form.Control
                type="date"
                value={dateStart}
                onChange={(e) => setDateStart(e?.target?.value)}
                style={{ width: 150,marginLeft:"3px" }}
              />
              <span>~</span>
              <Form.Control
                type="date"
                value={dateEnd}
                onChange={(e) => setDateEnd(e?.target?.value)}
                style={{ width: 150 }}
              />
            </div>
          )}
          {/* <Form.Control
            as="select"
            name="payment"
            // value={filterByPayment}
            // onChange={(e) => setFilterByPayment(e?.target?.value)}
            style={{ width: 150 }}
          >
            <option value="ALL">ສະແດງຮູບແບບ</option>
            <option value="CASH">ເງິນສົດ</option>
            <option value="TRANSFER">ເງິນໂອນ</option>
          </Form.Control> */}
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

      <PopUpPermissonCounter
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
