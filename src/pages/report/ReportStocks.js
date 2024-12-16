import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import useWindowDimension2 from "../../helpers/useWindowDimension2";
import { MdCallMissedOutgoing, MdSearch } from "react-icons/md";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import axios from "axios";
import NavList from "../../pages/stock/components/NavList";
import StockGroups from "./StockGroups";
import { thousandSeparator } from "../../helpers/thousandSeparator";
import { COLOR_APP } from "../../constants";
import PaginationAppzap from "../../constants/PaginationAppzap";
import LoadingAppzap from "../../components/LoadingAppzap";
import moment from "moment";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import ProgressBar from "@ramonak/react-progress-bar";
import { formatDateNow, numberFormat } from "../../helpers";
import {
  getCountStocksAll,
  getStocksAll,
  getStocksHistories,
} from "../../services/stocks";
import { IoSearchCircleOutline } from "react-icons/io5";
import EmptyState from "../../components/EmptyState";
import { useTranslation } from "react-i18next";
import useWindowDimensions2 from "../../helpers/useWindowDimension2";

export default function ReportStocks() {
  const { t } = useTranslation();
  const { height, width } = useWindowDimension2();
  const _stDate = moment().startOf("month").format("YYYY-MM-DD");
  const _edDate = moment().endOf("month").format("YYYY-MM-DD");

  const [historiesExport, setHistoriesExport] = useState([]);
  const [isLoadingTotal, setIsLoadingTotal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stocks, setStocks] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [totalStock, setTotalStock] = useState(0);
  const [totalStockGroups, setTotalStockGroups] = useState(0);
  const [bestStockImport, setBestStockImport] = useState();
  const [bestStockExport, setBestStockExport] = useState();
  const [bestStockReturn, setBestStockReturn] = useState();

  const [openGetDate, setOpenGetDate] = useState(false);
  const [startDate, setStartDate] = useState(_stDate);
  const [endDate, setEndDate] = useState(_edDate);
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");

  const rowsPerPage = 10;
  const [page, setPage] = useState(0);
  const pageAll = totalStock > 0 ? Math.ceil(totalStock / rowsPerPage) : 1;

  const handleChangePage = useCallback((newPage) => {
    setPage(newPage);
  }, []);

  const rowsPerPageTotal = 10;
  const [pageTotal, setPageTotal] = useState(0);
  const pageAllTotal =
    totalStockGroups > 0 ? Math.ceil(totalStockGroups / rowsPerPage) : 1;
  const handleChangePageTotal = useCallback((newPage) => {
    setPageTotal(newPage);
  }, []);

  const _localData = getLocalData();
  //ເອິ້ນໃຊ້ function ດືງຂໍ້ມູນຮ້ານ
  useEffect(() => {
    const fetchData = async () => {
      if (_localData) {
        getStockHistories();
      }
    };
    fetchData();
  }, [_localData?.DATA?.storeId, startDate, endDate, pageTotal]);

  // ເອື້ນໃຊ້​ function ດືງຂໍ້ມູນສະຕ໋ອກ ແລະ ປະຫວັດສະຕ໋ອກ
  useEffect(() => {
    getStocks();
    getCountStocks();
  }, [page, startDate, endDate]);

  // ດຶງຂໍ້ມູນຂອງປະຫວັດສະຕ໋ອກທັງໝົດ
  const getStockHistories = async () => {
    try {
      setIsLoadingTotal(true);
      const _localData = await getLocalData();
      const storeId = _localData?.DATA?.storeId;

      const findBy = `&dateFrom=${startDate}&dateTo=${endDate}&timeFrom=${startTime}&timeTo=${endTime}&skip=${
        page * rowsPerPage
      }&limit=${rowsPerPage}`;
      const response = await getStocksHistories(storeId, findBy);

      if (response.status === 200 && response.data) {
        const findBest = (key) => {
          return response?.data?.datas.reduce(
            (prev, current) => (prev[key] > current[key] ? prev : current),
            response?.data?.datas[0]
          );
        };

        const bestStockImport = findBest("totalQtyImport");
        const bestStockExport = findBest("totalQtyExport");
        const bestStockReturn = findBest("totalQtyReturn");

        setBestStockImport(bestStockImport);
        setBestStockExport(bestStockExport);
        setBestStockReturn(bestStockReturn);

        setHistoriesExport(response?.data?.datas);
        setTotalStockGroups(response?.data?.total);
      }
    } catch (error) {
      console.error("error:-->", error);
    } finally {
      setIsLoadingTotal(false);
    }
  };

  // ດຶງຂໍ້ມູນສະຕ໋ອກປະຈຸບັນທັງໝົດ
  const getStocks = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        let findby = "?";
        findby += `storeId=${_localData?.DATA?.storeId}&`;
        findby += `skip=${page * rowsPerPage}&`;
        findby += `limit=${rowsPerPage}&`;
        findby += `search=${filterName}&`;
        const res = await getStocksAll(findby);
        if (res.status === 200) {
          // console.log('res--->', res)
          // setTotalStock(res?.data?.total);
          setStocks(res?.data);
          setIsLoading(true);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  const getCountStocks = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        let findby = "?";
        findby += `storeId=${_localData?.DATA?.storeId}&`;
        findby += `search=${filterName}&`;
        const res = await getCountStocksAll(findby);
        if (res.status === 200) {
          console.log("res--->", res);
          setTotalStock(res?.data);
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  // log

  return (
    <div className="p-3">
      <NavList ActiveKey="/settingStore/reportStock" />
      {/* <div className="card-report-header">
        <div className="box">
          <div className="elm-title">
            <b>ສິນຄ້ານຳອອກດີສຸດ</b>
          </div>
          <div className="elm-totals">
            <h2>
              <b>{numberFormat(bestStockExport?.totalQtyExport ?? 0)} +</b>
            </h2>
          </div>

          <div className="elm-mores">
            {bestStockExport?.totalQtyExport >= 1 ? (
              <span>{bestStockExport?.stockDetails?.name}</span>
            ) : (
              "ຍັງບໍ່ມີສິນຄ້າ ທີສົ່ງຄືນ"
            )}
            <MdCallMissedOutgoing style={{ fontSize: 25, color: "green" }} />
          </div>
        </div>
        <div className="box">
          <div className="elm-title">
            <b>ສິນຄ້ານຳເຂົ້າດີສຸດ</b>
          </div>
          <div className="elm-totals">
            <h2>
              <b>{numberFormat(bestStockImport?.totalQtyImport ?? 0)} +</b>
            </h2>
          </div>

          <div className="elm-mores">
            {bestStockImport?.totalQtyImport >= 1 ? (
              <span>{bestStockImport?.stockDetails?.name}</span>
            ) : (
              "ຍັງບໍ່ມີສິນຄ້າ ທີສົ່ງຄືນ"
            )}
            <MdCallMissedOutgoing style={{ fontSize: 25, color: "green" }} />
          </div>
        </div>
        <div className="box">
          <div className="elm-title">
            <b>ສິນຄ້າທີຖຶກສົ່ງຄືນ</b>
          </div>
          <div className="elm-totals">
            <h2>
              <b>{numberFormat(bestStockReturn?.totalQtyReturn ?? 0)} +</b>
            </h2>
          </div>

          <div className="elm-mores">
            {bestStockReturn?.totalQtyReturn >= 1 ? (
              <span>{bestStockReturn?.stockDetails?.name}</span>
            ) : (
              "ຍັງບໍ່ມີສິນຄ້າ ທີສົ່ງຄືນ"
            )}
            <MdCallMissedOutgoing style={{ fontSize: 25, color: "green" }} />
          </div>
        </div>
      </div> */}
      <div
        className="card-filter-report w-100"
        style={{ display: width > 700 ? "flex" : "" }}
      >
        <div style={{ width: "100%", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "2.33em",
              center: 7,
              zIndex: 10,
            }}
          >
            <MdSearch style={{ fontSize: 27, color: COLOR_APP }} />
          </div>
          <Form.Label>{t("search")}</Form.Label>
          <InputGroup>
            <Form.Control
              style={{ paddingLeft: "2.5em" }}
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  getStocks();
                }
              }}
              type="text"
              placeholder={t("fill_prod_enter")}
            />
            {/* <Button onClick={() => getStocks()}>Enter</Button> */}
          </InputGroup>
        </div>
        <Form.Group style={{ width: width > 700 ? "60%" : "100%" }}>
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
            <div>
              {startDate} {startTime}
            </div>{" "}
            ~{" "}
            <div>
              {endDate} {endTime}
            </div>
          </Button>
        </Form.Group>
      </div>
      <div className="py-2">
        <Card
          border="primary"
          style={{ margin: 0, maxWidth: "95vw", overflowX: "auto" }}
        >
          <Card.Header
            style={{
              backgroundColor: COLOR_APP,
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            {t("current_stock")}
          </Card.Header>
          {isLoading ? (
            <LoadingAppzap />
          ) : (
            <>
              {totalStock >= 1 ? (
                <Card.Body className="w-100">
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th style={{ textAlign: "center", width: 50 }}>
                        {t("no")}
                      </th>
                      <th style={{ textAlign: "center" }}>{t("date")}</th>
                      <th style={{ textAlign: "center" }}>{t("buy_price")}</th>
                      <th style={{ textAlign: "center" }}>{t("type")}</th>
                      <th style={{ textAlign: "center" }}>{t("prod_name")}</th>
                      <th style={{ textAlign: "center" }}>{t("amount")}</th>
                      <th style={{ textAlign: "right", width: 40 }}>
                        {t("unit")}
                      </th>
                    </tr>
                    {stocks?.map((item, index) => (
                      <tr key={index}>
                        <td style={{ textAlign: "center" }}>
                          <div className="pl-2">
                            {page * rowsPerPage + index + 1}
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {formatDateNow(item?.createdAt)}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item?.buyPrice ?? "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>
                          {item?.stockCategoryId?.name ?? "-"}
                        </td>
                        <td style={{ textAlign: "center" }}>{item?.name}</td>
                        <td style={{ textAlign: "center", minWidth: "10em" }}>
                          <ProgressBar
                            maxCompleted={200}
                            width="100%"
                            labelColor={
                              item?.quantity >= 1
                                ? "#fff"
                                : item?.quantity <= 0
                                ? "red"
                                : "#777"
                            }
                            bgColor={item?.quantity >= 1 ? "#0ab847" : ""}
                            completed={`${thousandSeparator(
                              item?.quantity ?? 0
                            )}`}
                          />
                        </td>
                        <td style={{ textAlign: "right" }}>{item?.unit}</td>
                      </tr>
                    ))}
                  </table>
                </Card.Body>
              ) : (
                <EmptyState
                  text={`${t("no_prod_list")} [${filterName}] ${t("stoke")}`}
                />
              )}
            </>
          )}
          {!isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                padding: ".5em 0",
              }}
            >
              {totalStock > 0 && (
                <PaginationAppzap
                  rowsPerPage={rowsPerPage}
                  page={page}
                  pageAll={pageAll}
                  onPageChange={handleChangePage}
                />
              )}
            </div>
          )}
        </Card>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: isLoading ? 300 : "auto",
          maxWidth: "95vw",
          overflowX: "auto",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <StockGroups
          isLoading={isLoading}
          datas={historiesExport}
          filterName={filterName}
          rowsPerPageTotal={rowsPerPageTotal}
          pageTotal={pageTotal}
          isLoadingTotal={isLoadingTotal}
        />
        {totalStockGroups > 0 && (
          <PaginationAppzap
            rowsPerPage={rowsPerPageTotal}
            page={pageTotal}
            pageAll={pageAllTotal}
            onPageChange={handleChangePageTotal}
          />
        )}
      </div>

      {/* <StockGroups
				isLoading={isLoading}
				datas={historiesExport}
				filterName={filterName}
				rowsPerPageTotal={rowsPerPageTotal}
				pageTotal={pageTotal}
				isLoadingTotal={isLoadingTotal}
			/>
			{totalStockGroups > 0 && (
				<PaginationAppzap
					rowsPerPage={rowsPerPageTotal}
					page={pageTotal}
					pageAll={pageAllTotal}
					onPageChange={handleChangePageTotal}
				/>
			)} */}

      <PopUpSetStartAndEndDate
        open={openGetDate?.popupfiltter}
        onClose={() => setOpenGetDate()}
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
