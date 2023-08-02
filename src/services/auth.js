import React from "react";
import { USER_KEY } from "../constants";
import { useStore } from "../store";
import axios from "axios";
import { END_POINT_APP } from "../constants/api";
export const getHeaders = async (accessToken) => {
  // const { profile } = useStore();
  try {
    const user = await localStorage.getItem(USER_KEY);
    // const user = profile;
    const token = await JSON.parse(user)?.["accessToken"];
    if (accessToken) {
      return { authorization: `AppZap ${accessToken}` };
    } else if (token) {
      return { authorization: `AppZap ${token}` };
    } else {
      return null;
    }
  } catch (error) {
    console.log("get token error: ", error);
  }
};

export const logout = async () => {
  try {
    await localStorage.removeItem();
    await localStorage.clear();
  } catch (error) {
    console.log("logout error: ", error);
  }
};

export const getHeadersAccount = async (accessToken) => {
  // const { profile } = useStore();
  try {
    const user = await localStorage.getItem(USER_KEY);
    // const user = profile;
    const token = await JSON.parse(user)?.["accessToken"];
    if (accessToken) {
      return { authorization: `${accessToken}` };
    } else if (token) {
      return { authorization: `${token}` };
    } else {
      return null;
    }
  } catch (error) {
    console.log("get token error: ", error);
  }
};

export const tokenSelfOrderingPost = async (billId) => {
  // const { profile } = useStore();
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/staff/token-bill/${billId}`;
    const res = await axios.post(url, null, { headers: _header });

    return res.data;
  } catch (error) {
    console.log("get token error: ", error);
    return error;
  }
};
