import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Modal, Form, Container, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import moment from "moment";
import { QRCode } from "react-qrcode-logo";
import axios from "axios";
import html2canvas from "html2canvas";
import { base64ToBlob, orderStatusTranslate } from "../../helpers";
import { Checkbox } from "@material-ui/core";
import Box from "../../components/Box";
import PopUpQRToken from "../../components/popup/PopUpQRToken";

import { SiAirtable } from "react-icons/si";

/**
 * component
 * */
import Loading from "../../components/Loading";
import UserCheckoutModal from "./components/UserCheckoutModal";
import OrderCheckOut from "./components/OrderCheckOut";
import UpdateDiscountOrder from "./components/UpdateDiscountOrder";
import FeedbackOrder from "./components/FeedbackOrder";
import { orderStatus, moneyCurrency } from "../../helpers";
import BillForCheckOut80 from "../../components/bill/BillForCheckOut80";
import BillForCheckOut58 from "../../components/bill/BillForCheckOut58";
import BillForChef80 from "../../components/bill/BillForChef80";
import BillForChef58 from "../../components/bill/BillForChef58";
import PopUpPin from "../../components/popup/PopUpPin";
import printFlutter from "../../helpers/printFlutter";

/**
 * const
 **/
import {
  BLUETOOTH_PRINTER_PORT,
  COLOR_APP,
  ETHERNET_PRINTER_PORT,
  USB_PRINTER_PORT,
} from "../../constants/index";
import { useStore } from "../../store";
import {
  END_POINT_APP,
  END_POINT_SEVER_TABLE_MENU,
  END_POINT_WEB_CLIENT,
  USERS,
  getLocalData,
} from "../../constants/api";
import { successAdd, errorAdd, warningAlert } from "../../helpers/sweetalert";
import { getHeaders, tokenSelfOrderingPost } from "../../services/auth";
import { useNavigate, useParams } from "react-router-dom";
import { getBills } from "../../services/bill";
import { getCountOrderWaiting, updateOrderItem } from "../../services/order";
import styled from "styled-components";
import { callCheckOutPrintBillOnly, getCodes } from "../../services/code";
import PopUpAddDiscount from "../../components/popup/PopUpAddDiscount";
import { useTranslation } from "react-i18next";
import PopupOpenTable from "../../components/popup/PopupOpenTable";
import BillQRShortSmartOrdering80 from "../../components/bill/BillQRShortSmartOrdering80";
import CheckOutPopup from "./components/CheckOutPopup";
import CheckPopupDebt from "./components/CheckPopupDebt";
import { IoQrCode } from "react-icons/io5";
import BillForChefCancel80 from "../../components/bill/BillForChefCancel80";
import PopUpTranferTable from "../../components/popup/PopUpTranferTable";
import { printItems } from "./printItems";
import CombinedBillForChefNoCut from "../../components/bill/CombinedBillForChefNoCut";
import { repeat } from "lodash";
import { FaCheck } from "react-icons/fa";
import { FaTimes } from "react-icons/fa";
import { PiSpinnerLight } from "react-icons/pi";
import { MdOutlineTableRestaurant } from "react-icons/md";


