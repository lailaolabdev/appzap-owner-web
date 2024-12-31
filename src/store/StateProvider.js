import React from "react";
import { Context } from "./Context";
import { useTableState } from "./globalState/tableState";
import { useOrderState } from "./globalState/orderState";
import { useMenuCategoryState } from "./globalState/menuCategoryState";
import { useMenuState } from "./globalState/menuState";
import { useReservationState } from "./globalState/reservationState";
import { usePrintersState } from "./globalState/printerState";
import { useSoundState } from "./globalState/soundState";
import { useSocketState } from "./globalState/socketState";
import { UserState } from "./globalState/userState";
import { useThemeState } from "./globalState/themeState";
import { useBillState } from "./globalState/billSplitState";

import { useStoreStore } from "../zustand/storeStore";

export const StateProvider = ({ children }) => {

  const {storeDetail} = useStoreStore();
  
  const splitBill = useBillState();
  const order = useOrderState();
  const table = useTableState(storeDetail || {});
  const menuCategory = useMenuCategoryState(storeDetail || {});
  const reservation = useReservationState();
  const printer = usePrintersState();
  const sound = useSoundState();
  const socket = useSocketState({...sound });
  const user = UserState();
  const menu = useMenuState(storeDetail || {});
  const themeState = useThemeState();
  let store = Object.assign(
    order,
    table,
    // storeDetail,
    menuCategory,
    menu,
    reservation,
    printer,
    sound,
    socket,
    user,
    themeState,
    splitBill
  );
  return <Context.Provider value={store}>{children}</Context.Provider>;
};
