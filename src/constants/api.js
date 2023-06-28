import { USER_KEY } from "./index";

// TODO: check domain name and set end point
const production_domain = "restaurant.appzap.la"; // Production
const now_domain = window.location.hostname;
const dev = "https://dev-api.appzap.la"; // dev endpoint
// const dev = "https://api.appzap.la"; //locals
// const production = "http://localhost:7070"; //locals
const production = "https://api.appzap.la"; // Production
const production_socket = "https://app-api-alb.appzap.la"; // Production
const dev_socket = "ws://socket2.appzap.la:8888";
const production_web_client = "https://client.appzap.la/store/";
const dev_web_client = "http://18.141.158.70:3000/store/";
const isProduction = production_domain == now_domain;
export const END_POINT_SEVER = isProduction ? production : dev;
export const END_POINT_APP = isProduction ? production : dev;
export const END_POINT_SOCKET = isProduction ? production_socket : dev_socket;
export const END_POINT_WEB_CLIENT = isProduction
  ? production_web_client
  : dev_web_client;

// export const END_POINT_SERVER_BUNSI = 'http://localhost:7070';
export const END_POINT_SERVER_BUNSI = 'https://accounting.lailaolab.la/';


// ------------------------------------------

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
