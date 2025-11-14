import axios from "axios";
import { PAYMRNT_URL, SECRET_KEY } from "../constants";

export const generatePaymentLinkPhaJay = async (body) => {
  try {
    const authHeader = `Basic ${Buffer.from(`${SECRET_KEY}`).toString("base64")}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        secretKey: SECRET_KEY,
        // Authorization: authHeader,
      },
    };
    const response = await axios.post(
      `${PAYMRNT_URL}/v1/api/payment/generate-ldb-qr`,
      body,
      config
    );
    return response;
  } catch (error) {
    console.log("generate payment link error:", error);
  }
};
