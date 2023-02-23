import { USER_KEY } from "./index";

export const END_POINT_SEVER = "https://api.appzap.la"; // /prosdusction
export const END_POINT_APP = "https://api.appzap.la"; // /prosdusction

// export const END_POINT_SEVER = "http://localhost:7070"; // /
// export const END_POINT_APP = "http://localhost:7070"; // /

// export const END_POINT_SEVER = "https://dev-api.appzap.la"; // staging
// export const END_POINT_APP = "https://dev-api.appzap.la"; // staging

export const getLocalData = async () => {
  const _local = await localStorage.getItem(USER_KEY);
  const _localJson2 = await JSON.parse(_local);
  const DATA = _localJson2?.data;
  const TOKEN = { authorization: "AppZap " + _localJson2?.accessToken };
  return { TOKEN, DATA };
};

// =====>>>>
export const USERS = END_POINT_SEVER + "/v3/users";
export const USER = END_POINT_SEVER + "/user";
export const USERS_CREATE = END_POINT_SEVER + "/v3/user/create";
export const USERS_DELETE = END_POINT_SEVER + "/v3/user/delete/";
export const USERS_UPDATE = END_POINT_SEVER + "/v3/user/update";
// ========
export const CATEGORY = END_POINT_SEVER + "/v3/categories";
export const MENUS = END_POINT_SEVER + "/v3/menus";
export const PRESIGNED_URL = END_POINT_SEVER + "/uploadfile";
export const TABLES = END_POINT_SEVER + "/v3/tables";
export const STORE = END_POINT_SEVER + "/v3/store";
export const STORE_UPDATE = END_POINT_SEVER + "/v3/store/update";
export const QUERY_LANGUAGE = END_POINT_SEVER + "/v3/currencies";