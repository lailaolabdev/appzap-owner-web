import { useState } from "react";

export const useStoreDetailState = () => {
  const [isStoreDetailLoading, setStoreDetailLoading] = useState(false);
  const [storeDetail, setStoreDetail] = useState({});

  return {
    isStoreDetailLoading,
    setStoreDetailLoading,
    storeDetail,
    setStoreDetail,
  };
};
