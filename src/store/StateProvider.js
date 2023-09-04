import React from "react";
import { Context } from "./Context";
import { useTableState } from "./globalState/tableState";
import { useOrderState } from "./globalState/orderState";
import { useStoreDetailState } from "./globalState/storeState";
import { useMenuCategoryState } from "./globalState/menuCategoryState";
import { useMenuState } from "./globalState/menuState";
import { useReservationState } from "./globalState/reservationState";
import { usePrintersState } from "./globalState/printerState";
import { useSoundState } from "./globalState/soundState";
import { useSocketState } from "./globalState/socketState";
import { UserState } from "./globalState/userState";
import { useThemeState } from "./globalState/themeState";

export const StateProvider = ({ children }) => {
  const storeDetail = useStoreDetailState();
  const order = useOrderState();
  const table = useTableState(storeDetail);
  const menuCategory = useMenuCategoryState(storeDetail);
  const reservation = useReservationState();
  const printer = usePrintersState(storeDetail);
  const sound = useSoundState();
  const socket = useSocketState({ ...storeDetail, ...sound });
  const user = UserState();
  const menu = useMenuState(storeDetail);
  const themeState = useThemeState();
  let store = Object.assign(
    order,
    table,
    storeDetail,
    menuCategory,
    menu,
    reservation,
    printer,
    sound,
    socket,
    user,
    themeState
  );
  return <Context.Provider value={store}>{children}</Context.Provider>;
};
