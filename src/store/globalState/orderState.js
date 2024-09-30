import moment from "moment";
import { useState, useMemo, useRef, useEffect } from "react";
import Swal from "sweetalert2";
import { WAITING_STATUS } from "../../constants";
import { END_POINT_SEVER_BILL_ORDER, getLocalData } from "../../constants/api";
import { updateOrderItem } from "../../services/order";
import axios from "axios";

export const useOrderState = () => {
  const [userData, setUserData] = useState();
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderItems, setOrderItems] = useState([]);
  const [orderItemForPrintBillSelect, setorderItemForPrintBillSelect] =
    useState([]);
  const [callCheckBill, setCallCheckBill] = useState([]);
  const soundPlayer = useRef();
  const [selectOrderStatus, setSelectOrderStatus] = useState(""); //waiting,doing,served

  const [orderServed, setOrderServed] = useState([]);
  const [orderDoing, setOrderDoing] = useState([]);
  const [orderWaiting, setOrderWaiting] = useState([]);

  const [printBackground, setPrintBackground] = useState([]);
  const [onProcessPrintBackground, setOnProcessPrintBackground] =
    useState(false);

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
    try {
      await setOrderLoading(true);
      let _userData = await getLocalData();
      await fetch(
        END_POINT_SEVER_BILL_ORDER +
          `/v3/bills?status=CALL_TO_CHECKOUT&storeId=${_userData?.DATA?.storeId}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => {
          setCallCheckBill(json);
          setOrderLoading(false);
        });
      setOrderLoading(false);
    } catch (err) {
      setOrderLoading(false);
    }
  };
  const getOrderWaitingAndDoingByStore = async (skip = 0, limit = 200) => {
    try {
      let _userData = await getLocalData();

      const orderDoing = await axios.get(
        END_POINT_SEVER_BILL_ORDER +
          `/v3/orders?status=DOING&storeId=${_userData?.DATA?.storeId}&skip=${skip}&limit=${limit}`
      );
      const orderWaiting = await axios.get(
        END_POINT_SEVER_BILL_ORDER +
          `/v3/orders?status=WAITING&storeId=${_userData?.DATA?.storeId}&skip=${skip}&limit=${limit}`
      );
      // console.log("orderDoing?.data", orderDoing?.data);
      setOrderDoing(orderDoing?.data);
      setOrderWaiting(orderWaiting?.data);
    } catch (err) {}
  };

  const getOrderItemsStore = async (status, skip = 0, limit = 50) => {
    // console.log("getOrderItemsStore runnnnn");
    try {
      // setOrderItems([]);
      let time = "";
      if (status === "SERVED" || status === "CANCELED") {
        time = `&startDate=${moment(moment())
          .add(-1, "days")
          .format("MM-DD-YYYY")}&endDate=${moment(moment())
          .add(+1, "days")
          .format("MM-DD-YYYY")}`;
      }

      await setOrderLoading(true);
      let _userData = await getLocalData();
      await fetch(
        END_POINT_SEVER_BILL_ORDER +
          `/v3/orders?status=${status}&storeId=${_userData?.DATA?.storeId}&skip=${skip}&limit=${limit}` +
          time,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => {
          setOrderLoading(false);
          const data = json.map((e) => {
            const findData = orderItemForPrintBillSelect.find((item) => {
              if (item?._id == e?._id) {
                if (item?.isChecked) {
                  return true;
                }
              }
              return false;
            });
            // console.log("findData", findData);
            if (!findData) {
              return e;
            } else {
              return { ...e, isChecked: true };
            }
          });
          setOrderItems(data);
        })
        .catch((err) => {
          setOrderLoading(false);
        });
      setOrderLoading(false);
    } catch (err) {
      setOrderLoading(false);
    }
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
    console.log("checkAllOrders runnnnn");
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
    setorderItemForPrintBillSelect(_newOrderItems);
    setOrderItems(_newOrderItems);
  };

  useEffect(() => {
    if (onProcessPrintBackground) return;
    if (printBackground.length <= 0) return;

    const processChunks = async (items, limit) => {
      for (let i = 0; i < items.length; i += limit) {
        const chunk = items.slice(i, i + limit);
        await Promise.all(chunk);
      }
    };

    setOnProcessPrintBackground(true);
    const printItems = [...printBackground]; // Create a copy to avoid mutation
    setPrintBackground([]);

    processChunks(printItems, 5).then(() => {
      setOnProcessPrintBackground(false);
    });
  }, [printBackground, onProcessPrintBackground]);

  return {
    soundPlayer,
    callCheckBill,
    orderItemForPrintBillSelect,
    orderLoading,
    userData,
    orderItems,
    callingCheckOut,
    getOrderItemsStore,
    handleUpdateOrderStatus,
    handleCheckbox,
    checkAllOrders,
    initialOrderSocket,
    selectOrderStatus,
    setSelectOrderStatus,
    getOrderWaitingAndDoingByStore,
    setorderItemForPrintBillSelect,
    orderDoing,
    setOrderDoing,
    orderWaiting,
    setOrderWaiting,
    printBackground,
    setPrintBackground,
  };
};
