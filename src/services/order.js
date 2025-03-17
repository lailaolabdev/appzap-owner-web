import axios from "axios";
import {
  ACTIVE_STATUS,
  CANCEL_STATUS,
  CHECKOUT_STATUS,
  END_POINT,
  WAITING_STATUS,
} from "../constants";
import { getHeaders } from "./auth";
import { END_POINT_SEVER_BILL_ORDER } from "../constants/api";

export const getOrders = async (
  status = ACTIVE_STATUS,
  orderItemStatus = WAITING_STATUS
) => {
  try {
    const url = `${END_POINT_SEVER_BILL_ORDER}/orderItems`;
    const orders = await axios.get(url, {
      headers: await getHeaders(),
    });
    if (orders) {
      let data = orders?.data;
      let newOrders = [];
      for (let order of data) {
        for (let orderItem of order.order_item) {
          if (orderItem.status === orderItemStatus) {
            newOrders.push({
              ...orderItem,
              table_id: order?.table_id,
              code: order?.code,
            });
          }
        }
      }
      return newOrders;
    } else {
      return null;
    }
  } catch (error) {
    console.log("get orders error:", error);
  }
};
export const getCountOrderWaiting = async (storeId) => {
  try {
    const url = `${END_POINT_SEVER_BILL_ORDER}/v3/orders/count-order-waiting?storeId=${storeId}&status=WAITING`;
    const countOrder = await axios.get(url);
    return countOrder?.data?.count || 0;
  } catch (error) {
    console.log("get orders error:", error);
  }
};

export const getOrdersWithTableId = async (status = ACTIVE_STATUS, tableId) => {
  try {
    let url;
    if (tableId) {
      url = `${END_POINT_SEVER_BILL_ORDER}/orders?table_id=${tableId}&checkout=false`;
    }
    const orders = await axios.get(url, {
      headers: await getHeaders(),
    });
    if (orders) {
      let data = orders?.data;
      let newOrders = [];
      for (let order of data) {
        for (let orderItem of order.order_item) {
          if (orderItem.status !== CANCEL_STATUS) {
            newOrders.push({
              ...orderItem,
              code: order?.code,
              orderId: order?._id,
              table_id: order?.table_id,
            });
          }
        }
      }
      return newOrders;
    } else {
      return null;
    }
  } catch (error) {
    console.log("get orders error:", error);
  }
};

export const updateOrderItem = async (
  orderItems,
  storeId,
  menuId,
  seletedCancelOrderItem,
  selectedTable
) => {
  try {
    const url = `${END_POINT_SEVER_BILL_ORDER}/v3/orders/updateMany`;
    const orders = await axios.put(
      url,
      {
        orders: orderItems,
        storeId: storeId,
        menuId: menuId,
        remark: seletedCancelOrderItem ?? "",
        dataTable: selectedTable ?? "",
      },
      {
        headers: await getHeaders(),
      }
    );
    return orders;
  } catch (error) {
    return error;
  }
};

// Update order items status on the backend
export const updateOrderItemV7 = async (updateItems, storeId) => {
  try {
    const body = {
      orders: updateItems,
      storeId,
    };

    const response = await axios.put(
      `${END_POINT_SEVER_BILL_ORDER}/v7/orders/updateMany`,
      body,
      {
        headers: await getHeaders(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};
export const updateOrderCafeItemV7 = async (updateItems, storeId) => {
  try {
    const body = {
      orders: updateItems,
      storeId,
    };

    const response = await axios.put(
      `${END_POINT_SEVER_BILL_ORDER}/v7/orders/cafe/updateMany`,
      body,
      {
        headers: await getHeaders(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};
export const deleteOrderCafeItemV7 = async (updateItems, storeId) => {
  try {
    const body = {
      orders: updateItems,
      storeId,
    };

    const response = await axios.put(
      `${END_POINT_SEVER_BILL_ORDER}/v7/orders/cafe/delete`,
      body,
      {
        headers: await getHeaders(),
      }
    );
    return response;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw new Error("Failed to update order status");
  }
};

export const updateManyOrderItemsFeedBack = async (orderItems, storeId) => {
  try {
    const url = `${END_POINT_SEVER_BILL_ORDER}/v2/updateManyOrderItemsFeedBack`;
    const orders = await axios.put(
      url,
      {
        orderItem: orderItems,
        storeId: storeId,
      },
      {
        headers: await getHeaders(),
      }
    );
    return orders;
  } catch (error) {
    return error;
  }
};

export const updateOrder = async (data, status = CANCEL_STATUS) => {
  try {
    for (let orderElement of data) {
      const url = `${END_POINT_SEVER_BILL_ORDER}/orders/${orderElement.id}`;
      await axios.put(
        url,
        { status },
        {
          headers: await getHeaders(),
        }
      );
    }
    if (status === CHECKOUT_STATUS) {
      const url = `${END_POINT_SEVER_BILL_ORDER}/generates/${data[0].code}`;
      await axios.put(url);
    }
  } catch (error) {
    console.log("get orders error:", error);
  }
};
