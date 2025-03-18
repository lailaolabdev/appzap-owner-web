import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import moment from "moment";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { Table, Modal, Button, Pagination, Spinner } from "react-bootstrap";
import * as _ from "lodash";
import { FaCheckDouble, FaCircleCheck } from "react-icons/fa6";
import { BsFillExclamationTriangleFill } from "react-icons/bs";
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import {
  _statusCheckBill,
  base64ToBlob,
  orderStatus,
  moneyCurrency,
} from "./../../helpers";
import { useTranslation } from "react-i18next";
import { stringify } from "query-string";
import AnimationLoading from "../../constants/loading";
import Box from "../../components/Box";
import { getHeaders } from "../../services/auth";
import { useStore } from "../../store";
import useQuery from "../../helpers/useQuery";
import ButtonDownloadCSV from "../../components/button/ButtonDownloadCSV";
import ButtonDownloadExcel from "../../components/button/ButtonDownloadExcel";
import Loading from "../../components/Loading";
import { getCountBills } from "../../services/bill";

import { useStoreStore } from "../../zustand/storeStore";
import { useShiftStore } from "../../zustand/ShiftStore";

import {
  BLUETOOTH_PRINTER_PORT,
  COLOR_APP,
  ETHERNET_PRINTER_PORT,
  USB_PRINTER_PORT,
} from "../../constants";
import Swal from "sweetalert2";
import html2canvas from "html2canvas";
import printFlutter from "../../helpers/printFlutter";
import BillForCheckOut80 from "../../components/bill/BillForCheckOut80";
import BillForCheckOutCafe80 from "../../components/bill/BillForCheckOutCafe80";
import { convertUnitgramAndKilogram } from "../../helpers/convertUnitgramAndKilogram";

const limitData = 50;

