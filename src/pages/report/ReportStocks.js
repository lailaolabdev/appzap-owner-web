import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import useWindowDimension2 from "../../helpers/useWindowDimension2";
import { MdCallMissedOutgoing, MdSearch } from "react-icons/md";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import axios from "axios";
import StockGroups from "./StockGroups";
import { thousandSeparator } from "../../helpers/thousandSeparator";
import { COLOR_APP } from "../../constants";
import PaginationAppzap from "../../constants/PaginationAppzap";
import LoadingAppzap from "../../components/LoadingAppzap";
import moment from "moment";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import ProgressBar from "@ramonak/react-progress-bar";
import { numberFormat } from "../../helpers";
import { getStocksAll } from "../../services/stocks";
import { IoSearchCircleOutline } from "react-icons/io5";
import EmptyState from "../../components/EmptyState";

export default function ReportStocks() {
  const { height, width } = useWindowDimension2();
  const _stDate = moment().startOf("month").format("YYYY-MM-DD");
  const _edDate = moment().endOf("month").format("YYYY-MM-DD");

  const [historiesExport, setHistoriesExport] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stocks, setStocks] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [totalStock, setTotalStock] = useState(0);
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

  const _localData = getLocalData();
  //ເອິ້ນໃຊ້ function ດືງຂໍ້ມູນຮ້ານ
  useEffect(() => {
    const fetchData = async () => {
      if (_localData) {
        getStockHistories(_localData?.DATA?.storeId);
      }
    };
    fetchData();
  }, [_localData?.DATA?.storeId, startDate, endDate]);

  // ເອື້ນໃຊ້​ function ດືງຂໍ້ມູນສະຕ໋ອກ ແລະ ປະຫວັດສະຕ໋ອກ
  useEffect(() => {
    getStocks();
  }, [page, startDate, endDate]);

  // ດຶງຂໍ້ມູນຂອງປະຫວັດສະຕ໋ອກທັງໝົດ
  const getStockHistories = async (id) => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${END_POINT_SEVER}/v3/stock-history-groups`,
        {
          params: { storeId: id, startDate, startTime, endDate, endTime },
        }
      );

      if (response.status === 200 && response.data) {
        const stockData = response.data;

        const _bestImport = stockData.reduce(
          (prev, current) =>
            prev.totalQtyImport > current.totalQtyImport ? prev : current,
          stockData[0]
        );
        const _bestExport = stockData.reduce(
          (prev, current) =>
            prev.totalQtyExport > current.totalQtyExport ? prev : current,
          stockData[0]
        );
        const _bestReturn = stockData.reduce(
          (prev, current) =>
            prev.totalQtyReturn > current.totalQtyReturn ? prev : current,
          stockData[0]
        );

        setBestStockImport(_bestImport);
        setBestStockExport(_bestExport);
        setBestStockReturn(_bestReturn);

        setHistoriesExport(stockData);
      }
    } catch (error) {
      console.error("error:-->", error);
    } finally {
      setIsLoading(false);
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
          setTotalStock(res?.data?.total);
          setStocks(res?.data?.stocks);
          setIsLoading(true);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  // log

  return (
    <div className="p-3">
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
        className="card-filter-report"
        style={{ display: width > 700 ? "flex" : "" }}
      >
        <div style={{ width: "100%", position: "relative" }}>
          <div
            style={{ position: "absolute", top: "2.33em", left: 7, zIndex: 10 }}
          >
            <MdSearch style={{ fontSize: 27, color: COLOR_APP }} />
          </div>
          <Form.Label>ຄົ້ນຫາ</Form.Label>
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
              placeholder="ປ້ອນຊື່ສິນຄ້າ ແລ້ວ enter..."
            />
            {/* <Button onClick={() => getStocks()}>Enter</Button> */}
          </InputGroup>
        </div>
        <Form.Group style={{ width: "60%" }}>
          <Form.Label>ວັນທີ, ເດືອນ, ປີ (ເວລາ)</Form.Label>
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
        <Card border="primary" style={{ margin: 0 }}>
          <Card.Header
            style={{
              backgroundColor: COLOR_APP,
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            ສະຕ໋ອກປັດຈຸບັນ
          </Card.Header>
          {isLoading ? (
            <LoadingAppzap />
          ) : (
            <>
              {totalStock >= 1 ? (
                <Card.Body>
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th style={{ textAlign: "left", width: 50 }}>ລຳດັບ</th>
                      {/* <th style={{ textAlign: "left" }}>ວັນທີ,ເດືອນ,ປີ</th> */}
                      <th style={{ textAlign: "left" }}>ປະເພດ</th>
                      <th style={{ textAlign: "left" }}>ຊື່ສິນຄ້າ</th>
                      <th style={{ textAlign: "left" }}>ຈຳນວນ</th>
                      <th style={{ textAlign: "right", width: 40 }}>ຫົວໜ່ວຍ</th>
                    </tr>
                    {stocks &&
                      stocks.map((item, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: "left" }}>
                            <div className="pl-2">
                              {page * rowsPerPage + index + 1}
                            </div>
                          </td>
                          {/* <td style={{ textAlign: "left" }}>
                {formatDateNow(item?.createdAt)}
              </td> */}
                          <td style={{ textAlign: "left" }}>
                            {item?.stockCategoryId?.name ?? "-"}
                          </td>
                          <td style={{ textAlign: "left" }}>{item?.name}</td>
                          <td style={{ textAlign: "left", minWidth: "10em" }}>
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
                <EmptyState text={`ບໍ່ມີລາຍການສິນຄ້າ [${filterName}] ສະຕ໋ອກ`} />
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
      <Row>
        {/* Export Data stocks  histories*/}
        <Col
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "start",
            height: isLoading ? 300 : "auto",
          }}
        >
          <StockGroups
            isLoading={isLoading}
            limit={rowsPerPage}
            dataExports={historiesExport}
            filterName={filterName}
          />
        </Col>
      </Row>

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
