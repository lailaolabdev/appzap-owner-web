import axios from "axios";
import { getLocalData, END_POINT_APP } from "../constants/api";
import { getHeaders } from "./auth";
import { values } from "lodash";

export const getAllShift = async (findby) => {
  const { DATA } = await getLocalData();
  return await axios.get(
    `${END_POINT_APP}/v7/shift/all?storeId=${DATA?.storeId}`,
    {
      headers: await getHeaders(),
    }
  );
};
export const getOpenShift = async (findby) => {
  const { DATA } = await getLocalData();
  return await axios.get(
    `${END_POINT_APP}/v7/shift-all/open?storeId=${DATA?.storeId}&${findby}`,
    {
      headers: await getHeaders(),
    }
  );
};

export const CreateShift = async (value) => {
  const { DATA } = await getLocalData();
  return await axios.post(`${END_POINT_APP}/v7/shift/create`, value, {
    headers: await getHeaders(),
  });
};

export const getOneShift = async (shiftId) => {
  const { DATA } = await getLocalData();
  return await axios.get(
    `${END_POINT_APP}/v7/shift/one?storeId=${DATA?.storeId}&shiftId=${shiftId}`,
    {
      headers: await getHeaders(),
    }
  );
};

export const updateShift = async (values, shiftId) => {
  const { DATA } = await getLocalData();
  return await axios.put(
    `${END_POINT_APP}/v7/shift/update/${shiftId}/${DATA?.storeId}`,
    values,
    {
      headers: await getHeaders(),
    }
  );
};

export const DeleteShift = async (shiftId) => {
  const { DATA } = await getLocalData();
  return await axios.delete(
    `${END_POINT_APP}/v7/shift/delete/${shiftId}/${DATA?._id}`,
    {
      headers: await getHeaders(),
    }
  );
};

export const OpenShift = async (values, shiftId) => {
  const { DATA } = await getLocalData();
  return await axios.put(
    `${END_POINT_APP}/v7/shift/open/${shiftId}/${DATA?.storeId}`,
    values,
    {
      headers: await getHeaders(),
    }
  );
};
