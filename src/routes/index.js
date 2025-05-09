import React from "react";
import Login from "../pages/login/Login";
import { useRoutes } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

// import CheckBill from "../pages/Notification/CheckBill";
import Dashboard from "../pages/dashboard/Dashboard";
import MenuListMobile from "../pages/table/mobileView/MenuList";
import CartListMobile from "../pages/table/mobileView/Cart";
import HistoryUse from "../pages/historiesUse/HistoryUse";
import ReservationList from "../pages/reservation/ReservationList";
import Promotion from "../pages/promotion/Promotion";
import StoreDetail from "../pages/store/StoreDetail";
import DoingOrder from "../pages/order/DoingOrderTab";
import Table from "../pages/table/TableList";
import AddOrder from "../pages/table/AddOrder";
import Homecafe from "../pages/cafe_home/Homecafe";
import Histories from "../pages/histories/Histories";
import HistoryDetail from "../pages/histories/HistoryDetail";
import Notification from "../pages/Notification/NotificationCheckBill";
import HistoriesCheckBill from "../pages/Notification/HistoriesCheckBill";
import Qrcode from "../pages/qrcode/Qrcode";
import Users from "../pages/users/UserList";
import Category from "../pages/menu/Categorylist";
import MenuList from "../pages/menu/MenuList";
import MenuOptionList from "../pages/menu/MenuOptionList";
import FoodList from "../pages/FoodSetting/FoodList";
import FoodTypeList from "../pages/FoodSetting/FoodTypeList";
import FormAddMenu from "../pages/menu/form/FormAddMenu";
import FormAddMenuStock from "../pages/menu/form/FormAddMenuStock";
import StockList from "../pages/stock/StockList";
import StockCategory from "../pages/stock/Categorylist";
import StockHistory from "../pages/stock/HistoryList";
import SettingList from "../pages/settingStore/SettingList";
import MessagerList from "../pages/messager/MessagerList";
import ReservationDashboard from "../pages/reservation_dashboard/ReservationDashboard";

// add new
import CreateMembers from "../pages/member/CreateMembers";

// import SettingTheme from "../pages/setting_theme/SettingTheme";
import SettingPromotion from "../pages/settingStore/settingPromotion";
import _404 from "../pages/404";
import CreateMemberPageWithDebt from "../pages/member/CreateMemberPageWithDebt";

import MenuRoutes from "./Menu.routes";
import PrinterRoutes from "./Printer.routes";
import AuthRoutes from "./Auth.routes";
import OrderRoutes from "./Order.routes";
import DesignRoutes from "./Design.routes";
import TableRoutes from "./Table.routes";
import ReportRoutes from "./Report.routes";
import DashboardRoutes from "./Dashboard.routes";
import StaffRoutes from "./Staff.routes";
import AudioRoutes from "./Audio.routes";
import ComponentRoutes from "./Component.routes";
import AddOrderRoutes from "./AddOrder.routes";
import ExpendsRoutes from "./Expend.routes";

//expend
import AddIncomeAndExpend from "../pages/expend/component/AddIncomeAndExpend";
import EditIncomeAndExpend from "../pages/expend/component/EditIncomeAndExpend";
import DetailExpend from "../pages/expend/component/DetailExpend";
import ConfigRoutes from "./Config.routes";
import SelfOrderingOrderRoutes from "./SelfOrderingOrder.routes";
import CurrencyList from "../pages/currency/CurrencyList";
import BannerList from "../pages/banner/BannerList";

import DepositBeer from "../pages/depositBeer/index";
import FarkRoutes from "./Fark.routes";
import DebtRoutes from "./Debt.routes";
import BranchRoutes from "./Branch.routes";
import UserRoutes from "./User.routes";
import PinRoutes from "./Pin.routes";
import PolicyRoutes from "./Policy.routes";
import CategoryType from "../pages/menu/CategoryType";
import HistorySale from "../pages/cafe_home/HistorySale";
import ZoneList from "../pages/zone/ZoneList";
import BankList from "../pages/bank/BankList";
import Delivery from "../pages/delivery/Delivery";
import BillSplit from "../pages/split_bill/BillSplit";
import ManageCounterList from "../pages/manageCounter/manageCounter";
import StockCreate from "../pages/stock/StockCreate";
import StockCreateCategory from "../pages/stock/StockCreateCategory";
import ReportStocks from "../pages/report/ReportStocks";
import SettingStock from "../pages/stock/SettingStock";
import ShiftList from "../pages/shift/Shift";
import ShiftOpenPages from "../pages/shift/ShiftOpenPages";
import SecondScreen from "../pages/secondScreen/SecondScreen";
import MainScreen from "../pages/secondScreen/MainScreen";
import ManagementRole from "../pages/role/Role";

