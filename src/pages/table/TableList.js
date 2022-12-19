import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useLayoutEffect,
} from "react";
import {
  Row,
  Modal,
  Form,
  Container,
  Button,
  Nav,
  Col,
  Table,
} from "react-bootstrap";
import Swal from "sweetalert2";

import moment from "moment";
import { QRCode } from "react-qrcode-logo";
import axios from "axios";
import html2canvas from "html2canvas";
import { base64ToBlob } from "../../helpers";
import { Checkbox, FormControlLabel } from "@material-ui/core";
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
import { STORE } from "../../constants/api";
import { socket } from "../../services/socket";
import BillForCheckOut80 from "../../components/bill/BillForCheckOut80";
import BillForCheckOut58 from "../../components/bill/BillForCheckOut58";
import BillForChef80 from "../../components/bill/BillForChef80";
import BillForChef58 from "../../components/bill/BillForChef58";
import CheckOutType from "./components/CheckOutType";

/**
 * const
 **/
import {
  padding_white,
  CANCEL_STATUS,
  DOING_STATUS,
  SERVE_STATUS,
  COLOR_APP,
} from "../../constants/index";
import { useStore } from "../../store";
import { END_POINT_SEVER } from "../../constants/api";
import { successAdd, errorAdd, warningAlert } from "../../helpers/sweetalert";
import { getHeaders } from "../../services/auth";
import { useNavigate, useParams } from "react-router-dom";
import { getBills } from "../../services/bill";
import _ from "lodash";
import { updateOrderItem } from "../../services/order";
import styled from "styled-components";

