import axios from "axios";
import { getHeaders } from "./auth";
let END_POINT_SEVER = "https://app-api.appzap.la/crm";

export const getMembers = async (storeId) => {
  try {
    const url = `${END_POINT_SEVER}/api/crm/customers?resId=${storeId}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    return error;
  }
};

// export const getMenu = async (categoryId) => {
//   try {
//     const url = `${END_POINT_SEVER}/v3/menu?id=${categoryId}`;
//     const res = await axios.get(url);
//     return res.data;
//   } catch (error) {
//     return error;
//   }
// };

export const updateMember = async (pointsChange, MemberId) => {
  try {
    const url = `${END_POINT_SEVER}/api/crm/customers/${MemberId}/points`;
    const _category = await axios.put(
      url,
      {
        pointsChange: pointsChange,
      },
      {
        headers: await getHeaders(),
      }
    );
    return _category;
  } catch (error) {
    return error;
  }
};
// export const updateMember = async (data, id) => {
//   try {
//     const url = `${END_POINT_SEVER}/v3/category/update`;
//     const _category = await axios.put(
//       url,
//       {
//         id: id,
//         data: data,
//       },
//       {
//         headers: await getHeaders(),
//       }
//     );
//     return _category;
//   } catch (error) {
//     return error;
//   }
// };

// export const deleteMember = async (data) => {
//   try {
//     const url = `${END_POINT_SEVER}/v3/category/create`;
//     const _category = await axios.post(url, data, {
//       headers: await getHeaders(),
//     });
//     return _category;
//   } catch (error) {
//     return error;
//   }
// };

export const addMember = async (data) => {
  try {
    const url = `${END_POINT_SEVER}/api/crm/customers`;
    const _category = await axios.post(url, data, {
      headers: await getHeaders(),
    });
    return _category;
  } catch (error) {
    return error;
  }
};
