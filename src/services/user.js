import jwtDecode from "jwt-decode";
import { END_POINT_APP, USERS_UPDATE } from "../constants/api";
import axios from "axios";
import { errorAdd, successAdd } from "../helpers/sweetalert";

/**
 *
 * @param {*} billFarkId
 * @param {*} token
 * @returns
 */
export const getUserById = async (billFarkId, token) => {
  try {
    const url = `${END_POINT_APP}/v4/bill-fark/id/${billFarkId}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return error;
  }
};

export const updateUser = async (billFarkId, data, token) => {
  try {
    const url = `${END_POINT_APP}/v4/bill-fark/update`;
    const res = await axios.put(
      url,
      { id: billFarkId, data: data },
      {
        headers: token,
      }
    );

    return res.data;
  } catch (error) {
    return error;
  }
};

export const createUser = async (body, token) => {
  try {
    const url = `${END_POINT_APP}/v3/user/create`;
    const res = await axios.post(url, body, {
      headers: token,
    });
    successAdd("ເພີ່ມສຳເລັດ");
    return res.data;
  } catch (error) {
    errorAdd("ບໍ່ສຳເລັດ");
    return { error: true };
  }
};

export const userUpdate = async (userId, data, token) => {
  try {
    const url = `${USERS_UPDATE}?id=${userId}`;
    const res = await axios.put(
      url,
      data, // ไม่ต้องครอบ data: data
      {
        headers: token,
      }
    );
    return res.data;
  } catch (error) {
    throw error; // ควร throw error เพื่อให้ component จัดการได้
  }
};

export const deleteUser = async (userId, token) => {
  try {
    const url = `${END_POINT_APP}/v3/user/delete/${userId}`;
    const res = await axios.delete(url, {
      headers: token,
    });
    successAdd("ລຶບສຳເລັດ");
    return res.data;
  } catch (error) {
    errorAdd("ບໍ່ສຳເລັດ");
    return { error: true };
  }
};
export const getUsers = async (findby, token) => {
  try {
    const url = `${END_POINT_APP}/v3/users${findby}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};

export const getUserCountV5 = async (findby, token) => {
  try {
    const url = `${END_POINT_APP}/v5/user/count${findby}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    console.log(error);
    return { error: true };
  }
};
export const getUsersV5 = async (findby, token) => {
  try {
    const url = `${END_POINT_APP}/v5/users${findby}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res?.data;
  } catch (error) {
    console.log(error);
    return { error: true };
  }
};

export const getCount = async (findby, token) => {
  try {
    const url = `${END_POINT_APP}/v4/bill-farks${findby}`;
    const res = await axios.get(url, {
      headers: token,
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};
