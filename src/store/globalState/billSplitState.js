import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { END_POINT } from "../../constants";
import { errorAdd } from "../../helpers/sweetalert";
export const useBillState = (storeDetail) => {
  const [isbillOrderLoading, setIsbillOrderLoading] = useState(false);
  const [billOrders, setbillOrders] = useState([]);
  const [billOrderItems, setbillOrderItems] = useState([]);
  const [selectedBill, setSelectedBill] = useState();
  const [listbillSplitAll, setlistbillSplitAll] = useState([]);
  const [showAllbill, setShowAllbill] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [combine, setcombine] = useState({});
  const [chageStatus, setChageStatus] = useState(false);
  const [tableChild, setTableChild] = useState([]);
  const [orderItemForPrintBill, setorderItemForPrintBill] = useState([]);
  const [billSplitNewId, setbillSplitNewId] = useState([]);
  const [billSplitOldId, setbillSplitOldId] = useState([]);
  // console.log("tableChild", tableChild);

  /**
   * Modify Order
   *
   */

  // console.log("billOrders", billOrders);

  useEffect(() => {
    setbillOrderItems(billOrders);
  }, [billOrders]);

  const getSplitBillAll = useMemo(
    () => async (newId) => {
      // console.log("get new Id", newId);
      // const url = END_POINT + `/v3/bills/${oldId}/${newId}`;
      // const url = END_POINT + `/v3/code/${oldId}/${newId}`;
      const url = END_POINT + `/v3/code/findTwoCode/${newId}`;
      await fetch(url)
        .then((response) => response.json())
        .then((response) => {
          // console.log("response", response);
          if (response.message === "server error") return;
          setlistbillSplitAll(response);
          setTableChild(response[0]?.tableChildren);
        });
    },
    []
  );

  const onChangeMenuCheckbox = async (order) => {
    let _orderItemForPrint = [];
    let _orderItems = [...billOrderItems];
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
    setbillOrderItems(_newOrderItems);
  };

  const getbillOrders = async (bill) => {
    try {
      setbillOrders([]);
      if (!bill?.billId) return;
      // setIsbillOrderLoading(true);
      // const url =
      //   END_POINT +
      //   `/v3/orders?code=${bill?.code}&storeId=${bill?.storeId}&storeId=${bill?.storeId}&billId=${bill?.billId}`;
      const url = END_POINT + `/v3/bills?_id=${bill?.billId}`;
      let res = await axios.get(url);
      const data = res.data;

      // if (selectedItems.includes(data[0])) {
      //   if (selectedItems?.length >= 2) return;
      //   setSelectedItems(selectedItems.filter((b) => b?._id === data[0]?._id));
      // } else {
      //   setSelectedItems([...selectedItems, data[0]]);
      //   const exitItems = selectedItems.filter((b) => b?._id === data[0]?._id);
      //   if (exitItems?.length > 0) {
      //     setSelectedItems(
      //       selectedItems.filter((b) => b?._id !== data[0]?._id)
      //     );
      //   }
      // }

      if (res.status < 300) {
        setbillOrders(data);
        setIsbillOrderLoading(false);
        // setSelectedItems([...selectedItems, data[0]] || data[0]);
        // console.log({ data });
        return data;
      } else {
        setbillOrders([]);
        setIsbillOrderLoading(false);
        return [];
      }
    } catch (err) {
      console.log(err);
      setIsbillOrderLoading(false);
      return [];
    }
  };

  const onSelectBill = async (bill) => {
    console.log("____Billl===>", bill);

    setShowAllbill(false);
    if (bill) {
      setbillOrderItems([]);
      // alert(JSON.stringify(bill));
      setSelectedBill(bill);
      await getbillOrders(bill);
    }
  };

  // console.log("SelectedItems", selectedItems);

  return {
    getSplitBillAll,
    listbillSplitAll,
    onSelectBill,
    selectedBill,
    billOrderItems,
    isbillOrderLoading,
    selectedItems,
    setSelectedItems,
    combine,
    setcombine,
    showAllbill,
    chageStatus,
    setChageStatus,
    tableChild,
    orderItemForPrintBill,
    onChangeMenuCheckbox,
    billSplitNewId,
    setbillSplitNewId,
    billSplitOldId,
    setbillSplitOldId,
  };
};