export default function TableList() {
  const navigate = useNavigate();
  const params = useParams();
  const number = params?.number;
  const activeTableId = params?.tableId;

  // state
  const [show, setShow] = useState(false);
  const [popup, setPopup] = useState({
    CheckOutType: false,
  });
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [openModalSetting, setOpenModalSetting] = useState(false);
  const [dataSettingModal, setDataSettingModal] = useState();
  const [feedbackOrderModal, setFeedbackOrderModal] = useState(false);

  const [checkoutModel, setCheckoutModal] = useState(false);
  const [menuItemDetailModal, setMenuItemDetailModal] = useState(false);
  const [CheckStatus, setCheckStatus] = useState();
  const [CheckStatusCancel, setCheckStatusCancel] = useState();
  const [dataBill, setDataBill] = useState();
  const [modalAddDiscount, setModalAddDiscount] = useState(false);
  const [reload, setReload] = useState(false);

  const {
    orderItems,
    setOrderItems,
    getOrderItemsStore,
    printerCounter,
    printers,
    orderSound,
  } = useStore();

  // const [ref , setRef] = useRef();

  /**
   * useState
   */

  const {
    isTableOrderLoading,
    orderItemForPrintBill,
    tableList,
    setTableList,
    selectedTable,
    setSelectedTable,
    openTable,
    tableOrderItems,
    getTableDataStore,
    onSelectTable,
    resetTableOrder,
    initialTableSocket,
    storeDetail,
    getTableOrders,
  } = useStore();

  const reLoadData = () => {
    setReload(true);
    // const _selectedTable = selectedTable;
    // await resetTableOrder();
    // onSelect(_selectedTable);
  };
  useEffect(() => {
    if (reload) {
      getTableOrders(selectedTable);
      setReload(false);
      orderSound();
    }
  }, [reload]);

  const [isCheckedOrderItem, setIsCheckedOrderItem] = useState([]);

  const canCheckOut = !tableOrderItems.find(
    (e) =>
      e?.status === "DOING" ||
      e?.status === "WAITING" ||
      e?.tableOrderItems?.length == 0
  )?._id;

  useEffect(() => {
    initialTableSocket();
    getTableDataStore();
  }, []);
  /**
   * Modify Order Status
   */
  useEffect(() => {
    setIsCheckedOrderItem([...tableOrderItems]);
  }, [selectedTable, tableOrderItems]);
  useEffect(() => {
    if (!tableOrderItems) return;
    let _tableOrderItems = [...tableOrderItems];
    let _checkDataStatus = [];
    let _checkDataStatusCancel = [];
    _tableOrderItems.map((nData) => {
      if (nData.status === "SERVED") _checkDataStatus.push(nData?.status);
      if (nData.status === "CANCELED")
        _checkDataStatusCancel.push(nData?.status);
    });
    setCheckStatusCancel(_checkDataStatusCancel);
    setCheckStatus(_checkDataStatus);
  }, [tableOrderItems]);
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
  };

  const [codeTableNew, setCodeTableNew] = useState();

  const _changeTable = async () => {
    if (!codeTableNew) {
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
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const changTable = await axios({
        method: "put",
        url: END_POINT_SEVER + `/v3/bill-transfer`,
        data: {
          codeTableOld: selectedTable?.code,
          codeTableNew: codeTableNew,
        },
        headers: headers,
      });
      if (changTable?.status === 200) {
        handleClose();
        setSelectedTable();
        setTableList(changTable?.data);
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
            isOpened: "false",
            isStaffConfirm: "false",
          },
        },
        headers: headers,
      });
      setOpenModalSetting(false);
      if (updateTable.status < 300) {
        setSelectedTable();
        getTableDataStore();
        // setTableList(updateTable?.data);
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
      const _printerCounters = JSON.parse(printerCounter?.prints);
      const printerBillData = printers?.find(
        (e) => e?._id === _printerCounters?.BILL
      );
      let dataImageForPrint;
      if (printerBillData?.width == "80mm") {
        dataImageForPrint = await html2canvas(bill80Ref.current, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 530 / widthBill80,
        });
      }

      if (printerBillData?.width == "58mm") {
        dataImageForPrint = await html2canvas(bill58Ref.current, {
          useCORS: true,
          scrollX: 10,
          scrollY: 0,
          scale: 350 / widthBill58,
        });
      }

      const _file = await base64ToBlob(dataImageForPrint.toDataURL());
      var bodyFormData = new FormData();
      bodyFormData.append("ip", printerBillData?.ip);
      bodyFormData.append("port", "9100");
      bodyFormData.append("image", _file);

      await axios({
        method: "post",
        url: "http://localhost:9150/ethernet/image",
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
  const onPrintForCher = async () => {
    const orderSelect = isCheckedOrderItem?.filter((e) => e?.isChecked);
    let _index = 0;
    for (const _ref of billForCher80.current) {
      // console.log("orderSelect?.[_index]", orderSelect?.[_index]);
      const _printer = printers.find((e) => {
        // console.log(`${e?._id} == ${orderSelect?.[_index]?._id}`)
        return e?._id == orderSelect?.[_index]?.printer;
      });

      try {
        let dataUrl;
        if (_printer?.width == "80mm") {
          dataUrl = await html2canvas(billForCher80.current[_index], {
            useCORS: true,
            scrollX: 10,
            scrollY: 0,
            scale: 530 / widthBill80,
          });
        }
        if (_printer?.width == "58mm") {
          dataUrl = await html2canvas(billForCher58.current[_index], {
            useCORS: true,
            scrollX: 10,
            scrollY: 0,
            scale: 350 / widthBill58,
          });
        }

        // const _image64 = await resizeImage(dataUrl.toDataURL(), 300, 500);

        const _file = await base64ToBlob(dataUrl.toDataURL());
        var bodyFormData = new FormData();
        bodyFormData.append("ip", _printer?.ip);
        bodyFormData.append("port", "9100");
        bodyFormData.append("image", _file);
        await axios({
          method: "post",
          url: "http://localhost:9150/ethernet/image",
          data: bodyFormData,
          headers: { "Content-Type": "multipart/form-data" },
        });
        await Swal.fire({
          icon: "success",
          title: "ປິ້ນສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
      } catch (err) {
        console.log(err);
        await Swal.fire({
          icon: "error",
          title: "ປິ້ນບໍ່ສຳເລັດ",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      _index++;
    }
  };

  const onSelect = (data) => {
    if (isCheckedOrderItem?.length == 0) {
      const _data = tableOrderItems.map((e) => {
        if (data?._id === e?._id) {
          return data;
        } else {
          return e;
        }
      });
      setIsCheckedOrderItem(_data);
    } else {
      const _data = isCheckedOrderItem.map((e) => {
        if (data?._id === e?._id) {
          return data;
        } else {
          return e;
        }
      });
      setIsCheckedOrderItem(_data);
    }
  };

  const checkAllOrders = (item) => {
    let _newOrderItems = [];
    if (item?.target?.checked) {
      _newOrderItems = tableOrderItems.map((item) => {
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
    console.log("first", _newOrderItems);
    setIsCheckedOrderItem(_newOrderItems);
  };

  const handleUpdateOrderStatus = async (status) => {
    // getOrderItemsStore(SERVE_STATUS);
    const storeId = storeDetail?._id;
    let previousStatus = orderItems[0].status;
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
    if (_resOrderUpdate?.data?.message == "UPADTE_ORDER_SECCESS") {
      if (previousStatus == SERVE_STATUS) getOrderItemsStore(SERVE_STATUS);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
      // onSelectTable(selectedTable);
    }
  };

  const handleUpdateOrderStatusgo = async (status) => {
    // getOrderItemsStore(DOING_STATUS);
    const storeId = storeDetail?._id;
    let previousStatus = orderItems[0].status;
    let menuId;
    let _updateItems = isCheckedOrderItem
      ?.filter((e) => e?.isChecked)
      .map((i) => {
        console.log(i?._id);
        return {
          status: status,
          _id: i?._id,
          menuId: i?.menuId,
        };
      });
    let _resOrderUpdate = await updateOrderItem(_updateItems, storeId, menuId);
    if (_resOrderUpdate?.data?.message == "UPADTE_ORDER_SECCESS") {
      if (previousStatus == DOING_STATUS) getOrderItemsStore(DOING_STATUS);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
      // onSelectTable(selectedTable);
    }
  };

  const handleUpdateOrderStatuscancel = async (status) => {
    // getOrderItemsStore(CANCEL_STATUS);
    const storeId = storeDetail?._id;
    let previousStatus = orderItems[0].status;
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
    if (_resOrderUpdate?.data?.message == "UPADTE_ORDER_SECCESS") {
      if (previousStatus == CANCEL_STATUS) getOrderItemsStore(CANCEL_STATUS);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
      // onSelectTable(selectedTable);
    }
  };

  //   const handleCheckbox = async (order) => {
  //     let _orderItems = [...orderItems]
  //     let _newOrderItems = _orderItems.map((item) => {
  //         if (item._id == order._id) {
  //             return {
  //                 ...item,
  //                 isChecked: !item.isChecked
  //             }
  //         } else return item
  //     })
  //     let _orderItemForPrint = []
  //     for (let i = 0; i < _newOrderItems?.length; i++){
  //         if (_newOrderItems[i]?.isChecked === true) _orderItemForPrint.push(_newOrderItems[i])
  //     }
  //     setorderItemForPrintBillSelect(_orderItemForPrint)
  //     setOrderItems(_newOrderItems)
  // };

  useMemo(
    () =>
      socket.on(`ORDER:${storeDetail._id}`, (data) => {
        reLoadData();
      }),
    [storeDetail._id]
  );
  useMemo(() => {
    socket.on(`ORDER_UPDATE_STATUS:${storeDetail._id}`, (data) => {
      reLoadData();
    });
  }, [storeDetail._id]);
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
              ໂຕະທັງໝົດ : {tableList?.length}, ໂຕະທີ່ເປິດທັງໝົດ :{" "}
              {_checkStatusCode(tableList)}, ໂຕະທີ່ຫວ່າງທັງໝົດ :{" "}
              {_checkStatusCodeA(tableList)}, ຕອ້ງການເຊັກບີນທັງໝົດ :{" "}
              {_checkStatusCodeB(tableList)}
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
                  tableList.map((table, index) => (
                    <div
                      style={{
                        border:
                          selectedTable?.tableName == table?.tableName
                            ? "1px solid #404258"
                            : "1px solid #FB6E3B",
                        backgroundColor:
                          selectedTable?.tableName == table?.tableName
                            ? "#404258"
                            : "#FFF",
                        borderRadius: 8,
                        overflow: "hidden",
                        cursor: "pointer",
                      }}
                      key={"table" + index}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          borderRadius: 8,
                          // backgroundColor: table?.isStaffConfirm
                          //   ? "#FB6E3B"
                          //   : "white",
                          background: table?.isStaffConfirm
                            ? "rgb(251,110,59)"
                            : "white",
                          background: table?.isStaffConfirm
                            ? "linear-gradient(360deg, rgba(251,110,59,1) 0%, rgba(255,146,106,1) 48%, rgba(255,146,106,1) 100%)"
                            : "white",
                          border:
                            selectedTable?.tableName == table?.tableName
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
                          // console.log("selectTableData", table);
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
                              color: table?.staffConfirm ? "white" : "#616161",
                              fontWeight: "bold",
                            }}
                          >
                            <div>{table?.tableName}</div>
                            <div>{table?.code}</div>
                            <div>
                              {table?.isStaffConfirm ? "ມິແຂກ" : "ວ່າງ"}
                            </div>
                          </span>
                        </div>
                      </div>
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
                          ລະຫັດເຂົ້າໂຕະ:{" "}
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
                          ເວລາເປີດໂຕະ:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: COLOR_APP,
                            }}
                          >
                            {moment(selectedTable?.updatedAt).format("HH:mm A")}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: 16,
                          }}
                        >
                          ຜູ້ຮັບຜິດຊອບ:{" "}
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
                          ມີສ່ວນຫຼຸດ:{" "}
                          <span
                            style={{
                              fontWeight: "bold",
                              color: COLOR_APP,
                            }}
                          >
                            {moneyCurrency(dataBill?.discount)}{" "}
                            {dataBill?.discountType === "PERCENT" ? "%" : "ກີບ"}
                          </span>
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
                        <ButtonCustom onClick={() => onPrintForCher()}>
                          ພິມບິນໄປຄົວ
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => _openModalSetting(selectedTable)}
                        >
                          {/* <FontAwesomeIcon
                              icon={faWindowClose}
                              style={{ color: "#fff", marginRight: 10 }}
                            /> */}
                          ປິດໂຕະ
                        </ButtonCustom>
                        <ButtonCustom onClick={handleShow}>ລວມໂຕະ</ButtonCustom>
                        <ButtonCustom
                          onClick={() => {
                            /*_onAddDiscount()*/
                          }}
                        >
                          ເພີ່ມສ່ວນຫຼຸດ
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
                          + ເພີ່ມອໍເດີ
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
                      >
                        <ButtonCustom
                          onClick={() =>
                            handleUpdateOrderStatuscancel("CANCEL")
                          }
                        >
                          ຍົກເລີກ
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => handleUpdateOrderStatusgo("DOING")}
                        >
                          ສົ່ງໄປຄົວ
                        </ButtonCustom>
                        <ButtonCustom
                          onClick={() => handleUpdateOrderStatus("SERVED")}
                        >
                          ເສີບແລ້ວ
                        </ButtonCustom>
                      </div>

                      {/* <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => setFeedbackOrderModal(true)}>ສົ່ງຄືນ</Button> */}
                      {/* <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(CANCEL_STATUS, params?.storeId)}>ຍົກເລີກ</Button>
                    <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(DOING_STATUS, params?.storeId)}>ສົ່ງໄປຄົວ</Button>
                    <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(SERVE_STATUS, params?.storeId)}>ເສີບແລ້ວ</Button> */}

                      <TableCustom>
                        <thead>
                          <tr>
                            <th>
                              <Checkbox
                                name="checked"
                                onChange={(e) => checkAllOrders(e)}
                              />
                            </th>
                            <th>ລຳດັບ</th>
                            <th>ຊື່ເມນູ</th>
                            <th>ຈຳນວນ</th>
                            <th>ສະຖານະ</th>
                            <th>ຜູ້ສັ່ງ</th>
                            <th>ເວລາ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {isCheckedOrderItem
                            ? isCheckedOrderItem?.map((orderItem, index) => (
                                <tr
                                  key={"order" + index}
                                  style={{ borderBottom: "1px solid #eee" }}
                                >
                                  {/* <td style={{ border: "none" }}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 50 }}>
                              <Checkbox
                                checked={orderItem?.isChecked ? true : false}
                                onChange={(e) => onChangeMenuCheckbox(orderItem)}
                                disabled={orderItem?.status ==="FEEDBACK" ? true: false}
                                color="primary"
                                inputProps={{ "aria-label": "secondary checkbox" }}
                              />
                            </div>
                          </td> */}
                                  <td>
                                    <Checkbox
                                      name="checked"
                                      checked={orderItem?.isChecked || false}
                                      onChange={(e) =>
                                        onSelect({
                                          ...orderItem,
                                          isChecked: e.target.checked,
                                        })
                                      }
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
                      {tableOrderItems?.length == 0 && (
                        <div className="text-center">
                          <div style={{ marginTop: 50, fontSize: 50 }}>
                            {" "}
                            ໂຕະນີ້ຍັງບໍ່ມີອໍເດີ
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
                    "https://client.appzap.la/store/" +
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
                  ນໍາເອົາQRcodeນີ້ໄປໃຫ້ລູກຄ້າ ຫລື
                  ກົດເປີດໂຕະເພື່ອລິເລີ່ມການນໍາໃຊ້ງານ
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
                  {!selectedTable?.isOpened ? "ເປີດໂຕະ" : "ຢືນຢັນເປີດໂຕະ"}
                </Button>
              </div>
            )}

            {selectedTable == null && (
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
                onChange={(e) => setCodeTableNew(e.target.value)}
              >
                <option selected disabled>
                  ເລືອກໂຕະ
                </option>
                {tableList?.map((item, index) => (
                  <option
                    key={"talbe-" + index}
                    value={item?.code}
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
