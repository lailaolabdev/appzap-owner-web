import React from "react";
import Login from "../pages/login/Login";
import { useRoutes } from "react-router-dom";

import MainLayout from "../layouts/MainLayout";

// import CheckBill from "../pages/Notification/CheckBill";
import BillForChef80 from "../components/bill/BillForChef80";
import BillForCheckOut80 from "../components/bill/BillForCheckOut80";
import BillForCheckOut58 from "../components/bill/BillForCheckOut58";
import BillForChef58 from "../components/bill/BillForChef58";
import Dashboard from "../pages/dashboard/Dashboard";
// import DashboardLoyverse from "../pages/dashboardLoyverse/Dashboard";
import MenuListMobile from "../pages/table/mobileView/MenuList";
import CartListMobile from "../pages/table/mobileView/Cart";
import HistoryUse from "../pages/historiesUse/HistoryUse";
import ReservationList from "../pages/reservation/ReservationList";
import Promotion from "../pages/promotion/Promotion";
import StoreDetail from "../pages/store/StoreDetail";
import WaitingOrder from "../pages/order/WaitingOrder";
import DoingOrder from "../pages/order/DoingOrder";
import ServedOrder from "../pages/order/ServedOrder";
import CanceledOrder from "../pages/order/CanceledOrder";
import Table from "../pages/table/TableList";
import AddOrder from "../pages/table/AddOrder";
import Histories from "../pages/histories/Histories";
import HistoryDetail from "../pages/histories/HistoryDetail";
import Notification from "../pages/Notification/NotificationCheckBill";
import HistoriesCheckBill from "../pages/Notification/HistoriesCheckBill";
import Qrcode from "../pages/qrcode/Qrcode";
import Users from "../pages/users/UserList";
import Category from "../pages/menu/Categorylist";
import MenuList from "../pages/menu/MenuList";
import FormAddMenu from "../pages/menu/form/FormAddMenu";
import FormAddMenuStock from "../pages/menu/form/FormAddMenuStock";
import StockList from "../pages/stock/StockList";
import StockCategory from "../pages/stock/Categorylist";
import StockHistory from "../pages/stock/HistoryList";
import SettingList from "../pages/settingStore/SettingList";
import SettingTable from "../pages/settingStore/SettingTable";
import MessagerList from "../pages/messager/MessagerList";
import ReservationDashboard from "../pages/reservation_dashboard/ReservationDashboard";
import SettingTheme from "../pages/setting_theme/settingTheme"

import MenuRoutes from "./Menu.routes";
import PrinterRoutes from "./Printer.routes";

function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/CheckBillOut/:billId",
      element: <BillForCheckOut80 />,
    },
    {
      path: "/BillForChef80",
      element: <BillForChef80 />, //not work
    },
    {
      path: "/BillForChef58",
      element: <BillForChef58 />, //not work
    },

    {
      path: "/dashboard/:storeId",
      element: <Dashboard />,
    },
    // {
    //   path: "/dashboard-loyverse/:storeId",
    //   element: <DashboardLoyverse />,
    // },
    {
      path: "/BillForCheckOut80",
      element: <BillForCheckOut80 />,
    },
    {
      path: "/BillForCheckOut58",
      element: <BillForCheckOut58 />,
    },
    {
      path: "/menus/:storeId/:tableId",
      element: <MenuListMobile />,
    },
    {
      path: "/cart/:storeId/:tableId",
      element: <CartListMobile />,
    },
    {
      path: "/history-use-only/:id",
      element: <HistoryUse />,
    },
    {
      path: "/public/reservation/:storeId",
      element: <ReservationList />,
    },
    {
      path: "/",
      element: <MainLayout />,
      children: [
        {
          path: "/report/:storeId",
          element: <Dashboard />,
        },
        {
          path: "/promotion",
          element: <Promotion />,
        },
        {
          path: "/settingStore/storeDetail/:id",
          element: <StoreDetail />,
        },
        {
          path: "/orders/waiting",
          element: <WaitingOrder />,
        },
        {
          path: "/orders/doing",
          element: <DoingOrder />,
        },
        {
          path: "/orders/served",
          element: <ServedOrder />,
        },
        {
          path: "/orders/canceled/pagenumber/:number",
          element: <CanceledOrder />,
        },
        {
          path: "/tables",
          element: <Table />,
        },
        // ຢຸດໃຊ້ເວຊັ້ນ v6^--------->
        {
          path: "/tables/pagenumber/:number/tableid/:tableId/:storeId",
          element: <Table />,
        },
        // <------------------ ||
        {
          path: "/addOrder/tableid/:tableId/code/:code",
          element: <AddOrder />,
        },
        {
          path: "/histories/pagenumber/:number/:id",
          element: <Histories />,
        },
        {
          path: "/histories/HistoryDetail/:id/:storeId",
          element: <HistoryDetail />,
        },
        {
          path: "/checkBill/:id",
          element: <Notification />,
        },
        {
          path: "/checkBill/:id/historiesCheckBill",
          element: <HistoriesCheckBill />,
        },
        {
          path: "/qrcode/pagenumber/:number",
          element: <Qrcode />,
        },
        {
          path: "/settingStore/users/limit/:limit/page/:page/:id",
          element: <Users />,
        },
        {
          path: "/settingStore/menu/category/limit/:limit/page/:page/:id",
          element: <Category />,
        },
        {
          path: "/settingStore/menu/limit/:limit/page/:page/:id",
          element: <MenuList />,
        },
        {
          path: "/settingStore/menu/add",
          element: <FormAddMenu />,
        },
        {
          path: "/settingStore/menu/menu-stock/:id",
          element: <FormAddMenuStock />,
        },
        {
          path: "/settingStore/menu/Edit/:id",
          element: <FormAddMenu />,
        },
        {
          path: "/settingStore/stock/limit/:limit/page/:page/:id",
          element: <StockList />,
        },
        {
          path: "/settingStore/stock/category/limit/:limit/page/:page/:id",
          element: <StockCategory />,
        },
        {
          path: "/settingStore/stock/history/limit/:limit/page/:page/:id",
          element: <StockHistory />,
        },
        {
          path: "/settingStore/:id",
          element: <SettingList />,
        },
        {
          path: "/settingStore/settingTable/:id",
          element: <SettingTable />,
        },
        {
          path: "/messagerList",
          element: <MessagerList />,
        },
        {
          path: "/historyUse/:id",
          element: <HistoryUse />,
        },
        {
          path: "/reservations",
          element: <ReservationList />,
        },
        {
          path: "/reservation-dashboard",
          element: <ReservationDashboard />,
        },
        {
          path: "/menu",
          element: <MenuList />,
        },
        {
          path: "/manageorder",
          element: <DoingOrder />,
        },
        {
          path: "/setting-theme",
          element: <SettingTheme />,
        },
        MenuRoutes,
        PrinterRoutes,
      ],
    },
    {
      path: "/testPrinter",
      element: <DoingOrder />,
    },
    {
      path: "*",
      element: <h3>404</h3>,
    },
  ]);
}

export default Router;
