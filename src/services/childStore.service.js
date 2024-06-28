import axios from "axios";
import { END_POINT_SEVER, END_POINT_APP } from "../constants/api";

export const getBranchStore = async (storeId) => {
  try {
    const url = `${END_POINT_SEVER}/v4/branch-store?id=${storeId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return { error: true };
  }
};

export const getReports = async (storeId, findBy, tableIds) => {
  try {
    const url = `${END_POINT_APP}/v4/report-daily/${storeId}${findBy}`;
    const res = await axios.post(url, { tableIds: tableIds });
    return res.data;
  } catch (error) {
    return error;
  }
};
