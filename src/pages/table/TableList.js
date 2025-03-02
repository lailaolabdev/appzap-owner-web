import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Modal, Form, Container, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import moment, { lang } from "moment";
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
import flutterDrawer from "../../helpers/flutterDrawer";

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
  END_POINT_SEVER,
  END_POINT_SEVER_TABLE_MENU,
  END_POINT_WEB_CLIENT,
  USERS,
  getLocalData,
} from "../../constants/api";
import { successAdd, errorAdd, warningAlert } from "../../helpers/sweetalert";
import { getHeaders, tokenSelfOrderingPost } from "../../services/auth";
import { useNavigate, useParams } from "react-router-dom";
import { getBills } from "../../services/bill";
import {
  getCountOrderWaiting,
  updateOrderItem,
  updateOrderItemV7,
} from "../../services/order";
import styled from "styled-components";
import {
  callCheckOutPrintBillOnly,
  callPayBeforePrintBillOnly,
  callToUpdatePrintBillBefore,
  getCodes,
} from "../../services/code";
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
import {
  Check,
  Edit2Icon,
  HandPlatter,
  Loader,
  ReceiptText,
  X,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { fontMap } from "../../utils/font-map";

import { useStoreStore } from "../../zustand/storeStore";
import theme from "../../theme";

export default function TableList() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const params = useParams();
  const number = params?.number;
  const activeTableId = params?.tableId;
  const {
    t,
    i18n: { language },
  } = useTranslation();

  // state
  const [show, setShow] = useState(false);
  const [popup, setPopup] = useState({
    CheckOutType: false,
  });
  const [mobileMode, setMobileMode] = useState(false);
  const [show1, setShow1] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleClose1 = () => setShow1(false);

  const [disableCheckoutButton, setDisableCheckoutButton] = useState(false);

  const handleShow1 = (e) => {
    setShow1(true);
  };

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
  const [checkStatusItem, setCheckStatusItem] = useState(false);
  const [showBtnCombine, setShowBtnCombine] = useState(false);
  const [selectTable, setSelectTable] = useState(false);

  const handleCloseQuantity = () => setQuantity(false);

  const { printerCounter, printers } = useStore();
  const [totalMustPay, setTotalMustPay] = useState(0); // สร้างตัวแปรเก็บค่ายอดรวมพร้อมภาษี
  const [createdAt, setCreatedAt] = useState();

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
    getTableOrders,
    newTableTransaction,
    setNewTableTransaction,
    newOrderTransaction,
    setNewOrderTransaction,
    newOrderUpdateStatusTransaction,
    setNewOrderUpdateStatusTransaction,
    // getTableDataStoreList,
    // setPrintNowList,
    // openTableAndReturnTokenOfBill,
    openTableAndReturnCodeShortLink,
    setCountOrderWaiting,
    profile,
    setbillSplitNewId,
    setbillSplitOldId,
    // billSplitNewId,
    // billSplitOldId,
    userCallCheckout,
    setUserCallCheckout,
    isWaitingCheckout,
    setOrderPayBefore,
    orderPayBefore,
    setPrintBackground,
    isWaitingPress,
    dataQR,
  } = useStore();

  const { storeDetail, setStoreDetail, updateStoreDetail } = useStoreStore();

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
  const [selectNewTable, setSelectNewTable] = useState([]);
  const [combinedBillRefs, setCombinedBillRefs] = useState({});
  const [groupedItems, setGroupedItems] = useState({});
  const [printBillLoading, setPrintBillLoading] = useState(false);
  const [serviceChangeAmount, setServiceChangeAmount] = useState(0);
  const [printBillCalulate, setPrintBillCalulate] = useState(false);

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
    if (workAfterPin === "discount") {
      setWorkAfterPin("");
      setPopup({ discount: true });
    }
    if (workAfterPin === "cancle_order") {
      setWorkAfterPin("");
      setPopup();
      setShow1(true);
    }
    if (workAfterPin === "cancle_order_and_print") {
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

    const getDataTax = async () => {
      const { DATA } = await getLocalData();
      const _res = await axios.get(
        `${END_POINT_SEVER}/v4/tax/${DATA?.storeId}`
      );
      setTaxPercent(_res?.data?.taxPercent);
    };
    getDataTax();

    // const getDataServiceCharge = async () => {
    //   const { DATA } = await getLocalData();
    //   const _res = await axios.get(
    //     `${END_POINT_SEVER}/v4/service-charge?storeId=${DATA?.storeId}`
    //   );
    //   setServiceChargePercent(_res?.data?.serviceCharge);
    // };
    // getDataServiceCharge();
    getUserData();
    getDataZone();
    getDataTax();
    getDataServiceCharge();
    setZoneId("");

    setStoreDetail({
      serviceChargePer: 0,
      zoneCheckBill: false,
    });
  }, []);

  useEffect(() => {
    reLoadData();
    ableToCheckoutFunc(isCheckedOrderItem);
  }, []);

  useEffect(() => {
    ableToCheckoutFunc(isCheckedOrderItem);
  }, [isCheckedOrderItem]);

  const getUserData = async () => {
    // setIsLoading(true);
    await fetch(`${USERS}/skip/0/limit/0/?storeId=${storeDetail?._id}`, {
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
    const _data = seletedOrderItem?.quantity + int;
    if (_data > 0) {
      setSeletedOrderItem({ ...seletedOrderItem, quantity: _data });
    }
  }

  const ableToCheckoutFunc = (isCheckedOrderItem) => {
    // Check if any checked order has a status of "DOING" or "WAITING"
    if (isCheckedOrderItem.length === 0) return setDisableCheckoutButton(true);

    // If any item has status "DOING" or "WAITING", return false
    const anyOrderInvalid = isCheckedOrderItem.some(
      (item) => item.status === "DOING" || item.status === "WAITING"
    );

    // If there is any invalid order (status "DOING" or "WAITING"), set the flag to false, otherwise true
    setDisableCheckoutButton(anyOrderInvalid);
  };

  useEffect(() => {
    // setIsCheckedOrderItem([...tableOrderItems]);
    if (tableOrderItems?.length > 0)
      updateCheckedOrderItems(isCheckedOrderItem, tableOrderItems);
    else setIsCheckedOrderItem([]);
  }, [selectedTable, tableOrderItems]);

  const updateCheckedOrderItems = (isCheckedOrderItem, tableOrderItems) => {
    if (
      isCheckedOrderItem.length <= 0 ||
      tableOrderItems[0]["code"] !== isCheckedOrderItem[0]["code"]
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
    // setOrderPayBefore([]);
    getData(selectedTable?.code, true);
    setMenuItemDetailModal(true);
    calculateTotalBill();
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
    if (zoneId) {
      getTableDataStore({ zone: zoneId });
    } else {
      getTableDataStore();
      // onSelectTable(selectNewTable)
    }
  }, [zoneId]);

  useEffect(() => {
    if (state?.zoneId) {
      getTableDataStore({ zone: state?.zoneId });
    } else {
      getTableDataStore();
    }
  }, [state?.zoneId]);

  useEffect(() => {
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

      const _resBill = await axios({
        method: "get",
        url: END_POINT_SEVER_TABLE_MENU + `/v7/bill-group/` + code,
        headers: headers,
      });

      setDataBill(_resBill?.data);

      setBillDataLoading(false);
    } catch (err) {
      setBillDataLoading(false);
      console.log("err: ", err);
    }
  };

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
      setbillSplitNewId(selectNewTable?.billId);

      const _billsOld = await getBills(`?_id=${selectedTable?.billId}`);
      const _billIdOld = _billsOld?.[0]?.["_id"];
      setbillSplitOldId(selectedTable?.billId);

      const _codesNew = await getCodes(`?_id=${selectNewTable?._id}`);
      const _codeIdNew = _codesNew?.[0]?.["_id"];

      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      const changTable = await axios({
        method: "put",
        url: END_POINT_SEVER + `/v3/bill-transfer`,
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
        getTableDataStore();
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
        setSelectedTable(selectNewTable);
        onSelectTable(selectNewTable);
        setShowBtnCombine(true);
        // getTableDataStore();
        // navigate(`/bill/split/${_billIdOld}/${_billIdNew}`);
        // navigate(`/bill/split/${selectedTable?._id}/${selectNewTable?._id}`);
        // navigate(`/bill/split/${selectNewTable?._id}`);
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

  const _checkStatusCodeC = (code) => {
    let _editBill = 0;
    for (let i = 0; i < code?.length; i++) {
      if (
        code[i]?.isOpened &&
        code[i]?.status &&
        code[i]?.isStaffConfirm &&
        code[i]?.editBill
      )
        _editBill += 1;
    }
    return _editBill;
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

  const saveServiceChargeDetails = async () => {
    if (storeDetail?.serviceChargePer > 0) {
      try {
        if (!profile.data || !selectedTable) {
          console.error("Missing profile data or selected table");
          return;
        }

        const userId = profile.data._id || "";
        const billId = selectedTable.billId;
        const firstName = profile.data.firstname;
        const lastName = profile.data.lastname;

        const response = await axios.post(
          `${END_POINT_SEVER}/saveservice`,
          {
            userId,
            billId,
            taxPercent,
            total,
            serviceChargePercent,
            serviceChangeAmount,
            totalMustPay,
            firstName,
            lastName,
            createdAt,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      } catch (error) {
        console.error(
          "Error saving service charge:",
          error.response?.data || error.message
        );
      }
    }
  };

  const onPrintBill = async (isPrintBill) => {
    try {
      setPrintBillLoading(true);
      let _dataBill = {
        ...dataBill,
        typePrint: "PRINT_BILL_CHECKOUT",
      };
      saveServiceChargeDetails();
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
          drawer: true,
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

      callCheckOutPrintBillOnly(selectedTable?._id);
      setSelectedTable();
      setStoreDetail({ ChangeColorTable: true });

      setPrintBillLoading(false);
      await Swal.fire({
        icon: "success",
        title: `${t("checkbill_success")}`,
        showConfirmButton: false,
        timer: 1800,
      });
      setMenuItemDetailModal(false);
      setStoreDetail({
        serviceChargePer: 0,
        isServiceCharge: false,
      });
      // update bill status to call check out
      // callCheckOutPrintBillOnly(selectedTable?._id);
      // callPayBeforePrintBillOnly(selectedTable?._id);
      // orderPayBefore.length > 0
      //   ? updateTablePayBefore()
      //   : callCheckOutPrintBillOnly(selectedTable?._id);
      // setSelectedTable();
      // setOrderPayBefore([]);
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

  // const updateTablePayBefore = async () => {
  //   const orderItem =
  //     orderPayBefore.length > 0 ? orderPayBefore?.map((e) => e?._id) : [];
  //   const checkStatus = orderPayBefore.length > 0 ? "false" : "";
  //   const checkStatusBill = orderPayBefore.length > 0 ? "PRINTBILL" : "";
  //   const body = {
  //     orderPayBefore: orderItem,
  //     isCheckout: checkStatus,
  //     status: checkStatusBill,
  //   };
  //   callToUpdatePrintBillBefore(selectedTable?.billId, body);
  // };

  useEffect(() => {
    getTableDataStore();
  }, [storeDetail?.ChangeColorTable]);

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
          drawer: false,
          paper: printerBillData?.width === "58mm" ? 400 : 500,
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

      await Swal.fire({
        icon: "success",
        title: `${t("print_success")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      setCodeShortLink(null);
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

      await flutterDrawer(
        {
          drawer: true,
          // paper: printerBillData?.width === "58mm" ? 400 : 500,
          // imageBuffer: dataImageForPrint.toDataURL(),
          ip: printerBillData?.ip,
          // type: printerBillData?.type,
          port: "9100",
          // width: printerBillData?.width === "58mm" ? 400 : 580,
        },
        async () => {
          await axios.post(urlForPrinter, {
            ip: printerBillData?.ip,
            port: 9100,
          });
        }
      );

      // await axios.post(urlForPrinter, {
      //   ip: printerBillData?.ip,
      //   port: 9100,
      // });
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
      printItems(groupedItems, combinedBillRefs, printers, selectedTable).then(
        () => {
          Swal.fire({
            icon: "success",
            title: `${t("print_success")}`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      );
    } else {
      // Print with cut
      onPrintForCher();
    }
    setOrderPayBefore([]);
  };

  // const onPrintForCher = async () => {
  //   setOnPrinting(true);

  //   let _dataBill = {
  //     ...dataBill,
  //     typePrint: "PRINT_BILL_FORCHER",
  //   };
  //   await _createHistoriesPrinter(_dataBill);

  //   const orderSelect = isCheckedOrderItem?.filter((e) => e?.isChecked);
  //   let _index = 0;
  //   const printDate = [...billForCher80.current];
  //   let dataUrls = [];
  //   for (const _ref of printDate) {
  //     const dataUrl = await html2canvas(_ref, {
  //       useCORS: true,
  //       scrollX: 10,
  //       scrollY: 0,
  //       scale: 530 / widthBill80,
  //     });
  //     dataUrls.push(dataUrl);
  //   }
  //   for (const _ref of printDate) {
  //     const _printer = printers.find((e) => {
  //       return e?._id === orderSelect?.[_index]?.printer;
  //     });

  //     try {
  //       let urlForPrinter = "";
  //       let dataUrl = dataUrls[_index];

  //       if (_printer?.type === "ETHERNET") {
  //         urlForPrinter = ETHERNET_PRINTER_PORT;
  //       }
  //       if (_printer?.type === "BLUETOOTH") {
  //         urlForPrinter = BLUETOOTH_PRINTER_PORT;
  //       }
  //       if (_printer?.type === "USB") {
  //         urlForPrinter = USB_PRINTER_PORT;
  //       }
  //       // const _image64 = await resizeImage(dataUrl.toDataURL(), 300, 500);

  //       const _file = await base64ToBlob(dataUrl.toDataURL());
  //       var bodyFormData = new FormData();
  //       bodyFormData.append("ip", _printer?.ip);
  //       bodyFormData.append("isdrawer", false);
  //       bodyFormData.append("port", "9100");
  //       bodyFormData.append("image", _file);
  //       bodyFormData.append("paper", _printer?.width === "58mm" ? 58 : 80);
  //       if (_index === 0) {
  //         bodyFormData.append("beep1", 1);
  //         bodyFormData.append("beep2", 9);
  //       }
  //       await printFlutter(
  //         {
  //           drawer: false,
  //           paper: _printer?.width === "58mm" ? 400 : 500,
  //           imageBuffer: dataUrl.toDataURL(),
  //           ip: _printer?.ip,
  //           type: _printer?.type,
  //           port: "9100",
  //           width: _printer?.width === "58mm" ? 400 : 580,
  //         },
  //         async () => {
  //           await axios({
  //             method: "post",
  //             url: urlForPrinter,
  //             data: bodyFormData,
  //             headers: { "Content-Type": "multipart/form-data" },
  //           });
  //         }
  //       );

  //       if (_index === 0) {
  //         await Swal.fire({
  //           icon: "success",
  //           title: `${t("print_success")}`,
  //           showConfirmButton: false,
  //           timer: 1500,
  //         });
  //       }
  //     } catch (err) {
  //       console.log(err);
  //       if (_index === 0) {
  //         await Swal.fire({
  //           icon: "error",
  //           title: `${t("print_fial")}`,
  //           showConfirmButton: false,
  //           timer: 1500,
  //         });
  //       }
  //     }
  //     _index++;
  //   }
  //   setOnPrinting(false);
  // };

  const onPrintForCher = async () => {
    try {
      setOnPrinting(true);
      // setCountError("");

      const orderSelect = isCheckedOrderItem?.filter((e) => e?.isChecked);

      const base64ArrayAndPrinter = convertHtmlToBase64(orderSelect);

      let arrayPrint = [];
      for (var index = 0; index < base64ArrayAndPrinter.length; index++) {
        arrayPrint.push(
          runPrint(
            base64ArrayAndPrinter[index].dataUrl,
            index,
            base64ArrayAndPrinter[index].printer
          )
        );
      }
      // if (countError == "ERR") {
      //   setIsLoading(false);
      //   Swal.fire({
      //     icon: "error",
      //     title: "ປິ້ນບໍ່ສຳເລັດ",
      //     showConfirmButton: false,
      //     timer: 1500,
      //   });
      // } else {
      //   await Swal.fire({
      //     icon: "success",
      //     title: "ປິ້ນສຳເລັດ",
      //     showConfirmButton: false,
      //     timer: 1500,
      //   });
      // }
      setOnPrinting(false);
      setPrintBackground((prev) => [...prev, ...arrayPrint]);
    } catch (error) {
      // setIsLoading(false);
      setOnPrinting(false);
    }
  };

  const runPrint = async (dataUrl, index, printer) => {
    try {
      const printFile = base64ToBlob(dataUrl);
      var bodyFormData = new FormData();

      bodyFormData.append("ip", printer?.ip);
      if (index === 0) {
        bodyFormData.append("beep1", 1);
        bodyFormData.append("beep2", 9);
      }
      bodyFormData.append("isdrawer", false);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", printFile);
      bodyFormData.append("paper", printer?.width === "58mm" ? 58 : 80);

      let urlForPrinter = "";
      if (printer?.type === "ETHERNET") urlForPrinter = ETHERNET_PRINTER_PORT;
      if (printer?.type === "BLUETOOTH") urlForPrinter = BLUETOOTH_PRINTER_PORT;
      if (printer?.type === "USB") urlForPrinter = USB_PRINTER_PORT;

      await printFlutter(
        {
          imageBuffer: dataUrl,
          ip: printer?.ip,
          type: printer?.type,
          port: "9100",
          width: printer?.width === "58mm" ? 400 : 580,
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

      if (index === 0) {
        await Swal.fire({
          icon: "success",
          title: `${t("print_success")}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }

      return true;
    } catch (err) {
      console.log(err);
      if (index === 0) {
        await Swal.fire({
          icon: "error",
          title: `${t("print_fial")}`,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    }
  };

  // const convertHtmlToBase64 = (orderSelect) => {
  //   const base64ArrayAndPrinter = [];
  //   orderSelect.forEach((data, index) => {
  //     if (data) {
  //       const canvas = document.createElement("canvas");
  //       const context = canvas.getContext("2d");

  //       // Define base dimensions
  //       const baseHeight = 250;
  //       const extraHeightPerOption = 30;
  //       const extraHeightForNote = data?.note ? 40 : 0;
  //       const dynamicHeight =
  //         baseHeight +
  //         (data.options?.length || 0) * extraHeightPerOption +
  //         extraHeightForNote;
  //       const width = 510;

  //       canvas.width = width;
  //       canvas.height = dynamicHeight;

  //       // Set white background
  //       context.fillStyle = "#fff";
  //       context.fillRect(0, 0, width, dynamicHeight);

  //       // Helper function for text wrapping
  //       function wrapText(context, text, x, y, maxWidth, lineHeight) {
  //         const words = text.split(" ");
  //         let line = "";
  //         for (let n = 0; n < words.length; n++) {
  //           let testLine = line + words[n] + " ";
  //           let metrics = context.measureText(testLine);
  //           let testWidth = metrics.width;
  //           if (testWidth > maxWidth && n > 0) {
  //             context.fillText(line, x, y);
  //             line = words[n] + " ";
  //             y += lineHeight;
  //           } else {
  //             line = testLine;
  //           }
  //         }
  //         context.fillText(line, x, y);
  //         return y + lineHeight;
  //       }

  //       // Header: Table Name and Code
  //       // Draw the Table ID (left black block)
  //       context.fillStyle = "#000";
  //       context.fillRect(0, 0, width / 2, 60);
  //       context.fillStyle = "#fff";
  //       context.font = "bold 36px NotoSansLao, Arial, sans-serif";
  //       context.fillText(data?.tableId?.name || selectedTable?.name, 10, 45);

  //       // Table Code on the right
  //       context.fillStyle = "#000";
  //       context.font = "bold 36px NotoSansLao, Arial, sans-serif";
  //       context.fillText(data?.code || selectedTable?.code, width - 200, 45); // Adjusted position for better alignment

  //       // Divider line below header
  //       context.strokeStyle = "#ccc";
  //       context.lineWidth = 1;
  //       context.beginPath();
  //       context.moveTo(0, 65);
  //       context.lineTo(width, 65);
  //       context.stroke();

  //       // Content: Item Name and Quantity
  //       context.fillStyle = "#000";
  //       context.font = "bold 34px NotoSansLao, Arial, sans-serif";
  //       let yPosition = 100;
  //       yPosition = wrapText(
  //         context,
  //         `${data?.name} x (${data?.quantity})`,
  //         10,
  //         yPosition,
  //         width - 20,
  //         36
  //       );

  //       // Content: Item Note
  //       if (data?.note) {
  //         const noteLabel = "note: ";
  //         const noteText = data.note;

  //         // Draw "Note:" label in bold
  //         context.fillStyle = "#666";
  //         context.font = "bold italic bold 24px Arial, sans-serif";
  //         context.fillText(noteLabel, 10, yPosition);

  //         // Measure width of the "Note:" label
  //         const noteLabelWidth = context.measureText(noteLabel).width;

  //         // Wrap the note text, starting after the "Note:" label
  //         context.font = " bold italic 24px Arial, sans-serif";
  //         yPosition = wrapText(
  //           context,
  //           noteText,
  //           10 + noteLabelWidth, // Start after the label width
  //           yPosition,
  //           width - 20 - noteLabelWidth, // Adjust wrapping width
  //           30
  //         );

  //         // Add spacing after the note
  //         yPosition += 10;
  //       }

  //       // Options
  //       if (data.options && data.options.length > 0) {
  //         context.fillStyle = "#000";
  //         context.font = "24px NotoSansLao, Arial, sans-serif";
  //         data.options.forEach((option, idx) => {
  //           const optionPriceText = option?.price
  //             ? ` - ${moneyCurrency(option?.price)}`
  //             : "";
  //           const optionText = `- ${option?.name}${optionPriceText} x ${
  //             option?.quantity || 1
  //           }`;
  //           yPosition = wrapText(
  //             context,
  //             optionText,
  //             10,
  //             yPosition,
  //             width - 20,
  //             30
  //           );
  //         });

  //         // Divider below options
  //         context.strokeStyle = "#ccc";
  //         context.setLineDash([4, 2]);
  //         context.beginPath();
  //         context.moveTo(0, yPosition);
  //         context.lineTo(width, yPosition);
  //         context.stroke();
  //         context.setLineDash([]);
  //         yPosition += 20;
  //       }

  //       context.fillStyle = "#000";
  //       context.font = " 24px NotoSansLao, Arial, sans-serif";
  //       // let yPosition = 100;
  //       yPosition = wrapText(
  //         context,
  //         `${t("total")} ${moneyCurrency(
  //           data?.price + (data?.totalOptionPrice ?? 0)
  //         )} ${t(storeDetail?.firstCurrency)}`,
  //         30,
  //         dynamicHeight - 76,
  //         width - 20
  //       );

  //       // Set text properties
  //       context.fillStyle = "#000"; // Black text color
  //       context.font = "28px NotoSansLao, Arial, sans-serif"; // Font style and size
  //       context.textAlign = "right"; // Align text to the right
  //       context.textBaseline = "bottom"; // Align text baseline to bottom

  //       // Draw delivery code at the bottom-right
  //       context.fillText(
  //         `${
  //           data?.deliveryCode ? `(delivery code : ${data?.deliveryCode})` : ""
  //         }`, // Delivery code text
  //         width - 10, // Position X: 10px from the right edge
  //         dynamicHeight - 100 // Position Y: 100px above the bottom edge
  //       );

  //       // Add a dotted line before footer
  //       context.strokeStyle = "#000"; // Black dotted line
  //       context.setLineDash([4, 2]); // Dotted line style
  //       context.beginPath();
  //       context.moveTo(0, dynamicHeight - 70); // Position 70px above footer
  //       context.lineTo(width, dynamicHeight - 70); // Full-width dotted line
  //       context.stroke();
  //       context.setLineDash([]); // Reset line dash style

  //       // Footer: Created By and Date
  //       context.font = "bold 28px NotoSansLao, Arial, sans-serif";
  //       context.fillStyle = "#000";
  //       context.fillText(
  //         data?.createdBy?.firstname ||
  //           data?.updatedBy?.firstname ||
  //           "lailaolab",
  //         10,
  //         dynamicHeight - 40
  //       );
  //       context.fillStyle = "#6e6e6e";
  //       context.font = "28px NotoSansLao, Arial, sans-serif";
  //       context.fillText(
  //         `${moment(data?.createdAt).format("DD/MM/YY")} | ${moment(
  //           data?.createdAt
  //         ).format("LT")}`,
  //         width - 220,
  //         dynamicHeight - 40
  //       );

  //       // Convert canvas to base64
  //       const dataUrl = canvas.toDataURL("image/png");
  //       const printer = printers.find((e) => e?._id === data?.printer);
  //       if (printer) base64ArrayAndPrinter.push({ dataUrl, printer });
  //     }
  //   });

  //   return base64ArrayAndPrinter;
  // };
  const convertHtmlToBase64 = (orderSelect) => {
    const base64ArrayAndPrinter = [];
    orderSelect.forEach((data, index) => {
      if (data) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        // Define base dimensions
        const baseHeight = 250;
        const extraHeightPerOption = 30;
        const extraHeightForNote = data?.note ? 40 : 0;
        const dynamicHeight =
          baseHeight +
          (data.options?.length || 0) * extraHeightPerOption +
          extraHeightForNote;
        const width = 510;

        canvas.width = width;
        canvas.height = dynamicHeight;

        // Set white background
        context.fillStyle = "#fff";
        context.fillRect(0, 0, width, dynamicHeight);

        // Helper function for text wrapping
        function wrapText(context, text, x, y, maxWidth, lineHeight) {
          const words = text.split(" ");
          let line = "";
          for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + " ";
            let metrics = context.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
              context.fillText(line, x, y);
              line = words[n] + " ";
              y += lineHeight;
            } else {
              line = testLine;
            }
          }
          context.fillText(line, x, y);
          return y + lineHeight;
        }

        // Header: Table Name and Code
        // Draw the Table ID (left black block)
        context.fillStyle = "#000"; // Black background
        context.fillRect(0, 0, width / 2, 60); // Black block width / 2
        context.fillStyle = "#fff"; // White text
        context.font = "bold 36px NotoSansLao, Arial, sans-serif";
        context.fillText(selectedTable?.tableName, 10, 45); // Table ID text

        // Draw the Table Code (right side)
        context.fillStyle = "#000"; // Black text
        context.font = "bold 30px NotoSansLao, Arial, sans-serif";
        context.fillText(selectedTable?.code, width - 220, 45); // Code text on the right

        // Divider line below header
        context.strokeStyle = "#ccc";
        context.lineWidth = 1;
        context.beginPath();
        context.moveTo(0, 65);
        context.lineTo(width, 65);
        context.stroke();

        // Content: Item Name and Quantity
        context.fillStyle = "#000";
        context.font = "bold 34px NotoSansLao, Arial, sans-serif";
        let yPosition = 100;
        yPosition = wrapText(
          context,
          `${data?.name} (${data?.quantity})`,
          10,
          yPosition,
          width - 20,
          36
        );

        // Content: Item Note
        if (data?.note) {
          const noteLabel = "note: ";
          const noteText = data.note;

          // Draw "Note:" label in bold
          context.fillStyle = "#666";
          context.font = " bold italic bold 24px Arial, sans-serif";
          context.fillText(noteLabel, 10, yPosition);

          // Measure width of the "Note:" label
          const noteLabelWidth = context.measureText(noteLabel).width;

          // Wrap the note text, starting after the "Note:" label
          context.font = "bold italic 24px Arial, sans-serif";
          yPosition = wrapText(
            context,
            noteText,
            10 + noteLabelWidth, // Start after the label width
            yPosition,
            width - 20 - noteLabelWidth, // Adjust wrapping width
            30
          );

          // Add spacing after the note
          yPosition += 10;
        }

        // Options
        if (data.options && data.options.length > 0) {
          context.fillStyle = "#000";
          context.font = "24px NotoSansLao, Arial, sans-serif";
          data.options.forEach((option, idx) => {
            const optionPriceText = option?.price
              ? ` - ${moneyCurrency(option?.price)}`
              : "";
            const optionText = `- ${option?.name}${optionPriceText} x ${
              option?.quantity || 1
            }`;
            yPosition = wrapText(
              context,
              optionText,
              10,
              yPosition,
              width - 20,
              30
            );
          });

          // Divider below options
          context.strokeStyle = "#ccc";
          context.setLineDash([4, 2]);
          context.beginPath();
          context.moveTo(0, yPosition);
          context.lineTo(width, yPosition);
          context.stroke();
          context.setLineDash([]);
          yPosition += 20;
        }

        context.fillStyle = "#000";
        context.font = " 24px NotoSansLao, Arial, sans-serif";
        // let yPosition = 100;
        yPosition = wrapText(
          context,
          `${t("total")} ${moneyCurrency(
            data?.price + (data?.totalOptionPrice ?? 0)
          )} ${t(storeDetail?.firstCurrency)}`,
          10,
          yPosition,
          width - 20,
          46
        );

        // Set text properties
        context.fillStyle = "#000"; // Black text color
        context.font = "28px NotoSansLao, Arial, sans-serif"; // Font style and size
        context.textAlign = "right"; // Align text to the right
        context.textBaseline = "bottom"; // Align text baseline to bottom

        // Draw delivery code at the bottom-right
        context.fillText(
          `${data?.deliveryCode ? `(DC : ${data?.deliveryCode})` : ""}`, // Delivery code text
          width - 10, // Position X: 10px from the right edge
          dynamicHeight - 86 // Position Y: 100px above the bottom edge
        );

        // Add a dotted line above the footer
        context.strokeStyle = "#000"; // Black dotted line
        context.setLineDash([4, 2]); // Dotted line style
        context.beginPath();
        context.moveTo(0, dynamicHeight - 70); // Position 70px above footer
        context.lineTo(width, dynamicHeight - 70); // Full-width dotted line
        context.stroke();
        context.setLineDash([]); // Reset line dash style

        // Footer Section
        context.font = "bold 24px NotoSansLao, Arial, sans-serif";
        context.fillStyle = "#000";

        // Draw "Created By" text at the bottom-left
        context.textAlign = "left"; // Align text to the left
        context.fillText(
          data?.createdBy?.firstname || data?.updatedBy?.firstname || "", // Footer text
          10, // 10px from the left edge
          dynamicHeight - 20 // Position Y: 20px above the bottom
        );

        // Draw date and time at the bottom-right
        context.textAlign = "right"; // Align text to the right
        context.fillStyle = "#6e6e6e"; // Gray color
        context.font = "22px NotoSansLao, Arial, sans-serif"; // Smaller font size
        context.fillText(
          `${moment(data?.createdAt).format("DD/MM/YY")} | ${moment(
            data?.createdAt
          ).format("LT")}`, // Date and time
          width - 10, // 10px from the right edge
          dynamicHeight - 20 // Position Y: 20px above the bottom
        );

        // Convert canvas to base64
        const dataUrl = canvas.toDataURL("image/png");
        const printer = printers.find((e) => e?._id === data?.printer);
        if (printer) base64ArrayAndPrinter.push({ dataUrl, printer });
      }
    });

    return base64ArrayAndPrinter;
  };
  const onPrintForCherCancel = async () => {
    setOnPrinting(true);

    let _dataBill = {
      ...dataBill,
      typePrint: "PRINT_BILL_FORCHER",
    };
    await _createHistoriesPrinter(_dataBill);

    const orderSelect = isCheckedOrderItem?.filter((e) => e?.isChecked);
    console.log("ORDER", orderSelect);
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
            drawer: false,
            paper: _printer?.width === "58mm" ? 400 : 500,
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

    const res = _data.filter((e) => e?.isChecked);
    const dataRes = _data.filter((e) => e?.status === "SERVED");

    if (res.length !== dataRes.length) {
      setOrderPayBefore(res);
    } else {
      setOrderPayBefore([]);
    }

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
        if (item?.status === "CANCELED" || item.status === "PAID") return item;
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
      setOrderPayBefore({ ...orderPayBefore, _newOrderItems });
    }

    setCheckedBox(!checkedBox);
    setOrderPayBefore(!checkedBox);
    setIsCheckedOrderItem(_newOrderItems);
  };

  const [isServedLoading, setIsServerdLoading] = useState(false);
  const [isPrintedLoading, setIsPrintedLoading] = useState(false);

  // Handle updating SERVED order status
  const handleUpdateOrderStatusToServed = async () => {
    try {
      setIsServerdLoading(true); // Show loading spinner for the user
      const storeId = storeDetail?._id;

      // Filter checked items with status "SERVED"
      const serveItemsReq = isCheckedOrderItem
        ?.filter((e) => e?.isChecked && e?.status !== "SERVED") // Add condition for SERVED status
        .map((i) => ({
          status: i?.status,
          _id: i?._id,
          menuId: i?.menuId,
          quantity: i?.quantity,
          name:i?.name
        }));

      if (serveItemsReq.length === 0) return setIsServerdLoading(false);

      // Only send data for items with a valid status change
      const response = await updateOrderItemV7(serveItemsReq, storeId);

      if (response?.data?.message === "UPDATE_ORDER_SUCCESS") {
        setCheckedBox(!checkedBox);
        // Success, update the UI
        Swal.fire({
          icon: "success",
          title: `${t("update_order_status_success")}`,
          showConfirmButton: false,
          timer: 2000,
        });

        // 1. Optimistically update the order list in the state (Update the status to "SERVED")
        const updatedOrderItems = isCheckedOrderItem.map((item) => {
          // Check if the item is checked, and update its status
          const updatedItem = {
            ...item,
            isChecked: false, // Uncheck the item after updating status
            status: item.isChecked ? "SERVED" : item.status, // Update status to "SERVED" if it's checked
          };

          // If the order was served, update the `updatedBy` and `updatedAt` fields
          if (item.isChecked) {
            updatedItem.updatedBy = response.data.updatedBy; // Add `updatedBy` from response
            updatedItem.updatedAt = response.data.updatedAt; // Add `updatedAt` from response
          }

          return updatedItem;
        });

        setIsCheckedOrderItem(updatedOrderItems); // Update state

        // 2. Update total price immediately for the served items
        await calculateTotalBillV7(updatedOrderItems);
        ableToCheckoutFunc(updatedOrderItems);
        setIsServerdLoading(false);

        // Optionally, update other states based on your requirements
        // e.g., Update waiting count or trigger a re-fetch for fresh data
        const count = await getCountOrderWaiting(storeId);
        setCountOrderWaiting(count || 0);
      } else {
        // Handle failure in updating status
        setIsServerdLoading(false);
        Swal.fire({
          icon: "error",
          title: `${t("update_order_status_failed")}`,
          showConfirmButton: false,
          timer: 2000,
        });
      }
      setOrderPayBefore([]);
      setIsServerdLoading(false);
    } catch (error) {
      console.error("Error updating order status:", error);
      setIsServerdLoading(false);
      Swal.fire({
        icon: "error",
        title: `${t("update_order_status_error")}`,
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  // } catch (error) {
  //   console.error("Error updating order status:", error);
  //   setIsServerdLoading(false);
  //   Swal.fire({
  //     icon: "error",
  //     title: `${t("update_order_status_error")}`,
  //     showConfirmButton: false,
  //     timer: 2000,
  // };

  const calculateTotalBillV7 = async (updatedOrderItems) => {
    setPrintBillCalulate(true);

    // We are now using the passed updatedOrderItems to avoid querying unnecessary state
    let _total = 0;

    updatedOrderItems.forEach((item) => {
      if (item.status === "SERVED") {
        _total += item.quantity * (item.price + (item.totalOptionPrice ?? 0));
      }
    });

    // Apply discount if available
    if (dataBill?.discount > 0) {
      let discountedAmount = _total;

      if (
        dataBill?.discountType === "LAK" ||
        dataBill?.discountType === "MONEY"
      ) {
        discountedAmount -= dataBill?.discount;
      } else {
        const discount = (_total * dataBill?.discount) / 100;
        discountedAmount -= discount;
      }

      setTotalAfterDiscount(discountedAmount);
    } else {
      setTotalAfterDiscount(_total);
    }

    setTotal(_total); // Set the total without discount
    setPrintBillCalulate(false);
  };

  const handleUpdateOrderPayBefore = async (status) => {
    try {
      if (status === "PRINTBILL") setIsPrintedLoading(true);
      const storeId = storeDetail?._id;
      let menuId;
      const _updateItems = isCheckedOrderItem
        ?.filter((e) => e?.isChecked && e?.status === "PRINTBILL")
        .map((i) => {
          return {
            status: status,
            _id: i?._id,
            menuId: i?.menuId,
          };
        });

      const _resOrderUpdate = await updateOrderItem(
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
        const _newOrderItems = isCheckedOrderItem.map((item) => {
          return {
            ...item,
            isChecked: false,
          };
        });
        setIsCheckedOrderItem(_newOrderItems);

        const count = await getCountOrderWaiting(storeId);
        setCountOrderWaiting(count || 0);
        setIsPrintedLoading(false);
      } else {
        setIsPrintedLoading(false);
      }
      setOrderPayBefore([]);
      setIsPrintedLoading(false);
    } catch (error) {
      setIsPrintedLoading(false);
      console.log(error);
    }
  };

  const handleUpdateOrderStatusgo = async (status) => {
    const storeId = storeDetail?._id;
    let menuId;
    const _updateItems = isCheckedOrderItem
      ?.filter((e) => e?.isChecked)
      .map((i) => {
        return {
          status: status,
          _id: i?._id,
          menuId: i?.menuId,
        };
      });
    const _resOrderUpdate = await updateOrderItem(
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
      const _newOrderItems = isCheckedOrderItem.map((item) => {
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
    const _updateItems = isCheckedOrderItem
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
    const _resOrderUpdate = await updateOrderItem(
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
      const _newOrderItems = isCheckedOrderItem.map((item) => {
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
      const _updateItems = isCheckedOrderItem
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
      const _resOrderUpdate = await updateOrderItem(
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
        const _newOrderItems = isCheckedOrderItem.map((item) => {
          return {
            ...item,
            isChecked: false,
          };
        });
        setIsCheckedOrderItem(_newOrderItems);

        const count = await getCountOrderWaiting(storeId);
        setCountOrderWaiting(count || 0);
        setIsPrintedLoading(false);
      } else {
        setIsServerdLoading(false);
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
    if (userCallCheckout) {
      // getTableDataStore();
      if (zoneId) {
        getTableDataStore({ zone: zoneId });
      } else {
        getTableDataStore();
      }
      setUserCallCheckout(false);
    }
  }, [userCallCheckout]);

  useEffect(() => {
    // _calculateTotal();
    calculateTotalBill();
  }, [dataBill]);

  useEffect(() => {
    if (selectedTable) {
      setSelectTable(selectedTable);
    } else {
      setSelectTable(false);
    }
  }, [selectedTable]);

  // useEffect(() => {
  //   getStatusItem();
  // }, [isCheckedOrderItem]);

  // const getStatusItem = async () => {
  //   isCheckedOrderItem.map((e) => {
  //     const PrintItem = e?.status === "PRINTBILL";
  //     setCheckStatusItem(PrintItem);
  //   });
  // };

  // console.log("BILL: ", dataBill);
  // console.log("TABLE: ", selectedTable);

  // function
  // const _calculateTotal = () => {
  //   let _total = 0;
  //   for (let _data of dataBill?.orderId || []) {
  //     // console.log({ _data });
  //     _total +=
  //       (_data?.price + (_data?.totalOptionPrice ?? 0)) * _data?.quantity;
  //   }
  //   if (dataBill?.discount > 0) {
  //     if (
  //       dataBill?.discountType == "LAK" ||
  //       dataBill?.discountType == "MONEY"
  //     ) {
  //       setTotalAfterDiscount(_total - dataBill?.discount);
  //     } else {
  //       const ddiscount = parseInt((_total * dataBill?.discount) / 100);
  //       setTotalAfterDiscount(_total - ddiscount);
  //     }
  //   } else {
  //     setTotalAfterDiscount(_total);
  //   }
  //   setTotal(_total);
  // };

  // ================ new function ================
  // console.log("printBillCalulate", printBillCalulate);
  const calculateTotalBill = async () => {
    setPrintBillCalulate(true);
    let _total = 0;
    if (dataBill && dataBill?.orderId) {
      for (let i = 0; i < dataBill?.orderId?.length; i++) {
        if (dataBill?.orderId[i]?.status === "SERVED") {
          _total +=
            dataBill?.orderId[i]?.quantity *
            (dataBill?.orderId[i]?.price +
              (dataBill?.orderId[i]?.totalOptionPrice ?? 0));
        }
      }
    }

    if (dataBill?.discount > 0) {
      if (
        dataBill?.discountType === "LAK" ||
        dataBill?.discountType === "MONEY"
      ) {
        setTotalAfterDiscount(_total - dataBill?.discount);
      } else {
        const ddiscount = Number.parseInt((_total * dataBill?.discount) / 100);
        setTotalAfterDiscount(_total - ddiscount);
      }
    } else {
      await setTotalAfterDiscount(_total);
    }
    await setTotal(_total);
    setPrintBillCalulate(false);
  };

  const getQrTokenForSelfOrdering = async () => {
    // const data = await tokenSelfOrderingPost(selectedTable?.billId);
    const data = await tokenSelfOrderingPost(
      dataQR ? dataQR : selectedTable?.billId
    );
    if (data?.token) {
      setQrToken(data?.token);
      setPopup({ qrToken: true });
    }
  };

  const canCheckOut = !tableOrderItems.find(
    (e) =>
      e?.status === "DOING" ||
      e?.status === "WAITING" ||
      e?.tableOrderItems?.length === 0
  )?._id;

  const getDataZone = async () => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const data = await axios({
        method: "get",
        url: `${END_POINT_SEVER_TABLE_MENU}/v3/zones`,
        params: {
          storeId: storeDetail?._id,
          limit: 100,
        },
        headers: headers,
      });
      if (data?.status === 200) {
        setZoneData(data?.data?.data);
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

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

  return (
    <div className="bg-[#F9F9F9] h-[calc(100vh-66px)] overflow-hidden w-full">
      {/* popup */}
      <PopUpQRToken
        tableName={selectedTable?.tableName}
        open={popup?.qrToken}
        qr={qrToken}
        storeId={selectedTable?.storeId}
        onClose={() => setPopup()}
      />
      <div className="flex overflow-hidden h-full">
        <div className="flex-1 h-full flex flex-col">
          <div
            className={cn(
              "items-center justify-between p-2 grid gap-1.5",
              selectTable
                ? "grid-cols-5 sm:grid-cols-5 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5"
                : "grid-cols-5 sm:grid-cols-5 md:grid-cols-5 lg:grid-cols-5"
            )}
          >
            {[
              {
                label: t("total_table"),
                value: tableList?.length,
                icon: <HandPlatter />,
                bgColor: theme.primaryColor,
              },
              {
                label: t("available"),
                value: _checkStatusCodeA(tableList),
                icon: <Check />,
                bgColor: "#FFFFFF",
              },
              {
                label: t("unavailable"),
                value: _checkStatusCode(tableList),
                icon: <X />,
                bgColor: theme.primaryColor,
              },
              {
                label: t("printed_bill"),
                value: _checkStatusCodeB(tableList),
                icon: <ReceiptText />,
                bgColor: "#FFE17B",
              },
              {
                label: t("edit_bill"),
                value: _checkStatusCodeC(tableList),
                icon: <Edit2Icon />,
                bgColor: "#CECE5A",
              },
            ].map((item, index) => {
              return (
                <div
                  className={cn(
                    "min-h-[80px] h-full flex xl:gap-2.5 xl:flex-row bg-white py-2 xl:justify-start items-center rounded-[8px] shadow-sm",
                    selectTable
                      ? "flex-col justify-start items-center lg:items-center gap-1 px-2.5 xl:px-3"
                      : "lg:flex-row gap-1 sm:gap-2 flex-col md:flex-row px-3"
                  )}
                >
                  <div
                    style={{
                      backgroundColor: item.bgColor,
                      borderColor: theme.primaryColor,
                      borderWidth: index === 1 ? 1 : 0,
                    }}
                    className={cn(
                      "h-[40px] w-[40px] min-w-[40px] min-h-[40px] flex items-center justify-center rounded-[6px]",
                      index === 1 ? "text-gray-500" : "text-white"
                    )}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div
                      className={cn(
                        "text-[#6B7280] font-semibold text-[14px] md:text-[15px] flex-1 text-center md:whitespace-nowrap md:text-left",
                        fontMap[language]
                      )}
                    >
                      {item.label}
                    </div>
                    <div
                      className={cn(
                        "text-[#111827] font-semibold text-lg font-inter leading-6flex-1 flex",
                        selectTable
                          ? "justify-center xl:justify-start"
                          : "justify-center md:justify-start"
                      )}
                    >
                      {item.value}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {zoneData?.length > 0 ? (
            <div
              className={cn(
                "flex items-center justify-start w-full py-2 px-3",
                fontMap[language]
              )}
            >
              <Form.Label>
                <span className={cn(fontMap[language])}>
                  {t("show_by_zone")}
                </span>
              </Form.Label>
              <Form.Control
                as="select"
                value={zoneId}
                onChange={(e) => onSelectedZone(e?.target?.value)}
                style={{ width: "150px", marginLeft: "10px" }}
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

          <div className="overflow-y-auto flex-1 pb-[100px] px-3">
            <div style={{ height: 10 }} />
            <div
              className={cn(
                selectTable
                  ? "grid gap-2 grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
                  : "grid gap-2 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
              )}
            >
              {tableList &&
                tableList?.map((table, index) => (
                  <div
                    key={"table" + index}
                    className={cn(
                      "rounded-[8px] overflow-hidden bg-white cursor-pointer border-[.085rem] border-color-app box-border",
                      fontMap[language]
                    )}
                  >
                    <div
                      className={cn(
                        "md:block hidden h-full rounded-[7px] border-[.196rem] border-white box-border overflow-hidden",
                        selectTable._id === table._id && "border-red-600"
                      )}
                    >
                      <div
                        className={cn(
                          "w-full h-full flex-1 flex text-center justify-center rounded-[4px]",
                          table?.isOpened && !table?.isStaffConfirm
                            ? "blink_card"
                            : // : table.statusBill === "CALL_TO_CHECKOUT"
                              //   ? "blink_cardCallCheckOut"
                              "",
                          table?.isStaffConfirm
                            ? table?.editBill
                              ? "bg-[#CECE5A] text-gray-500"
                              : table?.statusBill === "CALL_TO_CHECKOUT"
                              ? "bg-[#FFE17B] text-gray-500"
                              : "bg-color-app text-white"
                            : "text-gray-500"
                        )}
                        onClick={() => {
                          setOrderPayBefore([]);
                          onSelectTable(table);
                          setSelectedTable(table);
                          setSelectTable(true);
                          setStoreDetail({
                            tableEdit: table?.editBill,
                          });
                        }}
                      >
                        <div className="flex flex-col items-center justify-center h-full px-3 py-2">
                          <div className="w-full">
                            <div
                              className={cn(
                                "flex items-center gap-1 text-base font-semibold flex-wrap text-center justify-center",
                                fontMap[language]
                              )}
                            >
                              <span>{table?.tableName}</span>
                              <span>{`(${table?.code})`}</span>
                            </div>
                            <div
                              className={cn(
                                "text-base font-semibold",
                                fontMap[language]
                              )}
                            >
                              {table?.isStaffConfirm
                                ? table?.editBill
                                  ? `${t("edit_bill")}`
                                  : table?.statusBill === "CALL_TO_CHECKOUT"
                                  ? `${t("printed_bill")}`
                                  : `${t("unavailable")}`
                                : `${t("available")}`}
                            </div>
                            <div
                              className={cn(
                                "text-[13px] font-medium",
                                fontMap[language],
                                table?.isStaffConfirm
                                  ? table?.editBill
                                    ? "text-gray-500"
                                    : table?.statusBill === "CALL_TO_CHECKOUT"
                                    ? "text-gray-500"
                                    : "text-white"
                                  : "text-gray-500"
                              )}
                            >
                              Zone:{" "}
                              {table?.zone?.name ? table?.zone?.name : "Normal"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="block md:hidden h-full">
                      <div
                        className={cn(
                          "w-full h-full rounded-md bg-white flex text-center justify-center border-collapse border-[.156rem] border-white",
                          table?.isOpened && !table?.isStaffConfirm
                            ? "blink_card"
                            : // : table.statusBill === "CALL_TO_CHECKOUT"
                              //   ? "blink_cardCallCheckOut"
                              "",
                          table?.isStaffConfirm
                            ? table?.editBill
                              ? "bg-[#CECE5A] text-gray-500"
                              : table?.statusBill === "CALL_TO_CHECKOUT"
                              ? "bg-[#FFE17B] text-gray-500"
                              : "bg-primary-gradient text-white"
                            : "text-gray-500"
                        )}
                        onClick={() => {
                          onSelectTable(table);
                          setStoreDetail({
                            tableEdit: table?.editBill,
                          });
                          if (table?.isOpened) {
                            navigate(`/staff/tableDetail/${table?._id}`);
                          } else {
                            setPopup({ openTable: true });
                          }
                        }}
                      >
                        <div className="flex gap-4 items-center justify-center h-full p-3">
                          <div className="w-full">
                            <div
                              className={cn(
                                "flex items-center gap-1 text-base font-semibold flex-wrap text-center justify-center",
                                fontMap[language]
                              )}
                            >
                              <span>{table?.tableName}</span>
                              <span>{`(${table?.code})`}</span>
                            </div>
                            <div
                              className={cn(
                                "text-lg font-semibold",
                                fontMap[language]
                              )}
                            >
                              {table?.isStaffConfirm
                                ? table?.editBill
                                  ? `${t("available")}`
                                  : table?.statusBill === "CALL_TO_CHECKOUT"
                                  ? `${t("printed_bill")}`
                                  : `${t("unavailable")}`
                                : `${t("available")}`}
                            </div>
                            <div
                              className={cn(
                                "text-[13px] font-medium font-inter",
                                fontMap[language],
                                table?.isStaffConfirm
                                  ? table?.editBill
                                    ? "text-gray-500"
                                    : table?.statusBill === "CALL_TO_CHECKOUT"
                                    ? "text-gray-500"
                                    : "text-white"
                                  : "text-gray-500"
                              )}
                            >
                              Zone:{" "}
                              {table?.zone?.name ? table?.zone?.name : "Normal"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <div style={{ height: 20 }} />
          </div>
        </div>
        {/* Detail Table */}
        {selectTable && (
          <div
            className={cn(
              "hidden md:block min-w-[460px] w-[460px] max-w-[460px] shadow-md"
            )}
          >
            {selectedTable != null &&
              selectedTable?.isStaffConfirm &&
              selectedTable?.isOpened && (
                <div className="w-full bg-white overflow-y-scroll h-full min-h-[calc(100dvh-64px)] max-h-[calc(100dvh-64px)]">
                  <div className="w-full h-full relative">
                    <Button
                      variant="outlined"
                      className="flex justify-center items-center !text-[#909090] absolute top-0 left-0 p-2"
                      onClick={getQrTokenForSelfOrdering}
                    >
                      <IoQrCode style={{ fontSize: "22px" }} />
                    </Button>
                    <div className="bg-white p-2.5 pb-0">
                      <div
                        className={cn(
                          "font-bold text-2xl w-full flex justify-center flex-col items-center p-2.5"
                        )}
                      >
                        {selectedTable?.tableName}
                      </div>
                      <div className={cn("text-base", fontMap[language])}>
                        {t("tableNumber2")}:{" "}
                        <span className="font-bold text-color-app">
                          {selectedTable?.code}
                        </span>
                      </div>
                      <div className={cn("text-base", fontMap[language])}>
                        {t("timeOfTableOpening")}:{" "}
                        <span className="font-bold text-color-app">
                          {moment(selectedTable?.createdAt).format("HH:mm A")}
                        </span>
                      </div>
                      <div className={cn("text-base", fontMap[language])}>
                        {t("respon")}:{" "}
                        <span className="font-bold text-color-app">
                          {dataBill?.orderId?.[0]?.updatedBy?.firstname &&
                          dataBill?.orderId?.[0]?.updatedBy?.lastname
                            ? `${dataBill?.orderId[0]?.updatedBy?.firstname} ${dataBill?.orderId[0]?.updatedBy?.lastname}`
                            : ""}
                        </span>
                      </div>
                      <div className={cn("text-base", fontMap[language])}>
                        {t("discount")}:{" "}
                        <span className="font-bold text-color-app">
                          {moneyCurrency(dataBill?.discount)}{" "}
                          {dataBill?.discountType === "PERCENT"
                            ? "%"
                            : storeDetail?.firstCurrency}
                        </span>
                      </div>
                      <div className={cn("text-base", fontMap[language])}>
                        {t("total")}:{" "}
                        <span className="font-bold text-color-app">
                          {isWaitingPress ? moneyCurrency(total) : "0"}{" "}
                          {storeDetail?.firstCurrency}
                        </span>
                      </div>
                      <div className={cn("text-base", fontMap[language])}>
                        {t("aPriceHasToPay")}:{" "}
                        <span className="font-bold text-color-app">
                          {isWaitingPress
                            ? moneyCurrency(totalAfterDiscount)
                            : "0"}{" "}
                          {storeDetail?.firstCurrency}
                        </span>
                      </div>
                      <div
                        className={cn("text-base", fontMap[language])}
                        style={{
                          fontSize: 16,
                          color: "red",
                          display: isCheckedOrderItem?.filter(
                            (e) =>
                              e?.status !== "SERVED" &&
                              e?.status !== "CANCELED" &&
                              e?.status !== "FEEDBACK" &&
                              e?.status !== "PAID"
                          )?.length
                            ? "block"
                            : "none",
                        }}
                      >
                        {
                          isCheckedOrderItem?.filter(
                            (e) =>
                              e?.status !== "SERVED" &&
                              e?.status !== "CANCELED" &&
                              e?.status !== "FEEDBACK" &&
                              e?.status !== "PAID"
                          )?.length
                        }{" "}
                        {t("itemNotServed")}
                      </div>
                      <div>
                        <p
                          className={cn(
                            "font-bold text-color-app",
                            fontMap[language]
                          )}
                        >
                          {isCheckedOrderItem?.filter(
                            (e) => e?.status === "PAID"
                          )?.length
                            ? ` ${
                                isCheckedOrderItem?.filter(
                                  (e) => e?.status === "PAID"
                                )?.length
                              } ${t("ORDER_PAID")}`
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="border-b border-dashed border-[#ccc] mb-2.5" />
                    <div
                      className={cn(
                        "grid grid-cols-4 px-2.5",
                        fontMap[language]
                      )}
                    >
                      <ButtonCustom
                        onClick={() => onPrintToKitchen()}
                        disabled={onPrinting}
                      >
                        {onPrinting && <Spinner animation="border" size="sm" />}
                        {t("printBillToKitchen")}
                      </ButtonCustom>
                      <ButtonCustom
                        onClick={() => _openModalSetting(selectedTable)}
                      >
                        {t("closeTable")}
                      </ButtonCustom>
                      <ButtonCustom
                        disabled={tableOrderItems?.length === 0}
                        onClick={handleShow}
                      >
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
                        disabled={disableCheckoutButton}
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
                        + {t("addOrder")}
                      </ButtonCustom>
                      <ButtonCustom disabled></ButtonCustom>
                      <ButtonCustom
                        onClick={() => setPopup({ PopUpTranferTable: true })}
                      >
                        {t("move_order")}
                      </ButtonCustom>
                      {/* {selectedTable?.tableChildren?.length > 0 ||
                        showBtnCombine ? (
                          <ButtonCustom
                            onClick={() =>
                              navigate(`/bill/split/${selectedTable?._id}`)
                            }
                          >
                            {t("bill_split")}
                          </ButtonCustom>
                        ) : (
                          ""
                        )} */}
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
                      className={cn(fontMap[language])}
                    >
                      <ButtonCustom
                        onClick={() => {
                          setWorkAfterPin("cancle_order_and_print");
                          setPopup({ PopUpPin: true });
                        }}
                        disabled={!checkedBox || onPrinting}
                      >
                        {onPrinting && <Spinner animation="border" size="sm" />}
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
                        onClick={() => handleUpdateOrderStatusgo("DOING")}
                        disabled={!checkedBox}
                      >
                        {t("sendToKitchen")}
                      </ButtonCustom>
                      <ButtonCustom
                        onClick={() => handleUpdateOrderStatusToServed()}
                        disabled={!checkedBox}
                      >
                        {isServedLoading && (
                          <Spinner animation="border" size="sm" />
                        )}{" "}
                        {t("servedBy")}
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
                                setOrderPayBefore(e);
                                checkAllOrders(e);
                                setCheckedBox(!checkedBox);
                              }}
                            />
                          </th>
                          <th className={fontMap[language]}>{t("no")}</th>
                          <th className={fontMap[language]}>{t("menuname")}</th>
                          <th className={fontMap[language]}>{t("quantity")}</th>
                          <th className={fontMap[language]}>{t("status")}</th>
                          <th className={fontMap[language]}>{t("customer")}</th>
                          <th className={fontMap[language]}>{t("time")}</th>
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
                                  key={`order${index}`}
                                  style={{
                                    borderBottom: "1px solid #eee",
                                  }}
                                >
                                  <td onClick={(e) => e.stopPropagation()}>
                                    <Checkbox
                                      disabled={
                                        orderItem?.status === "CANCELED" ||
                                        orderItem?.status === "PAID"
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
                                        orderItem?.status === "SERVED"
                                          ? "green"
                                          : orderItem?.status === "PAID"
                                          ? COLOR_APP
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
                        <div
                          style={{ marginTop: 50, fontSize: 50 }}
                          className={fontMap[language]}
                        >
                          {" "}
                          {t("TableHasNoOrder")}
                        </div>
                      </div>
                    )}

                    <div style={{ marginBottom: 100 }} />
                  </div>
                </div>
              )}

            {selectedTable != null && !selectedTable?.isStaffConfirm && (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  height: "100%",
                  minHeight: "calc(100vh - 64px)",
                  maxHeight: "calc(100vh - 64px)",
                  // borderColor: "none",
                  overflowY: "scroll",
                  borderWidth: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <div className="flex flex-col justify-center items-center pt-4 text-2xl font-bold">
                  <SiAirtable />
                  <span className={fontMap[language]}>
                    {selectedTable?.tableName}
                  </span>
                </div>
                <div className="p-2">
                  <QRCode
                    value={
                      END_POINT_WEB_CLIENT +
                      selectedTable?.storeId +
                      "?tableId=" +
                      selectedTable?.tableId
                    }
                    size={150}
                  />
                </div>
                <p
                  style={{
                    fontSize: 18,
                    color: "#616161",
                    textAlign: "center",
                  }}
                  className={fontMap[language]}
                >
                  {t("bringThisQRCodeToCustomersOrPressOpenToStartUsing")}
                </p>
                <p
                  style={{
                    fontSize: 18,
                    color: "#616161",
                    textAlign: "center",
                  }}
                  className={fontMap[language]}
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
                  <span className={fontMap[language]}>
                    {!selectedTable?.isOpened
                      ? `${t("open")}`
                      : "ຢືນຢັນເປີດໂຕະ"}
                  </span>
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
                  <span className={fontMap[language]}>
                    {t("open_table_with_qr")}
                  </span>
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
                <p
                  style={{ margin: 0, fontSize: 30 }}
                  className={fontMap[language]}
                >
                  {t("chose_table_for_order")}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      <div style={{ width: "80mm", padding: 10 }} ref={bill80Ref}>
        <BillForCheckOut80
          orderPayBefore={orderPayBefore}
          storeDetail={storeDetail}
          selectedTable={selectedTable}
          dataBill={dataBill}
          totalBillBillForCheckOut80={total}
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
        saveServiceChargeDetails={saveServiceChargeDetails}
        onPrintBill={onPrintBill}
        onPrintDrawer={onPrintDrawer}
        dataBill={dataBill}
        totalBillCheckOutPopup={total} // new props
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
        onSubmit={() => {
          setPopup({ CheckOutType: false, CheckPopUpDebt: true });
        }}
        setDataBill={setDataBill}
        taxPercent={taxPercent}
        billDataLoading={billDataLoading}
      />

      <OrderCheckOut
        setCreatedAt={setCreatedAt}
        createdAt={createdAt}
        totalMustPay={totalMustPay}
        setTotalMustPay={setTotalMustPay}
        setServiceChangeAmount={setServiceChangeAmount}
        staffData={userData}
        data={dataBill}
        totalBillOrderCheckOut={total} // new props
        printBillCalulate={printBillCalulate}
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
          setOrderPayBefore([]);
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
          <Modal.Title>
            <span className={fontMap[language]}>{t("combine_table")}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Label>
              <span className={fontMap[language]}>
                {t("move_from")} : {selectedTable?.tableName}
              </span>
            </Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className={fontMap[language]}>
                {t("to_table")} :{" "}
              </Form.Label>
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
                    style={{
                      backgroundColor:
                        selectedTable?.tableName === item?.tableName
                          ? "orange"
                          : "",
                    }}
                  >
                    {t("table")} {item?.tableName}
                  </option>
                ))}
              </select>
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer className={fontMap[language]}>
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
          <Modal.Title className={fontMap[language]}>
            {t("cause_cancel_order")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={fontMap[language]}>
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
        <Modal.Footer className={fontMap[language]}>
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
          <Modal.Title className={fontMap[language]}>
            {t("edit_amount")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <TableCustom>
              <thead className={fontMap[language]}>
                <tr>
                  <th>{t("table")}</th>
                  <th>{t("menuname")}</th>
                  <th>{t("quantity")}</th>
                  <th>{t("status")}</th>
                  <th>{t("customer")}</th>
                  <th>{t("time")}</th>
                </tr>
              </thead>
              <tbody className={fontMap[language]}>
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
        <Modal.Footer className={fontMap[language]}>
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
          <Modal.Title className={fontMap[language]}>
            {t("setting_table")}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={fontMap[language]}>
          <div style={{ textAlign: "center" }}>
            {t("would_you_like_to_close")} {dataSettingModal?.tableName} ?
          </div>
        </Modal.Body>
        <Modal.Footer className={fontMap[language]}>
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
        backgroundColor: theme.primaryColor,
        color: "#ffffff",
        fontWeight: "bold",
        fontSize: 13,
        padding: "8px 4px",
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
