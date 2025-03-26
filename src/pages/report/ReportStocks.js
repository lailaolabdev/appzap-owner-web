import React, { useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Form, InputGroup, Row } from "react-bootstrap";
import useWindowDimension2 from "../../helpers/useWindowDimension2";
import { MdCallMissedOutgoing, MdSearch } from "react-icons/md";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import axios from "axios";
import NavList from "../../pages/stock/components/NavList";
import StockGroups from "./StockGroups";
import PopUpPreViewsPage from "../../components/popup/PopUpPreViewsPage";
import PopupSelectStock from "../../components/popup/report/PopupSelectStock";
import { thousandSeparator } from "../../helpers/thousandSeparator";
import { COLOR_APP } from "../../constants";
import PaginationAppzap from "../../constants/PaginationAppzap";
import LoadingAppzap from "../../components/LoadingAppzap";
import moment from "moment";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import ProgressBar from "@ramonak/react-progress-bar";
import { formatDateNow, moneyCurrency, numberFormat } from "../../helpers";
import {
  faSearch,
  faSearchPlus,
  faPlus,
  faMinus,
  faTruck,
  faTrash,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import {
  deleteStock,
  getCountStocksAll,
  getStocksAll,
  getStocksCategory,
  getStocksHistories,
} from "../../services/stocks";
import { IoSearchCircleOutline } from "react-icons/io5";
import EmptyState from "../../components/EmptyState";
import { useTranslation } from "react-i18next";
import useWindowDimensions2 from "../../helpers/useWindowDimension2";
import { useStore } from "../../store";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import { faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import PopUpAddStock from "../stock/components/popup/PopUpAddStock";
import PopUpMinusStock from "../stock/components/popup/PopUpMinusStock";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { useNavigate } from "react-router-dom";
import PopUpChooseCategoryTypeComponent from "../../components/popup/PopUpChooseCategoryTypeComponent";
import { getCategories } from "../../services/menuCategory";

import { useStoreStore } from "../../zustand/storeStore";
import PopUpEditStock from "../stock/components/popup/PopUpEditStock";
import StockExport from "../stock/components/StockExport";

export default function ReportStocks() {
  const navigate = useNavigate();
  const { storeDetail } = useStoreStore();
  const [popup, setPopup] = useState();
  const { t } = useTranslation();
  const { height, width } = useWindowDimension2();
  const _stDate = moment().startOf("day").format("YYYY-MM-DD");
  const _edDate = moment().endOf("day").format("YYYY-MM-DD");
  const [selectCategories, setSelectCategories] = useState("");
  const [historiesExport, setHistoriesExport] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [prepaDatas, setPrepaDatas] = useState([]);
  const [select, setSelect] = useState();
  const [stockCategory, setStockCategory] = useState([]);
  const [isLoadingTotal, setIsLoadingTotal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stocks, setStocks] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [totalStock, setTotalStock] = useState(0);
  const [totalStockValue, setTotalStockValue] = useState(0);
  const [totalStockGroups, setTotalStockGroups] = useState(0);
  const [bestStockImport, setBestStockImport] = useState();
  const [bestStockExport, setBestStockExport] = useState();
  const [bestStockReturn, setBestStockReturn] = useState();
  const [categoryMenu, setCategoryMenu] = useState([]);
  const [openGetDate, setOpenGetDate] = useState(false);
  const [startDate, setStartDate] = useState(_stDate);
  const [endDate, setEndDate] = useState(_edDate);
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const { profile } = useStore();
  const [hasManageStockEdit, setHasManageStockEdit] = useState(false);

  const rowsPerPage = 15;
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

  useEffect(() => {
    if (profile?.data?.permissionRoleId?.permissions) {
      const permissions = profile?.data?.permissionRoleId?.permissions;
      const permissionMap = [
        { set: setHasManageStockEdit, check: "MANAGE_STOCK_CAN_EDIT" },
      ];
      permissionMap.forEach(({ set, check }) => {
        set(permissions.includes(check));
      });
    }
  }, [profile?.data?.permissionRoleId?.permissions, profile, storeDetail]);

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
    getCategorys(storeDetail?._id);
    getCategoryMenuStock(storeDetail?._id);
  }, [page, startDate, endDate, selectCategories]);

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
          return response?.data?.data.reduce(
            (prev, current) => (prev[key] > current[key] ? prev : current),
            response?.data?.data[0]
          );
        };

        const bestStockImport = findBest("totalQtyImport");
        const bestStockExport = findBest("totalQtyExport");
        const bestStockReturn = findBest("totalQtyReturn");

        setBestStockImport(bestStockImport);
        setBestStockExport(bestStockExport);
        setBestStockReturn(bestStockReturn);

        setHistoriesExport(response?.data?.data);
        setTotalStockGroups(response?.data?.total);
      }
    } catch (error) {
      console.error("error:-->", error);
    } finally {
      setIsLoadingTotal(false);
    }
  };

  const onSelectStocksAll = async () => {
    if (isSelectAll) {
      setPrepaDatas([]);
      setIsSelectAll(false);
    } else {
      const _stocksNew = [];
      // console.log("stocks:--new-->", stocks);
      for (var i = 0; i < stocks.length; i++) {
        _stocksNew.push(stocks[i]);
      }
      setPrepaDatas(_stocksNew);
      setIsSelectAll(true);
    }
    return;
  };

  const getCategoryMenuStock = async (id) => {
    try {
      const resData = await getCategories(id);
      setCategoryMenu(resData);
    } catch (error) {
      console.error("error:-->", error);
    }
  };

  const onSelectSigleStoks = (selectedProduct) => {
    const exists = prepaDatas.some(
      (product) => product._id === selectedProduct._id
    );

    if (exists) {
      // If the product is already in the array, remove it
      const filteredProducts = prepaDatas.filter(
        (product) => product._id !== selectedProduct._id
      );
      setPrepaDatas(filteredProducts);
    } else {
      // If the product is not in the array, add it
      const updatedProducts = [...prepaDatas, selectedProduct];
      setPrepaDatas(updatedProducts);
    }
  };

  const remove = async (stock) => {
    try {
      const deleteData = await deleteStock(stock?._id);
      if (deleteData.status === 200) {
        successAdd(`ລົບ ${stock?.name} ສຳເລັດ`);
        getStocks();
        setPopup();
      }
    } catch (error) {
      console.log("err:", error);
      errorAdd(`${t("delete_fail")}`);
    }
  };

  // ດຶງຂໍ້ມູນສະຕ໋ອກປະຈຸບັນທັງໝົດ
  const getStocks = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        let findby = "?";
        // findby += `dateFrom=${startDate}&`;
        // findby += `dateTo=${endDate}&`;
        // findby += `timeFrom=${startTime}&`;
        // findby += `timeTo=${endTime}&`;
        findby += `storeId=${_localData?.DATA?.storeId}&`;
        findby += `skip=${page * rowsPerPage}&`;
        findby += `limit=${rowsPerPage}&`;
        findby += `search=${filterName}&`;
        findby += `stockCategoryId=${selectCategories}&`;
        const res = await getStocksAll(findby);
        if (res.status === 200) {
          // console.log("res--->", res);
          // setTotalStock(res?.data?.total);
          setStocks(res?.data?.stockData);
          setTotalStockValue(res?.data?.totalStockValue);
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
        findby += `stockCategoryId=${selectCategories}&`;
        const res = await getCountStocksAll(findby);
        if (res.status === 200) {
          setTotalStock(res?.data);
        }
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  const getCategorys = async (id) => {
    try {
      const resData = await getStocksCategory(id);
      console.log({ resData });
      if (resData.status === 200) {
        setStockCategory(resData?.data);
      }
    } catch (error) {
      console.error("error:-->", error);
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
      {/* <div
        className="card-filter-report w-100"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <div style={{ width: "30%", position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "0",
              left: "1em",
              height: "80%",
              display: "flex",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <FontAwesomeIcon
              icon={faSearch}
              className="text-color-app py-2.5"
            />
          </div>
          <Form.Label>{t("search")}</Form.Label>
          <InputGroup>
            <Form.Control
              style={{ borderRadius: 8, paddingLeft: "2.5em" }}
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
          </InputGroup>
          <Button
            style={{ textWrap: "nowrap", marginTop: "1em" }}
            variant="outline-primary"
            onClick={() => setPopup({ PopUpChooseCategoryTypeComponent: true })}
          >
            {t("chose_type")}
          </Button>
          <select
            className="btn btn-outline-primary mt-3 mx-2"
            // value={sortOrder}
            // onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="All">{t("arranged")}</option>
            <option value="asc">{t("ascend")}</option>
            <option value="desc">{t("descend")}</option>
          </select>
        </div>

        
      </div> */}
      <div className="flex flex-row justify-between mt-8">
        <div className="text-xl font-semibold pt-2">
          {t("item_total")} {totalStock} {t("item_amount")}
        </div>
        <div class="w-full max-w-sm min-w-[200px]">
          <div class="relative flex items-center">
            <input
              class="w-full h-10 bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md pl-4 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder={t("search")}
            />

            <button
              class="rounded-md ml-2 bg-slate-800 py-2.5 px-3 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button"
            >
              <FontAwesomeIcon
                icon={faSearch}
                style={{
                  color: "white",
                }}
              />
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-between mt-4">
        <div>
          {/* <StockExport stock={stocks} storeName={storeDetail?.name} />
            <button
              class="bg-color-app hover:bg-color-app/70 text-white font-md py-2 px-3 rounded-md mx-2"
              onClick={() => setPopup({ PopUpPreViewsPage: true })}
              disabled={!hasManageStockEdit}
            >
              {t("Print")}
            </button> */}
          <button
            class="bg-color-app hover:bg-orange-400 text-white font-md py-2 px-3 rounded-md mr-2"
            onClick={() => setPopup({ PopupSelectStock: true })}
          >
            {t("create_stock_menu")}
          </button>

          <button
            class="bg-color-app hover:bg-orange-400 text-white font-md py-2 px-3 rounded-md"
            onClick={() => navigate("/settingStore/stock/add")}
          >
            {t("create_stock")}
          </button>
        </div>

        <div class="flex gap-2">
          <StockExport stock={stocks} storeName={storeDetail?.name} />
          <button
            class="bg-color-app hover:bg-color-app/70 text-white font-md py-2 px-3 rounded-md"
            onClick={() => setPopup({ PopUpPreViewsPage: true })}
            disabled={!hasManageStockEdit}
          >
            {t("Print")}
          </button>
        </div>
      </div>
      <div className="py-2">
        <Card
          border="primary"
          className="m-0, w-100 overflow-x-auto"
          // style={{ margin: 0, maxWidth: "95vw", overflowX: "auto" }}
        >
          <Card.Header
            style={{
              backgroundColor: COLOR_APP,
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
              width: "100%",
            }}
            // className="bg-color-app font-semibold text-xl "
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
                      <th scope="col" style={{ width: 50, textWrap: "nowrap" }}>
                        <Form.Check
                          onClick={() => onSelectStocksAll()}
                          label={t("no")}
                          id={t("no")}
                        />
                      </th>
                      {/* <th style={{ textAlign: "left", width: 50 }}>
                        {t("no")}
                      </th> */}
                      <th style={{ textAlign: "left" }}>{t("date")}</th>
                      <th style={{ textAlign: "center" }}>{t("prod_name")}</th>
                      <th style={{ textAlign: "left" }}>{t("type")}</th>
                      <th style={{ textAlign: "left" }}>{t("buy_price")}</th>
                      <th style={{ textAlign: "left" }}>{t("amount")}</th>
                      <th style={{ textAlign: "left" }}>{t("out_amount")}</th>
                      <th style={{ textAlign: "left" }}>{t("in_amount")}</th>
                      <th style={{ textAlign: "left" }}>{t("wastes")}</th>
                      <th style={{ textAlign: "left" }}>{t("low_stock")}</th>
                      <th style={{ textAlign: "left", width: 40 }}>
                        {t("unit")}
                      </th>
                      <th style={{ textAlign: "center" }}>
                        {t("total_amount")}
                      </th>
                      <th style={{ textAlign: "right" }}>
                        {t("manage_stock")}
                      </th>
                    </tr>
                    {stocks?.map((item, index) => (
                      <tr key={index}>
                        {/* <td style={{ textAlign: "left" }}>
                          <div className="pl-2">
                            {page * rowsPerPage + index + 1}
                          </div>
                        </td> */}
                        <td>
                          <div style={{ width: 30 }}>
                            {isSelectAll ? (
                              <Form.Check
                                checked={true}
                                label={page * rowsPerPage + index + 1}
                                readOnly
                              />
                            ) : (
                              <Form.Check
                                type="checkbox"
                                id={page * rowsPerPage + index + 1}
                                onChange={() => onSelectSigleStoks(item)}
                                label={page * rowsPerPage + index + 1}
                              />
                            )}
                          </div>
                        </td>
                        <td style={{ textAlign: "left" }}>
                          {formatDateNow(item?.createdAt)}
                        </td>
                        <td style={{ textAlign: "center" }}>{item?.name}</td>
                        <td style={{ textAlign: "left" }}>
                          {item?.stockCategoryId?.name ?? "-"}
                        </td>
                        <td style={{ textAlign: "left" }}>
                          {moneyCurrency(item?.buyPrice) ?? 0}{" "}
                          {storeDetail?.firstCurrency}
                        </td>
                        {/* <td style={{ textAlign: "center", minWidth: "10em" }}>
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
                        </td> */}
                        <td style={{ textAlign: "left" }}>{item?.quantity}</td>
                        <td style={{ textAlign: "left" }}>{item?.sale}</td>
                        <td style={{ textAlign: "left" }}>{item?.import}</td>
                        <td style={{ textAlign: "left" }}>
                          {item?.wastes ?? "-"} %
                        </td>
                        <td style={{ textAlign: "left" }}>
                          {item?.statusLevel}
                        </td>
                        <td style={{ textAlign: "left" }}>{item?.unit}</td>
                        <td style={{ textAlign: "center" }}>
                          {moneyCurrency(item?.stockLevel) ?? "-"}{" "}
                          {storeDetail?.firstCurrency}
                        </td>
                        <td className="justify-end flex ">
                          <div className="flex gap-2 w-auto justify-end ">
                            <>
                              <ButtonPrimary
                                onClick={() => {
                                  setSelect(item);
                                  setPopup({ PopUpMinusStock: true });
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faMinus}
                                  style={{
                                    color: "white",
                                  }}
                                />
                              </ButtonPrimary>{" "}
                              <ButtonPrimary
                                onClick={() => {
                                  setSelect(item);
                                  setPopup({ PopUpAddStock: true });
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPlus}
                                  style={{
                                    color: "white",
                                  }}
                                />
                              </ButtonPrimary>{" "}
                              <ButtonPrimary
                                onClick={() => {
                                  setSelect(item);
                                  setPopup({ PopUpConfirmDeletion: true });
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  style={{
                                    color: "white",
                                  }}
                                />
                              </ButtonPrimary>{" "}
                              <ButtonPrimary
                                onClick={() => {
                                  setSelect(item);
                                  setPopup({ PopUpEditStock: true });
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faEdit}
                                  style={{
                                    color: "white",
                                  }}
                                />
                              </ButtonPrimary>{" "}
                            </>
                          </div>
                        </td>
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
          <hr style={{ margin: "32px" }}></hr>
          <div className="text-end mr-8 font-semibold text-xl">
            {t("total")} : {moneyCurrency(totalStockValue)}{" "}
            {storeDetail?.firstCurrency}
          </div>
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

      <div className="mt-8 mb-8 w-2/4">
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

      <div
        style={{
          display: "flex",
          marginTop: "1em",
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
      ></div>

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

      <PopUpAddStock
        open={popup?.PopUpAddStock}
        onClose={() => setPopup()}
        data={select}
        callback={() => {
          getStocks();
          getStockHistories();
        }}
      />

      <PopUpMinusStock
        open={popup?.PopUpMinusStock}
        data={select}
        onClose={() => setPopup()}
        callback={() => {
          getStocks();
          getStockHistories();
        }}
      />

      <PopUpEditStock
        open={popup?.PopUpEditStock}
        data={select}
        stockCategory={stockCategory}
        onClose={() => setPopup()}
        callback={() => getStocks()}
      />

      <PopUpPreViewsPage
        onClose={() => setPopup()}
        open={popup?.PopUpPreViewsPage}
        datas={prepaDatas}
        storeData={storeDetail}
      />

      <PopupSelectStock
        open={popup?.PopupSelectStock}
        onClose={() => setPopup()}
        categoryMenu={categoryMenu}
      />

      <PopUpConfirmDeletion
        open={popup?.PopUpConfirmDeletion}
        text={select?.name}
        onClose={() => setPopup()}
        onSubmit={async () => {
          await remove(select);
        }}
      />

      <PopUpChooseCategoryTypeComponent
        open={popup?.PopUpChooseCategoryTypeComponent}
        onClose={() => setPopup()}
        categoryData={stockCategory}
        setSelectedCategory={(_array) => {
          const data = _array.join("||");
          setSelectCategories(data);
        }}
      />
    </div>
  );
}
