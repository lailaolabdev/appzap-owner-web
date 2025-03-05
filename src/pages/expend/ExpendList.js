import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
/**
 * component
 */
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { TitleComponent, ButtonComponent } from "../../components";
import Filter from "./component/filter";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import PaginationComponent from "../../components/PaginationComponent";
import queryString from "query-string";
import { useTranslation } from "react-i18next";
import ExportExpenses from "../../components/ExportExpenses";

import Select from "react-select";
/**
 * function
 */

import { getHeadersAccount } from "../../services/auth";
import {
  moneyCurrency,
  convertPayment,
  formatDate,
  convertExpendatureType,
  calculateTotalPaid,
  calculateTotalSumInLAK,
} from "../../helpers";
/**
 * api
 */
import {
  END_POINT_SERVER_BUNSI,
  getLocalData,
  QUERY_CURRENCIES,
  QUERY_CURRENCY_HISTORY,
} from "../../constants/api";
// import { END_POINT_SERVER_BUNSI, getLocalData } from "../../constants/api";
import { getAllShift } from "../../services/shift";
import { useStoreStore } from "../../zustand/storeStore";
import { useShiftStore } from "../../zustand/ShiftStore";
import { useStore } from "../../store";

/**
 * css
 */
import { Table, Spinner, Form, Image, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faBalanceScaleRight,
  faBold,
  faChartLine,
  faDollarSign,
  faEdit,
  faListAlt,
  faMoneyBillWave,
  faPlusCircle,
  faTrash,
  faYenSign,
  faFileExport,
} from "@fortawesome/free-solid-svg-icons";
import { COLOR_APP, EMPTY_LOGO, URL_PHOTO_AW3 } from "../../constants";
import EmptyState from "../../components/EmptyState";
import ExpendatureChart from "./ExpendatureChart";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import { cn } from "../../utils/cn";
import Axios from "axios";

