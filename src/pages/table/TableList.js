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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCashRegister,
  faArchway,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

import moment from "moment";
import { QRCode } from "react-qrcode-logo";
import axios from "axios";
import html2canvas from "html2canvas";
import { base64ToBlob, resizeImage } from "../../helpers";
import { Checkbox, FormControlLabel } from "@material-ui/core";
import Box from "../../components/Box";

/**
 * component
 * */
import Loading from "../../components/Loading";
import UserCheckoutModal from "./components/UserCheckoutModal";
import OrderCheckOut from "./components/OrderCheckOut";
import UpdateDiscountOrder from "./components/UpdateDiscountOrder";
import FeedbackOrder from "./components/FeedbackOrder";
import { orderStatus, moneyCurrency } from "../../helpers";
import { BillForChef } from "../../components/bill/BillForChef80";
import { BillForCheckOut } from "../../components/bill/BillForCheckOut80";
import { STORE } from "../../constants/api";
import { socket } from "../../services/socket";
import BillForCheckOut80 from "../../components/bill/BillForCheckOut80";
import BillForCheckOut58 from "../../components/bill/BillForCheckOut58";
import BillForChef80 from "../../components/bill/BillForChef80";
import BillForChef58 from "../../components/bill/BillForChef58";

/**
 * const
 **/
import {
  TITLE_HEADER,
  BODY,
  DIV_NAV,
  half_backgroundColor,
  padding_white,
  CANCEL_STATUS,
  DOING_STATUS,
  SERVE_STATUS,
  WAITING_STATUS,
} from "../../constants/index";
import { useStore } from "../../store";
import { END_POINT_SEVER } from "../../constants/api";
import { successAdd, errorAdd, warningAlert } from "../../helpers/sweetalert";
import { getHeaders } from "../../services/auth";
import { useAsyncError, useNavigate, useParams } from "react-router-dom";
import { getBills } from "../../services/bill";
import _ from "lodash";
import { updateOrderItem } from "../../services/order";

