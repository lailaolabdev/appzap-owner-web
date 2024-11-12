/* eslint-disable no-loop-func */
import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Modal, Form, Container, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import moment from "moment";
import { QRCode } from "react-qrcode-logo";
import axios from "axios";
import html2canvas from "html2canvas";
import { base64ToBlob, orderStatusTranslate } from "../../helpers";
import { Checkbox } from "@material-ui/core";
import Box from "../../components/Box";
import PopUpQRToken from "../../components/popup/PopUpQRToken";
import { SiAirtable } from "react-icons/si";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";
import _ from "lodash";

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
import CheckOutType from "./components/CheckOutType";
import BillQRSmartOrdering80 from "../../components/bill/BillQRSmartOrdering80";
import PopUpPin from "../../components/popup/PopUpPin";
import printFlutter from "../../helpers/printFlutter";
import ListBillCombine from "./components/ListBillCombine";
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
  END_POINT_WEB_CLIENT,
  USERS,
  getLocalData,
} from "../../constants/api";
import { successAdd, errorAdd, warningAlert } from "../../helpers/sweetalert";
import { getHeaders, tokenSelfOrderingPost } from "../../services/auth";
import { useNavigate, useParams } from "react-router-dom";
import { getBills } from "../../services/bill";
// import _ from "lodash";
import { getCountOrderWaiting, updateOrderItem } from "../../services/order";
import styled from "styled-components";
import { callCheckOutPrintBillOnly, getCodes } from "../../services/code";
import PopUpAddDiscount from "../../components/popup/PopUpAddDiscount";
import { useTranslation } from "react-i18next";
import PopupOpenTable from "../../components/popup/PopupOpenTable";
import BillQRShortSmartOrdering80 from "../../components/bill/BillQRShortSmartOrdering80";
import CheckOutPopup from "./components/CheckOutPopup";
import { IoQrCode } from "react-icons/io5";
import BillForChefCancel80 from "../../components/bill/BillForChefCancel80";
import PopUpTranferTable from "../../components/popup/PopUpTranferTable";
import { printItems } from "./printItems";
import CombinedBillForChefNoCut from "../../components/bill/CombinedBillForChefNoCut";
import BillForCheckOutCombine80 from "../../components/bill/BillForCheckOutCombine80";

