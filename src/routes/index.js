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
import HistoryDetail from "../pages/histories/HistoryDetail";
import Login from "../pages/login/Login";
import Table from "../pages/table/TableList";
import Notification from "../pages/Notification/NotificationCheckBill";
import HistoriesCheckBill from "../pages/Notification/HistoriesCheckBill";
import CheckBill from "../pages/Notification/CheckBill";
import { BillForChef } from "../pages/order/BillForChef";

import Qrcode from "../pages/qrcode/Qrcode";
import Users from "../pages/users/UserList";
import Category from "../pages/menu/Categorylist";
import MenuList from "../pages/menu/MenuList";

import StoreDetail from '../pages/store/StoreDetail'
import StoreEdit from '../pages/store/StoreEdit'
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
  return (
    <Router>
      <Switch>
        {/* Before login routes */}
        <PublicRoute exact path="/" component={Login} />
        <PublicRoute exact path="/CheckBillOut" component={CheckBill} />
        <PublicRoute exact path="/BillForChef" component={BillForChef} />

        {/* After login routes (has SideNav and NavBar) */}
        <Route
          render={({ location, history }) => (
            <React.Fragment>
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
                    path="/storeDetail"
                    component={StoreDetail}
                  />
                  <PrivateRoute
                    exact
                    path="/storeDetail/storeEdit"
                    component={StoreEdit}
                  />
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
                    path="/histories/HistoryDetail/:id"
                    component={HistoryDetail}
                  />
                  <PrivateRoute
                    exact
                    path="/checkBill"
                    component={Notification}
                  />
                  <PrivateRoute
                    exact
                    path="/checkBill/historiesCheckBill"
                    component={HistoriesCheckBill}
                  />
                  <PrivateRoute
                    exact
                    path="/qrcode/pagenumber/:number"
                    component={Qrcode}
                  />
                  <PrivateRoute
                    exact
                    path="/users/limit/:limit/page/:page"
                    component={Users}
                  />
                  <PrivateRoute
                    exact
                    path="/menu/category/limit/:limit/page/:page"
                    component={Category}
                  />
                  <PrivateRoute
                    exact
                    path="/menu/limit/:limit/page/:page"
                    component={MenuList}
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
