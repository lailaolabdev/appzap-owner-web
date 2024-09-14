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
  const [mergedObject, setMergedObject] = useState({});

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
        setSelectedBill(data);
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
    console.log("OnselectBill", bill);
    if (bill) {
      setbillOrderItems([]);
      // alert(JSON.stringify(bill));
      setSelectedBill(bill);
      await getbillOrders(bill);

      if (selectedItems.includes(bill?._id)) {
        // Remove the item from the selected list
        setSelectedItems(selectedItems.filter((id) => id !== bill?._id));

        // Update the merged object to remove the deselected item properties
        const { [bill?._title]: _, ...rest } = mergedObject;
        setMergedObject(rest);
      } else {
        // Add the item to the selected list
        setSelectedItems([...selectedItems, bill?._id]);

        // Merge the object properties into the mergedObject state
        setMergedObject({
          ...mergedObject,
          Data: bill?.orderId,
        });
      }
    } else {
    }
  };

  // console.log("selectedItems", selectedItems);
  console.log("mergedObject", mergedObject);

  /**
   * ເປີດໂຕະ
   */

  /**
   * ອັບເດດສະຖານະອໍເດີ
   */

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
  };
};