export default function DashboardFinance({
  startDate,
  endDate,
  startTime,
  endTime,
  selectedCurrency,
  setCountIsDebtTrue,
  shiftId,
}) {
  const [currency, setCurrency] = useState();
  const navigate = useNavigate();
  const { accessToken } = useQuery();
  const params = useParams();
  const [data, setData] = useState();
  const [disCountDataKib, setDisCountDataKib] = useState(0);
  const [disCountDataPercent, setDisCountDataPercent] = useState(0);
  const [dataNotCheckBill, setDataNotCheckBill] = useState({});
  const [dataCheckBill, setDataCheckBill] = useState({});
  const [selectOrder, setSelectOrder] = useState();
  const [moneyCash, setMoneyCash] = useState(0);
  const [moneyAon, setMoneyAon] = useState(0);
  const [show, setShow] = useState(false);
  const [dataModal, setDataModal] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [disabledEditBill, setDisabledEditBill] = useState(false);
  const [printBillLoading, setPrintBillLoading] = useState(false);

  const [pagination, setPagination] = useState(1);
  const [totalPagination, setTotalPagination] = useState();
  const [getDataDashboardFinance, setGetDataDashboardFinance] = useState([]);
  const [totalTranferAndPayLast, setTotalTranferAndPayLast] = useState(0);

  const handleClose = () => setShow(false);
  const {
    profile,
    dataBill,
    selectedTable,
    printers,
    printerCounter,
    dataPrint,
  } = useStore();
  const { shiftCurrent } = useShiftStore();
  const { storeDetail } = useStoreStore();

  const getPaginationCountData = async () => {
    try {
      const { TOKEN, DATA } = await getLocalData();
      const query = `?storeId=${params?.storeId}&dateFrom=${startDate}&dateTo=${endDate}&timeFrom=${startTime}&timeTo=${endTime}`;
      const _data = await getCountBills(query, TOKEN);
      if (_data.error) throw new Error("error");
      setTotalPagination(Math.ceil(_data?.count / limitData));
    } catch (err) {
      console.log(err);
    }
  };
  const [widthBill80, setWidthBill80] = useState(80);
  let bill80Ref = useRef(null);

  const onPrintBill = async (isPrintBill) => {
    try {
      setPrintBillLoading(true);
      // let _dataBill = {
      //   ...dataBill,
      //   typePrint: "PRINT_BILL_CHECKOUT",
      // };
      // saveServiceChargeDetails();
      // await _createHistoriesPrinter(_dataBill);
      let urlForPrinter = "";
      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );

      let dataImageForPrint;
      dataImageForPrint = await html2canvas(bill80Ref.current, {
        useCORS: true,
        scrollX: 10,
        scrollY: 0,
        scale: 530 / widthBill80,
      });
      if (printerBillData?.type === "ETHERNET") {
        urlForPrinter = ETHERNET_PRINTER_PORT;
      }
      if (printerBillData?.type === "BLUETOOTH") {
        urlForPrinter = BLUETOOTH_PRINTER_PORT;
      }
      if (printerBillData?.type === "USB") {
        urlForPrinter = USB_PRINTER_PORT;
      }

      const _file = await base64ToBlob(dataImageForPrint.toDataURL());
      var bodyFormData = new FormData();
      bodyFormData.append("ip", printerBillData?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("isdrawer", isPrintBill);
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);
      bodyFormData.append("paper", printerBillData?.width === "58mm" ? 58 : 80);

      await printFlutter(
        {
          drawer: false,
          paper: printerBillData?.width === "58mm" ? 400 : 500,
          imageBuffer: dataImageForPrint.toDataURL(),
          ip: printerBillData?.ip,
          type: printerBillData?.type,
          port: "9100",
          width: printerBillData?.width === "58mm" ? 400 : 580,
        },
        async () => {
          await axios({
            method: "post",
            url: urlForPrinter,
            data: bodyFormData,
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      );

      setPrintBillLoading(false);
      await Swal.fire({
        icon: "success",
        title: `${t("checkbill_success")}`,
        showConfirmButton: false,
        timer: 1800,
      });
      // setMenuItemDetailModal(false);
    } catch (err) {
      console.log("err printer", err);
      setPrintBillLoading(false);
      await Swal.fire({
        icon: "error",
        title: `${t("print_fial")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      return err;
    }
  };

  const handleEditBill = async () => {
    try {
      setDisabledEditBill(true);
      if (disabledEditBill) return;
      const url = `${END_POINT_SEVER}/v3/bill-reset`;
      const _body = {
        id: selectOrder?._id,
        storeId: storeDetail?._id,
      };
      const res = await axios.post(url, _body, {
        headers: await getHeaders(accessToken),
      });
      if (res.status < 300) {
        navigate("/tables");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleShow = (item) => {
    setShow(true);
    setDataModal(item);
  };

  const getCurrency = async () => {
    try {
      const x = await fetch(
        END_POINT_SEVER + `/v4/currencies?storeId=${storeDetail?._id}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => setCurrency(json));
    } catch (err) {
      console.log(err);
    }
  };

  const exportJsonToExceltyty = () => {
    const _export = data?.checkOut.map((item, index) => ({
      ລຳດັບ: index + 1,
      ເລກບິນ: item?.code,
      ວັນທີ: moment(item?.createdAt).format("DD/MM/YYYY HH:mm"),
      ຈຳນວນເງິນ: ["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
        ? new Intl.NumberFormat("ja-JP", {
            currency: "JPY",
          }).format(_countAmount(item?.orderId))
        : new Intl.NumberFormat("ja-JP", {
            currency: "JPY",
          }).format(item?.billAmount),
      ຈ່າຍເງິນສົດ: item?.payAmount,
      ຈ່າຍເງິນໂອນ: item?.transferAmount,
      ສ່ວນຫຼຸດ: item?.discount + " " + item?.discountType,
      ກ່ອນຫັກສ່ວນຫຼຸດ: item?.billAmountBefore,
      ຍອດລວມທັງໝົດ:
        data?.checkOut?.length === index + 1
          ? new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
              data?.amount + dataNotCheckBill?.amount
            )
          : "",
    }));
    return _export;
  };

  useEffect(() => {
    getCurrency();
    _fetchFinanceData();
  }, []);

  useEffect(() => {
    getPaginationCountData();
  }, [endDate, startDate, selectedCurrency, shiftId]);

  useEffect(() => {
    _fetchFinanceData();
  }, [
    endDate,
    startDate,
    selectedCurrency,
    shiftId,
    pagination,
    totalPagination,
  ]);

  const _fetchFinanceData = async () => {
    setIsLoading(true);
    const headers = await getHeaders(accessToken);

    let findby = "?";

    if (profile?.data?.role === "APPZAP_ADMIN") {
      findby += `storeId=${params?.storeId}&`;
      findby += `startDate=${startDate}&`;
      findby += `endDate=${endDate}&`;
      findby += `startTime=${startTime}&`;
      findby += `endTime=${endTime}&`;
      findby += `&skip=${(pagination - 1) * limitData}`;
      findby += `&limit=${limitData}`;

      if (shiftId) {
        findby += `shiftId=${shiftId}&`;
      }
    } else {
      findby += `storeId=${params?.storeId}&`;
      findby += `startDate=${startDate}&`;
      findby += `endDate=${endDate}&`;
      findby += `startTime=${startTime}&`;
      findby += `endTime=${endTime}&`;
      findby += `&skip=${(pagination - 1) * limitData}`;
      findby += `&limit=${limitData}`;
      if (shiftCurrent[0]) {
        findby += `shiftId=${shiftCurrent[0]?._id}&`;
      }
    }

    const getDataDashBoard = await axios.get(
      `${END_POINT_SEVER}/v7/bills${findby}`,
      {
        headers: headers,
      }
    );

    const _checkOut = getDataDashBoard.data;

    const totalPrice = _.sumBy(_checkOut, (o) => o.billAmount);

    const _formatJson = {
      checkOut: _checkOut,
      amount: totalPrice,
    };
    setData(_formatJson);
    setIsLoading(false);
  };

  useEffect(() => {
    let _disCountDataKib = 0;
    let _disCountDataAon = 0;
    let _cash = 0;
    let _aon = 0;
    const _notCheckBill = {
      total: 0,
      amount: 0,
      discountCash: 0,
      discountPercent: 0,
    };
    const _checkBill = {
      total: 0,
      amount: 0,
      discountCash: 0,
      discountPercent: 0,
      cash: 0,
      transfer: 0,
    };
    if (data?.checkOut?.length > 0) {
      for (let i = 0; i < data?.checkOut.length; i++) {
        if (["CALLTOCHECKOUT", "ACTIVE"].includes(data?.checkOut[i]?.status)) {
          _notCheckBill.total += 1;
          if (data?.checkOut[i]?.discountType === "LAK")
            _notCheckBill.discountCash += data?.checkOut[i]?.discount;
          if (data?.checkOut[i]?.discountType !== "LAK")
            _notCheckBill.discountPercent += data?.checkOut[i]?.discount;
          _notCheckBill.amount += _countAmount(data?.checkOut[i]?.orderId);
        }
        if (["CHECKOUT"].includes(data?.checkOut[i]?.status)) {
          _checkBill.total += 1;
          if (data?.checkOut[i]?.discountType === "LAK")
            _checkBill.discountCash += data?.checkOut[i]?.discount;
          if (data?.checkOut[i]?.discountType !== "LAK")
            _checkBill.discountPercent += data?.checkOut[i]?.discount;
          _checkBill.amount += data?.checkOut[i]?.billAmount;
          if (data?.checkOut[i]?.paymentMethod === "CASH") {
            _checkBill.cash += data?.checkOut[i]?.billAmount;
          }
          if (data?.checkOut[i]?.paymentMethod === "TRANSFER") {
            _checkBill.transfer += data?.checkOut[i]?.billAmount;
          }
          if (data?.checkOut[i]?.paymentMethod === "TRANSFER_CASH") {
            _checkBill.transfer +=
              data?.checkOut[i]?.billAmount - data?.checkOut[i]?.payAmount;
            _checkBill.cash += data?.checkOut[i]?.payAmount;
          }
        }
        if (data?.checkOut[i]?.discountType === "LAK")
          _disCountDataKib += data?.checkOut[i]?.discount;
        if (data?.checkOut[i]?.discountType !== "LAK")
          _disCountDataAon += data?.checkOut[i]?.discount;
        if (data?.checkOut[i]?.paymentMethod === "CASH")
          _cash += data?.checkOut[i]?.billAmount;
        if (data?.checkOut[i]?.paymentMethod !== "CASH")
          _aon += data?.checkOut[i]?.billAmount;
      }
    }
    setDataCheckBill(_checkBill);
    setDataNotCheckBill(_notCheckBill);
    setMoneyAon(_aon);
    setMoneyCash(_cash);
    setDisCountDataKib(_disCountDataKib);
    setDisCountDataPercent(_disCountDataAon);
  }, [data]);

  const { t } = useTranslation();

  const _countOrder = (item) => {
    let _countOrderCancel = 0;
    let _countOrderSuccess = 0;
    if (item?.length > 0) {
      for (let i = 0; i < item.length; i++) {
        if (item[i]?.status === "SERVED")
          _countOrderSuccess += item[i]?.quantity;
        if (item[i]?.status === "PAID") _countOrderSuccess += item[i]?.quantity;
        if (item[i]?.status === "CANCELED")
          _countOrderCancel += item[i]?.quantity;
      }
    }
    return { _countOrderSuccess, _countOrderCancel };
  };

  const _countAmount = (item) => {
    let _amount = 0;
    if (item?.length > 0) {
      for (let i = 0; i < item.length; i++) {
        const totalOptionPrice = item[i]?.totalOptionPrice ?? 0;
        const totalPrice =
          item[i]?.totalPrice ??
          (item[i]?.price + totalOptionPrice) * item[i]?.quantity;
        _amount += totalPrice;
      }
    }
    return _amount;
  };

  const formatMenuName = (name, options) => {
    const optionNames =
      options?.map((option) => `[${option.name}]`).join(" ") || "";
    return `${name} ${optionNames}`;
  };

  const renderDiscount = (value) => {
    const formattedValue = moneyCurrency(value);
    const currency =
      dataModal?.discountType !== "LAK" ? "%" : storeDetail?.firstCurrency;
    return `${formattedValue} ${currency}`;
  };

  const calculateDiscount = (menu) => {
    console.log("calculateDiscount", menu);

    if (
      !menu ||
      !menu.totalPrice ||
      !Array.isArray(menu.promotionId) ||
      menu.promotionId.length === 0 ||
      menu.status === "CANCELED"
    ) {
      return menu?.status === "CANCELED" ? 0 : menu?.totalPrice || 0;
    }

    let finalPrice = menu.totalPrice;

    // biome-ignore lint/complexity/noForEach: <explanation>
    menu.promotionId.forEach((promotion) => {
      if (
        !promotion ||
        !promotion.discountType ||
        promotion.discountValue == null
      ) {
        console.error("Invalid promotion data", promotion);
        return;
      }

      let discountAmount = 0;

      if (promotion.discountType === "PERCENTAGE") {
        if (promotion.discountValue < 0 || promotion.discountValue > 100) {
          console.warn("Invalid discount percentage:", promotion.discountValue);
          return;
        }
        discountAmount = (finalPrice * promotion.discountValue) / 100;
      } else if (promotion.discountType === "FIXED_AMOUNT") {
        discountAmount = promotion.discountValue;
      }

      // Apply the discount
      finalPrice = Math.max(finalPrice - discountAmount, 0);
    });

    return finalPrice;
  };

  let TotalAmount = 0;
  if (dataModal?.paymentMethod === "CASH") {
    TotalAmount =
      (dataModal?.point ?? 0) +
      (dataModal?.transferAmount ?? 0) +
      (dataModal?.payAmount ?? 0) +
      (dataModal?.change ?? 0) -
      (dataModal?.discount ?? 0);
  } else {
    TotalAmount =
      (dataModal?.point ?? 0) +
      (dataModal?.transferAmount ?? 0) +
      (dataModal?.payAmount ?? 0) -
      (dataModal?.discount ?? 0);
  }

  const TotalBefore =
    (dataModal?.billAmount ?? 0) +
    (dataModal?.taxAmount ?? 0) +
    (dataModal?.serviceChargeAmount ?? 0);

  const baseTotal =
    (dataModal?.point ?? 0) +
    (dataModal?.transferAmount ?? 0) +
    (dataModal?.change ?? 0) +
    (dataModal?.payAmount ?? 0) -
    (dataModal?.discount ?? 0) -
    (dataModal?.change ?? 0);

  const totalAfter =
    dataModal?.paymentMethod === "CASH" ||
    dataModal?.paymentMethod === "TRANSFER"
      ? baseTotal +
        (dataModal?.taxAmount ?? 0) +
        (dataModal?.serviceChargeAmount ?? 0)
      : baseTotal - dataModal?.change;

  let TotalCalculate = 0;

  if (dataModal?.paymentMethod === "CASH") {
    TotalCalculate =
      baseTotal +
      (dataModal?.taxAmount ?? 0) +
      (dataModal?.serviceChargeAmount ?? 0) +
      (dataModal?.discount ?? 0);
  } else if (dataModal?.paymentMethod === "TRANSFER") {
    TotalCalculate =
      baseTotal +
      (dataModal?.taxAmount ?? 0) +
      (dataModal?.serviceChargeAmount ?? 0) +
      (dataModal?.discount ?? 0);
  } else if (dataModal?.paymentMethod === "TRANSFER_CASH") {
    TotalCalculate = baseTotal ?? 0 - dataModal?.change ?? 0;
  } else if (dataModal?.paymentMethod === "CASH_TRANSFER_POINT") {
    TotalCalculate = baseTotal ?? 0 - dataModal?.change ?? 0;
  }

  useEffect(() => {
    const filteredData = data?.checkOut?.filter((item) => !item.isDebt) || [];
    setGetDataDashboardFinance(filteredData);
  }, [data]);

  useEffect(() => {
    setCountIsDebtTrue(
      data?.checkOut?.filter((item) => item?.isDebt === true).length
    );
  }, [data]);

  const mapOrderData = (orderId, formatMenuName, orderStatus) => {
    if (!orderId || !Array.isArray(orderId)) return [];

    return orderId.map((item, index) => {
      const isCanceled = item?.status === "CANCELED";

      return {
        index: index + 1,
        menuName: formatMenuName
          ? formatMenuName(item?.name || "", item?.options || [])
          : "-",
        quantity: item?.quantity || 0,
        status: item?.status || "UNKNOWN",
        statusColor: getStatusColor(item?.status),
        createdBy: item?.createdBy?.firstname || "-",
        isWeightMenu: item?.isWeightMenu,
        unitWeightMenu: item?.unitWeightMenu,
        totalPrice: (() => {
          if (isCanceled) return "CANCELED";
          try {
            const basePrice = item?.price || 0;
            const optionPrice = item?.totalOptionPrice || 0;
            const quantity = item?.quantity || 0;
            const isWeightMenu = item?.isWeightMenu;
            const totalPriceFromItem = item?.totalPrice;
            const isWeightMenuQuantity =
              item?.unitWeightMenu === "g"
                ? convertUnitgramAndKilogram(item?.quantity)
                : item?.quantity;
            const calculatedPrice =
              totalPriceFromItem *
              (isWeightMenu ? isWeightMenuQuantity : quantity);

            return new Intl.NumberFormat("ja-JP", { currency: "JPY" }).format(
              calculatedPrice
            );
          } catch {
            return "0";
          }
        })(),
        deliveryCode: item?.deliveryCode || "-",
        createdAt: item?.createdAt
          ? moment(item.createdAt).format("DD/MM/YYYY HH:mm")
          : "-",
        updatedAt: item?.updatedAt
          ? moment(item.updatedAt).format("DD/MM/YYYY HH:mm")
          : "-",
      };
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "WAITING":
        return "#2d00a8";
      case "DOING":
        return "#c48a02";
      case "SERVED":
        return "green";
      case "PAID":
        return COLOR_APP;
      case "PRINTBILL":
        return "blue";
      case "CART":
      case "FEEDBACK":
        return "#00496e";
      default:
        return "#bd0d00";
    }
  };

  const calculateTotalAmount = (orderData) => {
    try {
      return orderData.reduce((total, item) => {
        const price = parseFloat(item.totalPrice.replace(/,/g, "")) || 0;
        return total + price;
      }, 0);
    } catch {
      return 0;
    }
  };

  const orderData = mapOrderData(
    dataModal?.orderId,
    formatMenuName,
    orderStatus
  );
  const totalPriceAmount = calculateTotalAmount(orderData);

  useEffect(() => {
    setTotalTranferAndPayLast(dataModal?.totalTranferAndPayLast);
  }, [dataModal]);
  return (
    <div style={{ padding: 0 }}>
      {isLoading && <Loading />}
      <div style={{ padding: 10, overflowX: "auto" }}>
        <Table striped hover size="sm" style={{ fontSize: 15 }}>
          <thead>
            <tr>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("no")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("tableNumber")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("tableCode")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("tableDiscount")}
              </th>

              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("point")}
              </th>

              <>
                <th
                  style={{
                    textWrap: "nowrap",
                  }}
                >
                  delivery
                </th>
                <th
                  style={{
                    textWrap: "nowrap",
                  }}
                >
                  {t("name")} platform
                </th>
              </>

              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("price")} / {t("bill")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("served")} / {t("cancel")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("tableStatus")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("paymentType")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("time")}
              </th>
              <th
                style={{
                  textWrap: "nowrap",
                }}
              >
                {t("staffCheckBill")}
              </th>
            </tr>
          </thead>
          <tbody>
            {getDataDashboardFinance?.map((item, index) => (
              <tr
                key={item?._id}
                onClick={() => {
                  setSelectOrder(item);
                  handleShow(item);
                }}
                style={{
                  backgroundColor: ["CALLTOCHECKOUT", "ACTIVE"].includes(
                    item?.status
                  )
                    ? "#FB6E3B"
                    : "",
                  color: ["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
                    ? "#ffffff"
                    : "#616161",
                }}
              >
                <td>{(pagination - 1) * limitData + index + 1}</td>
                <td>{item?.tableId?.name ?? "-"}</td>
                <td>{item?.code}</td>
                <td>
                  {item?.discountType === "LAK"
                    ? new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(item?.discount) + t("lak")
                    : `${item?.discount}%`}
                </td>
                <td>{item?.point ? moneyCurrency(item?.point) : 0}</td>

                <>
                  <td>
                    {item?.orderId[0]?.deliveryCode
                      ? ["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
                        ? new Intl.NumberFormat("ja-JP", {
                            currency: "JPY",
                          }).format(_countAmount(item?.orderId))
                        : new Intl.NumberFormat("ja-JP", {
                            currency: "JPY",
                          }).format(item?.deliveryAmount)
                      : 0}{" "}
                    {storeDetail?.firstCurrency}
                  </td>
                  <td>
                    {item?.deliveryName
                      ? item?.deliveryName
                      : item?.orderId[0]?.platform
                      ? item?.orderId[0]?.platform
                      : "-"}
                  </td>
                </>

                <td>
                  {item?.orderId[0]?.deliveryCode
                    ? 0
                    : ["CALLTOCHECKOUT", "ACTIVE"].includes(item?.status)
                    ? new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(
                        isNaN(_countAmount(item?.orderId))
                          ? 0
                          : _countAmount(item?.orderId)
                      )
                    : new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(
                        item?.isDebtAndPay
                          ? item?.payAmount + item?.transferAmount
                          : item?.isDebtPayment
                          ? item?.payAmount +
                            item?.transferAmount -
                            item?.totalTranferAndPayLast
                          : isNaN(
                              item?.billAmount +
                                item?.taxAmount +
                                item?.serviceChargeAmount -
                                item?.point
                            )
                          ? item?.billAmount
                          : item?.billAmount +
                            item?.taxAmount +
                            item?.serviceChargeAmount -
                            item?.point
                      )}{" "}
                  {item?.isDebtPayment && (
                    <span className=" text-blue-500">
                      ( + {moneyCurrency(item?.totalTranferAndPayLast)}){" "}
                    </span>
                  )}
                  {storeDetail?.firstCurrency}
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "row",
                    }}
                  >
                    <p style={{ marginLeft: 5 }}>
                      {_countOrder(item?.orderId)?._countOrderSuccess}{" "}
                    </p>
                    <p style={{ marginLeft: 5 }}> / </p>
                    <p
                      style={{
                        color:
                          _countOrder(item?.orderId)?._countOrderCancel > 0
                            ? "red"
                            : "",
                        marginLeft: 5,
                      }}
                    >
                      {" "}
                      {_countOrder(item?.orderId)?._countOrderCancel}
                    </p>
                  </div>
                </td>
                <td
                  style={{
                    color:
                      item?.status === "CHECKOUT"
                        ? "green"
                        : item?.status === "CALLTOCHECKOUT"
                        ? "red"
                        : item?.status === "ACTIVE"
                        ? "#00496e"
                        : "",
                  }}
                >
                  {_statusCheckBill(item?.status)}
                </td>
                <td
                  style={{
                    color:
                      item?.paymentMethod === "CASH" ? "#00496e" : "#0D47A1",
                  }}
                >
                  {item?.paymentMethod === "CASH"
                    ? t("payBycash")
                    : item?.paymentMethod === "TRANSFER"
                    ? t("transferPayment")
                    : item?.paymentMethod === "DELIVERY"
                    ? `${t("transferPayment")} (delivery)`
                    : item?.paymentMethod === "POINT"
                    ? t("point")
                    : item?.paymentMethod === "CASH_TRANSFER_POINT"
                    ? t("transfercashpoint")
                    : t("transfercash")}{" "}
                  {item?.isDebtAndPay === true ? "(ຕິດໜີ້)" : ""}
                  {item?.isDebtPayment === true ? "(ຈາກການຊຳລະໜີ້)" : ""}
                </td>
                <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                <td>{item?.fullnameStaffCheckOut ?? "-"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
            bottom: 20,
          }}
        >
          <ReactPaginate
            previousLabel={
              <span className="glyphicon glyphicon-chevron-left">
                {t("previous")}
              </span>
            }
            nextLabel={
              <span className="glyphicon glyphicon-chevron-right">
                {t("next")}
              </span>
            }
            breakLabel={<Pagination.Item disabled>...</Pagination.Item>}
            breakClassName={"break-me"}
            pageCount={totalPagination} // Replace with the actual number of pages
            marginPagesDisplayed={1}
            pageRangeDisplayed={3}
            onPageChange={(e) => {
              setPagination(e?.selected + 1);
            }}
            containerClassName={"pagination justify-content-center"} // Bootstrap class for centering
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            activeClassName={"active"}
            previousClassName={"page-item"}
            nextClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextLinkClassName={"page-link"}
          />
        </div>
      </div>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("menuModal")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex justify-between my-4">
            <div>
              {totalAfter && TotalBefore > 0 ? (
                <div className="flex flex-row items-center text-green-500 gap-2">
                  <FaCircleCheck className="text-green-500 text-5xl" />{" "}
                  <div className="flex flex-col gap-1">
                    {/* <span>
                      ເງິນທີ່ຕ້ອງຈ່າຍ ={" "}
                      {`${new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(TotalBefore)} ${storeDetail?.firstCurrency}`}
                    </span> */}
                    <span>
                      ເງິນທີ່ຕ້ອງຈ່າຍ ={" "}
                      {new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(totalPriceAmount)}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                    <span>
                      ເງິນທີ່ໄດ້ຮັບມາຈານການປ້ອນ (
                      {dataModal?.paymentMethod === "CASH" ? "ເງິນສົດ " : ""}{" "}
                      {dataModal?.paymentMethod === "TRANSFER" ? "ເງິນໂອນ" : ""}{" "}
                      {dataModal?.paymentMethod === "TRANSFER_CASH"
                        ? "ເງິນສົດ + ເງິນໂອນ"
                        : ""}{" "}
                      {dataModal?.paymentMethod === "CASH_TRANSFER_POINT"
                        ? "ເງິນໂອນ + ເງິນສົດ + ພ໋ອຍ"
                        : ""}
                      ) ={" "}
                      {`${new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(
                        dataModal?.isDebtPayment
                          ? totalTranferAndPayLast
                          : TotalCalculate
                      )} ${storeDetail?.firstCurrency}`}{" "}
                    </span>
                    {dataModal?.isDebtPayment === true && (
                      <span>
                        {`ຍອດເງິນລວມທັງຫມົດທີຊຳລະກ່ອນຫນ້ານີ້ = ${moneyCurrency(
                          TotalCalculate - totalTranferAndPayLast
                        )}`}{" "}
                        {storeDetail?.firstCurrency}
                      </span>
                    )}
                    <span>
                      ເງິນທີ່ຍັງຄ້າງຊຳລະ ={" "}
                      {moneyCurrency(dataModal?.remainingAmount)}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                  </div>
                </div>
              ) : dataModal?.deliveryAmount ? (
                dataModal?.deliveryAmount > 0 ? (
                  <span className="flex items-center text-green-500 gap-2">
                    <FaCircleCheck className="text-green-500 text-5xl" />{" "}
                    ບິນຖຶກຕ້ອງ{" "}
                    {`${new Intl.NumberFormat("ja-JP", {
                      currency: "JPY",
                    }).format(dataModal?.deliveryAmount)}`}{" "}
                    {storeDetail?.firstCurrency}
                  </span>
                ) : (
                  <span className="flex items-center gap-2 text-red-500">
                    <BsFillExclamationTriangleFill className="text-red-500 text-5xl" />{" "}
                    ບິນບໍ່ຖຶກຕ້ອງ{" "}
                    {`${new Intl.NumberFormat("ja-JP", {
                      currency: "JPY",
                    }).format(dataModal?.deliveryAmount)}`}{" "}
                    {storeDetail?.firstCurrency}
                  </span>
                )
              ) : (
                ""
              )}
            </div>
            <div className="">
              {!storeDetail?.isStatusCafe && (
                <Button
                  disabled={
                    disabledEditBill ||
                    selectOrder?.status === "ACTIVE" ||
                    profile?.data?.role !== "APPZAP_ADMIN" ||
                    dataModal?.isDebtPayment === true ||
                    dataModal?.isDebtAndPay === true
                  }
                  onClick={handleEditBill}
                >
                  {selectOrder?.status === "ACTIVE"
                    ? t("editingTheBill")
                    : t("billEditing")}
                </Button>
              )}
              {storeDetail?.isStatusCafe && (
                <Button
                  // disabled={
                  //   disabledEditBill ||
                  //   selectOrder?.status === "ACTIVE" ||
                  //   profile?.data?.role != "APPZAP_ADMIN" ||
                  //   dataModal?.isDebtPayment === true ||
                  //   dataModal?.isDebtAndPay === true
                  // }
                  onClick={() => navigate(`/cafe/Edit/${dataModal?._id}`)}
                >
                  {t("billEditing")}
                </Button>
              )}
              <Button className="ml-2" onClick={() => onPrintBill()}>
                Print
              </Button>
            </div>
          </div>
          <Table striped bordered hover size="sm" style={{ fontSize: 15 }}>
            <thead>
              <tr>
                <th>{t("no")}</th>
                <th>{t("menuname")}</th>
                <th>{t("amount")}</th>
                <th>{t("statusOfFood")}</th>
                <th>{t("servedBy")}</th>
                <th>{t("price")}</th>
                {storeDetail?.isDelivery && <th>DC Code</th>}
                <th>{t("time")}</th>
                {/* <th>ເວລາອັບເດດ</th> */}
              </tr>
            </thead>
            <tbody>
              {mapOrderData(
                dataModal?.orderId,
                formatMenuName,
                orderStatus
              ).map((item) => (
                <tr key={item.index}>
                  <td>{item.index}</td>
                  <td>{item.menuName}</td>
                  <td>
                    {item?.isWeightMenu
                      ? `${item?.quantity} /${item?.unitWeightMenu}`
                      : item.quantity}
                  </td>
                  <td style={{ color: item.statusColor }}>
                    {orderStatus(item.status)}
                  </td>
                  <td>{item.createdBy}</td>

                  <td>{calculateDiscount(item)}</td>

                  {storeDetail?.isDelivery && (
                    <td style={{ textAlign: "center" }}>{item.deliveryCode}</td>
                  )}
                  <td>{item.createdAt}</td>
                  {/* <td>{item.updatedAt}</td> */}
                </tr>
              ))}
            </tbody>
          </Table>
          {!dataModal?.deliveryAmount ? (
            <div className="flex justify-end items-center mt-3">
              <div className="w-[260px]">
                <div className="flex justify-between ">
                  <div className="flex flex-col">
                    <span>{t("discount")} : </span>
                    <span>{t("vat")} : </span>
                    <span>{t("cash")} :</span>
                    <span>{t("transferAmount")} :</span>
                    <span>{t("point")}</span>
                    <span>{t("totalPrice2")} :</span>
                    <span>{t("change")} :</span>
                    <span>{t("total_Amount_of_Money")} :</span>
                  </div>
                  <div className="flex flex-col">
                    <span>{renderDiscount(dataModal?.discount)}</span>
                    <span>
                      {moneyCurrency(dataModal?.taxAmount)}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                    <span>
                      {moneyCurrency(
                        dataModal?.payAmount > 0
                          ? dataModal?.paymentMethod === "CASH"
                            ? dataModal?.payAmount -
                              dataModal?.taxAmount +
                              dataModal?.change
                            : dataModal?.payAmount - dataModal?.taxAmount
                          : 0
                      )}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                    <span>
                      {moneyCurrency(
                        dataModal?.transferAmount > 0
                          ? dataModal?.transferAmount - dataModal?.taxAmount
                          : 0
                      )}{" "}
                      {storeDetail?.firstCurrency}
                    </span>

                    <span>
                      {dataModal?.point > 0
                        ? moneyCurrency(dataModal?.point - dataModal?.taxAmount)
                        : 0}{" "}
                      {t("point")}
                    </span>

                    <span>
                      {moneyCurrency(
                        dataModal?.discount > 0
                          ? (dataModal?.discount ?? 0) + TotalAmount
                          : TotalAmount
                      )}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                    <span>
                      {moneyCurrency(dataModal?.change)}{" "}
                      {storeDetail?.firstCurrency}{" "}
                    </span>
                    <span>
                      {moneyCurrency(
                        dataModal?.discount > 0
                          ? (dataModal?.discount ?? 0) + totalAfter
                          : totalAfter
                      )}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-end items-center mt-3">
              <div className="w-[260px]">
                <div className="flex justify-between ">
                  <div className="flex flex-col">
                    <span>{t("total_Amount_of_Money")} :</span>
                  </div>
                  <div className="flex flex-col">
                    <span
                      className={`${
                        dataModal?.deliveryAmount <= 0
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {moneyCurrency(dataModal?.deliveryAmount)}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        {dataModal?.isCafe ? (
          <div
            style={{ width: "80mm", padding: 10, margin: 5 }}
            ref={bill80Ref}
          >
            <BillForCheckOutCafe80
              storeDetail={storeDetail}
              profile={profile}
              dataBill={dataModal?.orderId}
              data={dataModal?.length}
              memberData={""}
            />
          </div>
        ) : (
          <div
            style={{ width: "80mm", padding: 10, margin: 5 }}
            ref={bill80Ref}
          >
            <BillForCheckOut80
              orderPayBefore={0}
              storeDetail={storeDetail}
              selectedTable={selectedTable}
              dataBill={dataModal}
              totalBillBillForCheckOut80={totalAfter}
              // taxPercent={taxPercent}
              profile={profile}
            />
          </div>
        )}

        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            {t("close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
