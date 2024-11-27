import { END_POINT_PRINTBILL } from "../constants/index";
import axios from "axios";
export const prinBill80 = async (data) => {
  const url = `${END_POINT_PRINTBILL}`;
  await axios
    .post(url, data)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
};
