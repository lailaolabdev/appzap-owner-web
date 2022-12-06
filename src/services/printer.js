import { END_POINT_SEVER } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";

export const getPrinters = async (findby) => {
  try {
    const url = `${END_POINT_SEVER}/v3/printers${findby}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};
export const getPrinter = async (printerId) => {
  try {
    const url = `${END_POINT_SEVER}/v3/printer?id=${printerId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updatePrinter = async (data, id) => {
  try {
    const url = `${END_POINT_SEVER}/v3/printer/update`;
    const _printer = await axios.put(
      url,
      {
        id: id,
        data: data,
      },
      {
        headers: await getHeaders(),
      }
    );
    return _printer;
  } catch (error) {
    return error;
  }
};

export const addPrinter = async (data) => {
  try {
    const url = `${END_POINT_SEVER}/v3/printer/create`;
    const _printer = await axios.post(url, data, {
      headers: await getHeaders(),
    });
    return _printer;
  } catch (error) {
    return error;
  }
};

export const getPrinterCounter = async (findby) => {
  try {
    const data = await axios.get(`${END_POINT_SEVER}/v3/settings${findby}`);
    return data?.data?.[0];
  } catch (err) {
    console.log(err);
  }
};
