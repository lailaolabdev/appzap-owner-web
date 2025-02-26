import axios from "axios";
import { getLocalData, END_POINT_APP } from "../constants/api";
import { getHeaders } from "./auth";
import { values } from "lodash";

export const GetAllPromotion = async (textSearch, status) => {
  const { DATA } = await getLocalData();
  let findBy = "";
  if (textSearch) {
    findBy = `&name=${textSearch}`;
  }
  if (status) {
    findBy = `&status=${status}`;
  }

  return await axios.get(
    `${END_POINT_APP}/v7/promotions?storeId=${DATA?.storeId}${findBy}`,
    {
      headers: await getHeaders(),
    }
  );
};

export const CreateDiscountPromotion = async (value) => {
  const { DATA } = await getLocalData();
  return await axios.post(
    `${END_POINT_APP}/v7/promotions/discount/create`,
    value,
    {
      headers: await getHeaders(),
    }
  );
};
export const CreateFreePromotion = async (value) => {
  const { DATA } = await getLocalData();
  return await axios.post(`${END_POINT_APP}/v7/promotions/free/create`, value, {
    headers: await getHeaders(),
  });
};

export const GetOnePromotion = async (id) => {
  const { DATA } = await getLocalData();
  return await axios.get(
    `${END_POINT_APP}/v7/promotions/${id}?storeId=${DATA?.storeId}`,
    {
      headers: await getHeaders(),
    }
  );
};

export const UpdateDisCountPromotion = async (id, value) => {
  const { DATA } = await getLocalData();
  return await axios.put(
    `${END_POINT_APP}/v7/promotions/discount/${id}?storeId=${DATA?.storeId}`,
    value,
    {
      headers: await getHeaders(),
    }
  );
};
export const UpdateFreePromotion = async (id, value) => {
  const { DATA } = await getLocalData();
  return await axios.put(
    `${END_POINT_APP}/v7/promotions/free/${id}?storeId=${DATA?.storeId}`,
    value,
    {
      headers: await getHeaders(),
    }
  );
};

export const RemoveMenuFromDiscount = async (promotionId, menuIds) => {
  const { DATA } = await getLocalData();
  return await axios.put(
    `${END_POINT_APP}/v7/promotions/remove-menus-promotionId/${promotionId}?storeId=${DATA?.storeId}`,
    menuIds,
    {
      headers: await getHeaders(),
    }
  );
};
export const RemoveMenuFreeFromDiscount = async (promotionId, menuFreeIds) => {
  const { DATA } = await getLocalData();
  return await axios.put(
    `${END_POINT_APP}/v7/promotions/remove-menus-free-promotionId/${promotionId}?storeId=${DATA?.storeId}`,
    menuFreeIds,
    {
      headers: await getHeaders(),
    }
  );
};

export const DeletePromotion = async (id) => {
  const { DATA } = await getLocalData();
  return await axios.delete(
    `${END_POINT_APP}/v7/promotions/${id}?storeId=${DATA?.storeId}`,
    {
      headers: await getHeaders(),
    }
  );
};

export const UpdateStatusPromotion = async (promoId, value) => {
  const { DATA } = await getLocalData();
  return await axios.put(
    `${END_POINT_APP}/v7/promotions/status/${promoId}?storeId=${DATA?.storeId}`,
    value,
    {
      headers: await getHeaders(),
    }
  );
};
