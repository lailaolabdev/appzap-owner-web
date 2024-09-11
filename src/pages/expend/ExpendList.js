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

/**
 * function
 */

import { getHeadersAccount } from "../../services/auth";
import {
  moneyCurrency,
  convertPayment,
  formatDate,
  convertExpendatureType,
} from "../../helpers";
/**
 * api
 */
import { END_POINT_SERVER_BUNSI, getLocalData } from "../../constants/api";

/**
 * css
 */
import { Table, Spinner, Form, Image } from "react-bootstrap";
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
} from "@fortawesome/free-solid-svg-icons";
import { COLOR_APP, EMPTY_LOGO, URL_PHOTO_AW3 } from "../../constants";
import EmptyState from "../../components/EmptyState";
import ExpendatureChart from "./ExpendatureChart";

export default function ExpendList() {
  const { t } = useTranslation();
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
  const [filterByPayment, setFilterByPayment] = useState(
    !parsed?.filterByPayment ? "ALL" : parsed?.filterByPayment
  );

  useEffect(() => {
    let filter = {
      filterByYear: filterByYear,
      filterByMonth: filterByMonth,
      dateStart: dateStart,
      dateEnd: dateEnd,
      filterByPayment: filterByPayment,
    };

    // console.log("parame?.skip:::", parame?.skip);

    fetchExpend(
      filterByYear,
      filterByMonth,
      dateStart,
      dateEnd,
      filterByPayment
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filterByYear,
    filterByMonth,
    dateStart,
    dateEnd,
    filterByPayment,
    parame?.skip,
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
      text: "ລາຍຈ່າຍ",
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

  //function()
  const fetchExpend = async (
    filterByYear,
    filterByMonth,
    dateStart,
    dateEnd,
    filterByPayment
  ) => {
    try {
      setIsLoading(true);
      const _localData = await getLocalData();
      let findby = `accountId=${
        _localData?.DATA?.storeId
      }&platform=APPZAPP&limit=${_limit}&skip=${(parame?.skip - 1) * _limit}`;
      if (filterByYear) findby += `&year=${filterByYear}`;
      if (filterByMonth) findby += `&month=${filterByMonth}`;
      if (dateStart && dateEnd)
        findby += `&date_gte=${dateStart}&date_lt=${moment(
          moment(dateEnd)
        ).format("YYYY/MM/DD")}`;
      if (filterByPayment !== "ALL" && filterByPayment !== undefined)
        findby += `&payment=${filterByPayment}`;

      // console.log("findby::", findby);

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
          console.log(res?.data?.data);
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

  return (
    <div style={{ padding: 20 }}>
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
        <div
          className="account"
          // style={{
          //   display: "flex",
          //   flexDirection: "row",
          //   justifyContent: "end",
          //   alignItems: "center",
          //   gap: 5,
          // }}
        >
          <Form.Label>{t("date")}</Form.Label>
          <Form.Control
            type="date"
            value={dateStart}
            onChange={(e) => setDateStart(e?.target?.value)}
            style={{ width: 150 }}
          />{" "}
          ຫາວັນທີ
          <Form.Control
            type="date"
            value={dateEnd}
            onChange={(e) => setDateEnd(e?.target?.value)}
            style={{ width: 150 }}
          />
          <Form.Control
            as="select"
            name="payment"
            value={filterByPayment}
            onChange={(e) => setFilterByPayment(e?.target?.value)}
            style={{ width: 150 }}
          >
            <option value="ALL">{t("show_shape")}</option>
            <option value="CASH">{t("real_money")}</option>
            <option value="TRANSFER">{t("e_money")}</option>
          </Form.Control>
          {/* <Form.Control
            as="select"
            name="payment"
            value={filterByPayment}
            onChange={(e) => setFilterByPayment(e?.target?.value)}
            style={{ width: 60 }}
          >
            <option value="40">ຈຳນວນສະແດງ</option>
            <option value="50">50</option>
            <option value="100">100</option>
            <option value="200">200</option>
          </Form.Control> */}
          {/* Button ລົງບັນຊີປະຈຳວັນ */}
          <ButtonComponent
            title={t("daily_account")}
            icon={faPlusCircle}
            colorbg={"#1d6a9f"}
            hoverbg={"orange"}
            width={"150px"}
            handleClick={() => navigate("/add-expend")}
          />
        </div>
      </div>
      <Filter
        filterByYear={filterByYear}
        setFilterByYear={setFilterByYear}
        filterByMonth={filterByMonth}
        setFilterByMonth={setFilterByMonth}
        dateStart={dateStart}
        setDateStart={setDateStart}
        dateEnd={dateEnd}
        setDateEnd={setDateEnd}
      />

      <div
        class="column"
        // style={{
        //   display: "flex",
        //   flexDirection: "row",
        //   justifyContent: "space-between",
        //   alignItems: "center",
        // }}
      >
        {/* responsive column */}

        <div
          className="p-2 hover-me"
          style={{
            backgroundColor: "#1d6a9f",
            width: 180,
            height: 80,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            margin: 10,
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
            <div style={{ fontWeight: "bold", color: "white" }}>
              {" "}
              {t("all_list")}
            </div>
            <div style={{ fontSize: 24, color: "white" }}>
              {expendData?.total}
            </div>
          </div>
        </div>
        <div
          className="p-2 hover-me"
          style={{
            backgroundColor: "#fb6e3b",
            width: 180,
            height: 80,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            margin: 10,
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
            <div style={{ fontWeight: "bold", color: "white" }}>
              {" "}
              {t("paid_lak")}
            </div>
            <div style={{ fontSize: 24, color: "white" }}>
              {moneyCurrency(totalReport?.priceLAK)}
            </div>
          </div>
        </div>
        <div
          className="p-2 hover-me"
          style={{
            backgroundColor: "#fb6e3b",
            width: 180,
            height: 80,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            margin: 10,
          }}
        >
          <div
            style={{
              backgroundColor: "#eeeeee",
              padding: 12,
              borderRadius: 100,
              width: 50,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <FontAwesomeIcon
              style={{ fontSize: "1.2rem", color: "#fb6e3b", marginTop: 3 }}
              icon={faBold}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: "bold", color: "white" }}>
              {" "}
              {t("paid_thb")}
            </div>
            <div style={{ fontSize: 24, color: "white" }}>
              {moneyCurrency(totalReport?.priceTHB)}
            </div>
          </div>
        </div>
        <div
          className="p-2 hover-me"
          style={{
            backgroundColor: "#fb6e3b",
            width: 180,
            height: 80,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            margin: 10,
          }}
        >
          <div
            style={{
              backgroundColor: "#eeeeee",
              padding: 12,
              borderRadius: 100,
              width: 50,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <FontAwesomeIcon
              style={{ fontSize: "1.2rem", color: "#fb6e3b", marginTop: 3 }}
              icon={faDollarSign}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: "bold", color: "white" }}>
              {" "}
              {t("paid_usd")}
            </div>
            <div style={{ fontSize: 24, color: "white" }}>
              {moneyCurrency(totalReport?.priceUSD)}
            </div>
          </div>
        </div>
        <div
          className="p-2 hover-me"
          style={{
            backgroundColor: "#fb6e3b",
            width: 180,
            height: 80,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            margin: 10,
          }}
        >
          <div
            style={{
              backgroundColor: "#eeeeee",
              padding: 12,
              borderRadius: 100,
              width: 50,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <FontAwesomeIcon
              style={{ fontSize: "1.2rem", color: "#fb6e3b", marginTop: 3 }}
              icon={faYenSign}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: "bold", color: "white" }}>
              {" "}
              {t("paid_cny")}
            </div>
            <div style={{ fontSize: 24, color: "white" }}>
              {moneyCurrency(totalReport?.priceCNY)}
            </div>
          </div>
        </div>
        <div
          className="p-2 hover-me"
          style={{
            backgroundColor: "#fb6e3b",
            width: 180,
            height: 80,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            margin: 10,
          }}
          onClick={() => setIsShowGraphDisplay(!isGraphDisplay)}
        >
          <div
            style={{
              backgroundColor: "#eeeeee",
              padding: 12,
              borderRadius: 100,
              width: 50,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <FontAwesomeIcon
              style={{ fontSize: "1.2rem", color: "#fb6e3b", marginTop: 3 }}
              icon={isGraphDisplay ? faChartLine : faListAlt}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: "bold", color: "white" }}>
              {" "}
              {t("total_in_lak")}
            </div>
            <div style={{ fontSize: 24, color: "white" }}>
              {moneyCurrency(totalReport?.totalSumInLAK)}
            </div>
          </div>
        </div>
        <div
          className="p-2 hover-me"
          style={{
            backgroundColor: "#fb6e3b",
            width: 180,
            height: 80,
            borderRadius: 8,
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            margin: 10,
          }}
          onClick={() => setIsShowGraphDisplay(!isGraphDisplay)}
        >
          <div
            style={{
              backgroundColor: "#eeeeee",
              padding: 12,
              borderRadius: 100,
              width: 50,
              height: 50,
              display: "flex",
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            <FontAwesomeIcon
              style={{ fontSize: "1.2rem", color: "#fb6e3b", marginTop: 3 }}
              icon={isGraphDisplay ? faChartLine : faListAlt}
            />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontWeight: "bold", color: "white" }}>
              {" "}
              {t("show_in")}
            </div>
            <div style={{ fontSize: 24, color: "white" }}>
              {isGraphDisplay ? "Graph" : `${t("detial")}`}
            </div>
          </div>
        </div>
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
              expendData?.data.length > 0 &&
              expendData?.data.map((item, index) => (
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
    </div>
  );
}
