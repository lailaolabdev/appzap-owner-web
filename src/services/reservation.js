import axios from "axios";
import { getLocalData, END_POINT_APP } from "../constants/api";
import { getHeaders } from "./auth";

export const getReservationsCount = async (findBy) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v3/reservations/count?storeId=${LocalData?.DATA?.storeId}${findBy}`;
    const reservationsCount = await axios.get(url, {
      headers: await getHeaders(),
    });
    if (reservationsCount) {
      let data = reservationsCount?.data;
      return data;
    }
    return null;
  } catch (error) {
    console.log("get orders error:", error);
  }
};

export const getReservations = async (findBy, storeId) => {
  try {
    const LocalData = await getLocalData();
    const url = `${END_POINT_APP}/v3/reservations?storeId=${
      storeId || LocalData?.DATA?.storeId
    }${findBy}`;
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

export const deleteReservation = async (id) => {
  try {
    const url = `${END_POINT_APP}/v3/reservation/delete/${id}`;
    const reservation = await axios.delete(url, {
      headers: await getHeaders(),
    });
    return reservation;
  } catch (error) {
    return error;
  }
};
