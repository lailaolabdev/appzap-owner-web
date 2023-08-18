import { END_POINT_APP } from "../constants/api";
import axios from "axios";
import { getHeaders } from "./auth";
import { toast } from "react-toastify";

export const selfOrderingBillsStoreGet = async (storeId) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/self-ordering-bills-store/${storeId}`;
    const res = await axios.get(url, { headers: _header });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};

export const selfOrderingBillDelete = async (id) => {
  try {
    const _header = await getHeaders();
    const url = `${END_POINT_APP}/v4/self-ordering-bill/${id}`;
    const res = await toast.promise(axios.delete(url, { headers: _header }), {
      pending: "ກຳລັງໂຫລດ...",
      success: {
        render() {
          return "ສຳເລັດ 👌";
        },
        autoClose: 1000,
      },
      error: {
        render() {
          return "Error 🤯";
        },
        autoClose: 1000,
      },
    });
    return res.data;
  } catch (error) {
    return { error: true };
  }
};
