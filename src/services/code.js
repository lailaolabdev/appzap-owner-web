import { END_POINT_APP } from "../constants/api";
import axios from "axios";

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
