import React from "react";
import { Context } from "./Context";
import { useTableState } from "./globalState/tableState";
import { useOrderState } from "./globalState/orderState";
import { useStoreDetailState } from "./globalState/storeState";

export const StateProvider = ({ children }) => {
  const order = useOrderState();
  const table = useTableState();
  const storeDetail = useStoreDetailState();
  let store = Object.assign(order, table, storeDetail);
  return <Context.Provider value={store}>{children}</Context.Provider>;
};
