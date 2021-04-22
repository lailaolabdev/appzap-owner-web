import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import styled from "styled-components";
import socketIOClient from "socket.io-client";

import Navbar from "../layouts/Navbar";
import Sidenav from "../layouts/SideNav";
import { END_POINT } from "../constants";

/**
 * pages
 */
import Order from "../pages/order";
import DoingOrder from "../pages/order/DoingOrder";
import ServedOrder from "../pages/order/ServedOrder";
import CanceledOrder from "../pages/order/CanceledOrder";
import Histories from "../pages/histories/Histories";
import Login from "../pages/login/Login";
import Table from "../pages/table/TableList";
import Qrcode from "../pages/qrcode/Qrcode";
const Main = styled.main`
  /* position: relative; */
  overflow: hidden;
  transition: all 0.15s;
  padding: 0 20px;
  margin-left: ${(props) => (props.expanded ? 240 : 60)}px;
`;
const Index = () => {
  const [expanded, setExpanded] = React.useState(false);

  const _onToggle = (exp) => {
    setExpanded(exp);
  };
  // ======>>>
  useEffect(() => {
    const socket = socketIOClient(END_POINT);
    socket.on("createorder", (_) => {
      window.location.reload();
    });
    socket.on("checkout", (_) => {
      window.location.reload();
    });
  }, []);
  return (
    <Router>
      <Switch>
        {/* Before login routes */}
        <PublicRoute exact path="/" component={Login} />

        {/* After login routes (has SideNav and NavBar) */}
        <Route
          render={({ location, history }) => (
            <React.Fragment>
              {/* navbar */}
              <Navbar />
              <Sidenav
                location={location}
                history={history}
                onToggle={(exp) => _onToggle(exp)}
              />
              {/* sidenav */}
              <Main>
                {/* Contents */}
                <div
                  style={{
                    marginTop: 70,
                  }}
                >
                  {/* private routes */}
                  <PrivateRoute
                    exact
                    path="/orders/pagenumber/:number"
                    component={Order}
                  />
                  <PrivateRoute
                    exact
                    path="/orders/doing/pagenumber/:number"
                    component={DoingOrder}
                  />
                  <PrivateRoute
                    exact
                    path="/orders/served/pagenumber/:number"
                    component={ServedOrder}
                  />
                  <PrivateRoute
                    exact
                    path="/orders/canceled/pagenumber/:number"
                    component={CanceledOrder}
                  />
                  <PrivateRoute
                    exact
                    path="/tables/pagenumber/:number/tableid/:tableId"
                    component={Table}
                  />
                  <PrivateRoute
                    exact
                    path="/histories/pagenumber/:number"
                    component={Histories}
                  />
                  <PrivateRoute
                    exact
                    path="/qrcode/pagenumber/:number"
                    component={Qrcode}
                  />
                </div>
              </Main>
            </React.Fragment>
          )}
        />
      </Switch>
    </Router>
  );
};

export default Index;
