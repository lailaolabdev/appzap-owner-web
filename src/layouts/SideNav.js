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
  faUsers,
  faBeer,
  faShoppingCart,
  faBox,
  faBoxes
} from "@fortawesome/free-solid-svg-icons";
import { COLOR_APP, WAITING_STATUS } from "../constants";
import "./sidenav.css";
import { useStore } from "../store";
import { useTranslation } from "react-i18next";
import role from "../helpers/role";
import { getLocalData, getToken } from "../constants/api";
import { getCountOrderWaiting } from "../services/order";

export default function Sidenav({ location, navigate, onToggle }) {
  const {
    countOrderWaiting, setCountOrderWaiting,
    openTableData, getTableDataStore, storeDetail
  } = useStore();

  const [token, setToken] = useState();
  const [selected, setSelectStatus] = useState(
    location.pathname.split("/")[1].split("-")[0]
  );

  // useEffect
  useEffect(() => {
    (async () => {
      const TOKEN = await getToken();
      setToken(TOKEN);
    })();
  }, []);

  useEffect(() => {
    const fetchCountOrderWaiting = async () => {
      const count = await getCountOrderWaiting(storeDetail?._id);
      setCountOrderWaiting(count || 0)
    }

    fetchCountOrderWaiting();
  }, [selected])

  const UN_SELECTED_TAB_TEXT = "#606060";
  const { t } = useTranslation();
  const { profile } = useStore();
  const { user } = useStore();
  const itemList = [
    {
      title: "ສະຖານະຂອງໂຕະ",
      key: "tables",
      icon: faHome,
      typeStore: "",
      hidden: !storeDetail?.hasPOS,
      system: "tableManagement",
    },
    {
      title: "ລາຍການອໍເດີ້",
      key: "orders",
      typeStore: "",
      icon: faAddressCard,
      hidden: !storeDetail?.hasPOS,
      system: "orderManagement",
    },
    {
      title: t("financialStatic"),
      key: "report",
      icon: faTachometerAlt,
      typeStore: "",
      system: "reportManagement",
    },
    {
      title: "ຈັດການລາຍຈ່າຍ",
      key: "expends",
      icon: faBook,
      typeStore: "",
      system: "reportManagement",
    },
    {
      title: "ຈັດການການຈອງ",
      key: "reservations",
      icon: faList,
      typeStore: "",
      hidden: !storeDetail?.hasReservation,
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
      title: "ຈັດການເມນູອາຫານ",
      key: "menu",
      typeStore: "",
      icon: faBoxOpen,
      hidden: !storeDetail?.hasSmartMenu,
      system: "menuManagement",
    },
    {
      title: "ລາຍງານ (ໃໝ່)",
      key: "reports/sales-report",
      typeStore: "",
      icon: faChartLine,
      hidden: !storeDetail?.hasPOS,
      system: "reportManagement",
    },

    // {
    //   title: "ລາຍງານສະຕ໋ອກ",
    //   key: "reportStocks",
    //   typeStore: "",
    //   icon: faChartLine,
    //   hidden: !storeDetail?.hasPOS,
    //   system: "settingManagement",
    // },
    {
      title: "ສະຕ໊ອກ",
      key: "settingStore/stock",
      typeStore: "",
      icon: faBoxes,
      hidden: !storeDetail?.hasPOS,
      system: "stockManagement",
    },
    {
      title: "ຕັ້ງຄ່າຮ້ານຄ້າ",
      key: "settingStore",
      typeStore: "",
      icon: faCogs,
      hidden: !storeDetail?.hasPOS,
      system: "settingManagement",
    },

  ];

  const listForRole = itemList.filter((e) => {
    const verify = role(profile?.data?.role, profile?.data);
    return verify?.[e?.system] ?? false;
  });

  const popNoti = {
    position: "absolute",
    top: 0,
    left: 16,
    minWidth: 25,
    width: 'auto',
    height: 25,
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
    <SideNav
      style={{
        backgroundColor: "#FFFFFF",
        border: "solid 1px #E4E4E4",
        height: "100vh",
        display: "block",
        position: "fixed",
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
        {listForRole
          .filter((e) => !e?.hidden)
          .map((e) => (
            <NavItem
              eventKey={e?.key}
              style={{ backgroundColor: selected === e?.key ? "#ffff" : "" }}
            >

              <NavIcon>
                <FontAwesomeIcon
                  className={openTableData.length > 0 ? "scale-animation" : ""}
                  icon={e?.icon}
                  style={{
                    color:
                      selected === e?.key ? COLOR_APP : UN_SELECTED_TAB_TEXT,
                  }}
                />
                {(e?.key === 'orders' && countOrderWaiting > 0) && <span style={popNoti}>{countOrderWaiting}</span>}
              </NavIcon>
              <NavText
                style={{
                  color: selected === e?.key ? COLOR_APP : UN_SELECTED_TAB_TEXT,
                }}
              >
                {e?.title}
              </NavText>
              {e?.children?.map((element, index) => {
                return (
                  <NavItem
                    eventKey={element?.key}
                    style={{
                      backgroundColor: selected === element?.key ? "#ffff" : "",
                    }}
                  >
                    <NavText
                      style={{
                        color:
                          selected === element?.key
                            ? COLOR_APP
                            : UN_SELECTED_TAB_TEXT,
                      }}
                    >
                      {element?.title}
                    </NavText>
                  </NavItem>
                );
              })}
            </NavItem>
          ))}
        {role(profile?.data?.role, profile?.data)?.["settingManagement"] ? (
          <NavItem eventKey="songlist">
            <NavIcon>
              <FontAwesomeIcon
                className={openTableData.length > 0 ? "scale-animation" : ""}
                icon={faMusic}
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
              ລູກຄ້າຂໍເພງ
            </NavText>
          </NavItem>
        ) : (
          ""
        )}
        {role(profile?.data?.role, profile?.data)?.["settingManagement"] ? (
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
            <NavText
              style={{
                color: UN_SELECTED_TAB_TEXT,
              }}
            >
              ສະມາຊີກ
            </NavText>
          </NavItem>
        ) : (
          ""
        )}
        <NavItem eventKey="fark">
          <NavIcon>
            <FontAwesomeIcon
              className={openTableData.length > 0 ? "scale-animation" : ""}
              icon={faBeer}
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
            ຝາກສິນຄ້າ
          </NavText>
        </NavItem>
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
            ຕະຫຼາດ
          </NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav>
  );
}
