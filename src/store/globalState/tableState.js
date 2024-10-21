import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import {
  END_POINT,
  SERVE_STATUS,
  WAITING_STATUS,
  DOING_STATUS,
  CANCEL_STATUS,
} from "../../constants";
import {
  END_POINT_SEVER,
  END_POINT_SEVER_BILL_ORDER,
  END_POINT_SEVER_TABLE_MENU,
  getLocalData,
} from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { updateOrderItem } from "../../services/order";
import { getCodes } from "../../services/code";

export const useTableState = (storeDetail) => {
  const [isTableOrderLoading, setIsTableOrderLoading] = useState(false);
  const [tableList, setTableList] = useState([]);
  const [tableListCheck, setTableListCheck] = useState([]);
  const [openTableData, setOpenTableData] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [tableOrderItems, setTableOrderItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState();
  const [selectTable2, setSelectTable2] = useState();
  const [orderItemForPrintBill, setorderItemForPrintBill] = useState([]);
  const [isWaitingCheckout, setIsWaitingCheckout] = useState(false);

  /**
   * Modify Order
   *
   */

  // console.log("tableOrders", tableOrders);

  useEffect(() => {
    if (tableOrders.length > 0 && tableOrders[0].code !== selectedTable?.code) {
      getTableOrders(selectedTable);
    } else {
      setTableOrderItems(tableOrders);
    }
  }, [tableOrders]);

  const getTableDataStore = useMemo(
    () => async () => {
      let _userData = await getLocalData();
      const url =
        END_POINT +
        `/v3/codes?status=true&isCheckout=false&&storeId=${_userData?.DATA?.storeId}`;
      await fetch(url)
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "server error") return;
          setTableList(response);
          let _openTable = response.filter((table) => {
            return table.isOpened && !table.isStaffConfirm;
          });
          setOpenTableData(_openTable);
        })
        .catch((err) => {});
    },
    []
  );
  // useEffect(() => {
  //   getTableDataStore();
  // }, []);
  const getTableDataStoreList = useMemo(
    () => async () => {
      let _userData = await getLocalData();
      const url =
        END_POINT_SEVER_TABLE_MENU +
        `/v3/codes?isCheckout=false&storeId=${_userData?.DATA?.storeId}&isDeleted=false`;
      await fetch(url)
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "server error") return;
          setTableListCheck(response);
        });
    },
    []
  );
  /**
   * Get Table Orders
   */
  const getTableOrders = async (table) => {
    try {
      if (!table?.billId) return;
      const url =
        END_POINT_SEVER_BILL_ORDER +
        `/v3/orders?code=${table?.code}&storeId=${table?.storeId}&storeId=${table?.storeId}&billId=${table?.billId}`;
      let res = await axios.get(url);
      const data = res.data;

      if (res.status < 300) {
        setTableOrders(data);
        setIsTableOrderLoading(false);
        return data;
      } else {
        setTableOrders([]);
        setIsTableOrderLoading(false);
        return [];
      }
    } catch (err) {
      console.log(err);
      setIsTableOrderLoading(false);
      return [];
    }
  };

  /**
   * Select Table
   */

  const onSelectTable = async (table) => {
    console.log("table", table);
    if (table && !isWaitingCheckout) {
      setTableOrderItems([]);
      // alert(JSON.stringify(table));
      setSelectedTable(table);
      setIsWaitingCheckout(true);
      await getTableOrders(table);
      setIsWaitingCheckout(false);
    } else {
      setIsWaitingCheckout(true);
    }
  };

  /**
   * ເປີດໂຕະ
   */

  const openTable = async () => {
    try {
      let findby = "?";
      findby += "storeId=" + selectedTable?.storeId;
      findby += "&code=" + selectedTable?.code;
      findby += "&tableId=" + selectedTable?.tableId;

      const codesData = await getCodes(findby);
      const code = codesData[0];

      let resData = await axios.put(
        END_POINT_SEVER_TABLE_MENU + `/v3/code/update`,
        {
          id: code?._id,
          data: {
            isOpened: true,
            isStaffConfirm: true,
            createdAt: new Date(),
          },
        },
        {
          headers: await getHeaders(),
        }
      );
      if (resData.status < 300) {
        await getTableDataStore();
        await onSelectTable({
          ...resData?.data,
        });
        Swal.fire({
          icon: "success",
          title: "ເປີດໂຕະສໍາເລັດແລ້ວ",
          showConfirmButton: false,
          timer: 1800,
        });
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  const openTableAndReturnTokenOfBill = async () => {
    try {
      let findby = "?";
      findby += "storeId=" + selectedTable?.storeId;
      findby += "&code=" + selectedTable?.code;
      findby += "&tableId=" + selectedTable?.tableId;

      const codesData = await getCodes(findby);
      const code = codesData[0];

      let resData = await axios.put(
        END_POINT_SEVER_TABLE_MENU + `/v3/code/update`,
        {
          id: code?._id,
          data: {
            isOpened: true,
            isStaffConfirm: true,
            createdAt: new Date(),
          },
        },
        {
          headers: await getHeaders(),
        }
      );
      if (resData.status < 300) {
        const data = await axios.post(
          `${END_POINT_SEVER}/v4/staff/token-bill/${resData?.data?.billId}`
        );
        await getTableDataStore();
        await onSelectTable({
          ...selectedTable,
          isOpened: true,
          isStaffConfirm: true,
        });
        Swal.fire({
          icon: "success",
          title: "ເປີດໂຕະສໍາເລັດແລ້ວ",
          showConfirmButton: false,
          timer: 1800,
        });
        if (resData.status < 300) {
          return data?.data?.token;
        } else {
          throw new Error("can not qr token");
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  };
  const openTableAndReturnCodeShortLink = async () => {
    try {
      let findby = "?";
      findby += "storeId=" + selectedTable?.storeId;
      findby += "&code=" + selectedTable?.code;
      findby += "&tableId=" + selectedTable?.tableId;

      const codesData = await getCodes(findby);
      const code = codesData[0];

      let resData = await axios.put(
        END_POINT_SEVER_TABLE_MENU + `/v3/code/update`,
        {
          id: code?._id,
          data: {
            isOpened: true,
            isStaffConfirm: true,
            createdAt: new Date(),
          },
        },
        {
          headers: await getHeaders(),
        }
      );
      if (resData.status < 300) {
        const data = await axios.post(
          `${END_POINT_SEVER}/v4/staff/token-bill/${resData?.data?.billId}`
        );
        const dataShortLink = await axios.post(
          `https://e7d1e6zvrl.execute-api.ap-southeast-1.amazonaws.com/create-short-link`,
          {
            url: `https://client.appzap.la/store/${selectedTable?.storeId}?token=${data?.data?.token}`,
          }
        );
        await getTableDataStore();
        onSelectTable({
          ...selectedTable,
          isOpened: true,
          isStaffConfirm: true,
        });
        Swal.fire({
          icon: "success",
          title: "ເປີດໂຕະສໍາເລັດແລ້ວ",
          showConfirmButton: false,
          timer: 1800,
        });
        if (resData.status < 300) {
          return dataShortLink?.data?.code;
        } else {
          throw new Error("can not qr token");
        }
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const mergeTable = async (_newTable) => {
    try {
      const response = await axios.put(
        END_POINT_SEVER_BILL_ORDER + "v3/bill-transfer",
        {
          headers: await getHeaders(),
          body: {
            billOld: selectedTable["billId"],
            billNew: _newTable["billId"] ?? "NOT_BILL",
            codeId: _newTable["_id"],
          },
        }
      );

      // print(response.body);

      if (response.status === 200) {
        resetTableOrder();
      }
    } catch (err) {
      return err;
    }
  };

  const resetTableOrder = () => {
    getTableOrders(selectedTable);
    getTableDataStore();
    setTableOrders([]);
    // setTimeout(() => {
    //   setSelectedTable();
    // }, 100);
  };
  const onChangeMenuCheckbox = async (order) => {
    let _orderItemForPrint = [];
    let _orderItems = [...tableOrderItems];
    let _newOrderItems = _orderItems.map((item) => {
      if (item._id === order._id) {
        return {
          ...item,
          isChecked: !item.isChecked,
        };
      } else return item;
    });
    for (let i = 0; i < _newOrderItems?.length; i++) {
      if (_newOrderItems[i]?.isChecked === true)
        _orderItemForPrint.push(_newOrderItems[i]);
    }

    setorderItemForPrintBill(_orderItemForPrint);
    setTableOrderItems(_newOrderItems);
  };

  /**
   * ອັບເດດສະຖານະອໍເດີ
   */
  const handleUpdateTableOrderStatus = async (status, storeId) => {
    let _updateItems = tableOrderItems
      .filter((item) => item.isChecked)
      .map((i) => {
        return {
          ...i,
          status,
          _id: i._id,
        };
      });
    let _resOrderUpdate = await updateOrderItem(_updateItems, storeId);
    if (_resOrderUpdate?.data?.message === "UPADTE_ORDER_SECCESS") {
      let _newOrderItem = tableOrderItems.map((item) => {
        if (item.isChecked) {
          return {
            ...item,
            status,
            isChecked: ![
              CANCEL_STATUS,
              SERVE_STATUS,
              WAITING_STATUS,
              DOING_STATUS,
            ].includes(status),
          };
        } else return item;
      });
      setTableOrderItems(_newOrderItem);
      Swal.fire({
        icon: "success",
        title: "ອັບເດດສະຖານະອໍເດີສໍາເລັດ",
        showConfirmButton: false,
        timer: 10000,
      });
    }
  };

  return {
    isTableOrderLoading,
    orderItemForPrintBill,
    mergeTable,
    tableList,
    tableListCheck,
    openTableData,
    tableOrders,
    tableOrderItems,
    setTableOrderItems,
    selectedTable,
    setTableListCheck,
    setTableList,
    setSelectedTable,
    getTableOrders,
    getTableDataStoreList,
    openTable,
    getTableDataStore,
    onSelectTable,
    onChangeMenuCheckbox,
    handleUpdateTableOrderStatus,
    resetTableOrder,
    selectTable2,
    setSelectTable2,
    openTableAndReturnTokenOfBill,
    openTableAndReturnCodeShortLink,
    isWaitingCheckout,
  };
};
