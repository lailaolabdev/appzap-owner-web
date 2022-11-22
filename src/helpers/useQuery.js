import { useState } from "react";
import { useLocation } from "react-router-dom";

function useQuery() {
  // const { useLocation } = useReactRouter();
  const search = useLocation().search;
  if (!search) return {};
  console.log("search", search);
  let arr = search.split("&");
  arr[0] = arr?.[0].split("?")[1];
  const data = arr.map((Event) => Event.split("="));
  const query = Object.fromEntries(data);

  return { ...query };
}

function ObjectToQuery(query = {}) {
  let value = "";
  const arr = Object.entries(query);
  const data = arr.map((e, i) => `${i > 0 ? "&" : ""}${e[0]}=${e[1]}`);
  for (let i = 0; i < data.length; i++) {
    value = value + data[i];
  }
  return "?" + value;
}

export { ObjectToQuery };
export default useQuery;
