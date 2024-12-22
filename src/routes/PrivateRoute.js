import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../helpers";
import { useStore } from "../store";
import { getStore } from "../services/store";
import { USER_KEY } from "../constants";
import {useStoreStore} from "../zustand/storeStore"

function PrivateRoute({ component: Component, headerTitle, ...rest }) {
  const isAuthenticated = useAuth();
  const { setStoreDetail, profile } = useStore();
  // zustand state store
  const {
    storeDetail, 
    fetchStoreDetail,
    updateStoreDetail} = useStoreStore()

  useEffect(() => {
    const userData = JSON.parse(window.localStorage.getItem(USER_KEY));
    // const userData = profile;
    (async () => {
      // const data = await getStore(userData?.data?.storeId);
      // setStoreDetail(data?.data);
      await fetchStoreDetail(userData?.data?.storeId);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <div>
            <Component {...props} />
          </div>
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
}

export default PrivateRoute;