export default function TableList() {
  const navigate = useNavigate();
  const params = useParams();
  const number = params?.number;
  const activeTableId = params?.tableId;

  const [show, setShow] = useState(false);
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
  const [dataStore, setStore] = useState();
  const [selectedOrder, setSelectedOrder] = useState([]);
  const {
    orderItems,
    setOrderItems,
    getOrderItemsStore,
    printerCounter,
    printers,
  } = useStore();
  const [getTokken, setgetTokken] = useState();

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
    onChangeMenuCheckbox,
    handleUpdateTableOrderStatus,
    resetTableOrder,
    initialTableSocket,
    storeDetail,
    getTableOrders,
  } = useStore();

  const [isCheckedOrderItem, setIsCheckedOrderItem] = useState([]);

  const canCheckOut = !tableOrderItems.find(
    (e) => e?.status === "DOING" || e?.status === "WAITING"
  )?._id;

  useEffect(() => {
    initialTableSocket();
    getTableDataStore();
  }, []);
  useEffect(() => {
    _StoreData();
  }, [params?.storeId]);
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
  const _orderIsChecked = () => {
    let isIncluded = tableOrderItems.filter((item) => item.isChecked);
    return isIncluded.length == 0;
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
  const _StoreData = async () => {
    await fetch(STORE + `/?id=${params?.storeId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        setStore(json);
      });
  };
  useMemo(
    () =>
      socket.on(`ORDER:${storeDetail._id}`, (data) => {
        setSelectedTable();
      }),
    []
  );
  useMemo(
    () =>
      socket.on(`ORDER_UPDATE_STATUS:${storeDetail._id}`, (data) => {
        setSelectedTable();
      }),
    []
  );
  const [updateModal, setUpdateModal] = useState(false);
  useEffect(() => {
    getOrderItemsStore(DOING_STATUS);
  }, []);
  useMemo(
    () =>
      socket.on(`ORDER:${storeDetail._id}`, (data) => {
        getOrderItemsStore(DOING_STATUS);
      }),
    []
  );
  useMemo(
    () =>
      socket.on(`ORDER_UPDATE_STATUS:${storeDetail._id}`, (data) => {
        getOrderItemsStore(DOING_STATUS);
      }),
    []
  );
  useEffect(() => {
    getOrderItemsStore(CANCEL_STATUS);
  }, []);
  useMemo(
    () =>
      socket.on(`ORDER:${storeDetail._id}`, (data) => {
        getOrderItemsStore(CANCEL_STATUS);
      }),
    []
  );
  useMemo(
    () =>
      socket.on(`ORDER_UPDATE_STATUS:${storeDetail._id}`, (data) => {
        getOrderItemsStore(CANCEL_STATUS);
      }),
    []
  );
  useEffect(() => {
    getOrderItemsStore(SERVE_STATUS);
  }, []);
  useMemo(
    () =>
      socket.on(`ORDER:${storeDetail._id}`, (data) => {
        getOrderItemsStore(SERVE_STATUS);
      }),
    []
  );
  useMemo(
    () =>
      socket.on(`ORDER_UPDATE_STATUS:${storeDetail._id}`, (data) => {
        getOrderItemsStore(SERVE_STATUS);
      }),
    []
  );
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
      console.log("printerBillData", printerBillData);
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

      // const _image64 = await resizeImage(dataUrl.toDataURL(), 300, 500);

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
      // axios.post("http://localhost:9150/ethernet/text", {
      //   config: {
      //     ip: "192.168.100.236",
      //     port: 9100,
      //   },
      //   text: "llsdflkldsfkdkfogowekfokdofsalwiwslkofs",
      // });
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
        // axios.post("http://localhost:9150/ethernet/text", {
        //   config: {
        //     ip: "192.168.100.236",
        //     port: 9100,
        //   },
        //   text: "llsdflkldsfkdkfogowekfokdofsalwiwslkofs",
        // });
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
          isChecked: true
        }
      })
    } else {
      _newOrderItems = isCheckedOrderItem.map((item) => {
        return {
          ...item,
          isChecked: false
        }
      })
    }
    console.log("first", _newOrderItems)
    setIsCheckedOrderItem(_newOrderItems)
  }

  const handleUpdateOrderStatus = async (status) => {
    getOrderItemsStore(SERVE_STATUS);
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
    }
  };

  const handleUpdateOrderStatusgo = async (status) => {
    getOrderItemsStore(DOING_STATUS);
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
    }
  };

  const handleUpdateOrderStatuscancel = async (status) => {
    getOrderItemsStore(CANCEL_STATUS);
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


  return (
    <div
      style={{
        backgroundColor: "#F9F9F9",
        height: "100vh",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {isTableOrderLoading ? <Loading /> : ""}
      <div style={{ marginTop: -10, paddingTop: 10 }}>
        <div>
          <Nav
            variant="tabs"
            style={NAV}
            defaultActiveKey={`/tables/pagenumber/${number}/tableid/${activeTableId}`}
          >
            <Nav.Item>
              <Nav.Link
                style={{ color: "#FB6E3B", border: "none" }}
                active={true}
              >
                ໂຕະທັງໝົດ : {tableList?.length}, ໂຕະທີ່ເປິດທັງໝົດ :{" "}
                {_checkStatusCode(tableList)}, ໂຕະທີ່ຫວ່າງທັງໝົດ :{" "}
                {_checkStatusCodeA(tableList)}, ຕອ້ງການເຊັກບີນທັງໝົດ :{" "}
                {_checkStatusCodeB(tableList)}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item
              className="ml-auto row mr-5"
              style={{ paddingBottom: "3px" }}
            ></Nav.Item>
          </Nav>
        </div>
        <Box
          sx={{
            display: "flex",
            paddingBottom: 50,
            overflow: "hidden",
            height: "100vh",
          }}
        >
          <Box sx={{ flexGrow: 1, overflow: "auto", height: "100%" }}>
            <Container>
              <div style={{ height: 10 }}></div>
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
                      style={{ border: "1px solid #FB6E3B" }}
                      key={"table" + index}
                    >
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          border: "none",
                          backgroundColor: table?.isStaffConfirm
                            ? "#FB6E3B"
                            : "white",
                          border:
                            selectedTable?.tableName == table?.tableName
                              ? "2px solid #FB6E3B"
                              : "2px solid  white",
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
                        onClick={async () => {
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
            </Container>
          </Box>
          {/* Detail Table */}
          <Box sx={{ display: { xs: "none", sm: "block" }, minWidth: 600 }}>
            {selectedTable != null &&
              selectedTable?.isStaffConfirm &&
              selectedTable?.isOpened && (
                <div
                  style={{
                    width: "100%",
                    backgroundColor: "#FFF",
                    maxHeight: "90vh",
                    borderColor: "black",
                    overflowY: "scroll",
                    borderWidth: 1,
                    paddingLeft: 20,
                    paddingTop: 20,
                  }}
                >
                  {
                    <Container>
                      <Row style={{ margin: 0 }}>
                        <Col sm={12} style={{ backgroundColor: "#eee" }}>
                          <p
                            style={{
                              fontSize: 30,
                              margin: 0,
                              fontWeight: "bold",
                            }}
                          >
                            ຂໍ້ມູນໂຕະ
                          </p>
                          <p
                            style={{
                              fontSize: 20,
                              margin: 0,
                              fontWeight: "bold",
                            }}
                          >
                            ໂຕະ: {selectedTable?.tableName}{" "}
                          </p>
                          <p style={{ fontSize: 20, margin: 0 }}>
                            ລະຫັດເຂົ້າໂຕະ: {selectedTable?.code}
                          </p>
                          <p style={{ fontSize: 20, margin: 0 }}>
                            ເວລາເປີດໂຕະ:{" "}
                            {moment(selectedTable?.createdAt).format(
                              "HH:mm:ss A"
                            )}
                          </p>
                          <p style={{ fontSize: 20, margin: 0 }}>
                            ຜູ້ຮັບຜິດຊອບ:{" "}
                            {dataBill?.orderId[0]?.updatedBy?.firstname &&
                              dataBill?.orderId[0]?.updatedBy?.lastname
                              ? dataBill?.orderId[0]?.updatedBy?.firstname +
                              " " +
                              dataBill?.orderId[0]?.updatedBy?.lastname
                              : ""}
                          </p>
                          <p style={{ fontSize: 20, margin: 0 }}>
                            ມີສ່ວນຫຼຸດ: {moneyCurrency(dataBill?.discount)}{" "}
                            {dataBill?.discountType === "PERCENT" ? "%" : "ກີບ"}
                          </p>
                        </Col>
                      </Row>
                      <div
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          display: "flex",
                          paddingTop: 15,
                        }}
                      >
                        <div
                          style={{
                            alignItems: "end",
                            flexDirection: "column",
                            display: "flex",
                            justifyContent: "center",
                          }}
                        ></div>
                        <div
                          style={{
                            display:
                              CheckStatus?.length ===
                                tableOrderItems?.length -
                                CheckStatusCancel?.length
                                ? CheckStatus?.length !==
                                  tableOrderItems?.length -
                                  CheckStatusCancel?.length
                                  ? ""
                                  : CheckStatus?.length === 0
                                    ? ""
                                    : "none"
                                : "none",
                          }}
                        ></div>
                        <div
                          style={{ display: "flex", justifyContent: "center" }}
                        >
                          <div style={{}}>

                            <Button
                              variant="light"
                              className="hover-me"
                              style={{
                                marginRight: 15,
                                backgroundColor: "#FB6E3B",
                                color: "#ffffff",
                                fontWeight: "bold",
                                height: 60,
                              }}
                              onClick={() => onPrintForCher()}
                            >
                              {/* <FontAwesomeIcon
                              icon={faWindowClose}
                              style={{ color: "#fff", marginRight: 10 }}
                            /> */}
                              ພິມບິນໄປຄົວ
                            </Button>

                            <Button
                              variant="light"
                              className="hover-me"
                              style={{
                                marginRight: 15,
                                backgroundColor: "#FB6E3B",
                                color: "#ffffff",
                                fontWeight: "bold",
                                height: 60,
                              }}
                              onClick={() => _openModalSetting(selectedTable)}
                            >
                              {/* <FontAwesomeIcon
                              icon={faWindowClose}
                              style={{ color: "#fff", marginRight: 10 }}
                            /> */}
                              ປິດໂຕະ
                            </Button>
                            <Button
                              variant="light"
                              className="hover-me"
                              style={{
                                marginRight: 15,
                                backgroundColor: "#FB6E3B",
                                color: "#ffffff",
                                fontWeight: "bold",
                                height: 60,
                              }}
                              onClick={handleShow}
                            >
                              <FontAwesomeIcon
                                // icon={faRetweet}
                                style={{ color: "#fff", marginRight: 10 }}
                              />
                              ລວມໂຕະ
                            </Button>
                            {/* <Button
                            variant="light"
                            className="hover-me"
                            style={{
                              marginRight: 15,
                              backgroundColor: "#FB6E3B",
                              color: "#ffffff",
                              fontWeight: "bold",
                              height: 60,
                            }}
                            onClick={() => _onAddDiscount()}
                          >
                            <FontAwesomeIcon
                              // icon={faPercent}
                              style={{ color: "#fff" }}
                            />{" "}
                            ເພີ່ມສ່ວນຫຼຸດ
                          </Button> */}
                            <Button
                              variant="light"
                              className="hover-me"
                              style={{
                                marginRight: 15,
                                backgroundColor: "#FB6E3B",
                                color: "#ffffff",
                                fontWeight: "bold",
                                height: 60,
                              }}
                              disabled={!canCheckOut}
                              onClick={() => _onCheckOut()}
                            >
                              <FontAwesomeIcon
                                icon={faCashRegister}
                                style={{ color: "#fff" }}
                              />
                              Checkout
                            </Button>
                            {/* <ReactToPrint
                        trigger={() => <Button variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 60 }}><FontAwesomeIcon icon={faFileInvoice} style={{ color: "#fff" }} /> CheckBill</Button>}
                        content={() => componentRefA.current}
                      />
                      <div style={{ display: 'none' }}>
                        <BillForCheckOut ref={componentRefA} newData={dataBill} dataStore={dataBill?.storeId} />
                      </div> */}
                          </div>
                          <div>
                            <Button
                              variant="light"
                              className="hover-me"
                              style={{
                                backgroundColor: "#FB6E3B",
                                color: "#ffffff",
                                fontWeight: "bold",
                                height: 60,
                              }}
                              onClick={() =>
                                _goToAddOrder(
                                  selectedTable?.tableId,
                                  selectedTable?.code,
                                  selectedTable?._id
                                )
                              }
                            >
                              + ເພີ່ມອໍເດີ
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-around",
                          padding: "10px",
                        }}
                      >
                        <div>
                          <button
                            style={{
                              backgroundColor: "#FB6E3B",
                              color: "#fff",
                              border: "1px solid #FB6E3B",
                              // width: "100px",
                              height: "60px",
                              borderRadius: "3px"
                            }}
                            onClick={() =>
                              handleUpdateOrderStatuscancel("CANCEL")
                            }
                          >
                            ຍົກເລີກ
                          </button>
                        </div>
                        <div style={{ width: "10px" }}></div>

                        <div>
                          <button
                            style={{
                              backgroundColor: "#FB6E3B",
                              color: "#fff",
                              border: "1px solid #FB6E3B",
                              height: "60px",
                              borderRadius: "3px"
                            }}
                            onClick={() => handleUpdateOrderStatusgo("DOING")}
                          >
                            ສົ່ງໄປຄົວ
                          </button>
                        </div>
                        <div style={{ width: "10px" }}></div>

                        <div>
                          <button
                            style={{
                              backgroundColor: "#FB6E3B",
                              color: "#fff",
                              border: "1px solid #FB6E3B",
                              height: "60px",
                              borderRadius: "3px"
                            }}
                            onClick={() => handleUpdateOrderStatus("SERVED")}
                          >
                            ເສີບແລ້ວ
                          </button>
                        </div>
                      </div>
                      <div style={{ height: 20 }}></div>
                      <div
                        style={{ display: _orderIsChecked() ? "none" : "flex" }}
                      >
                        ອັບເດດເປັນສະຖານະ:
                      </div>
                      <div style={{ height: 20 }}></div>
                      <div
                        style={{
                          display: _orderIsChecked() ? "none" : "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* <div>
                    <ReactToPrint
                      trigger={() => <Button
                        variant="light"
                        style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold" }}
                      >ພີມບີນສົ່ງໄປຄົວ</Button>}
                      content={() => componentRef.current}
                    />
                    <div style={{ display: 'none' }}>
                      <BillForChef ref={componentRef} newData={orderItemForPrintBill} />
                    </div>
                  </div> */}
                        <div>
                          {/* <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => setFeedbackOrderModal(true)}>ສົ່ງຄືນ</Button> */}
                          {/* <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(CANCEL_STATUS, params?.storeId)}>ຍົກເລີກ</Button>
                    <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(DOING_STATUS, params?.storeId)}>ສົ່ງໄປຄົວ</Button>
                    <Button variant="outline-warning" style={{ marginRight: 15, border: "solid 1px #FB6E3B", color: "#FB6E3B", fontWeight: "bold" }} onClick={() => handleUpdateTableOrderStatus(SERVE_STATUS, params?.storeId)}>ເສີບແລ້ວ</Button> */}
                        </div>
                      </div>
                      <div style={padding_white} />
                      <div>
                        <Table
                          responsive
                          className="staff-table-list borderless table-hover"
                        >
                          <thead style={{ backgroundColor: "#F1F1F1" }}>
                            <tr>
                              <th><FormControlLabel control={<Checkbox name="checkedC" onChange={(e) => checkAllOrders(e)} />} style={{ marginLeft: 2 }} /></th>

                              {/* <th style={{ justifyContent: "center", alignItems: "center", height: 50 }}>#</th> */}
                              <th
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 50,
                                }}
                              >
                                ລຳດັບ
                              </th>
                              <th
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 50,
                                }}
                              >
                                ຊື່ເມນູ
                              </th>
                              <th
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 50,
                                }}
                              >
                                ຈຳນວນ
                              </th>
                              <th
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 50,
                                }}
                              >
                                ສະຖານະ
                              </th>
                              <th
                                style={{
                                  justifyContent: "center",
                                  alignItems: "center",
                                  height: 50,
                                }}
                              >
                                ເວລາ
                              </th>
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
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          name="checked"
                                          checked={
                                            orderItem?.isChecked || false
                                          }
                                        // isChecked={
                                        //   orderItem?.isChecked || false
                                        // }
                                        />
                                      }
                                      onChange={(e) =>
                                        onSelect({
                                          ...orderItem,
                                          isChecked: e.target.checked,
                                        })
                                      }
                                      style={{ marginLeft: 2 }}
                                    />
                                  </td>

                                  <td>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 50,
                                      }}
                                    >
                                      <p style={{ margin: 0 }}>{index + 1}</p>
                                    </div>
                                  </td>
                                  <td>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 50,
                                      }}
                                    >
                                      <p style={{ margin: 0 }}>
                                        {orderItem?.name}
                                      </p>
                                    </div>
                                  </td>
                                  <td>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 50,
                                      }}
                                    >
                                      <p style={{ margin: 0 }}>
                                        {orderItem?.quantity}
                                      </p>
                                    </div>
                                  </td>
                                  <td>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 50,
                                        color:
                                          orderItem?.status === `SERVED`
                                            ? "green"
                                            : orderItem?.status === "DOING"
                                              ? ""
                                              : "red",
                                      }}
                                    >
                                      <p style={{ margin: 0 }}>
                                        {orderItem?.status
                                          ? orderStatus(orderItem?.status)
                                          : "-"}
                                      </p>
                                    </div>
                                  </td>
                                  <td>
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 50,
                                      }}
                                    >
                                      <p style={{ margin: 0 }}>
                                        {orderItem?.createdAt
                                          ? moment(
                                            orderItem?.createdAt
                                          ).format("HH:mm A")
                                          : "-"}
                                      </p>
                                    </div>
                                  </td>
                                </tr>
                              ))
                              : ""}
                          </tbody>
                        </Table>
                        {tableOrderItems?.length == 0 && (
                          <div className="text-center">
                            <div style={{ marginTop: 50, fontSize: 50 }}>
                              {" "}
                              ໂຕະນີ້ຍັງບໍ່ມີອໍເດີ
                            </div>
                          </div>
                        )}
                      </div>
                      <div style={{ marginBottom: 100 }} />
                    </Container>
                  }
                </div>
              )}
            {selectedTable != null && !selectedTable?.isStaffConfirm && (
              <div
                style={{
                  width: "100%",
                  backgroundColor: "#FFF",
                  maxHeight: "90vh",
                  borderColor: "black",
                  overflowY: "scroll",
                  borderWidth: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <p style={{ fontSize: 50, fontWeight: "bold" }}>
                  {selectedTable?.tableName}
                </p>
                <QRCode
                  value={
                    "https://client.appzap.la/store/" +
                    selectedTable?.storeId +
                    "?tableId=" +
                    selectedTable?.tableId
                  }
                  size={200}
                />
                <p style={{ fontSize: 20 }}>
                  ນໍາເອົາQRcodeນີ້ໄປໃຫ້ລູກຄ້າ ຫລື
                  ກົດເປີດໂຕະເພື່ອລິເລີ່ມການນໍາໃຊ້ງານ
                </p>
                <p style={{ fontSize: 20 }}>( Smart-Menu && Self-Ordering)</p>
                <div style={{ height: 30 }} />
                <Button
                  variant="light"
                  className="hover-me"
                  style={{
                    backgroundColor: "#FB6E3B",
                    color: "#ffffff",
                    fontWeight: "bold",
                    fontSize: 40,
                    padding: 20,
                  }}
                  onClick={() => openTable()}
                >
                  <FontAwesomeIcon
                    icon={!selectedTable?.isOpened ? faArchway : faCheckCircle}
                    style={{ color: "#fff" }}
                  />{" "}
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

      <OrderCheckOut
        data={dataBill}
        onPrintBill={onPrintBill}
        tableData={selectedTable}
        show={menuItemDetailModal}
        resetTableOrder={resetTableOrder}
        hide={() => setMenuItemDetailModal(false)}
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

const NAV = {
  backgroundColor: "#F9F9F9",
  marginTop: -10,
  paddingTop: 10,
  border: "none",
};
