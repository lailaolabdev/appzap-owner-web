import React from "react";
import { USER_KEY } from "../constants";
import { useStore } from "../store";
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