export default function BillSplit() {
  const navigate = useNavigate();
  const params = useParams();
  const number = params?.number;
  const activeTableId = params?.tableId;

  // const oldId = params?.oldId;
  const newId = params?.newId;

  const { t } = useTranslation();

  // state
  const [show, setShow] = useState(false);

  const [disableBtn, setDisableBtn] = useState(false);

  const [popup, setPopup] = useState({
    CheckOutType: false,
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSelectedCancelOrder = (e) =>
    setSeletedCancelOrderItem(e.target.value);

  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [dataSettingModal, setDataSettingModal] = useState();
  const [showBillAfterCheckout, setShowBillAfterCheckout] = useState(false);

  const [checkoutModel, setCheckoutModal] = useState(false);
  const [menuItemDetailModal, setMenuItemDetailModal] = useState(false);
  const [dataBill, setDataBill] = useState();
  const [reload, setReload] = useState(false);
  const [quantity, setQuantity] = useState(false);
  const [totalAfterDiscount, setTotalAfterDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [codeShortLink, setCodeShortLink] = useState(null);
  const [qrToken, setQrToken] = useState("");
  const [pinStatus, setPinStatus] = useState(false);
  const [workAfterPin, setWorkAfterPin] = useState("");

  const handleCloseQuantity = () => setQuantity(false);
  const handleShowQuantity = (item) => {
    // _orderTableQunatity(item)
    setSeletedOrderItem(item);
    setQuantity(true);
  };

  const { printerCounter, printers } = useStore();

  // provider
  const {
    tableOrderItems,
    getTableDataStore,
    resetTableOrder,
    storeDetail,
    getTableOrders,
    newTableTransaction,
    setNewTableTransaction,
    newOrderTransaction,
    setNewOrderTransaction,
    newOrderUpdateStatusTransaction,
    setNewOrderUpdateStatusTransaction,
    setCountOrderWaiting,
    profile,
    getSplitBillAll,
    listbillSplitAll,
    onSelectBill,
    selectedBill,
    billOrderItems,
    isbillOrderLoading,
    combine,
    showAllbill,
    chageStatus,
    tableChild,
  } = useStore();

  // console.log({ billSplitNewId, billSplitOldId });
  // console.log({ billSplitNew, billSplitOld });
  // console.log(billOrderItems);
  // console.log({ combine });
  // console.log({ billOrderItems });
  // console.log("tableChlistbillSplitAllild", listbillSplitAll);

  // const totalBill = _.sumBy(
  //   combine?.items?.filter((e) => e?.status),
  //   (e) => (e?.price + (e?.totalOptionPrice ?? 0)) * e?.quantity
  // );

  const reLoadData = () => {
    setReload(true);
  };
  useEffect(() => {
    if (reload) {
      getTableOrders(selectedBill);
      setReload(false);
      // orderSound();
    }
  }, [reload]);

  const [isCheckedOrderItem, setIsCheckedOrderItem] = useState([]);
  const [seletedOrderItem, setSeletedOrderItem] = useState();
  const [seletedCancelOrderItem, setSeletedCancelOrderItem] = useState("");
  const [checkedBox, setCheckedBox] = useState(true);
  const [taxPercent, setTaxPercent] = useState(0);
  const [userData, setuserData] = useState(null);
  const [combinedBillRefs, setCombinedBillRefs] = useState({});
  const [groupedItems, setGroupedItems] = useState({});

  // console.log({ chageStatus });

  useEffect(() => {
    // getSplitBillAll(oldId, newId);
    getSplitBillAll(newId);
  }, [newId, chageStatus === true]);

  useEffect(() => {
    // Automatically select the first tableChild if it exists
    if (tableChild && tableChild[0]?.billId !== null) {
      const firstTableChild = tableChild[0];
      onSelectBill({ ...firstTableChild, isSplit: false });
      setDisableBtn(true);
      setShowBillAfterCheckout(false);
    } else {
      onSelectBill(listbillSplitAll[0]);
    }
  }, [tableChild, listbillSplitAll]);

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
    }
    if (workAfterPin == "cancle_order_and_print") {
      setPopup();
    }

    getUserData();
  }, [pinStatus]);

  useEffect(() => {
    getUserData();
    getSplitBillAll(newId);
    setShowBillAfterCheckout(true);
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

  useEffect(() => {
    const getDataTax = async () => {
      const { DATA } = await getLocalData();
      const _res = await axios.get(
        END_POINT_SEVER + "/v4/tax/" + DATA?.storeId
      );
      setTaxPercent(_res?.data?.taxPercent);
    };
    getDataTax();
  }, []);
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

  /**
   * Modify Order Status
   */
  useEffect(() => {
    setIsCheckedOrderItem([...tableOrderItems]);
  }, [selectedBill, tableOrderItems]);
  // useEffect(() => {
  //   if (!tableOrderItems) return;
  //   let _tableOrderItems = [...tableOrderItems];
  //   let _checkDataStatus = [];
  //   let _checkDataStatusCancel = [];
  //   _tableOrderItems.map((nData) => {
  //     if (nData.status === "SERVED") _checkDataStatus.push(nData?.status);
  //     if (nData.status === "CANCELED")
  //       _checkDataStatusCancel.push(nData?.status);
  //   });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [tableOrderItems]);
  const _handlecheckout = async () => {
    setCheckoutModal(false);
    navigate(
      `/tables/pagenumber/${number}/tableid/${activeTableId}/${params?.storeId}`
    );
  };
  const _onCheckOut = async () => {
    setMenuItemDetailModal(true);
  };
  const _goToAddOrder = (tableId, code, isSplit) => {
    navigate(`/addOrder/tableid/${tableId}/code/${code}`, {
      state: { key: isSplit, newId: newId },
    });
  };

  useEffect(() => {
    if (tableOrderItems?.length > 0) {
      getData(tableOrderItems[0]?.code);
    } else {
      setDataBill();
    }
  }, [tableOrderItems]);

  const getData = async (code) => {
    try {
      setDataBill();
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
        url: END_POINT_SEVER + `/v3/bill-group/` + _billId,
        headers: headers,
      });
      setDataBill(_resBill?.data);
    } catch (err) {
      setDataBill();
    }
  };

  // useEffect(() => {
  //   getDataBillSplit();
  // }, [billSplitNewId, billSplitOldId]);
  // const getDataBillSplit = async () => {
  //   try {
  //     const _billsNew = await getBills(`?_id=${billSplitNewId}`);
  //     const _billsOld = await getBills(`?_id=${billSplitOldId}`);
  //     // console.log({ _billsNew, _billsOld });
  //     setDataListBillSplit({ ...dataListBillSplit, _billsNew, _billsOld });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const _orderTableQunatity = async () => {
    try {
      let headers = await getHeaders();

      const updateTable = await axios({
        method: "put",
        url: END_POINT_SEVER + `/v3/orders/update/${seletedOrderItem?._id}`,
        data: {
          quantity: seletedOrderItem?.quantity,
        },
        headers: headers,
      });

      if (updateTable?.status < 300) {
        setQuantity(false);
        reLoadData();
        successAdd(`${t("succes_update_amount")}`);
      }
    } catch (err) {
      errorAdd(`${t("fail_update_amount")}`);
    }
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
        url: END_POINT_SEVER + `/v3/code/update`,
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
        // setSelectedBill();
        getTableDataStore();
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

  const [widthBill80, setWidthBill80] = useState(0);
  // const [widthBillCombine80, setWidthBillCombine80] = useState(0);
  const [widthBill58, setWidthBill58] = useState(0);
  // const [widthBillCombine50, setWidthBillCombine50] = useState(0);

  let qrSmartOrder80Ref = useRef(null);

  let bill80Ref = useRef(null);
  let bill58Ref = useRef(null);
  // let billcombine80Ref = useRef(null);
  // let billcombine50Ref = useRef(null);
  useLayoutEffect(() => {
    setWidthBill80(bill80Ref.current.offsetWidth);
    // setWidthBillCombine80(billcombine80Ref.current.offsetWidth);
    setWidthBill58(bill58Ref.current.offsetWidth);
    // setWidthBillCombine50(billcombine80Ref.current.offsetWidth);
  }, [bill80Ref, bill58Ref]);

  // console.log("bill80Ref", bill80Ref);

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

  const onPrintBill = async () => {
    try {
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
      if (printerBillData?.width === "80mm") {
        dataImageForPrint = await html2canvas(bill80Ref.current, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 530 / widthBill80,
        });
      }

      if (printerBillData?.width === "58mm") {
        dataImageForPrint = await html2canvas(bill58Ref.current, {
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
      bodyFormData.append("ip", printerBillData?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("isdrawer", false);
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
        title: "ປິນສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      });

      // update bill status to call check out
      callCheckOutPrintBillOnly(selectedBill?._id);
      // setSelectedBill();
      getTableDataStore();
      setMenuItemDetailModal(false);
    } catch (err) {
      console.log("err printer", err);
      await Swal.fire({
        icon: "error",
        title: `${t("print_fial")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      return err;
    }
  };

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
          port: "9100",
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
      setCodeShortLink(null);
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
      setCheckedBox(true);
    } else {
      setCheckedBox(false);
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
    setIsCheckedOrderItem(_newOrderItems);
  };

  const handleUpdateOrderStatus = async (status) => {
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
      selectedBill
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

      const count = await getCountOrderWaiting(storeId);
      setCountOrderWaiting(count || 0);
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
      selectedBill
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
        selectedBill
      );
      if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
        reLoadData();
        setCheckedBox(!checkedBox);
        // if (previousStatus === CANCEL_STATUS) getOrderItemsStore(CANCEL_STATUS);
        Swal.fire({
          icon: "success",
          title: `${t("update_order_status_success")}`,
          showConfirmButton: false,
          timer: 2000,
        });

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
          handleMessage();
          setNewOrderTransaction(false);
          setNewOrderUpdateStatusTransaction(false);
        }
      }
    }
  }, [newOrderTransaction, onPrinting, newOrderUpdateStatusTransaction]);

  useEffect(() => {
    if (newTableTransaction) {
      getTableDataStore();
      setNewTableTransaction(false);
    }
  }, [newTableTransaction]);

  // useEffect
  useEffect(() => {
    _calculateTotal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [billOrderItems]);
  // function
  const _calculateTotal = () => {
    // let _total = 0;
    // for (let _data of billOrderItems[0]?.orderId || []) {
    //   // console.log({ _data });
    //   _total +=
    //     (_data?.price + (_data?.totalOptionPrice ?? 0)) * _data?.quantity;
    // }

    const totalBillDefualt = _.sumBy(
      billOrderItems[0]?.orderId?.filter((e) => e?.status === "SERVED"),
      (e) => (e?.price + (e?.totalOptionPrice ?? 0)) * e?.quantity
    );
    if (billOrderItems?.discount > 0) {
      if (
        billOrderItems?.discountType == "LAK" ||
        billOrderItems?.discountType == "MONEY"
      ) {
        setTotalAfterDiscount(totalBillDefualt - billOrderItems?.discount);
      } else {
        const ddiscount = parseInt(
          (totalBillDefualt * billOrderItems?.discount) / 100
        );
        setTotalAfterDiscount(totalBillDefualt - ddiscount);
      }
    } else {
      setTotalAfterDiscount(totalBillDefualt);
    }
    setTotal(totalBillDefualt);
  };

  // console.log("selectedBill[0]", selectedBill[0]);

  return (
    <div
      style={{
        backgroundColor: "#F9F9F9",
        height: "calc(100vh - 66px)",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* popup */}
      <PopUpQRToken
        tableName={selectedBill?.tableName}
        open={popup?.qrToken}
        qr={qrToken}
        storeId={selectedBill?.storeId}
        onClose={() => setPopup()}
      />
      {isbillOrderLoading ? <Loading /> : ""}
      <div>
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
                backgroundColor: "#ff926a",
                padding: "10px",
                color: "#fff",
              }}
            >
              ລາຍການໃບບິນ
            </div>
            <Container style={{ overflowY: "scroll", flexGrow: 1 }}>
              <div style={{ height: 10 }} />
              <Box
                sx={{
                  display: "grid",
                  gap: 6,
                  gridTemplateColumns: {
                    md: "1fr 1fr",
                    sm: "1fr 1fr",
                    xs: "1fr 1fr",
                  },
                }}
              >
                {/* ============================ Child Table ==================== */}
                {tableChild[0]?.billId !== null &&
                  tableChild?.map((table, index) => (
                    <div
                      style={{
                        border:
                          selectedBill?.code === table?.code
                            ? "1px solid #C51605"
                            : "1px solid #FB6E3B",
                        backgroundColor:
                          selectedBill?.code === table?.code
                            ? "#404258"
                            : "#FFF",
                        borderRadius: 8,
                        overflow: "hidden",
                        cursor: "pointer",
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
                            border: "none",
                            borderRadius: 8,
                            background: table?.isStaffConfirm
                              ? "rgba(251,110,15,0.8)"
                              : "white",
                            background: table?.isStaffConfirm
                              ? table?.editBill
                                ? "#CECE5A"
                                : table?.statusBill === "CALL_TO_CHECKOUT"
                                ? "#FFE17B"
                                : "linear-gradient(360deg, rgba(251,110,15,0.8) 0%, rgba(255,102,0,1) 48%, rgba(255,102,10,1) 100%)"
                              : "white",
                            border:
                              selectedBill?.code === table?.code
                                ? "3px solid #C51605"
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
                            // onSelectTable(table);
                            onSelectBill({ ...table, isSplit: false });
                            setDisableBtn(true);
                            setShowBillAfterCheckout(false);
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
                                fontWeight: table?.isStaffConfirm
                                  ? table?.editBill
                                    ? ""
                                    : table?.statusBill === "CALL_TO_CHECKOUT"
                                    ? ""
                                    : "bold"
                                  : "",
                                color: table?.isStaffConfirm
                                  ? table?.editBill
                                    ? "#616161"
                                    : table?.statusBill === "CALL_TO_CHECKOUT"
                                    ? "#616161"
                                    : "white"
                                  : "#616161",
                              }}
                            >
                              <div>{table?.tableName}</div>
                              <div>{table?.code}</div>
                              {/* <div>
                                {table?.isStaffConfirm
                                  ? `${t("unavailable")}`
                                  : `${t("avaliable")}`}
                              </div> */}
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
                              ? "rgba(251,110,15,0.8)"
                              : "white",
                            background: table?.isStaffConfirm
                              ? table?.editBill
                                ? "#bfff00"
                                : "linear-gradient(360deg, rgba(251,110,15,0.8) 0%, rgba(255,146,106,1) 48%, rgba(255,146,106,1) 100%)"
                              : "white",
                            border:
                              selectedBill?.tableName === table?.tableName
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
                              : table.statusBill === "CALL_TO_CHECKOUT"
                            //   ? "blink_cardCallCheckOut"
                          }
                          onClick={() => {
                            // onSelectTable(table);
                            onSelectBill({ ...table, isSplit: false });
                            setDisableBtn(true);
                            setShowBillAfterCheckout(false);
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
                              {/* <div>
                                {table?.isStaffConfirm
                                  ? `${t("unavailable")}`
                                  : `${t("avaliable")}`}
                              </div> */}
                            </span>
                          </div>
                        </div>
                      </Box>
                    </div>
                  ))}

                {listbillSplitAll &&
                  listbillSplitAll?.map((table, index) => (
                    <div
                      style={{
                        border:
                          selectedBill?.code === table?.code
                            ? "1px solid #C51605"
                            : "1px solid #FB6E3B",
                        backgroundColor:
                          selectedBill?.code === table?.code
                            ? "#404258"
                            : "#FFF",
                        borderRadius: 8,
                        overflow: "hidden",
                        cursor: "pointer",
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
                            border: "none",
                            borderRadius: 8,
                            background: table?.isStaffConfirm
                              ? "rgb(251,110,59)"
                              : "white",
                            background: table?.isStaffConfirm
                              ? table?.editBill
                                ? "#CECE5A"
                                : table?.statusBill === "CALL_TO_CHECKOUT"
                                ? "#FFE17B"
                                : "linear-gradient(360deg, rgba(251,110,59,1) 0%, rgba(255,146,106,1) 48%, rgba(255,146,106,1) 100%)"
                              : "white",
                            border:
                              selectedBill?.code === table?.code
                                ? "3px solid #C51605"
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
                            // onSelectTable(table);
                            onSelectBill({ ...table, isSplit: false });
                            setDisableBtn(false);
                            setShowBillAfterCheckout(false);
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
                                // color: table?.staffConfirm
                                //   ? "white"
                                //   : "#616161",
                                // fontWeight: "bold",
                                fontWeight: table?.isStaffConfirm
                                  ? table?.editBill
                                    ? ""
                                    : table?.statusBill === "CALL_TO_CHECKOUT"
                                    ? ""
                                    : "bold"
                                  : "",
                                color: table?.isStaffConfirm
                                  ? table?.editBill
                                    ? "#616161"
                                    : table?.statusBill === "CALL_TO_CHECKOUT"
                                    ? "#616161"
                                    : "white"
                                  : "#616161",
                              }}
                            >
                              <div>{`${t("bill_combine")} ${
                                table?.tableName
                              }`}</div>
                              <div>{table?.code}</div>
                              {/* <div>
                                {table?.isStaffConfirm
                                  ? `${t("unavailable")}`
                                  : `${t("avaliable")}`}
                              </div> */}
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
                              selectedBill?.tableName === table?.tableName
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
                            // onSelectTable(table);
                            onSelectBill({ ...table, isSplit: false });
                            setDisableBtn(false);
                            setShowBillAfterCheckout(false);
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
                              {/* <div>
                                {table?.isStaffConfirm
                                  ? `${t("unavailable")}`
                                  : `${t("avaliable")}`}
                              </div> */}
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
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              minWidth: 600,
              width: 600,
              maxWidth: 600,
              boxShadow: "-1px 0px 10px rgba(0,0,0,0.1)",
              overflow: "hidden",
            }}
          >
            {billOrderItems.length !== 0 && (
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
                    <div style={{ backgroundColor: "#fff", padding: 10 }}>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: "bold",
                          textAlign: "center",
                          padding: 20,
                        }}
                      >
                        <SiAirtable />{" "}
                        {` ${`ໃບບິນ ${billOrderItems[0]?.tableId?.name}`}`}
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                        }}
                      >
                        {t("tableNumber2")}:{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color: COLOR_APP,
                          }}
                        >
                          {billOrderItems[0]?.code}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                        }}
                      >
                        {t("timeOfTableOpening")}:{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color: COLOR_APP,
                          }}
                        >
                          {moment(selectedBill?.createdAt).format("HH:mm A")}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 16,
                        }}
                      >
                        {t("respon")}:{" "}
                        <span
                          style={{
                            fontWeight: "bold",
                            color: COLOR_APP,
                          }}
                        >
                          {`${billOrderItems[0]?.createdBy?.firstname}  ${billOrderItems[0]?.createdBy?.firstname}`}
                        </span>
                      </div>

                      <div
                        style={{
                          fontSize: 16,
                        }}
                      >
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
                        {t("aPriceHasToPay")}:{" "}
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
                              e?.status !== "SERVED" &&
                              e?.status !== "CANCELED" &&
                              e?.status !== "PAID" &&
                              e?.status !== "FEEDBACK"
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
                              e?.status !== "PAID" &&
                              e?.status !== "FEEDBACK"
                          )?.length
                        }{" "}
                        {t("itemNotServed")} !
                      </div>
                      <div>
                        <p style={{ color: COLOR_APP, fontWeight: "bold" }}>
                          {isCheckedOrderItem?.filter(
                            (e) => e?.status == "PAID"
                          )?.length
                            ? ` ${
                                isCheckedOrderItem?.filter(
                                  (e) => e?.status == "PAID"
                                )?.length
                              } ${t("ORDER_PAID")}`
                            : ""}
                        </p>
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
                      <div hidden={!disableBtn}>
                        <ButtonCustom
                          disabled={!disableBtn}
                          onClick={() => _onCheckOut()}
                        >
                          {t("checkout")}
                        </ButtonCustom>
                      </div>
                      <div hidden={disableBtn}>
                        <ButtonCustom
                          disabled={disableBtn}
                          onClick={() =>
                            _goToAddOrder(
                              billOrderItems[0]?.tableId?._id,
                              billOrderItems[0]?.code,
                              billOrderItems?.isBillSplit
                            )
                          }
                        >
                          + {t("addOrder")}
                        </ButtonCustom>
                      </div>
                    </div>
                    <div
                      style={{
                        borderBottom: "1px dashed #ccc",
                        margin: "10px 0",
                      }}
                    />

                    <TableCustom>
                      <thead>
                        <tr>
                          {/* <th>
                              <Checkbox
                                name="checked"
                                onChange={(e) => {
                                  checkAllOrders(e);
                                  setCheckedBox(!e.target.checked);
                                }}
                              />
                            </th> */}
                          <th>{t("no")}</th>
                          <th>{t("menuname")}</th>
                          <th>{t("quantity")}</th>
                          <th>{t("status")}</th>
                          <th>{t("customer")}</th>
                          <th>{t("time")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {billOrderItems[0]?.orderId?.map((orderItem, index) => {
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
                              // onClick={() => handleShowQuantity(orderItem)}
                              key={"order" + index}
                              style={{ borderBottom: "1px solid #eee" }}
                            >
                              {/* <td onClick={(e) => e.stopPropagation()}>
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
                                  </td> */}
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
                                      : orderItem?.status === "PAID"
                                      ? COLOR_APP
                                      : orderItem?.status === "DOING"
                                      ? ""
                                      : "red",
                                }}
                              >
                                {orderItem?.status
                                  ? t(orderStatusTranslate(orderItem?.status))
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
                        })}
                      </tbody>
                    </TableCustom>
                    <div style={{ marginBottom: 100 }} />
                  </div>
                }
              </div>
            )}
          </Box>
        </Box>
      </div>
      {/* <div style={{ width: "80mm", padding: 10 }} ref={bill80Ref}>
        <BillForCheckOut80
          storeDetail={storeDetail}
          selectedBill={billOrderItems[0]}
          dataBill={billOrderItems[0]}
          taxPercent={taxPercent}
          profile={profile}
        />
      </div> */}
      <div style={{ width: "80mm", padding: 10 }} ref={bill80Ref}>
        <BillForCheckOutCombine80
          storeDetail={storeDetail}
          selectedBill={billOrderItems[0]}
          dataBill={billOrderItems[0]}
          taxPercent={taxPercent}
          profile={profile}
        />
      </div>
      <div style={{ width: "80mm", padding: 10 }} ref={qrSmartOrder80Ref}>
        {/* <BillQRSmartOrdering80
          storeId={storeDetail?._id}
          TokenOfBill={tokenForSmartOrder}
          tableName={selectedBill?.tableName}
        /> */}
        <BillQRShortSmartOrdering80
          tableName={selectedBill?.tableName}
          CodeShortLink={codeShortLink}
        />
      </div>
      <div style={{ width: "58mm", padding: 10 }} ref={bill58Ref}>
        <BillForCheckOut58
          storeDetail={storeDetail}
          selectedBill={billOrderItems[0]}
          // dataBill={selectNewTable}
          taxPercent={taxPercent}
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
                selectedBill={selectedBill}
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
                selectedBill={selectedBill}
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
                  selectedBill={selectedBill}
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
                selectedBill={selectedBill}
                selectedMenu={items}
                table={{ tableId: { name: selectedBill?.tableName } }}
              />
            </div>
          </div>
        ))}
      </div>

      <CheckOutPopup
        onPrintBill={onPrintBill}
        onPrintDrawer={onPrintDrawer}
        dataBill={billOrderItems[0]}
        tableData={billOrderItems[0]}
        open={popup?.CheckOutType}
        onClose={() => setPopup()}
        setDataBill={setDataBill}
        taxPercent={taxPercent}
        newId={newId}
        oldId={tableChild[0]?._id}
        setshowBillAfterCheckout={setShowBillAfterCheckout}
      />

      <OrderCheckOut
        staffData={userData}
        data={billOrderItems[0]}
        setDataBill={setDataBill}
        onPrintBill={onPrintBill}
        tableData={billOrderItems[0]}
        show={menuItemDetailModal}
        resetTableOrder={resetTableOrder}
        hide={() => setMenuItemDetailModal(false)}
        taxPercent={taxPercent}
        onSubmit={() => {
          setMenuItemDetailModal(false);
          setPopup({ CheckOutType: true });
        }}
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
  margin: 10,
  width: "100%",
  fontSize: 15,
  "th,td": {
    padding: 8,
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
