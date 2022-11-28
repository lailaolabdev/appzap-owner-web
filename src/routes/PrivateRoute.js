import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../helpers";
import { useStore } from "../store";
import { getStore } from "../services/store";
import { getLocalData } from "../constants/api";
import { USER_KEY } from "../constants";

function PrivateRoute({ component: Component, headerTitle, ...rest }) {
  const isAuthenticated = useAuth();
  const { storeDetail, setStoreDetail } = useStore();
  useEffect(() => {
    const userData = JSON.parse(window.localStorage.getItem(USER_KEY));
    (async () => {
      const data = await getStore(userData?.data?.storeId);
      setStoreDetail(data?.data)
    })();
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
