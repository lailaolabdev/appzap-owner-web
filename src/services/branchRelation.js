import { END_POINT_APP } from "../constants/api";
import axios from "axios";

export const createBranchRelation = async (body, token) => {
  try {
    const url = `${END_POINT_APP}/v4/branch/create`;
    const res = await axios.post(url, body, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error };
  }
};

export const GetAllBranchRelation = async (token, findbyIncome) => {
  try {
    const url = `${END_POINT_APP}/v4/branch${findbyIncome}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};
export const GetAllBranchIncome = async (token, findby) => {
  try {
    const url = `${END_POINT_APP}/v4/branch/income${findby}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};

export const DeleteBranchRelation = async (token, branchId, storeId) => {
  try {
    const url = `${END_POINT_APP}/v4/branch/delete?branchId=${branchId}&storeId=${storeId}`;
    const res = await axios.delete(url, {
      headers: token,
    });
    return res.data;
  } catch (err) {
    return { err };
  }
};
