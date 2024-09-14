import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { END_POINT } from "../../constants";
export const useBillState = (storeDetail) => {
  const [isbillOrderLoading, setIsbillOrderLoading] = useState(false);
  const [billOrders, setbillOrders] = useState([]);
  const [billOrderItems, setbillOrderItems] = useState([]);
  const [selectedBill, setSelectedBill] = useState();
  const [listbillSplitNew, setlistbillSplitNew] = useState([]);
  const [listbillSplitOld, setlistbillSplitOld] = useState([]);
  const [listbillSplitAll, setlistbillSplitAll] = useState([]);
  const [billTotal, setbillTotal] = useState([]);

  console.log("billTotal", billTotal);

  /**
   * Modify Order
   *
   */

  console.log("billOrders", billOrders);

  useEffect(() => {
    setbillOrderItems(billOrders);
  }, [billOrders]);

  const getSplitBillOld = useMemo(
    () => async (oldId) => {
      console.log("oldId", oldId);
      const url = END_POINT + `/v3/bills?_id=${oldId}`;
      await fetch(url)
        .then((response) => response.json())
        .then((response) => {
          console.log("Old billresponse", response);
          if (response.message === "server error") return;
          setlistbillSplitOld(response);
          setbillTotal(...billTotal, response);
          // let _openbill = response.filter((bill) => {
          //   return bill.isOpened && !bill.isStaffConfirm;
          // });
          // setOpenbillData(_openbill);
        })
        .catch((err) => {});
    },
    []
  );
  const getSplitBillNew = useMemo(
    () => async (newId) => {
      console.log("newId", newId);
      const url = END_POINT + `/v3/bills?_id=${newId}`;
      await fetch(url)
        .then((response) => response.json())
        .then((response) => {
          console.log("New bill response", response);
          if (response.message === "server error") return;
          setlistbillSplitNew(response);
          setbillTotal(...billTotal, response);
          // let _openbill = response.filter((bill) => {
          //   return bill.isOpened && !bill.isStaffConfirm;
          // });
          // setOpenbillData(_openbill);
        })
        .catch((err) => {});
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
    console.log("get billOrders", bill);
    try {
      setbillOrders([]);
      if (!bill?.billId) return;
      setIsbillOrderLoading(true);
      const url = END_POINT + `/v3/bills?_id=${bill?.billId}`;
      let res = await axios.get(url);
      const data = res.data;
      console.log("data", data);
      if (res.status < 300) {
        setbillOrders(data);
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
    } else {
    }
  };

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
    listbillSplitNew,
    listbillSplitOld,
    listbillSplitAll,
    billTotal,
    onSelectBill,
    selectedBill,
    billOrderItems,
    isbillOrderLoading,
  };
};
