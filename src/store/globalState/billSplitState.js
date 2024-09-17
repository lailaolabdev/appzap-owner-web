import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { END_POINT } from "../../constants";
export const useBillState = (storeDetail) => {
  const [isbillOrderLoading, setIsbillOrderLoading] = useState(false);
  const [billOrders, setbillOrders] = useState([]);
  const [billOrderItems, setbillOrderItems] = useState([]);
  const [selectedBill, setSelectedBill] = useState();
  const [billSplitNew, setbillSplitNew] = useState([]);
  const [billSplitOld, setbillSplitOld] = useState([]);
  const [listbillSplitAll, setlistbillSplitAll] = useState([]);
  const [billTotal, setbillTotal] = useState([]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [combine, setcombine] = useState({});

  // console.log("billTotal", billTotal);

  /**
   * Modify Order
   *
   */

  // console.log("billOrders", billOrders);

  useEffect(() => {
    setbillOrderItems(billOrders);
  }, [billOrders]);

  const getSplitBillOld = useMemo(
    () => async (oldId) => {
      setIsbillOrderLoading(true);
      const url = END_POINT + `/v3/bills?_id=${oldId}`;
      await fetch(url)
        .then((response) => response.json())
        .then((response) => {
          console.log("Old billresponse", response);
          if (response.message === "server error") return;
          setbillSplitOld(response);
          setbillTotal(...billTotal, response);
          // let _openbill = response.filter((bill) => {
          //   return bill.isOpened && !bill.isStaffConfirm;
          // });
          // setOpenbillData(_openbill);
          setIsbillOrderLoading(false);
        })
        .catch((err) => {
          setIsbillOrderLoading(false);
        });
    },
    []
  );
  const getSplitBillNew = useMemo(
    () => async (newId) => {
      setIsbillOrderLoading(true);
      const url = END_POINT + `/v3/bills?_id=${newId}`;
      await fetch(url)
        .then((response) => response.json())
        .then((response) => {
          console.log("New bill response", response);
          if (response.message === "server error") return;
          setbillSplitNew(response);
          setbillTotal(...billTotal, response);
          // let _openbill = response.filter((bill) => {
          //   return bill.isOpened && !bill.isStaffConfirm;
          // });
          // setOpenbillData(_openbill);
          setIsbillOrderLoading(false);
        })
        .catch((err) => {
          setIsbillOrderLoading(false);
        });
    },
    []
  );

  const getSplitBillAll = useMemo(
    () => async (Id) => {
      const url = END_POINT + `/v3/bills?_id=${Id}`;
      await fetch(url)
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "server error") return;
          setlistbillSplitAll(response);
          setbillTotal(...billTotal, response);
        });
    },
    []
  );
  const getbillOrders = async (bill) => {
    // console.log("get billOrders", bill);
    try {
      setbillOrders([]);
      if (!bill?._id) return;
      setIsbillOrderLoading(true);
      const url = END_POINT + `/v3/bills?_id=${bill?._id}`;
      let res = await axios.get(url);
      const data = res.data;
      console.log("data", data);
      if (res.status < 300) {
        setbillOrders({ ...data, isBillSplit: bill?.isSplit });
        // setSelectedBill(data);
        setIsbillOrderLoading(false);
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
    // console.log("OnselectBill", bill);

    if (bill) {
      setbillOrderItems([]);
      // alert(JSON.stringify(bill));
      setSelectedBill(bill);
      await getbillOrders(bill);
    }

    if (selectedItems.includes(bill)) {
      if (selectedItems?.length >= 2) return;
      // console.log("selectedItems 01");
      setSelectedItems(selectedItems.filter((b) => b !== bill));
    } else {
      if (
        selectedItems?.filter((b) => {
          console.log("bill", b?._id, "===", bill?._id);
          // return b?._id !== bill?._id;
        })
      ) {
        setSelectedItems([...selectedItems, bill]);
      }
    }
  };

  console.log("SelectedItems", selectedItems);

  const combineBills = (bill1, bill2) => {
    const combinedItems = [...bill1?.orderId, ...bill2?.orderId];
    const totalbill1 = bill1?.orderId?.reduce(
      (sum, bill) => sum + bill.totalPrice,
      0
    );
    const totalbill2 = bill2?.orderId?.reduce(
      (sum, bill) => sum + bill.totalPrice,
      0
    );
    const combinedTotal = totalbill1 + totalbill2;

    return {
      items: combinedItems,
      total: combinedTotal,
      // You can merge other fields as well, like timestamps, users, etc.
      mergedTableNames: `ບິນລວມທັງໝົດ`,
      // You can decide how to handle discounts, taxes, etc.
    };
  };

  const handleCombineBills = () => {
    if (selectedItems.length >= 2) {
      const combinedBill = combineBills(selectedItems[0], selectedItems[1]);
      setcombine(combinedBill);
      // You can then update the UI or send this combined object to the backend.
    } else {
      alert("Please select exactly two bills to combine.");
    }
  };

  console.log("selectedItems All", selectedItems);
  console.log("selectedItems[0]", selectedItems[0]);
  console.log("selectedItems[1]", selectedItems[1]);
  console.log("combine", combine);

  return {
    getSplitBillOld,
    getSplitBillNew,
    getSplitBillAll,
    billSplitNew,
    billSplitOld,
    listbillSplitAll,
    billTotal,
    onSelectBill,
    selectedBill,
    billOrderItems,
    isbillOrderLoading,
    handleCombineBills,
    selectedItems,
    combine,
  };
};
