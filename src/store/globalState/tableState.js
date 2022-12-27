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
import { END_POINT_SEVER, getLocalData } from "../../constants/api";
import { getHeaders } from "../../services/auth";
import { updateOrderItem } from "../../services/order";
import { socket } from "../../services/socket";
import { getCodes } from "../../services/code";

export const useTableState = () => {
  const [isTableOrderLoading, setIsTableOrderLoading] = useState(false);
  const [tableList, setTableList] = useState([]);
  const [tableListCheck, setTableListCheck] = useState([]);
  const [openTableData, setOpenTableData] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [tableOrderItems, setTableOrderItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState();
  const [selectTable2, setSelectTable2] = useState();
  const [orderItemForPrintBill, setorderItemForPrintBill] = useState([]);

  /**
   * Modify Order
   */
  useEffect(() => {
    setTableOrderItems(tableOrders);
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
          if (response.message == "server error") return;
          setTableList(response);
          let _openTable = response.filter((table) => {
            return table.isOpened && !table.isStaffConfirm;
          });
          setOpenTableData(_openTable);
        });
    },
    []
  );
  const getTableDataStoreList = useMemo(
    () => async () => {
      let _userData = await getLocalData();
      const url =
        END_POINT +
        `/v3/codes?isCheckout=false&storeId=${_userData?.DATA?.storeId}&isDeleted=false`;
      await fetch(url)
        .then((response) => response.json())
        .then((response) => {
          if (response.message == "server error") return;
          setTableListCheck(response);
        });
    },
    []
  );
  /**
   * Get Table Orders
   */
  const getTableOrders = async (table) => {
    setIsTableOrderLoading(true);
    console.log("table", table);
    const url = END_POINT + `/v3/orders?code=${table?.code}`;
    console.log("url", url);
    let res = await fetch(url)
      .then((response) => response.json())
      .then((response) => {
        setTableOrders(response);
        setIsTableOrderLoading(false);
      });
    setIsTableOrderLoading(false);

    return res;
  };

  /**
   * Select Table
   */

  const onSelectTable = async (table) => {
    if (table) {
      setTableOrderItems([]);
      // alert(JSON.stringify(table));
      setSelectedTable(table);
      await getTableOrders(table);
    } else {
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
        END_POINT + `/v3/code/update`,
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
      }
    } catch (err) {
      console.log("err", err);
    }
  };

  const mergeTable = async (_newTable) => {
    try {
      const response = await axios.put(END_POINT_SEVER + "v3/bill-transfer", {
        headers: await getHeaders(),
        body: {
          billOld: selectedTable["billId"],
          billNew: _newTable["billId"] ?? "NOT_BILL",
          codeId: _newTable["_id"],
        },
      });

      // print(response.body);

      if (response.status == 200) {
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
      if (item._id == order._id) {
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
    if (_resOrderUpdate?.data?.message == "UPADTE_ORDER_SECCESS") {
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
  };
};
