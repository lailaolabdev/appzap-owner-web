import React from "react";
import { USER_KEY } from "../constants";
export const getHeaders = async (accessToken) => {
  try {
    const user = await localStorage.getItem(USER_KEY);
    const token = await JSON.parse(user)?.["accessToken"];
    console.log("token", token);
    console.log("user", user);
    if (token) {
      return { authorization: `AppZap ${token}` };
    } else if (accessToken) {
      return { authorization: `AppZap ${accessToken}` };
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