export default function TableList() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams();
  const number = params?.number;
  const activeTableId = params?.tableId;
  const { t } = useTranslation();

  // state
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [popup, setPopup] = useState({ CheckOutType: false });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose1 = () => setShow1(false);

  const handleSelectedCancelOrder = (e) =>
    setSeletedCancelOrderItem(e.target.value);

  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [dataSettingModal, setDataSettingModal] = useState();
  const [feedbackOrderModal, setFeedbackOrderModal] = useState(false);

  const [checkoutModel, setCheckoutModal] = useState(false);
  const [menuItemDetailModal, setMenuItemDetailModal] = useState(false);
  const [dataBill, setDataBill] = useState();
  const [modalAddDiscount, setModalAddDiscount] = useState(false);
  const [reload, setReload] = useState(false);
  const [quantity, setQuantity] = useState(false);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [codeShortLink, setCodeShortLink] = useState(null);
  const [qrToken, setQrToken] = useState("");
  const [pinStatus, setPinStatus] = useState(false);
  const [workAfterPin, setWorkAfterPin] = useState("");

  const handleCloseQuantity = () => setQuantity(false);

  const { printerCounter, printers } = useStore();

  // provider
  const {
    orderItemForPrintBill,
    tableList,
    selectedTable,
    setSelectedTable,
    openTable,
    tableOrderItems,
    getTableDataStore,
    onSelectTable,
    resetTableOrder,
    storeDetail,
    setStoreDetail,
    getTableOrders,
    newTableTransaction,
    setNewTableTransaction,
    newOrderTransaction,
    setNewOrderTransaction,
    newOrderUpdateStatusTransaction,
    setNewOrderUpdateStatusTransaction,
    openTableAndReturnCodeShortLink,
    setCountOrderWaiting,
    profile,
    isWaitingCheckout,
  } = useStore();

  const reLoadData = () => {
    setReload(true);
  };
  useEffect(() => {
    if (reload) {
      getTableOrders(selectedTable);
      setReload(false);
    }
  }, [reload]);

  const [isCheckedOrderItem, setIsCheckedOrderItem] = useState([]);
  const [seletedOrderItem, setSeletedOrderItem] = useState();
  const [seletedCancelOrderItem, setSeletedCancelOrderItem] = useState("");
  const [checkedBox, setCheckedBox] = useState(false);
  const [taxPercent, setTaxPercent] = useState(0);
  const [serviceChargePercent, setServiceChargePercent] = useState(0);
  const [userData, setuserData] = useState(null);
  const [zoneData, setZoneData] = useState();
  const [zoneId, setZoneId] = useState();
  const [combinedBillRefs, setCombinedBillRefs] = useState({});
  const [groupedItems, setGroupedItems] = useState({});
  const [printBillLoading, setPrintBillLoading] = useState(false);

  useEffect(() => {
    const orderSelect = isCheckedOrderItem?.filter((e) => e?.isChecked);
    const refs = {};
    const grouped = groupItemsByPrinter(orderSelect);
    // Create refs for each printer IP
    Object.keys(grouped).forEach((printerIp) => {
      refs[printerIp] = React.createRef();
    });
    setCombinedBillRefs(refs);
    setGroupedItems(grouped);
  }, [isCheckedOrderItem]);

  const groupItemsByPrinter = (items) => {
    return items?.reduce((groups, item) => {
      const printer = printers.find((e) => e?._id === item.printer);
      const printerIp = printer?.ip || "unknown";
      if (!groups[printerIp]) {
        groups[printerIp] = [];
      }
      groups[printerIp].push(item);
      return groups;
    }, {});
  };

  useEffect(() => {
    if (!pinStatus) return;
    setPinStatus(false);
    if (workAfterPin == "discount") {
      setWorkAfterPin("");
      setPopup({ discount: true });
    }
    if (workAfterPin == "cancle_order") {
      setWorkAfterPin("");
      setPopup();
      setShow1(true);
    }
    if (workAfterPin == "cancle_order_and_print") {
      setPopup();
      setShow1(true);
    }

    getUserData();
  }, [pinStatus]);

  useEffect(() => {
    const localZone = localStorage.getItem("selectedZone");
    if (localZone) {
      setZoneId(localZone);
      getTableDataStore({ zone: localZone });
    }

    getUserData();
    getDataZone();
    getDataTax();
    getDataServiceCharge();

    setStoreDetail({
      ...storeDetail,
      serviceChargePer: 0,
      zoneCheckBill: false,
    });
  }, []);

  const getUserData = async () => {
    // setIsLoading(true);
    await fetch(USERS + `/skip/0/limit/0/?storeId=${storeDetail?._id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => setuserData(json));
    // setIsLoading(false);
  };

  const getDataTax = async () => {
    const { DATA } = await getLocalData();
    const _res = await axios.get(
      END_POINT_SEVER_TABLE_MENU + "/v4/tax/" + DATA?.storeId
    );
    setTaxPercent(_res?.data?.taxPercent);
  };

  const getDataServiceCharge = async () => {
    const { DATA } = await getLocalData();
    const _res = await axios.get(
      `${END_POINT_SEVER_TABLE_MENU}/v4/service-charge/${DATA?.storeId}`
    );
    setServiceChargePercent(_res?.data?.serviceCharge);
  };

  function handleSetQuantity(int, seletedOrderItem) {
    let _data = seletedOrderItem?.quantity + int;
    if (_data > 0) {
      setSeletedOrderItem({ ...seletedOrderItem, quantity: _data });
    }
  }

  const canCheckOut = !tableOrderItems.find(
    (e) =>
      e?.status === "DOING" ||
      e?.status === "WAITING" ||
      e?.tableOrderItems?.length === 0
  )?._id;

  useEffect(() => {
    // setIsCheckedOrderItem([...tableOrderItems]);
    if (tableOrderItems?.length > 0)
      updateCheckedOrderItems(isCheckedOrderItem, tableOrderItems);
    else setIsCheckedOrderItem([]);
  }, [selectedTable, tableOrderItems]);

  const updateCheckedOrderItems = (isCheckedOrderItem, tableOrderItems) => {
    if (
      isCheckedOrderItem.length <= 0 ||
      tableOrderItems[0]["code"] != isCheckedOrderItem[0]["code"]
    ) {
      setIsCheckedOrderItem(tableOrderItems);
    } else {
      tableOrderItems.forEach((tableItem) => {
        const existingItemIndex = isCheckedOrderItem.findIndex(
          (checkedItem) => checkedItem._id === tableItem._id
        );

        if (existingItemIndex === -1) {
          // Item doesn't exist in isCheckedOrderItem, so add it
          isCheckedOrderItem = [{ ...tableItem }, ...isCheckedOrderItem];
        } else {
          // Item exists, check if status differs
          if (
            isCheckedOrderItem[existingItemIndex].status !== tableItem.status
          ) {
            // Update the status
            isCheckedOrderItem[existingItemIndex].status = tableItem.status;
          }
        }
      });
      setIsCheckedOrderItem(isCheckedOrderItem);
    }
  };

  const _handlecheckout = async () => {
    setCheckoutModal(false);
    navigate(
      `/tables/pagenumber/${number}/tableid/${activeTableId}/${params?.storeId}`
    );
  };

  const [billDataLoading, setBillDataLoading] = useState(false);
  const _onCheckOut = async () => {
    getData(selectedTable?.code, true);
    setMenuItemDetailModal(true);
  };
  const _goToAddOrder = (tableId, code) => {
    navigate(`/addOrder/tableid/${tableId}/code/${code}`);
  };

  useEffect(() => {
    if (tableOrderItems?.length > 0) {
      getData(tableOrderItems[0]?.code, false);
    } else {
      setDataBill();
    }
  }, [tableOrderItems]);

  useEffect(() => {
    console.log("ZONE23");
    if (zoneId) {
      getTableDataStore({ zone: zoneId });
    } else {
      getTableDataStore();
    }
  }, [zoneId]);

  useEffect(() => {
    console.log("ZONEID");
    if (state?.zoneId) {
      getTableDataStore({ zone: state?.zoneId });
    } else {
      getTableDataStore();
    }
  }, [state?.zoneId]);

  // console.log("ZONE Out :", storeDetail?.zoneCheckBill);

  useEffect(() => {
    console.log("ZONE In :", storeDetail?.zoneCheckBill);
    if (storeDetail?.zoneCheckBill === true) {
      getTableDataStore({ zone: state?.zoneId });
    } else {
      getTableDataStore();
    }
  }, [storeDetail?.zoneCheckBill === true]);

  const onSelectedZone = (value) => {
    localStorage.setItem("selectedZone", value);
    setZoneId(value);
    if (!value) {
      getTableDataStore();
    }
  };

  const getData = async (code, forBill) => {
    try {
      if (forBill) setBillDataLoading(true);
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      let findby = "?";
      findby += `code=${code}`;
      const _bills = await getBills(findby);
      const _billId = _bills?.[0]?.["_id"];
      const _resBill = await axios({
        method: "get",
        url: END_POINT_SEVER_TABLE_MENU + `/v3/bill-group/` + _billId,
        headers: headers,
      });
      setDataBill(_resBill?.data);
      setTimeout(() => {
        setBillDataLoading(false);
      }, 1000);
    } catch (err) {
      setBillDataLoading(false);
      console.log("err: ", err);
    }
  };

  const [selectNewTable, setSelectNewTable] = useState();

  const _changeTable = async () => {
    if (!selectNewTable) {
      handleClose();
      await Swal.fire({
        icon: "warning",
        title: `${t("please_select_table")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    try {
      const _billsNew = await getBills(`?_id=${selectNewTable?.billId}`);
      const _billIdNew = _billsNew?.[0]?.["_id"];

      const _billsOld = await getBills(`?_id=${selectedTable?.billId}`);
      const _billIdOld = _billsOld?.[0]?.["_id"];

      const _codesNew = await getCodes(`?_id=${selectNewTable?._id}`);
      const _codeIdNew = _codesNew?.[0]?.["_id"];

      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      const changTable = await axios({
        method: "put",
        url: END_POINT_SEVER_TABLE_MENU + `/v3/bill-transfer`,
        data: {
          billOld: _billIdOld,
          billNew: _billIdNew ?? "NOT_BILL",
          codeId: _codeIdNew,
          tableNow: selectedTable?.tableName,
          tableNew: selectNewTable?.tableName,
        },
        headers: headers,
      });
      if (changTable?.status === 200) {
        handleClose();
        setSelectedTable();
        // getTableDataStore();
        if (zoneId) {
          getTableDataStore({ zone: zoneId });
        } else {
          getTableDataStore();
        }
        await Swal.fire({
          icon: "success",
          title: `${t("change_table_success")}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      console.log({ err });
      await Swal.fire({
        icon: "error",
        title: `${t("change_table_fial")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
    setSelectNewTable();
  };

  const _openModalSetting = (data) => {
    setDataSettingModal(data);
    setOpenModalSetting(true);
  };

  const _resetTable = async () => {
    try {
      if (tableOrderItems?.length > 0) {
        setOpenModalSetting(false);
        warningAlert(`${t("can_not_close_table")}`);
        return;
      }
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const updateTable = await axios({
        method: "put",
        url: END_POINT_SEVER_TABLE_MENU + `/v3/code/update`,
        data: {
          id: dataSettingModal?._id,
          data: {
            isOpened: false,
            isStaffConfirm: false,
          },
        },
        headers: headers,
      });
      setOpenModalSetting(false);
      if (updateTable.status < 300) {
        setSelectedTable();
        // getTableDataStore();
        if (zoneId) {
          getTableDataStore({ zone: zoneId });
        } else {
          getTableDataStore();
        }
        successAdd(`${t("close_table_success")}`);
      }
    } catch (err) {
      errorAdd(`${t("close_table_fial")}`);
    }
  };

  const _checkStatusCode = (code) => {
    let _open = 0;
    for (let i = 0; i < code?.length; i++) {
      if (
        code[i]?.isOpened &&
        code[i]?.status &&
        code[i]?.isStaffConfirm &&
        !code[i]?.isCheckout
      )
        _open += 1;
    }
    return _open;
  };
  const _checkStatusCodeA = (code) => {
    let _empty = 0;
    for (let i = 0; i < code?.length; i++) {
      if (
        !code[i]?.isOpened &&
        code[i]?.status &&
        !code[i]?.isStaffConfirm &&
        !code[i]?.isCheckout
      )
        _empty += 1;
    }
    return _empty;
  };

  const _checkStatusCodeB = (code) => {
    let _checkBill = 0;
    for (let i = 0; i < code?.length; i++) {
      if (
        code[i]?.isOpened &&
        code[i]?.status &&
        code[i]?.isStaffConfirm &&
        !code[i]?.isCheckout &&
        code[i]?.statusBill === "CALL_TO_CHECKOUT"
      )
        _checkBill += 1;
    }
    return _checkBill;
  };

  const [widthBill80, setWidthBill80] = useState(0);
  const [widthBill58, setWidthBill58] = useState(0);

  let qrSmartOrder80Ref = useRef(null);

  let bill80Ref = useRef(null);
  let bill58Ref = useRef(null);
  useLayoutEffect(() => {
    setWidthBill80(bill80Ref.current.offsetWidth);
    setWidthBill58(bill58Ref.current.offsetWidth);
  }, [bill80Ref, bill58Ref]);

  // ສ້າງປະຫວັດການພິມບິນຂອງແຕ່ລະໂຕະ
  const _createHistoriesPrinter = async (data) => {
    try {
      let headers = await getHeaders();
      const _url = `${END_POINT_APP}/v3/logs/create-histories-printer`;
      const updateTable = await axios({
        method: "post",
        url: _url,
        data: data,
        headers: headers,
      });

      if (updateTable?.status < 300) {
        console.log("success create printer bil...");
      }
    } catch (err) {
      console.log({ err });
    }
  };

  const onPrintBill = async (isPrintBill) => {
    console.log("isPrintBill", isPrintBill);
    try {
      setPrintBillLoading(true);
      let _dataBill = {
        ...dataBill,
        typePrint: "PRINT_BILL_CHECKOUT",
      };
      await _createHistoriesPrinter(_dataBill);
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
      // update bill status to call check out
      callCheckOutPrintBillOnly(selectedTable?._id);
      setSelectedTable();
      setStoreDetail({ ...storeDetail, ChangeColorTable: true });

      setPrintBillLoading(false);
      await Swal.fire({
        icon: "success",
        title: `${t("checkbill_success")}`,
        showConfirmButton: false,
        timer: 1800,
      });

      // update bill status to call check out
      callCheckOutPrintBillOnly(selectedTable?._id);
      setSelectedTable();
      // getTableDataStore();
      if (zoneId) {
        getTableDataStore({ zone: zoneId });
      } else {
        getTableDataStore();
      }
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

  useEffect(() => {
    getTableDataStore();
  }, [storeDetail?.ChangeColorTable]);

  async function delay(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  useEffect(() => {
    if (codeShortLink) {
      onPrintQR(codeShortLink);
    }
  }, [codeShortLink]);

  const onPrintQR = async (tokenQR) => {
    try {
      if (!tokenQR) {
        return;
      }

      // alert(tokenQR);
      // setTokenForSmartOrder(tokenQR, (ee) => {
      //   console.log(tokenForSmartOrder, "tokenForSmartOrder");
      // });
      // if (!tokenForSmartOrder) {
      //   setTokenForSmartOrder(tokenQR);
      //   await delay(1000);
      //   return;
      // }
      // if (!tokenForSmartOrder) {
      //   return;
      // }

      let urlForPrinter = "";
      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );

      let dataImageForPrint;
      if (printerBillData?.width === "80mm") {
        dataImageForPrint = await html2canvas(qrSmartOrder80Ref.current, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 530 / widthBill80,
        });
      }

      if (printerBillData?.width === "58mm") {
        dataImageForPrint = await html2canvas(qrSmartOrder80Ref.current, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 350 / widthBill58,
        });
      }

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
      bodyFormData.append("isdrawer", false);
      bodyFormData.append("ip", printerBillData?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);
      bodyFormData.append("paper", printerBillData?.width === "58mm" ? 58 : 80);

      await printFlutter(
        {
          imageBuffer: dataImageForPrint.toDataURL(),
          ip: printerBillData?.ip,
          type: printerBillData?.type,
          port: "9000",
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

      // await axios({
      //   method: "post",
      //   url: urlForPrinter,
      //   data: bodyFormData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      // setCodeShortLink(null);
      await Swal.fire({
        icon: "success",
        title: `${t("print_success")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      // setCodeShortLink(null);
    } catch (err) {
      setCodeShortLink(null);
      console.log(err);
      await Swal.fire({
        icon: "error",
        title: `${t("print_fial")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const onPrintDrawer = async () => {
    try {
      let urlForPrinter = "";
      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );

      if (printerBillData?.type === "ETHERNET") {
        urlForPrinter = "http://localhost:9150/ethernet/drawer";
      }
      if (printerBillData?.type === "BLUETOOTH") {
        urlForPrinter = "http://localhost:9150/bluetooth/drawer";
      }
      if (printerBillData?.type === "USB") {
        urlForPrinter = "http://localhost:9150/usb/drawer";
      }

      var bodyFormData = new FormData();
      bodyFormData.append("ip", printerBillData?.ip);
      bodyFormData.append("port", "9100");

      // await axios({
      //   method: "post",
      //   url: urlForPrinter,
      //   data: bodyFormData,
      //   headers: { "Content-Type": "multipart/form-data" },
      // });

      await axios.post(urlForPrinter, {
        ip: printerBillData?.ip,
        port: 9100,
      });
    } catch (err) {
      console.log(err);
      await Swal.fire({
        icon: "error",
        title: `${t("open_drawer_fail")}`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const arrLength = isCheckedOrderItem?.filter((e) => e?.isChecked).length;

  const billForCher80 = useRef([]);
  const billForCher58 = useRef([]);
  const billForCherCancel80 = useRef([]);

  if (billForCher80.current.length !== arrLength) {
    // add or remove refs
    billForCher80.current = Array(arrLength)
      .fill()
      .map((_, i) => billForCher80.current[i]);
  }
  if (billForCher58.current.length !== arrLength) {
    // add or remove refs
    billForCher58.current = Array(arrLength)
      .fill()
      .map((_, i) => billForCher58.current[i]);
  }
  if (billForCherCancel80.current.length !== arrLength) {
    // add or remove refs
    billForCherCancel80.current = Array(arrLength)
      .fill()
      .map((_, i) => billForCherCancel80.current[i]);
  }

  const [onPrinting, setOnPrinting] = useState(false);

  const onPrintToKitchen = async () => {
    const hasNoCut = printers.some((printer) => printer.cutPaper === "not_cut");

    if (hasNoCut) {
      // Print with no cut
      printItems(groupedItems, combinedBillRefs, printers);
    } else {
      // Print with cut
      onPrintForCher();
    }
  };

  const onPrintForCher = async () => {
    setOnPrinting(true);

    let _dataBill = {
      ...dataBill,
      typePrint: "PRINT_BILL_FORCHER",
    };
    await _createHistoriesPrinter(_dataBill);

    const orderSelect = isCheckedOrderItem?.filter((e) => e?.isChecked);
    let _index = 0;
    const printDate = [...billForCher80.current];
    let dataUrls = [];
    for (const _ref of printDate) {
      const dataUrl = await html2canvas(_ref, {
        useCORS: true,
        scrollX: 10,
        scrollY: 0,
        scale: 530 / widthBill80,
      });
      dataUrls.push(dataUrl);
    }
    for (const _ref of printDate) {
      const _printer = printers.find((e) => {
        return e?._id === orderSelect?.[_index]?.printer;
      });

      try {
        let urlForPrinter = "";
        let dataUrl = dataUrls[_index];
        // if (_printer?.width === "80mm") {
        //   dataUrl = await html2canvas(printDate[_index], {
        //     useCORS: true,
        //     scrollX: 10,
        //     scrollY: 0,
        //     scale: 530 / widthBill80,
        //   });
        // }
        // if (_printer?.width === "58mm") {
        //   dataUrl = await html2canvas(printDate[_index], {
        //     useCORS: true,
        //     scrollX: 10,
        //     scrollY: 0,
        //     scale: 350 / widthBill58,
        //   });
        // }
        if (_printer?.type === "ETHERNET") {
          urlForPrinter = ETHERNET_PRINTER_PORT;
        }
        if (_printer?.type === "BLUETOOTH") {
          urlForPrinter = BLUETOOTH_PRINTER_PORT;
        }
        if (_printer?.type === "USB") {
          urlForPrinter = USB_PRINTER_PORT;
        }
        // const _image64 = await resizeImage(dataUrl.toDataURL(), 300, 500);

        const _file = await base64ToBlob(dataUrl.toDataURL());
        var bodyFormData = new FormData();
        bodyFormData.append("ip", _printer?.ip);
        bodyFormData.append("isdrawer", false);
        bodyFormData.append("port", "9100");
        bodyFormData.append("image", _file);
        bodyFormData.append("paper", _printer?.width === "58mm" ? 58 : 80);
        if (_index === 0) {
          bodyFormData.append("beep1", 1);
          bodyFormData.append("beep2", 9);
        }
        await printFlutter(
          {
            imageBuffer: dataUrl.toDataURL(),
            ip: _printer?.ip,
            type: _printer?.type,
            port: "9100",
            width: _printer?.width === "58mm" ? 400 : 580,
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
        // printFlutter({
        //   imageBuffer: dataUrl.toDataURL(),
        //   ip: _printer?.ip,
        //   type: _printer?.type,
        //   port: "9100",
        // });
        // await axios({
        //   method: "post",
        //   url: urlForPrinter,
        //   data: bodyFormData,
        //   headers: { "Content-Type": "multipart/form-data" },
        // });
        if (_index === 0) {
          await Swal.fire({
            icon: "success",
            title: `${t("print_success")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (err) {
        console.log(err);
        if (_index === 0) {
          await Swal.fire({
            icon: "error",
            title: `${t("print_fial")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
      _index++;
    }
    setOnPrinting(false);
  };

  const onPrintForCherCancel = async () => {
    setOnPrinting(true);

    let _dataBill = {
      ...dataBill,
      typePrint: "PRINT_BILL_FORCHER",
    };
    await _createHistoriesPrinter(_dataBill);

    const orderSelect = isCheckedOrderItem?.filter((e) => e?.isChecked);
    let _index = 0;
    const printDate = [...billForCherCancel80.current];
    let dataUrls = [];
    for (const _ref of printDate) {
      const dataUrl = await html2canvas(_ref, {
        useCORS: true,
        scrollX: 10,
        scrollY: 0,
        scale: 530 / widthBill80,
      });
      dataUrls.push(dataUrl);
    }
    for (const _ref of printDate) {
      const _printer = printers.find((e) => {
        return e?._id === orderSelect?.[_index]?.printer;
      });

      try {
        let urlForPrinter = "";
        let dataUrl = dataUrls[_index];
        // if (_printer?.width === "80mm") {
        //   dataUrl = await html2canvas(printDate[_index], {
        //     useCORS: true,
        //     scrollX: 10,
        //     scrollY: 0,
        //     scale: 530 / widthBill80,
        //   });
        // }
        // if (_printer?.width === "58mm") {
        //   dataUrl = await html2canvas(printDate[_index], {
        //     useCORS: true,
        //     scrollX: 10,
        //     scrollY: 0,
        //     scale: 350 / widthBill58,
        //   });
        // }
        if (_printer?.type === "ETHERNET") {
          urlForPrinter = ETHERNET_PRINTER_PORT;
        }
        if (_printer?.type === "BLUETOOTH") {
          urlForPrinter = BLUETOOTH_PRINTER_PORT;
        }
        if (_printer?.type === "USB") {
          urlForPrinter = USB_PRINTER_PORT;
        }
        // const _image64 = await resizeImage(dataUrl.toDataURL(), 300, 500);

        const _file = await base64ToBlob(dataUrl.toDataURL());
        var bodyFormData = new FormData();
        bodyFormData.append("ip", _printer?.ip);
        bodyFormData.append("port", "9100");
        bodyFormData.append("image", _file);
        bodyFormData.append("paper", _printer?.width === "58mm" ? 58 : 80);
        if (_index === 0) {
          bodyFormData.append("beep1", 1);
          bodyFormData.append("beep2", 9);
        }
        await printFlutter(
          {
            imageBuffer: dataUrl.toDataURL(),
            ip: _printer?.ip,
            type: _printer?.type,
            port: "9100",
            width: _printer?.width === "58mm" ? 400 : 580,
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
        // printFlutter({
        //   imageBuffer: dataUrl.toDataURL(),
        //   ip: _printer?.ip,
        //   type: _printer?.type,
        //   port: "9100",
        // });
        // await axios({
        //   method: "post",
        //   url: urlForPrinter,
        //   data: bodyFormData,
        //   headers: { "Content-Type": "multipart/form-data" },
        // });
        if (_index === 0) {
          await Swal.fire({
            icon: "success",
            title: `${t("print_success")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (err) {
        console.log(err);
        if (_index === 0) {
          setOnPrinting(false);
          return { error: true, err };
          await Swal.fire({
            icon: "error",
            title: "ປິ້ນບໍ່ສຳເລັດ",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      }
      _index++;
    }
    setOnPrinting(false);
  };

  const onSelect = (data) => {
    const _data = isCheckedOrderItem.map((e) => {
      if (data?._id === e?._id) {
        return data;
      } else {
        return e;
      }
    });
    setIsCheckedOrderItem(_data);

    const _isChecked = _data.filter((e) => {
      if (e?.isChecked) {
        return true;
      }
      return false;
    });

    if (_isChecked.length === 0) {
      setCheckedBox(false);
    } else {
      setCheckedBox(true);
    }
  };

  const checkAllOrders = (item) => {
    let _newOrderItems = [];
    if (item?.target?.checked) {
      _newOrderItems = tableOrderItems.map((item) => {
        if (item?.status === "CANCELED") return item;
        return {
          ...item,
          isChecked: true,
        };
      });
    } else {
      _newOrderItems = isCheckedOrderItem.map((item) => {
        return {
          ...item,
          isChecked: false,
        };
      });
    }
    setCheckedBox(!checkedBox);
    setIsCheckedOrderItem(_newOrderItems);
  };

  const [isServedLoading, setIsServerdLoading] = useState(false);
  const handleUpdateOrderStatus = async (status) => {
    try {
      if (status === "SERVED") setIsServerdLoading(true);
      const storeId = storeDetail?._id;
      let menuId;
      let _updateItems = isCheckedOrderItem
        ?.filter((e) => e?.isChecked)
        .map((i) => {
          return {
            status: status,
            _id: i?._id,
            menuId: i?.menuId,
          };
        });
      let _resOrderUpdate = await updateOrderItem(
        _updateItems,
        storeId,
        menuId,
        seletedCancelOrderItem,
        selectedTable
      );
      if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
        reLoadData();
        setCheckedBox(!checkedBox);
        Swal.fire({
          icon: "success",
          title: `${t("update_order_status_success")}`,
          showConfirmButton: false,
          timer: 2000,
        });
        let _newOrderItems = isCheckedOrderItem.map((item) => {
          return {
            ...item,
            isChecked: false,
          };
        });
        setIsCheckedOrderItem(_newOrderItems);

        const count = await getCountOrderWaiting(storeId);
        setCountOrderWaiting(count || 0);
        setIsServerdLoading(false);
      } else {
        setIsServerdLoading(false);
      }
    } catch (error) {
      setIsServerdLoading(false);
      console.log(error);
    }
  };

  const handleUpdateOrderStatusgo = async (status) => {
    const storeId = storeDetail?._id;
    let menuId;
    let _updateItems = isCheckedOrderItem
      ?.filter((e) => e?.isChecked)
      .map((i) => {
        return {
          status: status,
          _id: i?._id,
          menuId: i?.menuId,
        };
      });
    let _resOrderUpdate = await updateOrderItem(
      _updateItems,
      storeId,
      menuId,
      seletedCancelOrderItem,
      selectedTable
    );
    if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
      reLoadData();
      setCheckedBox(!checkedBox);
      Swal.fire({
        icon: "success",
        title: `${t("update_order_status_success")}`,
        showConfirmButton: false,
        timer: 2000,
      });
      let _newOrderItems = isCheckedOrderItem.map((item) => {
        return {
          ...item,
          isChecked: false,
        };
      });
      setIsCheckedOrderItem(_newOrderItems);

      const count = await getCountOrderWaiting(storeId);
      setCountOrderWaiting(count || 0);
    }
  };

  const handleUpdateOrderStatuscancel = async (status) => {
    // getOrderItemsStore(CANCEL_STATUS);
    const storeId = storeDetail?._id;
    // let previousStatus = orderItems[0].status;
    let menuId;
    let _updateItems = isCheckedOrderItem
      ?.filter((e) => e?.isChecked)
      .map((i) => {
        return {
          status: status,
          _id: i?._id,
          menuId: i?.menuId,
          name: i?.name,
          // remark: seletedCancelOrderItem
        };
      });
    let _resOrderUpdate = await updateOrderItem(
      _updateItems,
      storeId,
      menuId,
      seletedCancelOrderItem,
      selectedTable
    );
    if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
      handleClose1();
      reLoadData();
      setCheckedBox(!checkedBox);
      // if (previousStatus === CANCEL_STATUS) getOrderItemsStore(CANCEL_STATUS);
      Swal.fire({
        icon: "success",
        title: `${t("update_order_status_success")}`,
        showConfirmButton: false,
        timer: 2000,
      });
      let _newOrderItems = isCheckedOrderItem.map((item) => {
        return {
          ...item,
          isChecked: false,
        };
      });
      setIsCheckedOrderItem(_newOrderItems);

      const count = await getCountOrderWaiting(storeId);
      setCountOrderWaiting(count || 0);
    }
  };

  const handleUpdateOrderStatusAndCallback = async (status, callback) => {
    try {
      // getOrderItemsStore(CANCEL_STATUS);
      const storeId = storeDetail?._id;
      // let previousStatus = orderItems[0].status;
      let menuId;
      let _updateItems = isCheckedOrderItem
        ?.filter((e) => e?.isChecked)
        .map((i) => {
          return {
            status: status,
            _id: i?._id,
            menuId: i?.menuId,
            name: i?.name,
            // remark: seletedCancelOrderItem
          };
        });

      const checkError = await callback();
      if (checkError?.error) {
        throw new Error(`${t("print_fial")}`);
      }
      let _resOrderUpdate = await updateOrderItem(
        _updateItems,
        storeId,
        menuId,
        seletedCancelOrderItem,
        selectedTable
      );
      if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
        handleClose1();

        reLoadData();
        setCheckedBox(!checkedBox);
        // if (previousStatus === CANCEL_STATUS) getOrderItemsStore(CANCEL_STATUS);
        Swal.fire({
          icon: "success",
          title: `${t("update_order_status_success")}`,
          showConfirmButton: false,
          timer: 2000,
        });
        let _newOrderItems = isCheckedOrderItem.map((item) => {
          return {
            ...item,
            isChecked: false,
          };
        });
        setIsCheckedOrderItem(_newOrderItems);

        const count = await getCountOrderWaiting(storeId);
        setCountOrderWaiting(count || 0);
      }
    } catch (err) {
      errorAdd(`${t("fail")}`);
    }
  };

  const handleMessage = (event) => {
    reLoadData();
  };

  useEffect(() => {
    if (!onPrinting) {
      if (!reload) {
        if (newOrderTransaction || newOrderUpdateStatusTransaction) {
          console.log("newOrderTransaction: ", newOrderTransaction);
          console.log(
            "newOrderUpdateStatusTransaction: ",
            newOrderUpdateStatusTransaction
          );
          handleMessage();
          setNewOrderTransaction(false);
          setNewOrderUpdateStatusTransaction(false);
        }
      }
    }
  }, [newOrderTransaction, onPrinting, newOrderUpdateStatusTransaction]);

  useEffect(() => {
    if (newTableTransaction) {
      if (zoneId) {
        getTableDataStore({ zone: zoneId });
      } else {
        getTableDataStore();
      }
      setNewTableTransaction(false);
    }
  }, [newTableTransaction]);

  useEffect(() => {
    _calculateTotal();
  }, [dataBill]);

  // function
  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataBill?.orderId || []) {
      // console.log({ _data });
      _total +=
        (_data?.price + (_data?.totalOptionPrice ?? 0)) * _data?.quantity;
    }
    if (dataBill?.discount > 0) {
      if (
        dataBill?.discountType == "LAK" ||
        dataBill?.discountType == "MONEY"
      ) {
        setTotalAfterDiscount(_total - dataBill?.discount);
      } else {
        const ddiscount = parseInt((_total * dataBill?.discount) / 100);
        setTotalAfterDiscount(_total - ddiscount);
      }
    } else {
      setTotalAfterDiscount(_total);
    }
    setTotal(_total);
  };

  const getQrTokenForSelfOrdering = async () => {
    const data = await tokenSelfOrderingPost(selectedTable?.billId);
    if (data?.token) {
      setQrToken(data?.token);
      setPopup({ qrToken: true });
    }
  };

  const getDataZone = async () => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const data = await axios({
        method: "get",
        url: END_POINT_SEVER_TABLE_MENU + `/v3/zones`,
        params: {
          storeId: storeDetail?._id,
          limit: 100,
        },
        headers: headers,
      });
      if (data?.status == 200) {
        setZoneData(data?.data?.data);
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#F9F9F9",
        height: "calc(100vh - 66px)",
        overflow: "hidden",
        width: "100%",

      }}
    >
      <p style={{
         fontSize: '25px', 
         fontWeight: '400',
         padding: " 0 10px",
         fontWeight:'700',
         paddingTop:"20px",
         paddingLeft:'20px'
          }}>Home</p>
      {/* popup */}
      <PopUpQRToken
        tableName={selectedTable?.tableName}
        open={popup?.qrToken}
        qr={qrToken}
        storeId={selectedTable?.storeId}
        onClose={() => setPopup()}
      />
      <div >
        <Box
          sx={{
            display: "flex",
            paddingBottom: 50,
            overflow: "hidden",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              flexGrow: 1,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              
            }}
          >
            <div
              style={{
                padding: "10px",
                color: "gray",
                display: 'grid',
                alignItems: 'center',
                gap: 8,
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                justifyContent: 'center',
                padding:'30px 30px 30px 15px'
              }} 
            >
              {[
                { label: t("total_table"), value: tableList?.length,icon: <MdOutlineTableRestaurant />  },
                { label: t("total_available_table"), value: _checkStatusCodeA(tableList) ,icon: <FaCheck /> },
                { label: t("total_unavailable_table"), value: _checkStatusCode(tableList),icon: <FaTimes  /> },
                { label: t("total_bill_check"), value: _checkStatusCodeB(tableList),icon: <PiSpinnerLight  style={{fontSize:'50px'}}/> },
              ].map((item, index) => {
                return (
                  <div style={{
                    display: "flex",
                    backgroundColor: 'white',
                    padding: '5px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '70px',
                    borderRadius:3,
                    boxShadow: '7px 7px 7px  rgba(0,0,0,0.1)',

                  }}>
                    <div style={{
                      backgroundColor: 'tomato',
                      height: '40px',
                      width: '40px',
                      marginRight: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '5px',
                      color: 'white'
                    }}>{item.icon}</div>
                    <div>
                      <div>{item.label}</div>
                      <div style={{ fontWeight: "700" }}>{item.value}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            {zoneData?.length > 0 ? (
              <div style={{ padding: "15px 20px", display: 'flex', alignItems: 'center', width: '100%', }}>
                <Form.Label >{t("show_by_zone")}</Form.Label>
                <Form.Control
                  as="select"
                  value={zoneId}
                  onChange={(e) => onSelectedZone(e?.target?.value)}
                  style={{ width: '150px', marginLeft: '5px' }}
                >
                  <option value="">{t("show_all_zone")}</option>
                  {zoneData?.map((item, index) => (
                    <option key={index} value={item?._id}>
                      {item?.name}
                    </option>
                  ))}
                </Form.Control>
              </div>
            ) : (
              ""
            )}

            <Container style={{ overflowY: "scroll", flexGrow: 1 , paddingBottom:'100px',}}>
              <div style={{ height: 10 }} />
              <Box
                sx={{
                  display: "grid",
                  gap: 8,
                  gridTemplateColumns: {
                    md: "1fr 1fr 1fr 1fr ",
                    sm: "1fr 1fr 1fr",
                    xs: "1fr 1fr",
                  },
                }}
              >
                {tableList &&
                  tableList?.map((table, index) => (
                    <div
                      style={{
                        borderRadius: 4,
                        overflow: "hidden",
                        cursor: "pointer",

                        boxShadow: '2px 2px 7px  rgba(0,0,0,0.1)',
                      }}
                      key={"table" + index}
                    >
                      <Box
                        sx={{
                          display: { md: "block", xs: "none" },
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 4,
                            background: 'white',
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            padding: 10,
                          }}
                          className={
                            table?.isOpened && !table?.isStaffConfirm
                              ? "blink_card"
                              : // : table.statusBill === "CALL_TO_CHECKOUT"
                              //   ? "blink_cardCallCheckOut"
                              ""
                          }
                          onClick={() => {
                            onSelectTable(table);
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              float: "right",
                              right: 10,
                              top: 10,
                            }}
                          ></div>
                          <div style={{
                            display: 'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            padding: '5px 0px',
                            height:'100%'
                          }}>
                            <div style={{
                              height: '40px',
                              width: '40px',
                              marginRight: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderRadius: '5px',
                              color: 'white',
                              background: table?.isStaffConfirm
                                ? "rgb(251,110,59)"
                                : "gray",
                              background: table?.isStaffConfirm
                                ? table?.editBill
                                  ? "#39DB5F"
                                  : table?.statusBill === "CALL_TO_CHECKOUT"
                                    ? "#FFE17B"
                                    : "linear-gradient(360deg, rgba(251,110,59,1) 0%, rgba(255,146,106,1) 48%, rgba(255,146,106,1) 100%)"
                                : "gray",
                            }}>{index + 1}
                            </div>
                            <span style={{
                              textAlign: 'start'
                            }} >
                              {/* <div>{table?.tableName}</div>
                              <div>{table?.code}</div> */}
                              <div style={{
                                 fontSize: 20 ,
                                 color: table?.isStaffConfirm
                                 ? "rgb(251,110,59)"
                                 : "gray",
                                 color: table?.isStaffConfirm
                                 ? table?.editBill
                                   ? "#39DB5F"
                                   : table?.statusBill === "CALL_TO_CHECKOUT"
                                     ? "#FFE17B"
                                     : "linear-gradient(360deg, rgba(251,110,59,1) 0%, rgba(255,146,106,1) 48%, rgba(255,146,106,1) 100%)"
                                 : "gray",
                                 }}>
                                {table?.isStaffConfirm
                                  ? `${t("unavailable")}`
                                  : `${t("avaliable")}`}
                              </div>
                              <div style={{color:'gray',fontSize:'15px'}}>Zone: Nomal</div>
                            </span>
                          </div>
                        </div>
                      </Box>
                      <Box
                        sx={{
                          display: { md: "none", xs: "block" },
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "none",
                            borderRadius: 8,
                            background: table?.isStaffConfirm
                              ? "rgb(251,110,59)"
                              : "white",
                            background: table?.isStaffConfirm
                              ? table?.editBill
                                ? "#bfff00"
                                : "linear-gradient(360deg, rgba(251,110,59,1) 0%, rgba(255,146,106,1) 48%, rgba(255,146,106,1) 100%)"
                              : "white",
                            border:
                              selectedTable?.tableName === table?.tableName
                                ? "3px solid #404258"
                                : "3px solid  white",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            textAlign: "center",
                            padding: 10,
                          }}
                          className={
                            table?.isOpened && !table?.isStaffConfirm
                              ? "blink_card"
                              : // : table.statusBill === "CALL_TO_CHECKOUT"
                              //   ? "blink_cardCallCheckOut"
                              ""
                          }
                          onClick={() => {
                            onSelectTable(table);
                            if (table?.isOpened) {
                              navigate(`/staff/tableDetail/${table?._id}`);
                            } else {
                              setPopup({ openTable: true });
                            }
                          }}
                        >
                          <div
                            style={{
                              position: "absolute",
                              float: "right",
                              right: 10,
                              top: 10,
                            }}
                          ></div>
                          <div>
                            <span
                              style={{
                                fontSize: 16,
                                color: table?.staffConfirm
                                  ? "white"
                                  : "#616161",
                                fontWeight: "bold",
                              }}
                            >
                              <div>{table?.tableName}</div>
                              <div>{table?.code}</div>
                              <div>
                                {table?.isStaffConfirm
                                  ? `${t("unavailable")}`
                                  : `${t("avaliable")}`}
                              </div>
                            </span>
                          </div>
                        </div>
                      </Box>
                    </div>
                  ))}
              </Box>
              <div style={{ height: 20 }} />
            </Container>
          </Box>
          {/* Detail Table */}
          {/* <Box
            sx={{
              display: { xs: "none", sm: "block" },
              minWidth: 420,
              width: 420,
              border:'1px solid green',
              maxWidth: 420,
              boxShadow: "-1px 0px 10px rgba(0,0,0,0.1)",
            }}
          >
            {selectedTable != null &&
              selectedTable?.isStaffConfirm &&
              selectedTable?.isOpened && (
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#FFF",
                    maxHeight: "90vh",
                    overflowY: "scroll",
                  }}
                >
                  {
                    <div>
                      <Button
                        variant="outlined"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          color: "#909090",
                        }}
                        onClick={getQrTokenForSelfOrdering}
                      >
                        <IoQrCode style={{ fontSize: "22px" }} />
                      </Button>
                      <div style={{ backgroundColor: "#fff", padding: 10 }}>
                        <div
                          style={{
                            fontSize: 24,
                            fontWeight: "bold",
                            textAlign: "center",
                            padding: 20,
                          }}
                        >
                          <SiAirtable /> {selectedTable?.tableName}
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                          }}
                        >
                          {t("table_code")}:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: COLOR_APP,
                            }}
                          >
                            {selectedTable?.code}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                          }}
                        >
                          {t("time_of_table_opening")}:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: COLOR_APP,
                            }}
                          >
                            {moment(selectedTable?.createdAt).format("HH:mm A")}
                          </span>
                        </div>
                        <div style={{ fontSize: 16 }}>
                          {t("responsible")}:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: COLOR_APP,
                            }}
                          >
                            {dataBill?.orderId?.[0]?.updatedBy?.firstname &&
                              dataBill?.orderId?.[0]?.updatedBy?.lastname
                              ? dataBill?.orderId[0]?.updatedBy?.firstname +
                              " " +
                              dataBill?.orderId[0]?.updatedBy?.lastname
                              : ""}
                          </span>
                        </div>

                        <div style={{ fontSize: 16 }}>
                          {t("discount")}:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: COLOR_APP,
                            }}
                          >
                            {moneyCurrency(dataBill?.discount)}{" "}
                            {dataBill?.discountType === "PERCENT"
                              ? "%"
                              : storeDetail?.firstCurrency}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: 16,
                          }}
                        >
                          {t("total")}:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: COLOR_APP,
                            }}
                          >
                            {moneyCurrency(total)} {storeDetail?.firstCurrency}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                          }}
                        >
                          {t("price_has_to_pay")}:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: COLOR_APP,
                            }}
                          >
                            {moneyCurrency(totalAfterDiscount)}{" "}
                            {storeDetail?.firstCurrency}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                            color: "red",
                            display: isCheckedOrderItem?.filter(
                              (e) =>
                                e?.status != "SERVED" &&
                                e?.status != "CANCELED" &&
                                e?.status != "FEEDBACK"
                            )?.length
                              ? "block"
                              : "none",
                          }}
                        >
                          {
                            isCheckedOrderItem?.filter(
                              (e) =>
                                e?.status != "SERVED" &&
                                e?.status != "CANCELED" &&
                                e?.status != "FEEDBACK"
                            )?.length
                          }{" "}
                          {t("item_not_served")} !
                        </div>
                      </div>
                      <div
                        style={{
                          borderBottom: "1px dashed #ccc",
                          marginBottom: 10,
                        }}
                      />
                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(4,1fr)",
                          paddingLeft: 10,
                          paddingRight: 10,
                        }}
                      >
                        <ButtonCustom
                          onClick={() => onPrintToKitchen()}
                          disabled={onPrinting}
                        >
                          {onPrinting && (
                            <Spinner animation="border" size="sm" />
                          )}
                          {t("print_bill_to_kitchen")}
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => _openModalSetting(selectedTable)}
                        >
                          {t("close_table")}
                        </ButtonCustom>
                        <ButtonCustom onClick={handleShow}>
                          {t("combine_table")}
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => {
                            // _onAddDiscount();
                            setWorkAfterPin("discount");
                            setPopup({ PopUpPin: true });
                          }}
                        >
                          {t("discount")}
                        </ButtonCustom>

                        <ButtonCustom
                          disabled={!canCheckOut || isWaitingCheckout}
                          onClick={() => _onCheckOut()}
                        >
                          {isWaitingCheckout && (
                            <Spinner animation="border" size="sm" />
                          )}{" "}
                          Checkout
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() =>
                            _goToAddOrder(
                              selectedTable?.tableId,
                              selectedTable?.code,
                              selectedTable?._id
                            )
                          }
                        >
                          + {t("add_order")}
                        </ButtonCustom>
                        <ButtonCustom disabled></ButtonCustom>
                        <ButtonCustom
                          onClick={() => setPopup({ PopUpTranferTable: true })}
                        >
                          {t("move_order")}
                        </ButtonCustom>
                      </div>
                      <div
                        style={{
                          borderBottom: "1px dashed #ccc",
                          margin: "10px 0",
                        }}
                      />
                      <div
                        style={{
                          display: "flex",
                          padding: "0 10px",
                          marginBottom: 10,
                        }}
                        hidden={!checkedBox}
                      >
                        <ButtonCustom
                          onClick={() => {
                            setWorkAfterPin("cancle_order_and_print");
                            setPopup({ PopUpPin: true });
                          }}
                          disabled={!checkedBox || onPrinting}
                        >
                          {onPrinting && (
                            <Spinner animation="border" size="sm" />
                          )}
                          {t("cancel_and_send_to_kitchen")}
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => {
                            setWorkAfterPin("cancle_order");
                            setPopup({ PopUpPin: true });
                          }}
                          disabled={!checkedBox}
                        >
                          {t("cancel")}
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => {
                            handleUpdateOrderStatusAndCallback(
                              "DOING",
                              async () => {
                                // const data = await onPrintForCher();
                                const data = await onPrintToKitchen();
                                return data;
                              }
                            ).then();
                          }}
                          disabled={!checkedBox || onPrinting}
                        >
                          {onPrinting && (
                            <Spinner animation="border" size="sm" />
                          )}
                          {t("update_and_send_to_kitchen")}
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => handleUpdateOrderStatusgo("DOING")}
                          disabled={!checkedBox}
                        >
                          {t("send_to_kitchen")}
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => handleUpdateOrderStatus("SERVED")}
                          disabled={!checkedBox}
                        >
                          {isServedLoading && (
                            <Spinner animation="border" size="sm" />
                          )}{" "}
                          {t("served_by")}
                        </ButtonCustom>
                      </div>

                      <TableCustom>
                        <thead>
                          <tr>
                            <th>
                              <Checkbox
                                name="checked"
                                checked={checkedBox}
                                onChange={(e) => {
                                  checkAllOrders(e);
                                  setCheckedBox(!checkedBox);
                                }}
                              />
                            </th>
                            <th>{t("no")}</th>
                            <th>{t("menuname")}</th>
                            <th>{t("quantity")}</th>
                            <th>{t("status")}</th>
                            <th>{t("customer")}</th>
                            <th>{t("time")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isCheckedOrderItem
                            ? isCheckedOrderItem?.map((orderItem, index) => {
                              const options =
                                orderItem?.options
                                  ?.map((option) =>
                                    option.quantity > 1
                                      ? `[${option.quantity} x ${option.name}]`
                                      : `[${option.name}]`
                                  )
                                  .join(" ") || "";
                              return (
                                <tr
                                  key={"order" + index}
                                  style={{ borderBottom: "1px solid #eee" }}
                                >
                                  <td onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                      disabled={
                                        orderItem?.status === "CANCELED"
                                      }
                                      name="checked"
                                      checked={orderItem?.isChecked || false}
                                      onChange={(e) => {
                                        onSelect({
                                          ...orderItem,
                                          isChecked: e.target.checked,
                                        });
                                      }}
                                    />
                                  </td>
                                  <td>{index + 1}</td>
                                  <td>
                                    {orderItem?.name} {options}
                                  </td>
                                  <td>{orderItem?.quantity}</td>
                                  <td
                                    style={{
                                      color:
                                        orderItem?.status === `SERVED`
                                          ? "green"
                                          : orderItem?.status === "DOING"
                                            ? ""
                                            : "red",
                                    }}
                                  >
                                    {orderItem?.status
                                      ? t(
                                        orderStatusTranslate(
                                          orderItem?.status
                                        )
                                      )
                                      : "-"}
                                  </td>
                                  <td>{orderItem?.createdBy?.firstname}</td>
                                  <td>
                                    {orderItem?.createdAt
                                      ? moment(orderItem?.createdAt).format(
                                        "HH:mm A"
                                      )
                                      : "-"}
                                  </td>
                                </tr>
                              );
                            })
                            : ""}
                        </tbody>
                      </TableCustom>
                      {tableOrderItems?.length === 0 && (
                        <div className="text-center">
                          <div style={{ marginTop: 50, fontSize: 50 }}>
                            {" "}
                            {t("table_has_no_order")}
                          </div>
                        </div>
                      )}

                      <div style={{ marginBottom: 100 }} />
                    </div>
                  }
                </div>
              )}
            {selectedTable != null && !selectedTable?.isStaffConfirm && (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  height: "100%",
                  borderColor: "black",
                  overflowY: "scroll",
                  borderWidth: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: 20,
                  }}
                >
                  <SiAirtable /> {selectedTable?.tableName}
                </div>
                <QRCode
                  value={
                    END_POINT_WEB_CLIENT +
                    selectedTable?.storeId +
                    "?tableId=" +
                    selectedTable?.tableId
                  }
                  size={150}
                />
                <p
                  style={{
                    fontSize: 18,
                    color: "#616161",
                    textAlign: "center",
                  }}
                >
                  {t("bring_this_or_code_to_customers_or_press_open_to_start_using")}
                </p>
                <p
                  style={{
                    fontSize: 18,
                    color: "#616161",
                    textAlign: "center",
                  }}
                >
                  ( Smart-Menu && Self-Ordering)
                </p>
                <div style={{ height: 30 }} />
                <Button
                  variant="light"
                  className="hover-me"
                  style={{
                    backgroundColor: "#FB6E3B",
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 20,
                    padding: 20,
                  }}
                  onClick={() => openTable()}
                >
                  {!selectedTable?.isOpened ? `${t("open")}` : "ຢືນຢັນເປີດໂຕະ"}
                </Button>
                <br />
                <Button
                  variant="light"
                  className="hover-me"
                  style={{
                    backgroundColor: "#FB6E3B",
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 20,
                    padding: 20,
                    display: !selectedTable?.isOpened ? "block" : "none",
                  }}
                  onClick={() => {
                    openTableAndReturnCodeShortLink().then((e) => {
                      setCodeShortLink(e);
                    });
                  }}
                >
                  {t("open_table_with_qr")}
                </Button>
              </div>
            )}

            {selectedTable === null && (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  maxHeight: "90vh",
                  borderColor: "black",
                  overflowY: "scroll",
                  borderWidth: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p style={{ margin: 0, fontSize: 30 }}>
                  {t("chose_table_for_order")}
                </p>
              </div>
            )}
          </Box> */}
        </Box>
      </div>
      <div style={{ width: "80mm", padding: 10 }} ref={bill80Ref}>
        <BillForCheckOut80
          storeDetail={storeDetail}
          selectedTable={selectedTable}
          dataBill={dataBill}
          taxPercent={taxPercent}
          profile={profile}
        />
      </div>
      <div style={{ width: "80mm", padding: 10 }} ref={qrSmartOrder80Ref}>
        <BillQRShortSmartOrdering80
          tableName={selectedTable?.tableName}
          CodeShortLink={codeShortLink}
        />
      </div>
      <div style={{ width: "58mm", padding: 10 }} ref={bill58Ref}>
        <BillForCheckOut58
          storeDetail={storeDetail}
          selectedTable={selectedTable}
          dataBill={dataBill}
          taxPercent={taxPercent}
          serviceCharge={serviceChargePercent}
        />
      </div>
      {isCheckedOrderItem
        ?.filter((e) => e?.isChecked)
        .map((val, i) => {
          return (
            <div
              style={{ width: "80mm", padding: 10 }}
              ref={(el) => (billForCher80.current[i] = el)}
            >
              <BillForChef80
                storeDetail={storeDetail}
                selectedTable={selectedTable}
                dataBill={dataBill}
                val={val}
              />
            </div>
          );
        })}
      {isCheckedOrderItem
        ?.filter((e) => e?.isChecked)
        .map((val, i) => {
          return (
            <div
              style={{ width: "80mm", padding: 10 }}
              ref={(el) => (billForCherCancel80.current[i] = el)}
            >
              <BillForChefCancel80
                storeDetail={storeDetail}
                selectedTable={selectedTable}
                dataBill={dataBill}
                val={val}
              />
            </div>
          );
        })}
      <div>
        {isCheckedOrderItem
          ?.filter((e) => e?.isChecked)
          .map((val, i) => {
            return (
              <div
                style={{ width: "58mm", padding: 10 }}
                ref={(el) => (billForCher58.current[i] = el)}
              >
                <BillForChef58
                  storeDetail={storeDetail}
                  selectedTable={selectedTable}
                  dataBill={dataBill}
                  val={val}
                />
              </div>
            );
          })}
      </div>

      {/* Render the combined bill for 80mm */}
      <div>
        {Object.entries(groupedItems).map(([printerIp, items]) => (
          <div key={printerIp}>
            <div
              style={{
                width: "80mm",
                paddingRight: "20px",
              }}
              ref={combinedBillRefs[printerIp]}
            >
              <CombinedBillForChefNoCut
                storeDetail={storeDetail}
                selectedTable={selectedTable}
                selectedMenu={items}
                table={{ tableId: { name: selectedTable?.tableName } }}
              />
            </div>
          </div>
        ))}
      </div>

      <CheckPopupDebt
        onPrintBill={onPrintBill}
        onPrintDrawer={onPrintDrawer}
        dataBill={dataBill}
        tableData={selectedTable}
        open={popup?.CheckPopUpDebt}
        onClose={() => setPopup()}
        setDataBill={setDataBill}
        taxPercent={taxPercent}
      // editMode={select}
      />
      <CheckOutPopup
        onPrintBill={onPrintBill}
        onPrintDrawer={onPrintDrawer}
        dataBill={dataBill}
        tableData={selectedTable}
        open={popup?.CheckOutType}
        onClose={() => {
          setPopup();
          setDataBill((prev) => ({
            ...prev,
            Name: "",
            Point: "",
          }));
        }}
        setDataBill={setDataBill}
        taxPercent={taxPercent}
        billDataLoading={billDataLoading}
      />

      <OrderCheckOut
        staffData={userData}
        data={dataBill}
        setDataBill={setDataBill}
        onPrintBill={onPrintBill}
        tableData={selectedTable}
        show={menuItemDetailModal}
        resetTableOrder={resetTableOrder}
        hide={() => setMenuItemDetailModal(false)}
        serviceCharge={serviceChargePercent}
        taxPercent={taxPercent}
        onSubmit={() => {
          setMenuItemDetailModal(false);
          setPopup({ CheckOutType: true });
        }}
        printBillLoading={printBillLoading}
        billDataLoading={billDataLoading}
      />

      <PopUpPin
        open={popup?.PopUpPin}
        onClose={() => setPopup()}
        setPinStatus={(e) => {
          setPinStatus(e);
        }}
      />

      <UpdateDiscountOrder
        data={tableOrderItems}
        tableData={selectedTable}
        show={modalAddDiscount}
        resetTableOrder={resetTableOrder}
        hide={() => setModalAddDiscount(false)}
      />

      <FeedbackOrder
        data={orderItemForPrintBill}
        tableData={selectedTable}
        show={feedbackOrderModal}
        hide={() => setFeedbackOrderModal(false)}
      />

      <UserCheckoutModal
        show={checkoutModel}
        hide={() => setCheckoutModal(false)}
        tableId={selectedTable?.code}
        func={_handlecheckout}
      />
      <PopupOpenTable
        open={popup?.openTable}
        code={selectedTable}
        onClose={() => {
          setPopup();
        }}
        onSubmit={async () => {
          openTable().then(() => {
            navigate(`/staff/tableDetail/${selectedTable?._id}`);
            setPopup();
          });
          // getData();
        }}
      />

      <PopUpAddDiscount
        open={popup?.discount}
        value={isCheckedOrderItem}
        dataBill={dataBill}
        onClose={() => {
          setPopup();
        }}
        onSubmit={async () => {
          // handleMessage();
          getData(selectedTable?.code, false);
        }}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{t("combine_table")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Label>
              {t("move_from")} : {selectedTable?.tableName}
            </Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>{t("to_table")} : </Form.Label>
              <div style={{ height: 10 }}></div>
              <select
                className="form-select form-control"
                aria-label="Default select example"
                value={selectNewTable?._id}
                onChange={(e) => {
                  const _select = tableList?.find(
                    (item) => e.target.value === item?._id
                  );
                  setSelectNewTable(_select);
                }}
              >
                <option selected disabled>
                  {t("chose_table")}
                </option>
                {tableList?.map((item, index) => (
                  <option
                    key={"talbe-" + index}
                    value={item?._id}
                    disabled={
                      selectedTable?.tableName === item?.tableName
                        ? true
                        : false
                    }
                  >
                    {t("table")} {item?.tableName}
                  </option>
                ))}
              </select>
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleClose()}>
            {t("cancel")}
          </Button>
          <Button variant="success" onClick={() => _changeTable()}>
            {t("combine_table")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>{t("cause_cancel_order")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <select
              size="8"
              style={{ overflow: "auto", border: "none", fontSize: "20px" }}
              className="form-control"
              onChange={handleSelectedCancelOrder}
            >
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                {t("wrong_serving")}
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                {t("customer_cancel")}
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                {t("wrong_cooking")}
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                {t("server_wrong_ordering")}
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                {t("wait_long")}
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                {t("food_gone")}
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                {t("drink_gone")}
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                {t("table_no_food")}
              </option>
            </select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleClose1()}>
            {t("cancel")}
          </Button>
          <Button
            variant="success"
            // onClick={() => handleUpdateOrderStatuscancel("CANCELED")}
            onClick={() => {
              if (workAfterPin == "cancle_order_and_print") {
                handleUpdateOrderStatusAndCallback("CANCELED", async () => {
                  const data = await onPrintForCherCancel();
                  return data;
                }).then((resp) => {
                  setWorkAfterPin("");
                  handleUpdateOrderStatuscancel("CANCELED");
                });
              } else {
                handleUpdateOrderStatuscancel("CANCELED");
              }
            }}
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={quantity} onHide={handleCloseQuantity}>
        <Modal.Header closeButton>
          <Modal.Title>{t("edit_amount")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <TableCustom>
              <thead>
                <tr>
                  <th>{t("table")}</th>
                  <th>{t("menuname")}</th>
                  <th>{t("quantity")}</th>
                  <th>{t("status")}</th>
                  <th>{t("customer")}</th>
                  <th>{t("time")}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{seletedOrderItem?.tableId?.name}</td>
                  <td>
                    {seletedOrderItem?.name}{" "}
                    {seletedOrderItem?.options
                      ?.map((option) => `[${option.quantity} x ${option.name}]`)
                      .join(" ")}
                  </td>
                  <td
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <button
                      style={{ color: "blue", border: "none", width: 25 }}
                      onClick={() => handleSetQuantity(-1, seletedOrderItem)}
                    >
                      -
                    </button>
                    {seletedOrderItem?.quantity}
                    <button
                      style={{ color: "red", border: "none", width: 25 }}
                      onClick={() => handleSetQuantity(1, seletedOrderItem)}
                    >
                      +
                    </button>
                  </td>
                  <td
                    style={{
                      color:
                        seletedOrderItem?.status === `SERVED`
                          ? "green"
                          : seletedOrderItem?.status === "DOING"
                            ? ""
                            : "red",
                    }}
                  >
                    {seletedOrderItem?.status
                      ? orderStatus(seletedOrderItem?.status)
                      : "-"}
                  </td>
                  <td>{seletedOrderItem?.createdBy?.firstname}</td>
                  <td>
                    {seletedOrderItem?.createdAt
                      ? moment(seletedOrderItem?.createdAt).format("HH:mm A")
                      : "-"}
                  </td>
                </tr>
              </tbody>
            </TableCustom>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleCloseQuantity()}>
            {t("cancel")}
          </Button>
          <Button
            disabled
            variant="success"
          // onClick={() => {
          //   _orderTableQunatity();
          // }}
          >
            {t("save")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openModalSetting} onHide={() => setOpenModalSetting(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("setting_table")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            {t("would_you_like_to_close")} {dataSettingModal?.tableName} ?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setOpenModalSetting(false)}>
            {t("cancel")}
          </Button>
          <Button variant="success" onClick={() => _resetTable()}>
            {t("close_table")}
          </Button>
        </Modal.Footer>
      </Modal>

      <PopUpTranferTable
        open={popup?.PopUpTranferTable}
        onClose={() => setPopup({ PopUpTranferTable: false })}
        onSubmit={reLoadData}
        tableList={tableList}
      />
    </div>
  );
}

const ButtonCustom = ({ children, ...etc }) => {
  return (
    <Button
      variant="light"
      className="hover-me"
      style={{
        backgroundColor: "#FB6E3B",
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 10,
      }}
      {...etc}
    >
      {children}
    </Button>
  );
};

const TableCustom = styled("table")({
  width: "100%",
  fontSize: 12,
  "th,td": {
    padding: 0,
  },
  "th:first-child": {
    maxWidth: 40,
    width: 40,
  },
  "td:first-child": {
    maxWidth: 40,
    width: 40,
  },
  thead: {
    backgroundColor: "#e9e9e9",
  },
});
