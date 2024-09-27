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

  // console.log("billTotal", billTotal);

  /**
   * Modify Order
   *
   */

  // console.log("billOrders", billOrders);

  useEffect(() => {
    setbillOrderItems(billOrders);
  }, [billOrders]);

  const getSplitBillAll = useMemo(
    () => async (oldId, newId) => {
      // const url = END_POINT + `/v3/bills/${oldId}/${newId}`;
      const url = END_POINT + `/v3/code/${oldId}/${newId}`;
      await fetch(url)
        .then((response) => response.json())
        .then((response) => {
          if (response.message === "server error") return;
          setlistbillSplitAll(response);
        });
    },
    []
  );
  const getbillOrders = async (bill) => {
    try {
      setbillOrders([]);
      if (!bill?.billId) return;
      setIsbillOrderLoading(true);
      const url = END_POINT + `/v3/bills?_id=${bill?.billId}`;
      let res = await axios.get(url);
      const data = res.data;

      if (selectedItems.includes(data[0])) {
        if (selectedItems?.length >= 2) return;
        setSelectedItems(selectedItems.filter((b) => b?._id === data[0]?._id));
      } else {
        setSelectedItems([...selectedItems, data[0]]);
        const exitItems = selectedItems.filter((b) => b?._id === data[0]?._id);
        if (exitItems?.length > 0) {
          setSelectedItems(
            selectedItems.filter((b) => b?._id !== data[0]?._id)
          );
        }
      }

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
    setShowAllbill(false);
    if (bill) {
      setbillOrderItems([]);
      // alert(JSON.stringify(bill));
      setSelectedBill(bill);
      await getbillOrders(bill);
    }
  };

  // console.log("SelectedItems", selectedItems);

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
      DiscountCategory: bill2?.DiscountCategory,
      billAmount: bill2?.billAmount,
      billAmountBefore: bill2?.billAmountBefore,
      checkPoint: bill2?.checkPoint,
      code: bill2?.code,
      createdAt: bill2?.createdAt,
      createdBy: bill2?.createdBy,
      currency: bill2?.currency,
      discount: bill2?.discount,
      discountType: bill2?.discountType,
      isCheckout: bill2?.isCheckout,
      isDeleted: bill2?.isDeleted,
      memberName: bill2?.memberName,
      password: bill2?.password,
      payAmount: bill2?.payAmount,
      paymentMethod: bill2?.paymentMethod,
      queue: bill2?.queue,
      saveCafe: bill2?.saveCafe,
      serviceChargeAmount: bill2?.serviceChargeAmount,
      serviceChargePercent: bill2?.serviceChargePercent,
      status: bill2?.status,
      storeId: bill2?.storeId,
      tableId: bill2?.tableId,
      taxAmount: bill2?.taxAmount,
      taxPercent: bill2?.taxPercent,
      transferAmount: bill2?.transferAmount,
      _id: bill2?._id,
      oldId: bill1?._id,
      newId: bill2?._id,
      items: combinedItems,
      total: combinedTotal,
      mergedTableNames: `ບິນລວມທັງໝົດ`,
    };
  };

  const handleCombineBills = () => {
    setSelectedItems([]);
    if (selectedItems?.length === 0) {
      return errorAdd("Please select exactly two bills to combine.");
    }
    if (selectedItems?.length >= 2) {
      setShowAllbill(true);
      const combinedBill = combineBills(selectedItems[0], selectedItems[1]);
      setcombine(combinedBill);
      // You can then update the UI or send this combined object to the backend.
    } else {
      errorAdd("Please select exactly two bills to combine.");
    }
  };

  return {
    getSplitBillAll,
    listbillSplitAll,
    onSelectBill,
    selectedBill,
    billOrderItems,
    isbillOrderLoading,
    handleCombineBills,
    selectedItems,
    setSelectedItems,
    combine,
    setcombine,
    showAllbill,
    chageStatus,
    setChageStatus,
  };
};
