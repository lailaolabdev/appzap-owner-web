import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../helpers";
import { useStore } from "../store";
import { getStore } from "../services/store";
import { USER_KEY } from "../constants";
import {useStoreStore} from "../zustand/storeStore"

function PrivateRoute({ component: Component, headerTitle, ...rest }) {
  const isAuthenticated = useAuth();
  // zustand state store
  const {
    storeDetail, 
    fetchStoreDetail,
    updateStoreDetail} = useStoreStore()

  useEffect(() => {
    const userData = JSON.parse(window.localStorage.getItem(USER_KEY));
    (async () => {
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
