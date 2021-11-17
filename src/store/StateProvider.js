import React from "react";
import { Context } from "./Context";
import { useTableState } from "./globalState/tableState";
import { useOrderState } from "./globalState/orderState";

export const StateProvider = ({ children }) => {
    const order = useOrderState();
    const table = useTableState();
    let store = Object.assign(order, table);

    return <Context.Provider value={store}>{children}</Context.Provider>;
};