import React, { useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../helpers";
import { useStore } from "../store";
import { getStore } from "../services/store";
import { getLocalData } from "../constants/api";

function PrivateRoute({ component: Component, headerTitle, ...rest }) {
  const isAuthenticated = useAuth();
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
