import jwtDecode from "jwt-decode";
import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { errorAdd, successAdd } from "../helpers/sweetalert";

/**
 *
 * @param {*} billFarkId
 * @param {*} token
 * @returns
 */


// export const updateUser = async (billFarkId, data, token) => {
//   try {
//     const url = `${END_POINT_APP}/v4/bill-fark/update`;
//     const res = await axios.put(
//       url,
//       { id: billFarkId, data: data },
//       {
//         headers: token,
//       }
//     );

//     return res.data;
//   } catch (error) {
//     return error;
//   }
// };
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
    return res.data;
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


export const updateUserV5 = async (userId, data, token) => {
  try {
    const url = `${END_POINT_APP}/v3/user/update`;
    const res = await axios.put(url, {
      ...data,
      id: userId  
    }, {
      headers: {
        ...token,
        'Content-Type': 'application/json'
      }
    });
   
    successAdd("update_success");
    return res.data;
  } catch (error) {
    console.error("Update User Error:", error.response?.data);
   
    const errorMessage = error.response?.data?.message ||
                         error.response?.data?.error ||
                         "ไม่สามารถอัปเดตข้อมูลได้";
   
    errorAdd(errorMessage);
   
    return {
      error: true,
      message: errorMessage
    };
  }
};