export default function ExpendList() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  //constant
  const parame = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { _limit, _skip, Pagination_component } = PaginationComponent();
  const parsed = queryString?.parse(location?.state);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [expendData, setExpendData] = useState(null);
  const [expendGraphData, setExpendGraphData] = useState();

  const [expendDetail, setExpendDetail] = useState();
  const [shoConfirmDelete, setShowConfirmDelete] = useState(false);

  const [totalReport, setTotalReport] = useState();
  const [isGraphDisplay, setIsShowGraphDisplay] = useState(false);

  //filter
  const [filterByYear, setFilterByYear] = useState(
    !parsed?.filterByYear ? currentYear : parsed?.filterByYear
  );
  const [filterByMonth, setFilterByMonth] = useState(
    !parsed?.filterByMonth ? currentMonth : parsed?.filterByMonth
  );

  const [startDate, setStartDate] = useState(moment().format("YYYY/MM/DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY/MM/DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [isFilterDatePopUpOpen, setIsFilterDatePopUpOpen] = useState(false);
  const [exchangerateData, setExchangerateData] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [shiftId, setShiftId] = useState(null);

  // const startDate = new Date(year, month, 1);
  // const endDate = new Date(year, month + 1, 0);
  const time = new Date();
  const month = time.getMonth();
  const year = time.getFullYear();

  const [dateStart, setDateStart] = useState(
    // !parsed?.dateStart ? "" : parsed?.dateStart
    new Date(year, month, 1)
  );
  const [dateEnd, setDateEnd] = useState(
    // !parsed?.dateEnd ? "" : parsed?.dateEnd
    new Date(year, month + 1, 0)
  );

  const { storeDetail } = useStoreStore();
  const { profile } = useStore();
  const { shiftCurrent } = useShiftStore();

  const [filterByPayment, setFilterByPayment] = useState(
    !parsed?.filterByPayment ? "ALL" : parsed?.filterByPayment
  );

  const fetchShift = async () => {
    await getAllShift()
      .then((res) => {
        setShifts(res?.data?.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchShift();
  }, []);

  useEffect(() => {
    fetchExpend(
      filterByYear,
      filterByMonth,
      dateStart,
      dateEnd,
      startDate,
      endDate,
      startTime,
      endTime,
      filterByPayment
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterByYear,
    filterByMonth,
    dateStart,
    dateEnd,
    startDate,
    endDate,
    startTime,
    endTime,
    filterByPayment,
    parame?.skip,
    shiftId,
  ]);

  const [series, setSeries] = useState([
    {
      name: "ລາຍຈ່າຍກີບ",
      data: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 9, 5, 4, 6, 6, 7, 8, 3, 2, 3, 4, 5, 6,
      ],
    },
  ]);

  const [options, setOptions] = useState({
    chart: {
      height: 350,
      type: "line",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    colors: [COLOR_APP, "#00ABB3"],
    dataLabels: {
      enabled: true,
      formatter: function (value) {
        return value.toLocaleString("en-US");
      },
    },
    title: {
      text: t("pay"),
      align: "left",
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
        opacity: 0.5,
      },
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return value.toLocaleString("en-US");
        },
      },
    },
    xaxis: {
      categories: [],
    },
  });

  const modifyData = () => {
    let _createdAtGraph = expendGraphData?.createdAt;
    let _xAxisData = [];
    _createdAtGraph.map((x) => _xAxisData.push(x));
    let _options = options;
    _options.xaxis.categories = _xAxisData;

    let _dataAtGraph = expendGraphData?.totalExpendLAK;
    let _lakData = [];
    _dataAtGraph.map((x) => _lakData.push(x));
    let _series = [...series];
    _series[0] = {
      data: [..._lakData],
    };
    setSeries(_series);
    setOptions(_options);
  };

  useEffect(() => {
    if (!expendGraphData) return;
    modifyData();
  }, [expendGraphData]);

  useEffect(() => {
    getDataCurrencyHistory();
  }, []);

  //function()
  const fetchExpend = async (
    filterByYear,
    filterByMonth,
    dateStart,
    dateEnd,
    startDate,
    endDate,
    filterByPayment
  ) => {
    // console.log("fetchExpend::", dateStart, dateEnd);
    try {
      setIsLoading(true);
      const _localData = await getLocalData();
      let findby = `accountId=${
        _localData?.DATA?.storeId
      }&platform=APPZAPP&limit=${_limit}&skip=${(parame?.skip - 1) * _limit}`;
      // if (filterByYear) findby += `&year=${filterByYear}`;
      // if (filterByMonth) findby += `&month=${filterByMonth}`;

      if (profile?.data?.role === "APPZAP_ADMIN") {
        if (startDate && endDate) {
          findby += `&date_gte=${startDate}`;
          findby += `&date_lt=${endDate}`;
        }
        if (startTime && endTime) {
          findby += `&startTime=${startTime}&endTime=${endTime}&`;
        }

        if (shiftId) {
          findby += `&shiftId=${shiftId}`;
        }
      } else {
        findby += `&date_gte=${startDate}&`;
        findby += `&date_lt=${endDate}&`;
        findby += `&startTime=${startTime}&`;
        findby += `&endTime=${endTime}&`;
        if (shiftCurrent[0]) {
          findby += `&shiftId=${shiftCurrent[0]?._id}&`;
        }
      }

      let header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "get",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expends?${findby}`,
        headers: headers,
      })
        .then((res) => {
          setExpendData(res.data);
        })
        .finally(() => {
          setIsLoading(false);
        });

      await axios({
        method: "get",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expend-report?${findby}`,
        headers: headers,
      })
        .then((res) => {
          setTotalReport(res?.data?.data);
          // setExpendData(res?.data?.expends);
          // console.log("Reports", res?.data?.expends);
          setExpendGraphData(res?.data?.data?.chartExpend);
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (err) {
      console.log("err:::", err);
    }
  };

  const getDataCurrencyHistory = async () => {
    try {
      // alert("jojo");
      const { DATA } = await getLocalData();
      if (DATA) {
        const data = await Axios.get(
          `${QUERY_CURRENCIES}?storeId=${DATA?.storeId}&p=createdBy`
        );
        if (data?.status == 200) {
          setExchangerateData(data?.data?.data);
        }
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  //_confirmeDelete
  const _confirmeDelete = async () => {
    try {
      await setFilterByPayment("ALL");
      await setIsLoading(true);
      await setShowConfirmDelete(false);
      const _localData = await getLocalData();
      let header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "delete",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expend/${expendDetail?._id}`,
        headers: headers,
      }).then(async () => {
        await setExpendDetail();
        await successAdd(`${t("delete_success")}`);
        await fetchExpend(
          filterByYear,
          filterByMonth,
          dateStart,
          dateEnd,
          filterByPayment
        );
        await setIsLoading(false);
      });
    } catch (err) {
      errorAdd(`${t("delete_fail")}`);
      console.log("err:::", err);
    }
  };

  function limitText(text, limit) {
    if (!text) {
      return ""; // Return an empty string if the text is undefined or null
    }
    if (text.length <= limit) {
      return text; // Return the original text if it's within the limit
    } else {
      // If the text is longer than the limit, truncate it and append '...'
      return text.slice(0, limit) + "...";
    }
  }

  useEffect(() => {
    if (totalReport) {
      // Calculate the total sum in LAK using the helper function
      const convertTotal = calculateTotalSumInLAK(
        totalReport,
        exchangerateData
      );

      // If the total is not NaN or undefined, set it; otherwise, set to 0
      totalReport.totalSumInLAK = convertTotal || 0;
    }
  }, [totalReport]);

  const dataCardOption = [
    {
      title: "all_list",
      total: expendData?.total,
      icon: faBalanceScaleRight,
      enabled: true,
    },
    {
      title: "paid_lak",
      total: totalReport?.priceLAK,
      icon: faMoneyBillWave,
      enabled: true,
    },
    {
      title: "paid_thb",
      total: totalReport?.priceTHB,
      icon: faBold,
      enabled: true,
    },
    {
      title: "paid_usd",
      total: totalReport?.priceUSD,
      icon: faDollarSign,
      enabled: true,
    },
    {
      title: "paid_cny",
      total: totalReport?.priceCNY,
      icon: faYenSign,
      enabled: true,
    },
    {
      title: "total_in_lak",
      total: totalReport?.totalSumInLAK,
      icon: faChartLine,
      enabled: true,
    },
  ];

  const optionsData = [
    {
      value: {
        shiftID: "ALL",
      },
      label: t("all_shifts"),
    },
    ...(shifts ?? []).map((item) => {
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
      fetchExpend(
        filterByYear,
        filterByMonth,
        dateStart,
        dateEnd,
        startDate,
        endDate,
        startTime,
        endTime,
        filterByPayment
      );
    } else {
      setShiftId(option?.value?.shiftID);
    }
  };

  return (
    <div
      style={{
        padding: "20px 20px 80px 20px",
        maxHeight: "100vh",
        height: "100%",
        overflow: "auto",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div
        class="account-payment"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 5,
        }}
      >
        <TitleComponent title={t("paid_account")} />
        <div className="flex flex-wrap gap-3">
          <ExportExpenses data={expendData?.data} />
          <Button
            variant="outline-primary"
            size="small"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
            onClick={() => setIsFilterDatePopUpOpen(true)}
          >
            <BsFillCalendarWeekFill />
            <div>
              {startDate} {startTime}
            </div>{" "}
            ~{" "}
            <div>
              {endDate} {endTime}
            </div>
          </Button>
          {profile?.data?.role === "APPZAP_ADMIN" && storeDetail?.isShift && (
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Select
                placeholder={t("chose_shift")}
                className="min-w-[170px] w-full border-orange-500"
                options={optionsData}
                onChange={handleSearchInput}
              />
            </div>
          )}

          <ButtonComponent
            title={t("daily_account")}
            icon={faPlusCircle}
            colorbg={"#f97316"}
            // hoverbg={"orange"}
            width={"150px"}
            handleClick={() => navigate("/add-expend")}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-4">
        {dataCardOption.map((item, index) => (
          <div className="rounded-[10px] w-full bg-white shadow-card flex items-center gap-3 p-3">
            <div
              className={cn(
                "p-2 text-lg md:text-xl bg-orange-500 text-white flex justify-center items-center rounded-md",
                "w-10 md:w-11 h-10 md:h-11 min-w-10 md:min-w-11 min-h-10 md:min-h-11"
              )}
            >
              <FontAwesomeIcon icon={item.icon} />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                className={cn(
                  "text-sm md:text-base text-gray-500 font-medium",
                  language === "la" ? "font-noto" : "font-inter"
                )}
              >
                {t(item.title)}
              </div>
              <div className="text-black text-base md:text-xl font-inter font-semibold">
                {moneyCurrency(item.total)}
              </div>
            </div>
          </div>
        ))}
      </div>
      {isGraphDisplay && <ExpendatureChart series={series} options={options} />}

      {isLoading ? (
        <div>
          <center>
            <Spinner animation="border" variant="warning" />
          </center>
        </div>
      ) : (
        <Table responsive="xl" className="mt-3 table-hover table-bordered">
          <thead>
            <tr style={{ backgroundColor: "#fb6e3b", color: "white" }}>
              <th>#</th>
              <th>{t("date")}</th>
              <th style={{ textWrap: "nowrap" }} width="30%">
                {t("detial")}
              </th>
              <th>{t("paid_type")}</th>
              <th style={{ textWrap: "nowrap" }}>{t("paid_mode")}</th>
              <th style={{ textWrap: "nowrap" }}>{t("jam")}</th>
              <th style={{ textWrap: "nowrap" }}>{t("payer")}</th>
              <th style={{ textAlign: "right" }}>{t("lak")}</th>
              <th style={{ textAlign: "right" }}>{t("thb")}</th>
              <th style={{ textAlign: "right" }}>{t("cny")}</th>
              <th style={{ textAlign: "right" }}>{t("usd")}</th>
              <th style={{ textWrap: "nowrap" }}>{t("manage")}</th>
            </tr>
          </thead>
          <tbody>
            {expendData?.data &&
              expendData?.data?.length > 0 &&
              expendData?.data?.map((item, index) => (
                <tr
                  key={"expend" + index}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/detail-expend/${item?._id}`)}
                >
                  <td>{index + 1 + _limit * (parame?.skip - 1)}</td>
                  <td style={{ textAlign: "left", textWrap: "nowrap" }}>
                    {formatDate(item?.dateExpend)}
                  </td>
                  <td style={{ textAlign: "left" }}>
                    {limitText(item?.detail, 50)}
                  </td>
                  <td style={{ textWrap: "nowrap" }}>
                    {convertExpendatureType(item?.type)}
                  </td>
                  <td>{convertPayment(item?.payment)}</td>
                  <td
                    style={{
                      padding: 0,
                      display: "flex",
                      justifyContent: "center",
                      height: 50,
                      alignItems: "center",
                    }}
                  >
                    <Image
                      src={
                        item?.expendImages?.length > 0
                          ? URL_PHOTO_AW3 + item?.expendImages[0]
                          : EMPTY_LOGO
                      }
                      // width="100"
                      // height="100"
                      style={{
                        height: 40,
                        width: 40,
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td>{item?.paidBy}</td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    {moneyCurrency(item?.priceLAK)}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    {moneyCurrency(item?.priceTHB)}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    {moneyCurrency(item?.priceCNY)}
                  </td>
                  <td style={{ textAlign: "right", fontWeight: "bold" }}>
                    {moneyCurrency(item?.priceUSD)}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        gap: 15,
                        alignItems: "center",
                        justifyContent: "center",
                        flexDirection: "row",
                      }}
                    >
                      <FontAwesomeIcon
                        onClick={(event) => {
                          event.stopPropagation();
                          navigate(`/edit-expend/${item?._id}`);
                        }}
                        icon={faEdit}
                        style={{ cursor: "pointer" }}
                      />
                      <FontAwesomeIcon
                        onClick={(event) => {
                          event.stopPropagation();
                          setShowConfirmDelete(true);
                          setExpendDetail(item);
                        }}
                        icon={faTrash}
                        style={{ cursor: "pointer", color: "red" }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      )}

      {expendData?.data.length == 0 && (
        <EmptyState text={`${t("still_not_paid")}`} />
      )}
      {Pagination_component(
        expendData?.total,
        "/expends",
        `filterByYear=${filterByYear}&&filterByMonth=${filterByMonth}&&dateStart=${dateStart}&&dateEnd=${dateEnd}&&filterByPayment=${filterByPayment}`
      )}

      <PopUpConfirmDeletion
        open={shoConfirmDelete}
        text={limitText(expendDetail?.detail, 50)}
        onClose={() => setShowConfirmDelete(false)}
        onSubmit={_confirmeDelete}
      />

      <PopUpSetStartAndEndDate
        open={isFilterDatePopUpOpen}
        onClose={() => setIsFilterDatePopUpOpen(false)}
        startDate={startDate}
        setStartDate={setStartDate}
        setStartTime={setStartTime}
        startTime={startTime}
        setEndDate={setEndDate}
        setEndTime={setEndTime}
        endTime={endTime}
        endDate={endDate}
      />
    </div>
  );
}
