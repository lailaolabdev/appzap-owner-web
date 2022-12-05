import React from "react";
import { Context } from "./Context";
import { useTableState } from "./globalState/tableState";
import { useOrderState } from "./globalState/orderState";
import { useStoreDetailState } from "./globalState/storeState";
import { useMenuCategoryState } from "./globalState/menuCategoryState";
import { useReservationState } from "./globalState/reservationState";
import { usePrintersState } from "./globalState/printerState";

export const StateProvider = ({ children }) => {
  const storeDetail = useStoreDetailState();
  const order = useOrderState();
  const table = useTableState();
  const menuCategory = useMenuCategoryState(storeDetail);
  const reservation = useReservationState();
  const printer = usePrintersState(storeDetail);
  let store = Object.assign(
    order,
    table,
    storeDetail,
    menuCategory,
    reservation,
    printer
  );
  return <Context.Provider value={store}>{children}</Context.Provider>;
};
