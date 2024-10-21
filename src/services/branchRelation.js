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
    return { error: true };
  }
};

export const GetAllBranchRelation = async (token) => {
  try {
    const url = `${END_POINT_APP}/v4/branch`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};