import MemberPage from "../pages/member/MemberPage";
import DashboardPage from "../pages/dashboardnew/DashboardPage";
import SettingMemberPointPage from "../pages/member/SettingMemberPointPage";
import DiscountForm from "../pages/promotion/components/DiscountForm";
import BuyXGetYForm from "../pages/promotion/components/BuyXGetYForm";
import EditDiscountForm from "../pages/promotion/components/EditDiscountForm";
import EditBuyXGetYForm from "../pages/promotion/components/EditBuyXGetYForm";
import HistoryBankTransferClaim from "../pages/claim/HistoryBankTransferClaim";
import HomecafeEdit from "../pages/cafe_home/HomecafeEdit";
import EditMenu from "../pages/menu/EditMenu";
import BuyXGetYDetail from "../pages/promotion/components/BuyXGetYDetail";
import DiscountDetail from "../pages/promotion/components/DiscountDetail";
function Router() {
  return useRoutes([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/dashboard/:storeId",
      element: <Dashboard />,
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
      path: "/add/newMembers",
      element: <CreateMembers />,
    },

    {
      path: "/create/members",
      element: <CreateMemberPageWithDebt />,
    },
    {
      path: "/second-screen",
      element: <SecondScreen />,
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
          path: "/promotion/discount/:type",
          element: <DiscountForm />,
        },
        {
          path: "/promotion/discount/edit/:promotionId",
          element: <EditDiscountForm />,
        },
        {
          path: "/promotion/discount/detail/:promotionId",
          element: <DiscountDetail />,
        },
        {
          path: "/promotion/buyXGetX/:type",
          element: <BuyXGetYForm />,
        },
        {
          path: "/promotion/buyXGetX/edit/:promotionId",
          element: <EditBuyXGetYForm />,
        },
        {
          path: "/promotion/buyXGetX/detail/:promotionId",
          element: <BuyXGetYDetail />,
        },
        {
          path: "/settingStore/storeDetail/:id",
          element: <StoreDetail />,
        },
        {
          path: "/settingStore/banner",
          element: <BannerList />,
        },
        {
          path: "/tables",
          element: <Table />,
        },
        {
          // path: "/bill/split/:oldId/:newId",
          path: "/bill/split/:newId",
          element: <BillSplit />,
        },

        // ຢຸດໃຊ້ເວຊັ້ນ v6^--------->
        {
          path: "/tables/pagenumber/:number/tableid/:tableId/:storeId",
          element: <Table />,
        },
        // <------------------ ||
        {
          path: "/cafe",
          element: <Homecafe />,
        },
        {
          path: "/cafe/Edit/:billId",
          element: <HomecafeEdit />,
        },
        {
          path: "/history-cafe-sale",
          element: <HistorySale />,
        },
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
          path: "/settingStore/currency/:id",
          element: <CurrencyList />,
        },
        {
          path: "/settingStore/bank/:id",
          element: <BankList />,
        },
        {
          path: "/settingStore/role",
          element: <ManagementRole />,
        },
        {
          path: "/user/manage-counter/:id",
          element: <ManageCounterList />,
        },
        {
          path: "/settingStore/delivery/:id",
          element: <Delivery />,
        },
        {
          path: "/settingStore/menu/category/limit/:limit/page/:page/:id",
          element: <Category />,
        },
        {
          path: "/settingStore/menu/category-type",
          element: <CategoryType />,
        },
        {
          path: "/settingStore/menu/limit/:limit/page/:page/:id",
          element: <MenuList />,
        },
        {
          path: "/settingStore/menu-option/limit/:limit/page/:page/:id",
          element: <MenuOptionList />,
        },
        {
          path: "/food-setting/limit/:limit/page/:page",
          element: <FoodList />,
        },
        {
          path: "/shift",
          element: <ShiftList />,
        },
        {
          path: "/shift-open-pages",
          element: <ShiftOpenPages />,
        },
        {
          path: "/food-setting/food-type/limit/:limit/page/:page",
          element: <FoodTypeList />,
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
          element: <ReportStocks />,
        },
        {
          path: "/stock",
          element: <ReportStocks />,
        },
        {
          path: "/stock/Editing",
          element: <SettingStock />,
        },
        {
          path: "/stockCategory",
          element: <StockCategory />,
        },
        {
          path: "/settingStore/stock/add",
          element: <StockCreate />,
        },
        {
          path: "/settingStore/reportStock",
          element: <ReportStocks />,
        },
        {
          path: "/settingStore/stock/addCategory",
          element: <StockCreateCategory />,
        },
        {
          path: "/settingStore/settingPromotion/:id",
          element: <SettingPromotion />,
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
          path: "/depositBeer/:storeId",
          element: <DepositBeer />,
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
          path: "/reservationDashboard",
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
        // {
        //   path: "/settingTheme",
        //   element: <SettingTheme />,
        // },
        {
          path: "add-expend",
          element: <AddIncomeAndExpend />,
        },
        {
          path: "edit-expend/:id",
          element: <EditIncomeAndExpend />,
        },
        {
          path: "detail-expend/:id",
          element: <DetailExpend />,
        },
        {
          path: "/settingStore/settingZone/:id",
          element: <ZoneList />,
        },
        {
          path: "/setting-screen",
          element: <MainScreen />,
        },
        {
          path: "/member/crm",
          element: <MemberPage />,
        },
        {
          path: "/DashboardPage",
          element: <DashboardPage />,
        },
        {
          path: "/DashboardPage",
          element: <DashboardPage />,
        },
        {
          path: "/point-seting",
          element: <SettingMemberPointPage />,
        },
        {
          path: "/claim/:storeId",
          element: <HistoryBankTransferClaim />,
        },
        {
          path: "/settingStore/edit-menu/:storeId",
          element: <EditMenu />,
        },

        OrderRoutes,
        PrinterRoutes,
        DesignRoutes,
        TableRoutes,
        ReportRoutes,
        DashboardRoutes,
        ExpendsRoutes,
        MenuRoutes,
        StaffRoutes,
        AddOrderRoutes,
        AudioRoutes,
        ConfigRoutes,
        SelfOrderingOrderRoutes,
        FarkRoutes,
        DebtRoutes,
        BranchRoutes,
        UserRoutes,
        PinRoutes,
      ],
    },
    ComponentRoutes,
    AuthRoutes,
    PolicyRoutes,
    {
      path: "/testPrinter",
      element: <DoingOrder />,
    },
    {
      path: "*",
      element: <_404 />,
    },
  ]);
}

export default Router;
