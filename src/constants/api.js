import { USER_KEY } from './index'
// export const END_POINT_SEVER = "http://localhost:7070"; //dev
 export const END_POINT_SEVER = "https://api.appzap.la"; //// prosduction
export const getLocalData = async () => {
    const _local = await localStorage.getItem(USER_KEY);
    const _localJson2 = await JSON.parse(_local)
    const DATA = _localJson2?.data
    const TOKEN = { authorization: "AppZap " + _localJson2?.accessToken }
    return { TOKEN, DATA };
}
// =====>>>>
export const USERS = END_POINT_SEVER + '/users'
export const USER = END_POINT_SEVER + '/user'
export const USERS_CREATE = END_POINT_SEVER + '/user_create'
export const USERS_DELETE = END_POINT_SEVER + '/user_delete'
export const USERS_UPDATE = END_POINT_SEVER + '/user_update'
// ========
export const CATEGORY = END_POINT_SEVER + '/v3/categories?'
export const MENUS = END_POINT_SEVER + '/v3/menus/?isOpened=true&'
export const PRESIGNED_URL = END_POINT_SEVER + '/uploadfile'
export const TABLES = END_POINT_SEVER + '/tables'
export const STORE = END_POINT_SEVER + '/v3/store'
export const STORE_UPDATE = END_POINT_SEVER + '/store_update'
