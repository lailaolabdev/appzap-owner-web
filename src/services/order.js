import axios from "axios";
import { END_POINT } from "../constants";
import { getHeaders } from "./auth";

export const getOrders = async () => {
    try {
        const orders = await axios.get(`${END_POINT}/orders?status=CART`, {
            headers: await getHeaders(),
        });
        if (orders) {
            let data = orders?.data;
            return data;
        } else {
            return null;
        }
    } catch (error) {
        console.log("get orders error:", error);
    }
};
