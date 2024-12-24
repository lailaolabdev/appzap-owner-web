import axios from "axios";
import { getLocalData, END_POINT_APP } from "../constants/api";
import { getHeaders } from "./auth";
export const RedeemPoint = async (value) => {
  return await axios.post(`${END_POINT_APP}/v6/point-redeem`, value, {
    headers: await getHeaders(),
  });
};
export const PointUser = async (value) => {
  return await axios.post(`${END_POINT_APP}/v6/piontStore/user`, value, {
    headers: await getHeaders(),
  });
};
export const GetRedeemPoint = async (findBy) => {
  return await axios.get(`${END_POINT_APP}/v6/point-redeem/history${findBy}`, {
    headers: await getHeaders(),
  });
};
export const GetEarnPoint = async (findBy) => {
  return await axios.get(`${END_POINT_APP}/v6/point-earn/history${findBy}`, {
    headers: await getHeaders(),
  });
};
