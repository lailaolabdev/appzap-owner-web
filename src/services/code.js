import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getCodes = async (findBy) => {
  try {
    const url = `${END_POINT_APP}/v3/codes${findBy}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getCode = async (codeId) => {
  try {
    const url = `${END_POINT_APP}/v3/code/${codeId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return { error: true };
  }
};

export const callCheckOutPrintBillOnly = async (id) => {
  try {
    const url = `${END_POINT_APP}/v3/code/call-check-out-print-bill-only/${id}`;
    const token = await getHeaders();
    console.log({token})
    const reservation = await axios.put(
      url,
      {},
      {
        headers: token,
      }
    );
    console.log({reservation})
    return reservation;
  } catch (error) {
    return error;
  }
};