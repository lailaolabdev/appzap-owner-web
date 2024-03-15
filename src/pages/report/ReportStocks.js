import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import useWindowDimension2 from "../../helpers/useWindowDimension2";
import { MdCallMissedOutgoing } from "react-icons/md";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import useQuery, { ObjectToQuery } from "../../helpers/useQuery";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import StockGroups from "./StockGroups";
import { thousandSeparator } from "../../helpers/thousandSeparator";
import { COLOR_APP } from "../../constants";
import PaginationAppzap from "../../constants/PaginationAppzap";
import LoadingAppzap from "../../components/LoadingAppzap";
import moment from "moment";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import ReactPaginate from "react-paginate";
import ProgressBar from "@ramonak/react-progress-bar";
import { numberFormat } from "../../helpers";

export default function ReportStocks() {
  const { height, width } = useWindowDimension2();
  const _stDate = moment().startOf("month").format("YYYY-MM-DD");
  const _edDate = moment().endOf("month").format("YYYY-MM-DD");

  const [histories, setHistories] = useState([]);
  const [importDatas, setImportDatas] = useState([]);
  const [historiesExport, setHistoriesExport] = useState([]);
  const [returnDatas, setReturnDatas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [stocks, setStocks] = useState(false);
  const [storeData, setStoreData] = useState(false);
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
      setHistories([]);
      setIsLoading(true);
  
      const response = await axios.get(`${END_POINT_SEVER}/v3/stock-history-groups`, {
        params: { storeId: id, startDate, startTime, endDate, endTime },
      });
  
      if (response.status === 200 && response.data) {
        const stockData = response.data;
  
        const _bestImport = stockData.reduce((prev, current) => prev.totalQtyImport > current.totalQtyImport ? prev : current, stockData[0]);
        const _bestExport = stockData.reduce((prev, current) => prev.totalQtyExport > current.totalQtyExport ? prev : current, stockData[0]);
        const _bestReturn = stockData.reduce((prev, current) => prev.totalQtyReturn > current.totalQtyReturn ? prev : current, stockData[0]);
  
        setBestStockImport(_bestImport);
        setBestStockExport(_bestExport);
        setBestStockReturn(_bestReturn);
  
        
        setImportDatas(stockData);
        setHistoriesExport(stockData);
        setReturnDatas(stockData);
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
        setStoreData(_localData?.DATA);
        setIsLoading(true);

        const res = await axios.get(`${END_POINT_SEVER}/v3/stocks`, {
          params: {
            storeId: _localData?.DATA?.storeId,
            limit: rowsPerPage,
            skip: page * rowsPerPage,
          },
        });
        if (res.status === 200) {
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
      <div className="card-report-header">
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
            <span>{bestStockExport?.stockDetails?.name}</span>

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
            <span>{bestStockImport?.stockDetails?.name}</span>
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
            {bestStockReturn?.totalQtyExport >= 1 ? (
              <span>{bestStockReturn?.stockDetails?.name}</span>
            ) : (
              "ຍັງບໍ່ມີສິນຄ້າ ທີສົ່ງຄືນ"
            )}
            <MdCallMissedOutgoing style={{ fontSize: 25, color: "green" }} />
          </div>
        </div>
      </div>
      <div
        className="card-filter-report"
        style={{ display: width > 700 ? "flex" : "" }}
      >
        <Form.Group style={{ width: "100%" }}>
          <Form.Label>ຄົ້ນຫາ</Form.Label>
          <Form.Control
            value={filterName}
            onChange={(e) => setFilterName(e?.target?.value)}
            type="text"
            placeholder="ປ້ອນຂໍ້ມູນເພື່ອຄົ້ນຫາ..."
          />
        </Form.Group>
        <Form.Group style={{ width: "60%" }}>
          <Form.Label>ຄົ້ນຫາດ້ວຍວັນທີ</Form.Label>
          <Button
            variant="outline-primary"
            size="small"
            style={{ display: "flex", gap: 10, alignItems: "center" }}
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
          <Card.Body>
            {isLoading ? (
              <LoadingAppzap />
            ) : (
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
                  stocks
                    ?.filter((e) => e?.name?.includes(filterName))
                    .map((item, index) => (
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
            )}
          </Card.Body>
          {!isLoading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                padding: ".5em 0",
              }}
            >
              <PaginationAppzap
                rowsPerPage={rowsPerPage}
                page={page}
                pageAll={pageAll}
                onPageChange={handleChangePage}
              />
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
