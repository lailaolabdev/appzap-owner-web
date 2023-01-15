import { USER_KEY } from "../constants";
import useQuery from "../helpers/useQuery";
export const getHeaders = async () => {
  try {
    const { accessToken } = useQuery();
    const user = await localStorage.getItem(USER_KEY);
    const token = await JSON.parse(user)?.["accessToken"];
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
