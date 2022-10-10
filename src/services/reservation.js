import axios from "axios";
import { END_POINT } from "../constants";
import { getLocalData, END_POINT_APP } from "../constants/api";
import { getHeaders } from "./auth";

export const getReservation = async (findBy) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v3/reservations?storeId=${LocalData?.DATA?.storeId}${findBy}`;
    const reservation = await axios.get(url, {
      headers: await getHeaders(),
    });
    if (reservation) {
      let data = reservation?.data;
      return data;
    }
    return null;
  } catch (error) {
    console.log("get orders error:", error);
  }
};

export const addReservation = async (data) => {
  try {
    const _localData = await getLocalData();
    const url = `${END_POINT_APP}/v3/reservation/create`;
    const reservation = await axios.post(
      url,
      { ...data, storeId: _localData?.DATA?.storeId },
      {
        headers: await getHeaders(),
      }
    );
    if (reservation) {
      let data = reservation?.data;
      return data;
    } else {
      return null;
    }
  } catch (error) {
    console.log("get orders error:", error);
  }
};

export const updateReservation = async (data, id) => {
  try {
    const url = `${END_POINT_APP}/v3/reservation/update`;
    const reservation = await axios.put(
      url,
      {
        id: id,
        data: data,
      },
      {
        headers: await getHeaders(),
      }
    );
    return reservation;
  } catch (error) {
    return error;
  }
};
// export const updateManyOrderItemsFeedBack = async (orderItems, storeId) => {
//   try {
//     const url = `${END_POINT}/v2/updateManyOrderItemsFeedBack`;
//     const orders = await axios.put(
//       url,
//       {
//         orderItem: orderItems,
//         storeId: storeId,
//       },
//       {
//         headers: await getHeaders(),
//       }
//     );
//     return orders;
//   } catch (error) {
//     return error;
//   }
// };

// export const updateOrder = async (data, status = CANCEL_STATUS) => {
//   try {
//     for (let orderElement of data) {
//       const url = `${END_POINT}/orders/${orderElement.id}`;
//       const orders = await axios.put(
//         url,
//         { status },
//         {
//           headers: await getHeaders(),
//         }
//       );
//     }
//     if (status === CHECKOUT_STATUS) {
//       const url = `${END_POINT}/generates/${data[0].code}`;
//       await axios.put(url);
//     }
//   } catch (error) {
//     console.log("get orders error:", error);
//   }
// };
