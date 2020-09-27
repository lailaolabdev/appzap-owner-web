import React from "react";
import { Route, Redirect } from "react-router-dom";

// custom import
// import { useAuth } from '../User/common/helpers'

/**
 *
 * return authenticated header & component
 */
function PrivateRoute({ component: Component, headerTitle, ...rest }) {
  //   const isAuthenticated = useAuth()
  const isAuthenticated = true;

  // if not authenticated, redirect to "/"
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated ? (
          <div>
            {/* <Header isAuthenticated headerTitle={headerTitle} /> */}
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
