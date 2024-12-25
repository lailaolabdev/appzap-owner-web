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
    console.log({ token });
    const reservation = await axios.put(
      url,
      {},
      {
        headers: token,
      }
    );
    console.log({ reservation });
    return reservation;
  } catch (error) {
    return error;
  }
};

export const callPayBeforePrintBillOnly = async (id) => {
  try {
    const url = `${END_POINT_APP}/v3/code/call-pay-before-print-bill/${id}`;
    const token = await getHeaders();
    console.log({ token });
    const reservation = await axios.put(
      url,
      {},
      {
        headers: token,
      }
    );
    console.log({ reservation });
    return reservation;
  } catch (error) {
    return error;
  }
};

export const callToUpdatePrintBillBefore = async (id, body) => {
  try {
    console.log("BODY: ", body);
    const url = `${END_POINT_APP}/v6/bill-checkout`;
    const token = await getHeaders();
    const reservation = await axios.put(
      url,
      {
        id: id,
        data: body,
      },
      {
        headers: token,
      }
    );
    console.log({ reservation });
    return reservation;
  } catch (error) {
    return error;
  }
};
