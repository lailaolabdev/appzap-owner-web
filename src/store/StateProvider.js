import React from "react";
import { Context } from "./Context";
import { useTableState } from "./globalState/tableState";
import { useOrderState } from "./globalState/orderState";
import { useStoreDetailState } from "./globalState/storeState";
import { useMenuCategoryState } from "./globalState/menuCategoryState";

export const StateProvider = ({ children }) => {
  const order = useOrderState();
  const table = useTableState();
  const menuCategory = useMenuCategoryState();
  const storeDetail = useStoreDetailState();
  let store = Object.assign(order, table, storeDetail, menuCategory);
  return <Context.Provider value={store}>{children}</Context.Provider>;
};
