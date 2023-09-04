import React, { useEffect, useState, useRef, useLayoutEffect } from "react";
import { Modal, Form, Container, Button, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";

import moment from "moment";
import { QRCode } from "react-qrcode-logo";
import axios from "axios";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import { Checkbox } from "@material-ui/core";
import Box from "../../components/Box";

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
import CheckOutType from "./components/CheckOutType";

/**
 * const
 **/
import { COLOR_APP } from "../../constants/index";
import { useStore } from "../../store";
import { END_POINT_SEVER, END_POINT_WEB_CLIENT } from "../../constants/api";
import { successAdd, errorAdd, warningAlert } from "../../helpers/sweetalert";
import { getHeaders } from "../../services/auth";
import { useNavigate, useParams } from "react-router-dom";
import { getBills } from "../../services/bill";
// import _ from "lodash";
import { updateOrderItem } from "../../services/order";
import styled from "styled-components";
import { getCodes } from "../../services/code";
import PopUpAddDiscount from "../../components/popup/PopUpAddDiscount";
import { useTranslation } from "react-i18next";
import PopupOpenTable from "../../components/popup/PopupOpenTable";

export default function TableList() {
  const navigate = useNavigate();
  const params = useParams();
  const number = params?.number;
  const activeTableId = params?.tableId;
  const { t } = useTranslation();

  // state
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [popup, setPopup] = useState({
    CheckOutType: false,
  });
  const [mobileMode, setMobileMode] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleClose1 = () => setShow1(false);
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

  const handleCloseQuantity = () => setQuantity(false);
  const handleShowQuantity = (item) => {
    // _orderTableQunatity(item)
    setSeletedOrderItem(item);
    setQuantity(true);
  };

  const { printerCounter, printers } = useStore();
  // provider
  const {
    isTableOrderLoading,
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
    getTableOrders,
    newTableTransaction,
    setNewTableTransaction,
    newOrderTransaction,
    setNewOrderTransaction,
    newOrderUpdateStatusTransaction,
    setNewOrderUpdateStatusTransaction,
    getTableDataStoreList,
    setPrintNowList,
  } = useStore();

  const reLoadData = () => {
    setReload(true);
  };
  useEffect(() => {
    if (reload) {
      getTableOrders(selectedTable);
      setReload(false);
      // orderSound();
    }
  }, [reload]);

  const [isCheckedOrderItem, setIsCheckedOrderItem] = useState([]);
  const [seletedOrderItem, setSeletedOrderItem] = useState();
  const [seletedCancelOrderItem, setSeletedCancelOrderItem] = useState("");
  const [checkedBox, setCheckedBox] = useState(true);

  // function handleSetQuantity(int, seletedOrderItem) {
  //   let _data = seletedOrderItem?.quantity + int
  //   setSeletedOrderItem(_data)
  // }
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
    // initialTableSocket();
    // getTableDataStoreList();
    getTableDataStore();
  }, []);

  /**
   * Modify Order Status
   */
  useEffect(() => {
    setIsCheckedOrderItem([...tableOrderItems]);
  }, [selectedTable, tableOrderItems]);
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
  const _goToAddOrder = (tableId, code) => {
    navigate(`/addOrder/tableid/${tableId}/code/${code}`);
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
        successAdd("ແກ້ໄຂຈຳນວນສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ແກ້ໄຂຈຳນວນບໍ່ສຳເລັດ");
    }
  };

  const [selectNewTable, setSelectNewTable] = useState();

  const _changeTable = async () => {
    if (!selectNewTable) {
      handleClose();
      await Swal.fire({
        icon: "warning",
        title: "ກະລຸນາເລືອກໂຕະ",
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
        url: END_POINT_SEVER + `/v3/bill-transfer`,
        data: {
          billOld: _billIdOld,
          billNew: _billIdNew ?? "NOT_BILL",
          codeId: _codeIdNew,
        },
        headers: headers,
      });
      if (changTable?.status === 200) {
        handleClose();
        setSelectedTable();
        getTableDataStore();
        await Swal.fire({
          icon: "success",
          title: "ການປ່ຽນໂຕະສໍາເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "ການປ່ຽນໂຕະບໍ່ສໍາເລັດ",
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
        warningAlert("ບໍ່ສາມາດປິດໂຕະໄດ້ເພາະມີການໃຊ້ງານ...!");
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
        setSelectedTable();
        getTableDataStore();
        successAdd("ການປິດໂຕະສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ການປິດໂຕະບໍ່ສຳເລັດ");
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

  let bill80Ref = useRef(null);
  let bill58Ref = useRef(null);
  useLayoutEffect(() => {
    setWidthBill80(bill80Ref.current.offsetWidth);
    setWidthBill58(bill58Ref.current.offsetWidth);
  }, [bill80Ref, bill58Ref]);

  const onPrintBill = async () => {
    try {
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
        urlForPrinter = "http://localhost:9150/ethernet/image";
      }
      if (printerBillData?.type === "BLUETOOTH") {
        urlForPrinter = "http://localhost:9150/bluetooth/image";
      }
      if (printerBillData?.type === "USB") {
        urlForPrinter = "http://localhost:9150/usb/image";
      }

      const _file = await base64ToBlob(dataImageForPrint.toDataURL());
      var bodyFormData = new FormData();
      bodyFormData.append("ip", printerBillData?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", _file);
      bodyFormData.append("beep1", 1);
      bodyFormData.append("beep2", 9);

      await axios({
        method: "post",
        url: urlForPrinter,
        data: bodyFormData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      await Swal.fire({
        icon: "success",
        title: "ປິນສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (err) {
      console.log(err);
      await Swal.fire({
        icon: "error",
        title: "ປິນບໍ່ສຳເລັດ",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const arrLength = isCheckedOrderItem?.filter((e) => e?.isChecked).length;

  const billForCher80 = useRef([]);
  const billForCher58 = useRef([]);

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
  const [onPrinting, setOnPrinting] = useState(false);
  const onPrintForCher = async () => {
    setOnPrinting(true);
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
          urlForPrinter = "http://localhost:9150/ethernet/image";
        }
        if (_printer?.type === "BLUETOOTH") {
          urlForPrinter = "http://localhost:9150/bluetooth/image";
        }
        if (_printer?.type === "USB") {
          urlForPrinter = "http://localhost:9150/usb/image";
        }
        // const _image64 = await resizeImage(dataUrl.toDataURL(), 300, 500);

        const _file = await base64ToBlob(dataUrl.toDataURL());
        var bodyFormData = new FormData();
        bodyFormData.append("ip", _printer?.ip);
        bodyFormData.append("port", "9100");
        bodyFormData.append("image", _file);
        if (_index === 0) {
          bodyFormData.append("beep1", 1);
          bodyFormData.append("beep2", 9);
        }
        await axios({
          method: "post",
          url: urlForPrinter,
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (_index === 0) {
          await Swal.fire({
            icon: "success",
            title: "ປິ້ນສຳເລັດ",
            showConfirmButton: false,
            timer: 1500,
          });
        }
      } catch (err) {
        console.log(err);
        if (_index === 0) {
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
    let _resOrderUpdate = await updateOrderItem(_updateItems, storeId, menuId);
    if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
      reLoadData();
      setCheckedBox(!checkedBox);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
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
    let _resOrderUpdate = await updateOrderItem(_updateItems, storeId, menuId);
    if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
      reLoadData();
      setCheckedBox(!checkedBox);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
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
          // remark: seletedCancelOrderItem
        };
      });
    let _resOrderUpdate = await updateOrderItem(
      _updateItems,
      storeId,
      menuId,
      seletedCancelOrderItem
    );
    if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
      handleClose1();
      reLoadData();
      setCheckedBox(!checkedBox);
      // if (previousStatus === CANCEL_STATUS) getOrderItemsStore(CANCEL_STATUS);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
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
  // useEffect(() => {
  //   if (!onPrinting) {
  //     if (newOrderTransaction || newOrderUpdateStatusTransaction) {
  //       handleMessage();
  //       setNewOrderTransaction(false);
  //       setNewOrderUpdateStatusTransaction(false);
  //     }
  //   }
  // }, [onPrinting]);

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
  }, [dataBill]);
  // function
  const _calculateTotal = () => {
    let _total = 0;
    for (let _data of dataBill?.orderId || []) {
      _total += _data?.quantity * _data?.price;
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
  return (
    <div
      style={{
        backgroundColor: "#F9F9F9",
        height: "calc(100vh - 66px)",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {isTableOrderLoading ? <Loading /> : ""}
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
            <div style={{ backgroundColor: "#ff926a", padding: "10px" }}>
              {t("totalTable")} : {tableList?.length},{" "}
              {t("totalUnavailableTable")} : {_checkStatusCode(tableList)},{" "}
              {t("totalAvailableTable")} : {_checkStatusCodeA(tableList)},{" "}
              {t("totalBillCheck")} : {_checkStatusCodeB(tableList)}
            </div>
            <Container style={{ overflowY: "scroll", flexGrow: 1 }}>
              <div style={{ height: 10 }} />
              <Box
                sx={{
                  display: "grid",
                  gap: 5,
                  gridTemplateColumns: {
                    md: "1fr 1fr 1fr 1fr",
                    sm: "1fr 1fr 1fr",
                    xs: "1fr 1fr",
                  },
                }}
              >
                {tableList &&
                  tableList?.map((table, index) => (
                    <div
                      style={{
                        border:
                          selectedTable?.tableName === table?.tableName
                            ? "1px solid #404258"
                            : "1px solid #FB6E3B",
                        backgroundColor:
                          selectedTable?.tableName === table?.tableName
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
                              : table.statusBill === "CALL_TO_CHECKOUT"
                              ? "blink_cardCallCheckOut"
                              : ""
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
                              : table.statusBill === "CALL_TO_CHECKOUT"
                              ? "blink_cardCallCheckOut"
                              : ""
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
          <Box
            sx={{
              display: { xs: "none", sm: "block" },
              minWidth: 420,
              width: 420,
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
                          {t("tableNumber2")}:{" "}
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
                          {t("timeOfTableOpening")}:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: COLOR_APP,
                            }}
                          >
                            {moment(selectedTable?.createdAt).format("HH:mm A")}
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
                            {dataBill?.orderId[0]?.updatedBy?.firstname &&
                            dataBill?.orderId[0]?.updatedBy?.lastname
                              ? dataBill?.orderId[0]?.updatedBy?.firstname +
                                " " +
                                dataBill?.orderId[0]?.updatedBy?.lastname
                              : ""}
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
                              : t("lak")}
                          </span>
                        </div>

                        <div
                          style={{
                            fontSize: 16,
                          }}
                        >
                          ຍອດບິນ:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: COLOR_APP,
                            }}
                          >
                            {moneyCurrency(total)} ກີບ
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                          }}
                        >
                          ຍອດທີຕ້ອງຊຳລະ:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: COLOR_APP,
                            }}
                          >
                            {moneyCurrency(totalAfterDiscount)} ກີບ
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
                          ອໍເດີຍັງບໍ່ທັນເສີບ !
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
                          onClick={() => onPrintForCher()}
                          disabled={onPrinting}
                        >
                          {onPrinting && (
                            <Spinner animation="border" size="sm" />
                          )}
                          {t("printBillToKitchen")}
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => _openModalSetting(selectedTable)}
                        >
                          {/* <FontAwesomeIcon
                              icon={faWindowClose}
                              style={{ color: "#fff", marginRight: 10 }}
                            /> */}
                          {t("closeTable")}
                        </ButtonCustom>
                        <ButtonCustom onClick={handleShow}>ລວມໂຕະ</ButtonCustom>
                        <ButtonCustom
                          onClick={() => {
                            // _onAddDiscount();
                            setPopup({ discount: true });
                          }}
                        >
                          {t("discount")}
                        </ButtonCustom>

                        <ButtonCustom
                          disabled={!canCheckOut}
                          onClick={() => _onCheckOut()}
                        >
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
                        hidden={checkedBox}
                      >
                        <ButtonCustom
                          onClick={() => handleShow1()}
                          disabled={checkedBox}
                        >
                          {t("cancel")}
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => handleUpdateOrderStatusgo("DOING")}
                          disabled={checkedBox}
                        >
                          {t("sendToKitchen")}
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => handleUpdateOrderStatus("SERVED")}
                          disabled={checkedBox}
                        >
                          {t("served")}
                        </ButtonCustom>
                      </div>

                      <TableCustom>
                        <thead>
                          <tr>
                            <th>
                              <Checkbox
                                name="checked"
                                onChange={(e) => {
                                  checkAllOrders(e);
                                  setCheckedBox(!e.target.checked);
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
                            ? isCheckedOrderItem?.map((orderItem, index) => (
                                <tr
                                  onClick={() => handleShowQuantity(orderItem)}
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
                                        // e.stopPropagation()
                                        onSelect({
                                          ...orderItem,
                                          isChecked: e.target.checked,
                                        });
                                      }}
                                    />
                                  </td>

                                  <td>{index + 1}</td>
                                  <td>{orderItem?.name}</td>
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
                                      ? orderStatus(orderItem?.status)
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
                              ))
                            : ""}
                        </tbody>
                      </TableCustom>
                      {tableOrderItems?.length === 0 && (
                        <div className="text-center">
                          <div style={{ marginTop: 50, fontSize: 50 }}>
                            {" "}
                            {t("TableHasNoOrder")}
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
                  {t("bringThisQRCodeToCustomersOrPressOpenToStartUsing")}
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
                  ເລືອກໂຕະເພື່ອເບິ່ງອໍເດີ
                </p>
              </div>
            )}
          </Box>
        </Box>
      </div>
      <div style={{ width: "80mm", padding: 10 }} ref={bill80Ref}>
        <BillForCheckOut80
          storeDetail={storeDetail}
          selectedTable={selectedTable}
          dataBill={dataBill}
        />
      </div>
      <div style={{ width: "58mm", padding: 10 }} ref={bill58Ref}>
        <BillForCheckOut58
          storeDetail={storeDetail}
          selectedTable={selectedTable}
          dataBill={dataBill}
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
      <div>
        {isCheckedOrderItem
          ?.filter((e) => e?.isChecked)
          .map((val, i) => {
            return (
              <div
                style={{ width: "80mm", padding: 10 }}
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

      <CheckOutType
        dataBill={dataBill}
        tableData={selectedTable}
        open={popup?.CheckOutType}
        onClose={() => setPopup()}
      />

      <OrderCheckOut
        data={dataBill}
        onPrintBill={onPrintBill}
        tableData={selectedTable}
        show={menuItemDetailModal}
        resetTableOrder={resetTableOrder}
        hide={() => setMenuItemDetailModal(false)}
        onSubmit={() => {
          setMenuItemDetailModal(false);
          setPopup({ CheckOutType: true });
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
          handleMessage();
          getData();
        }}
      />
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ລວມໂຕະ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Form.Label>ຍ້າຍຈາກໂຕະ : {selectedTable?.tableName}</Form.Label>
            <div style={{ height: 10 }}></div>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>ໄປຫາໂຕະ : </Form.Label>
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
                  ເລືອກໂຕະ
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
                    ໂຕະ {item?.tableName}
                  </option>
                ))}
              </select>
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleClose()}>
            ຍົກເລີກ
          </Button>
          <Button variant="success" onClick={() => _changeTable()}>
            ລວມໂຕະ
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>ເຫດຜົນຍົກເລີກອາຫານ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <select
              size="8"
              style={{ overflow: "auto", border: "none", fontSize: "20px" }}
              className="form-control"
              onChange={handleSelectedCancelOrder}
            >
              {/* value={seletedCancelOrderItem?.remark} */}
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                ເສີບອາຫານຜິດໂຕະ
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                ລູກຄ້າຍົກເລີກ
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                ຄົວເຮັດອາຫານຜິດ
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                ພະນັກງານເສີບ ຄີອາຫານຜິດ
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                ອາຫານດົນ
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                ອາຫານໝົດ
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                drinkIsGone
              </option>
              <option
                style={{ borderBottom: "1px #ccc solid", padding: "10px 0" }}
              >
                ບໍ່ມີອາຫານໃນໂຕະ
              </option>
            </select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleClose1()}>
            ຍົກເລີກ
          </Button>
          <Button
            variant="success"
            onClick={() => handleUpdateOrderStatuscancel("CANCELED")}
          >
            ບັນທຶກ
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={quantity} onHide={handleCloseQuantity}>
        <Modal.Header closeButton>
          <Modal.Title>ແກ້ໄຂຈຳນວນ</Modal.Title>
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
                  <td>{seletedOrderItem?.name}</td>
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
                {/* {isCheckedOrderItem
                  ? isCheckedOrderItem?.map((orderItem, index) => (
                    <tr
                      key={"order" + index}
                      style={{ borderBottom: "1px solid #eee" }}
                    >

                      <td>{orderItem?.tableId?.name}</td>
                      <td>{orderItem?.name}</td>
                      <td style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <button style={{ color: "blue", border: "none", width: 25 }} onClick={() => handleSetQuantity(-1, orderItem)}>-</button>
                        {orderItem?.quantity}
                        <button style={{ color: "red", border: "none", width: 25 }} onClick={() => handleSetQuantity(1, orderItem)}>+</button>
                      </td>
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
                          ? orderStatus(orderItem?.status)
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
                  ))
                  : ""} */}
              </tbody>
            </TableCustom>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => handleCloseQuantity()}>
            ຍົກເລີກ
          </Button>
          <Button
            variant="success"
            onClick={() => {
              _orderTableQunatity();
            }}
          >
            ບັນທຶກ
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={openModalSetting} onHide={() => setOpenModalSetting(false)}>
        <Modal.Header closeButton>
          <Modal.Title>ຕັ້ງຄ່າໂຕະ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            ທ່ານຕ້ອງການປິດໂຕະ {dataSettingModal?.tableName} ນີ້ບໍ ?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setOpenModalSetting(false)}>
            ຍົກເລີກ
          </Button>
          <Button variant="success" onClick={() => _resetTable()}>
            ປິດໂຕະ
          </Button>
        </Modal.Footer>
      </Modal>
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
  ["th,td"]: {
    padding: 0,
  },
  ["th:first-child"]: {
    maxWidth: 40,
    width: 40,
  },
  ["td:first-child"]: {
    maxWidth: 40,
    width: 40,
  },
  thead: {
    backgroundColor: "#e9e9e9",
  },
});
