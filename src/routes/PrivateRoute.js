import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../helpers"

function PrivateRoute({ component: Component, headerTitle, ...rest }) {
  const isAuthenticated = useAuth()
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
  )
}

export default PrivateRoute;
