import { useState } from "react";
import useLocalStorage from "../../helpers/useLocalStorage";

export const useStoreDetailState = () => {
  const [isStoreDetailLoading, setStoreDetailLoading] = useState(false);
  const [storeDetail, setStoreDetail] = useLocalStorage("storeDetail", {});

  return {
    isStoreDetailLoading,
    setStoreDetailLoading,
    storeDetail,
    setStoreDetail,
  };
};
