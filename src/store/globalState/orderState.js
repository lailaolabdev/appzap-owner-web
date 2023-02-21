import moment from "moment";
import { useState, useMemo, useRef } from "react";
import Swal from "sweetalert2";
import { END_POINT, WAITING_STATUS } from "../../constants";
import { getLocalData } from "../../constants/api";
import { updateOrderItem } from "../../services/order";

export const useOrderState = () => {
  const [userData, setUserData] = useState();
  const [orderLoading, setOrderLoading] = useState(true);
  const [orderItems, setOrderItems] = useState([]);
  const [waitingOrderItems, setWaitingOrderItems] = useState([]);
  const [orderItemForPrintBillSelect, setorderItemForPrintBillSelect] =
    useState([]);
  const [callCheckBill, setCallCheckBill] = useState([]);
  const soundPlayer = useRef();
  const [selectOrderStatus, setSelectOrderStatus] = useState(""); //waiting,doing,served

  const initialOrderSocket = useMemo(
    () => async () => {
      let _userData = await getLocalData();
      setUserData(_userData);
      // socket.on(`ORDER:${_userData?.DATA?.storeId}`, (data) => {
      //     setWaitingOrderItems(data)
      //     setOrderItems(data)
      // });
    },
    []
  );

  const callingCheckOut = async () => {
    await setOrderLoading(true);
    let _userData = await getLocalData();
    await fetch(
      END_POINT +
        `/v3/bills?status=CALL_TO_CHECKOUT&storeId=${_userData?.DATA?.storeId}`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setCallCheckBill(json);
      });
  };

  const getOrderItemsStore = async (status, skip = 0, limit = 50) => {
    let time = "";
    if (status === "SERVED") {
      time = `&startDate=${moment(moment())
        .add(-1, "days")
        .format("MM-DD-YYYY")}&endDate=${moment().format("MM-DD-YYYY")}`;
    }

    await setOrderLoading(true);
    let _userData = await getLocalData();
    await fetch(
      END_POINT +
        `/v3/orders?status=${status}&storeId=${_userData?.DATA?.storeId}&skip=${skip}&limit=${limit}` +
        time,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((json) => {
        setOrderLoading(false);
        setOrderItems(json);
        if (status === WAITING_STATUS) setWaitingOrderItems(json);
      });
  };

  const handleUpdateOrderStatus = async (status, storeId) => {
    let previousStatus = orderItems[0].status;
    let _updateItems = orderItems
      .filter((item) => item.isChecked)
      .map((i) => {
        return {
          ...i,
          status,
          id: i._id,
        };
      });
    let _resOrderUpdate = await updateOrderItem(_updateItems, storeId);
    if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
      let _newOrderItem = orderItems.filter((item) => !item.isChecked);
      setOrderItems(_newOrderItem);
      if (previousStatus === WAITING_STATUS) getOrderItemsStore(WAITING_STATUS);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleCheckbox = async (order) => {
    let _orderItems = [...orderItems];
    let _newOrderItems = _orderItems.map((item) => {
      if (item._id === order._id) {
        return {
          ...item,
          isChecked: !item.isChecked,
        };
      } else return item;
    });
    let _orderItemForPrint = [];
    for (let i = 0; i < _newOrderItems?.length; i++) {
      if (_newOrderItems[i]?.isChecked === true)
        _orderItemForPrint.push(_newOrderItems[i]);
    }
    setorderItemForPrintBillSelect(_orderItemForPrint);
    setOrderItems(_newOrderItems);
  };
  /**
   * ເລືອກທຸກອໍເດີ
   */
  const checkAllOrders = (item) => {
    let _orderItems = [...orderItems];
    let _newOrderItems;
    if (item?.target?.checked) {
      _newOrderItems = _orderItems.map((item) => {
        return {
          ...item,
          isChecked: true,
        };
      });
    } else {
      _newOrderItems = _orderItems.map((item) => {
        return {
          ...item,
          isChecked: false,
        };
      });
    }
    setOrderItems(_newOrderItems);
  };
  return {
    soundPlayer,
    callCheckBill,
    orderItemForPrintBillSelect,
    orderLoading,
    userData,
    orderItems,
    waitingOrderItems,
    callingCheckOut,
    getOrderItemsStore,
    handleUpdateOrderStatus,
    handleCheckbox,
    checkAllOrders,
    initialOrderSocket,
    selectOrderStatus,
    setSelectOrderStatus,
  };
};
