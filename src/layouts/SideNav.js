import React, { useState, useEffect } from "react";
import SideNav, {
  Toggle,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import "@trendmicro/react-sidenav/dist/react-sidenav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faCogs,
  faHome,
  faList,
  faTachometerAlt,
  faChartBar,
  faAddressCard,
  faIcicles,
  faChartLine,
  faUser,
  faBook,
  faMusic,
  faBeer,
  faShoppingCart,
  faBoxes,
  faLayerGroup,
  faStoreAlt,
  faBuilding,
  faClock,
  faMoneyBill,
} from "@fortawesome/free-solid-svg-icons";
import { COLOR_APP, COLOR_GRAY, WAITING_STATUS } from "../constants";
import "./sidenav.css";
import { useStore } from "../store";
import { useTranslation } from "react-i18next";
import role from "../helpers/role";
import {  getToken } from "../constants/api";
import _ from "lodash";
import { fontMap } from "../utils/font-map";
import { useStoreStore } from "../zustand/storeStore";
import { useOrderStore } from "../zustand/orderStore";
import { useBookingStore } from "../zustand/bookingStore";
import PopUpOpenShift from "./../components/popup/PopUpOpenShift";
import { useShiftStore } from "../zustand/ShiftStore";

export default function Sidenav({ location, navigate, onToggle }) {
  const { openTableData, getTableDataStore } = useStore();

  const { storeDetail } = useStoreStore();
  const { waitingOrders } = useOrderStore();
  const { bookingWaitingLength, fetchBookingByStatus } = useBookingStore();


  const { profile } = useStore();
  const { user } = useStore();
  const [openPopUpShift, setOpenPopUpShift] = useState(false);
  const { shiftCurrent } = useShiftStore();
  const [status, setStatus] = useState(true);
  const [token, setToken] = useState();
  const [isTitle, setIsTitle] = useState(false);
  const [hasReportStock, setHasReportStock] = useState(false);
  const [hasReportDebt, setHasReportDebt] = useState(false);
  const [hasBranches, setHasBranches] = useState(false);
  const [hasOrders, setHasOrders] = useState(false);
  const [hasCafe, setHasCafe] = useState(false);
  const [hasCuctomrRequests, setHasCuctomrRequests] = useState(false);
  const [hasMarketing, setHasMarketing] = useState(false);
  const [hasMenu, setHasMenu] = useState(false);
  const [hasExpenses, setHasExpenses] = useState(false);
  const [hasReservation, setHasRevervation] = useState(false);
  const [hasProductExpenses, setHasProductExpress] = useState(false);
  const [hasFinancialstatistics, setHasFinancialStatistics] = useState(false);
  const [hasReportNew, setHasReportNew] = useState(false);
  const [hasTableStatus, setHasTableStatus] = useState(false);
  const [hasShopSetting, setHasShopSetting] = useState(false);
  const [profileRole ,setProfileRole] = useState(profile?.data?.role || null);
  const [firstFoundPermission, setFirstFoundPermission] = useState("");
  const [path ,setPath ]= useState("")

  

  const [selected, setSelectStatus] = useState(
    location.pathname.split("/")[1].split("-")[0]
  );

  const isPathInclude = (condition) =>
    _.includes(condition, selected.split("/page")[0]);

  // useEffect
  useEffect(() => {
    (async () => {
      const TOKEN = await getToken();
      setToken(TOKEN);
    })();
  }, []);

  useEffect(() => {
    const fetchBooking = async () => {
      await fetchBookingByStatus("WAITING");
    };
    fetchBooking();
  }, [fetchBookingByStatus]);
  const UN_SELECTED_TAB_TEXT = "#606060";
  const {
    t,
    i18n: { language },
  } = useTranslation();
 

  const appzapStaff = ["APPZAP_DEALER", "APPZAP_ADMIN", "APPZAP_KITCHEN", "APPZAP_COUNTER", "APPZAP_STAFF"];
  const appzapAdmin = "APPZAP_ADMIN";


  useEffect(() => {
    if (profile?.data?.permissionRoleId?.permissions) {
      const permissions = profile?.data?.permissionRoleId?.permissions;
      const permissionMap = [
        { set: setHasTableStatus, check: "TABLE_STATUS" },
        { set: setHasOrders, check: "MANAGE_ORDERS" },
        { set: setHasReportStock, check: "MANAGE_STOCK" },
        { set: setHasCafe, check: "MANAGE_CAFE" },
        { set: setHasExpenses, check: "MANAGE_EXPENSES" },
        { set: setHasRevervation, check: "MANAGE_RESERVATIONS" },
        { set: setHasMenu, check: "MANAGE_MENU" },
        { set: setHasReportNew, check: "REPORT_NEW" },
        { set: setHasFinancialStatistics, check: "FINANCIAL_STATISTICS" },
        { set: setHasBranches, check: "MANAGE_BRANCHES" },
        { set: setHasShopSetting, check: "SHOP_SETING" },
        { set: setHasProductExpress, check: "MANAGE_PRODUCT_EXPRESS" },
        { set: setHasReportDebt, check: "REPORT_INDEBTED" },
        { set: setHasCuctomrRequests, check: "MANAGE_CUSTOMER_REQUESTS" },
        { set: setHasMarketing, check: "MANAGE_MARKETING" },
      ];
      permissionMap.forEach(({ set, check }) => {
        set(permissions.includes(check));
      });
    }
  }, [profile?.data?.permissionRoleId?.permissions, profile,storeDetail]);


  const itemList = [
    {
      title: `${t("table_status")}`,
      key: storeDetail?.isShift
        ? shiftCurrent[0]?.status === "OPEN"
          ? "tables"
          : "shift-open-pages"
        : "tables",
      icon: faHome,
      typeStore: "",
      hidden:(!hasTableStatus && appzapStaff.includes(profileRole))|| !storeDetail?.hasPOS,
      system: "tableManagement",
    },
    {
      title: `${t("order_list")}`,
      key: "orders",
      typeStore: "",
      icon: faAddressCard,
      hidden: (!hasOrders && appzapStaff.includes(profileRole)) || !storeDetail?.hasPOS,
      system: "orderManagement",
    },
    {
      title: t("stock_manage"),
      key: "stock",
      // icon: BsArchive,
      icon: faBoxes,
      typeStore: "",
      hidden: (!hasReportStock && appzapStaff.includes(profileRole)) || !storeDetail?.hasPOS,
      system: "stockManagement",
    },
    {
      title: `${t("isCafe")}`,
      key: storeDetail?.isShift
        ? shiftCurrent[0]?.status === "OPEN"
          ? "cafe"
          : "shift-open-pages"
        : "cafe",
      icon: faStoreAlt,
      typeStore: storeDetail?.isRestuarant,
      hidden: (!hasCafe && appzapStaff.includes(profileRole)) || !storeDetail?.hasPOS,
      system: "tableManagement",
    },
    {
      title: `${t("paid_manage")}`,
      key: "expends",
      icon: faBook,
      typeStore: "",
      system: "reportManagement",
      hidden: !hasExpenses && appzapStaff.includes(profileRole),
    },
    {
      title: `${t("booking_manage")}`,
      key: "reservations",
      icon: faList,
      typeStore: "",
      hidden: (!hasReservation && appzapStaff.includes(profileRole)) || !storeDetail?.isReservable,
      system: "reservationManagement",
    },

    // {
    //   title: "ລາຍງານການຈອງ",
    //   key: "reservationDashboard",
    //   icon: faChartBar,
    //   typeStore: "",
    //   hidden: !storeDetail?.hasReservation,
    //   system: "reservationManagement",
    // },
    // {
    //   title: "ລູກຄ້າສັ່ງເອງ",
    //   key: "self-ordering-order",
    //   typeStore: "",
    //   icon: faUser,
    //   system: "orderManagement",
    // },

    {
      title: `${t("menu_manage")}`,
      key: "menu",
      typeStore: "",
      icon: faBoxOpen,
      hidden: (!hasMenu && appzapStaff.includes(profileRole)) || !storeDetail?.hasSmartMenu,
      system: "menuManagement",
    },

    // {
    //   title: "ລາຍງານ (ໃໝ່)",
    //   key: "reports/sales-report",
    //   typeStore: "",
    //   icon: faChartLine,
    //   hidden: !storeDetail?.hasPOS,
    //   system: "reportManagement",
    // },

    // {
    //   title: "ລາຍງານສະຕ໋ອກ",
    //   key: "reportStocks",
    //   typeStore: "",
    //   icon: faChartLine,
    // hidden: !storeDetail?.hasPOS,
    //   system: "settingManagement",
    // },
    // {
    //   title: "ສະຕ໊ອກ",
    //   key: "settingStore/stock",
    //   typeStore: "",
    //   icon: faBoxes,
    //   hidden: !storeDetail?.hasPOS,
    //   system: "stockManagement",
    // },
    // {
    //   title: "ຕັ້ງຄ່າຮ້ານຄ້າ",
    //   key: "settingStore",
    //   typeStore: "",
    //   icon: faCogs,
    //   hidden: !storeDetail?.hasPOS,
    //   system: "settingManagement",
    // },
  ]
    .filter((e) => e.title) // Filter out items with empty title

    .filter((e) => {
      const verify = role(profile?.data?.role, profile?.data,"","",path);
      return verify?.[e?.system] ?? false;
    })
    .filter((e) => !e?.hidden)
    .filter((e) => e.typeStore != "GENERAL");

  const itemReports = [
    {
      title: `${t("statistic_money")}`,
      key: "report",
      icon: faLayerGroup,
      typeStore: "",
      system: "reportManagement",
      hidden: !hasFinancialstatistics && appzapStaff.includes(profileRole),
    },
    {
      title: `${t("report_new")}`,
      key: "reports/sales-report",
      typeStore: "",
      icon: faChartLine,
      hidden:(!hasReportNew && appzapStaff.includes(profileRole) )|| !storeDetail?.hasPOS,
      system: "reportManagement",
    },
  ]
    .filter((e) => e.title) // Filter out items with empty title
    .filter((e) => {
      const verify = role(profile?.data?.role, profile?.data,"","",path);
      return verify?.[e?.system] ?? false;
    })
    .filter((e) => !e?.hidden);

  const settingNavItem = [
    {
      title: `${t("branch")}`,
      key: "branch",
      typeStore: "",
      icon: faBuilding,
      hidden: (!hasBranches && appzapStaff.includes(profileRole)) || !storeDetail?.hasPOS,
      system: "reportManagement",
    },
    {
      title: `${t("shift")}`,
      key: "shift",
      typeStore: "",
      icon: faClock,
      hidden: !storeDetail?.isShift,
      system: "reportManagement",
    },
    {
      title: `${t("shop_setting")}`,
      key: "settingStore",
      typeStore: "",
      icon: faCogs,
      hidden:(!hasShopSetting && appzapStaff.includes(profileRole)) || !storeDetail?.hasPOS,
      system: "settingManagement",
    },

    {
      title: `${t("deposit_goods")}`,
      key: "fark",
      typeStore: "",
      icon: faBeer,
      hidden: (!hasProductExpenses && appzapStaff.includes(profileRole)) || !storeDetail?.hasPOS,
      system: "farkManagement",
    },
    {
      title: `${t("debt")}`,
      key: "debt",
      typeStore: "",
      icon: faMoneyBill,
      hidden: (!hasReportDebt && appzapStaff.includes(profileRole)) || !storeDetail?.hasPOS,
      system: "reportManagement",
    },
  ]
    .filter((e) => {
      const verify = role(profile?.data?.role, profile?.data,"","",path);
      return verify?.[e?.system] ?? false;
    })
    .filter((e) => !e?.hidden);

  const listForRole = itemList.filter((e) => {
    const verify = role(profile?.data?.role, profile?.data,"","",path);
    return verify?.[e?.system] ?? false;
  });

  const popNoti = {
    position: "absolute",
    top: 0,
    right: 5,
    minWidth: 20,
    width: "auto",
    height: 20,
    fontSize: 12,
    borderRadius: "50%",
    background: "red",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
  };

  // console.log("=====::::===", { countOrderWaiting })

  return (
    <>
      <SideNav
        style={{
          backgroundColor: "#FFFFFF",
          border: "solid 1px #E4E4E4",
          height: "100vh",
          display: "block",
          position: "fixed",
          overflow: "auto",
        }}
        onSelect={(selected) => {
          setSelectStatus(selected.split("/")[0].split("-")[0]);
          if (selected === "dashboard") {
            selected = selected + "/" + storeDetail?._id;
          }
          if (selected === "report") {
            selected = selected + "/" + storeDetail?._id;
          }
          if (selected === "histories") {
            selected = selected + "/pagenumber/" + 1 + "/" + storeDetail?._id;
          }
          if (selected === "users") {
            selected =
              selected + "/limit/" + 40 + "/page/" + 1 + "/" + storeDetail?._id;
          }
          if (selected === "settingStore/stock") {
            selected =
              selected + "/limit/" + 40 + "/page/" + 1 + "/" + storeDetail?._id;
          }
          if (selected === "expends") {
            selected = selected + "/limit/" + 40 + "/skip/" + 1;
          }
          if (selected === "category") {
            selected =
              selected + "/limit/" + 40 + "/page/" + 1 + "/" + storeDetail?._id;
          }
          if (selected === "settingStore") {
            selected = selected + `/${storeDetail?._id}`;
          }
          if (selected === "depositBeer") {
            selected = selected + `/${storeDetail?._id}`;
          }
          if (selected === "cafe") {
            selected = selected;
          }
          if (selected === "stock") {
            selected = selected;
          }
          if (selected === "songlist") {
            window
              .open(
                "https://dtf6wpulhnd0r.cloudfront.net/store/songs/" +
                `${storeDetail?._id}?token=${token}`,
                "_blank"
              )
              .focus();
            return;
          }
          if (selected === "customerList") {
            window
              .open(
                "https://d3ttcep1vkndfn.cloudfront.net/store/crm_customers/" +
                `${storeDetail?._id}?token=${token}`,
                "_blank"
              )
              .focus();
            return;
          }
          if (selected === "supplier") {
            window.open("https://supplier.appzap.la", "_blank").focus();
            return;
          }
          const to = "/" + selected;

          if (location.pathname !== to) {
            navigate(to);
          }
        }}
        onToggle={(expanded) => {
          onToggle(expanded);
        }}
      >
        <Toggle />
        <SideNav.Nav value={location.pathname.split("/")[1]}>
          <hr style={{ marginTop: "-.05em" }} />
          {listForRole
            .filter((e) => !e?.hidden)
            .map((e, index) => (
              <NavItem
                eventKey={e?.key}
                key={index}
                style={{ backgroundColor: selected === e?.key ? "#ffff" : "" }}
              >
                <NavIcon>
                  <FontAwesomeIcon
                    className={
                      openTableData.length > 0 ? "scale-animation" : ""
                    }
                    icon={e?.icon}
                    style={{
                      color:
                        selected === e?.key ? COLOR_APP : UN_SELECTED_TAB_TEXT,
                      fontSize: 16,
                    }}
                  />
                  {e?.key === "orders" && waitingOrders.length > 0 && (
                    <span style={popNoti}>{waitingOrders.length}</span>
                  )}
                </NavIcon>
                <NavText>
                  <b
                    style={{
                      color:
                        selected === e?.key ? COLOR_APP : UN_SELECTED_TAB_TEXT,
                    }}
                    className={fontMap[language]}
                  >
                    {" "}
                    {e?.title}
                  </b>
                </NavText>
                {e?.children?.map((element, index) => {
                  return (
                    <NavItem
                      eventKey={element?.key}
                      key={index}
                      style={{
                        backgroundColor:
                          selected === element?.key ? "#ffff" : "",
                      }}
                    >
                      <NavText
                        style={{
                          color:
                            selected === element?.key
                              ? COLOR_APP
                              : UN_SELECTED_TAB_TEXT,
                        }}
                        className={fontMap[language]}
                      >
                        {element?.title}
                      </NavText>
                    </NavItem>
                  );
                })}
              </NavItem>
            ))}
          <hr />

          {itemReports?.length !== 0 ? (
            <NavItem
              eventKey="reportGroups"
              style={{
                color:
                  isPathInclude(["report"]) || isPathInclude(["reports"])
                    ? COLOR_APP
                    : COLOR_GRAY,
              }}
            >
              <NavIcon>
                <FontAwesomeIcon
                  className={openTableData.length > 0 ? "scale-animation" : ""}
                  icon={faTachometerAlt}
                  style={{
                    color:
                      isPathInclude(["report"]) || isPathInclude(["reports"])
                        ? COLOR_APP
                        : COLOR_GRAY,
                  }}
                />
              </NavIcon>
              <NavText>
                <b
                  style={{
                    color: UN_SELECTED_TAB_TEXT,
                  }}
                  className={fontMap[language]}
                >
                  {t("report")}
                </b>
              </NavText>

              {itemReports.map((elm, index) => (
                <NavItem key={index} eventKey={elm?.key}>
                  <NavText>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "start",
                        height: 40,
                        alignItems: "center",
                        gap: 8,
                        width: "100%",
                      }}
                    >
                      <div>
                        <FontAwesomeIcon
                          className={
                            openTableData.length > 0 ? "scale-animation" : ""
                          }
                          icon={elm?.icon}
                          style={{
                            color:
                              selected === elm?.key ? COLOR_APP : COLOR_GRAY,
                            marginTop: "-2em",
                          }}
                        />
                      </div>
                      <p
                        style={{
                          paddingTop: 13,
                          fontSize: 15,
                          color: selected === elm?.key ? COLOR_APP : COLOR_GRAY,
                        }}
                        className={fontMap[language]}
                      >
                        {elm?.title}
                      </p>
                    </div>
                  </NavText>
                </NavItem>
              ))}
            </NavItem>
          ) : (
            ""
          )}
          {settingNavItem?.map((e, index) => (
            <NavItem key={index} eventKey={e?.key}>
              <NavIcon>
                <FontAwesomeIcon
                  className={openTableData.length > 0 ? "scale-animation" : ""}
                  icon={e?.icon}
                  style={{
                    color: isPathInclude([e?.key]) ? COLOR_APP : COLOR_GRAY,
                  }}
                />
                {e?.key === "orders" && waitingOrders.length > 0 && (
                  <span style={popNoti}>{waitingOrders.length}</span>
                )}
                {e?.key === "reservations" && bookingWaitingLength > 0 && (
                  <span style={popNoti}>{bookingWaitingLength}</span>
                )}
              </NavIcon>
              <NavText>
                <b
                  style={{
                    color: isPathInclude([e?.key]) ? COLOR_APP : COLOR_GRAY,
                  }}
                  className={fontMap[language]}
                >
                  {e?.title}
                </b>
              </NavText>
            </NavItem>
          ))}
          <hr />
          {/* {role(profile?.data?.role, profile?.data)?.["settingManagement"] ? (
          <NavItem eventKey="customerList">
            <NavIcon>
              <FontAwesomeIcon
                className={openTableData.length > 0 ? "scale-animation" : ""}
                icon={faUsers}
                style={{
                  color: UN_SELECTED_TAB_TEXT,
                }}
              />
            </NavIcon>
            <NavText>
              <b
                style={{
                  color: UN_SELECTED_TAB_TEXT,
                }}
              >
                ສະມາຊີກ
              </b>
            </NavText>
          </NavItem>
        ) : (
          ""
        )} */}
          {
            (hasCuctomrRequests && appzapStaff.includes(profileRole)) || (profileRole === appzapAdmin) ? <NavItem eventKey="songlist">
              <NavIcon>
                <FontAwesomeIcon
                  className={openTableData.length > 0 ? "scale-animation" : ""}
                  icon={faMusic}
                  style={{
                    color: UN_SELECTED_TAB_TEXT,
                  }}
                />
              </NavIcon>
              <NavText>
                <b
                  style={{
                    color: UN_SELECTED_TAB_TEXT,
                  }}
                  className={fontMap[language]}
                >
                  {t("require_music")}
                </b>
              </NavText>
            </NavItem> : ""
          }

          {
            (hasMarketing && appzapStaff.includes(profileRole)) || (profileRole === appzapAdmin) ? (
              <NavItem eventKey="supplier">
                <NavIcon>
                  <FontAwesomeIcon
                    className={openTableData.length > 0 ? "scale-animation" : ""}
                    icon={faShoppingCart}
                    style={{
                      color: UN_SELECTED_TAB_TEXT,
                    }}
                  />
                </NavIcon>
                <NavText
                  style={{
                    color: UN_SELECTED_TAB_TEXT,
                  }}
                >
                  <b
                    style={{
                      color: COLOR_GRAY,
                    }}
                    className={fontMap[language]}
                  >
                    {t("market")}
                  </b>
                </NavText>
              </NavItem>
            ) : ""
          }
        </SideNav.Nav>
      </SideNav>
    </>
  );
}
