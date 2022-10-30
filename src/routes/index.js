import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import styled from "styled-components";
// import socketIOClient from "socket.io-client";

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
import AddOrder from "../pages/table/AddOrder";
import Notification from "../pages/Notification/NotificationCheckBill";
import HistoriesCheckBill from "../pages/Notification/HistoriesCheckBill";
import CheckBill from "../pages/Notification/CheckBill";
import { BillForChef } from "../pages/bill/BillForChef";

import Qrcode from "../pages/qrcode/Qrcode";
import Users from "../pages/users/UserList";
import Category from "../pages/menu/Categorylist";
import MenuList from "../pages/menu/MenuList";
import FormAddMenu from "../pages/menu/form/FormAddMenu";
import FormEditMenu from "../pages/menu/form/FormEditMenu";
import FormAddMenuStock from "../pages/menu/form/FormAddMenuStock";
import StockList from "../pages/stock/StockList";
import StockCategory from "../pages/stock/Categorylist";
import StockHistory from "../pages/stock/HistoryList";
import ReservationList from "../pages/reservation/ReservationList";

import StoreDetail from "../pages/store/StoreDetail";
// ===========> Setting ============>
import SettingList from "../pages/settingStore/SettingList";
import SettingTable from "../pages/settingStore/SettingTable";
// ===========> Dashboard ============>
import Dashboard from "../pages/dashboard/Dashboard";
import DashboardLoyverse from "../pages/dashboardLoyverse/Dashboard";
// ===========> Promotion ============>
import Promotion from "../pages/promotion/Promotion";
// ===========> HistoryUse ============>
import HistoryUse from "../pages/historiesUse/HistoryUse";

// ===========> MessagerList ============>
import MessagerList from "../pages/messager/MessagerList";
import MenuListMobile from "../pages/table/mobileView/MenuList";
import CartListMobile from "../pages/table/mobileView/Cart";
import ReservationDashboard from "../pages/reservation_dashboard/ReservationDashboard";

import MenuRoutes from "./Menu.routes";

const Main = styled.main`
  /* position: relative; */
  overflow: hidden;
  transition: all 0.15s;
  padding: 0 20px;
  margin-left: ${(props) => (props.expanded ? 240 : 60)}px;
`;
function Index() {
  const [expanded, setExpanded] = React.useState(false);

  const _onToggle = (exp) => {
    setExpanded(exp);
  };

  return (
    <Router>
      <Switch>
        {/* Before login routes */}
        <PublicRoute exact path="/" component={Login} />
        <PublicRoute exact path="/CheckBillOut/:id" component={CheckBill} />
        <PublicRoute exact path="/BillForChef" component={BillForChef} />
        <PublicRoute exact path="/dashboard/:storeId" component={Dashboard} />
        <PublicRoute
          exact
          path="/dashboard-loyverse/:storeId"
          component={DashboardLoyverse}
        />
        <PublicRoute
          exact
          path="/menus/:storeId/:tableId"
          component={MenuListMobile}
        />
        <PublicRoute
          exact
          path="/cart/:storeId/:tableId"
          component={CartListMobile}
        />
        {/* After login routes (has SideNav and NavBar) */}
        <PrivateRoute
          exact
          path="/history-use-only/:id"
          component={HistoryUse}
        />
        <PublicRoute 
        exact
        path="/public/reservation/:storeId"
        component={ReservationList}
        />
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
              <Main style={{ padding: 0 }}>
                {/* Contents */}
                <div
                  style={{
                    marginTop: 65,
                  }}
                >
                  {/* private routes */}
                  <PrivateRoute
                    exact
                    path="/report/:storeId"
                    component={Dashboard}
                  />
                  <PrivateRoute exact path="/promotion" component={Promotion} />
                  <PrivateRoute
                    exact
                    path="/settingStore/storeDetail/:id"
                    component={StoreDetail}
                  />
                  <PrivateRoute
                    exact
                    path="/orders/pagenumber/:number/:id"
                    component={Order}
                  />
                  <PrivateRoute
                    exact
                    path="/orders/doing/pagenumber/:number/:id"
                    component={DoingOrder}
                  />
                  <PrivateRoute
                    exact
                    path="/orders/served/pagenumber/:number/:id"
                    component={ServedOrder}
                  />
                  <PrivateRoute
                    exact
                    path="/orders/canceled/pagenumber/:number"
                    component={CanceledOrder}
                  />
                  <PrivateRoute
                    exact
                    path="/tables/pagenumber/:number/tableid/:tableId/:storeId"
                    component={Table}
                  />
                  <PrivateRoute
                    exact
                    path="/addOrder/tableid/:tableId/code/:code"
                    component={AddOrder}
                  />
                  <PrivateRoute
                    exact
                    path="/histories/pagenumber/:number/:id"
                    component={Histories}
                  />
                  <PrivateRoute
                    exact
                    path="/histories/HistoryDetail/:id/:storeId"
                    component={HistoryDetail}
                  />
                  <PrivateRoute
                    exact
                    path="/checkBill/:id"
                    component={Notification}
                  />
                  <PrivateRoute
                    exact
                    path="/checkBill/:id/historiesCheckBill"
                    component={HistoriesCheckBill}
                  />
                  <PrivateRoute
                    exact
                    path="/qrcode/pagenumber/:number"
                    component={Qrcode}
                  />
                  <PrivateRoute
                    exact
                    path="/settingStore/users/limit/:limit/page/:page/:id"
                    component={Users}
                  />
                  <PrivateRoute
                    exact
                    path="/settingStore/menu/category/limit/:limit/page/:page/:id"
                    component={Category}
                  />
                  <PrivateRoute
                    exact
                    path="/settingStore/menu/limit/:limit/page/:page/:id"
                    component={MenuList}
                  />
                  <PrivateRoute
                    exact
                    path="/settingStore/menu/add"
                    component={FormAddMenu}
                  />
                  <PrivateRoute
                    exact
                    path="/settingStore/menu/menu-stock/:id"
                    component={FormAddMenuStock}
                  />
                  <PrivateRoute
                    exact
                    path="/settingStore/menu/Edit/:id"
                    component={FormAddMenu}
                  />

                  <PrivateRoute
                    exact
                    path="/settingStore/stock/limit/:limit/page/:page/:id"
                    component={StockList}
                  />
                  <PrivateRoute
                    exact
                    path="/settingStore/stock/category/limit/:limit/page/:page/:id"
                    component={StockCategory}
                  />
                  <PrivateRoute
                    exact
                    path="/settingStore/stock/history/limit/:limit/page/:page/:id"
                    component={StockHistory}
                  />
                  <PrivateRoute
                    exact
                    path="/settingStore/:id"
                    component={SettingList}
                  />
                  <PrivateRoute
                    exact
                    path="/settingStore/settingTable/:id"
                    component={SettingTable}
                  />
                  <PrivateRoute
                    exact
                    path="/messagerList"
                    component={MessagerList}
                  />

                  <PrivateRoute
                    exact
                    path="/historyUse/:id"
                    component={HistoryUse}
                  />
                  <PrivateRoute
                    exact
                    path="/reservations"
                    component={ReservationList}
                  />
                  <PrivateRoute
                    exact
                    path="/reservation-dashboard"
                    component={ReservationDashboard}
                  />
                  <PrivateRoute exact path="/menu" component={MenuList} />
                  <MenuRoutes />
                </div>
              </Main>
            </React.Fragment>
          )}
        />
      </Switch>
    </Router>
  );
}

export default Index;
