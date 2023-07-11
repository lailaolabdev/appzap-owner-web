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
} from "@fortawesome/free-solid-svg-icons";
import { COLOR_APP, WAITING_STATUS } from "../constants";
import "./sidenav.css";
import { useStore } from "../store";
import { useTranslation } from "react-i18next";
import role from "../helpers/role";

export default function Sidenav({ location, navigate, onToggle }) {
  const [selected, setSelectStatus] = useState(
    location.pathname.split("/")[1].split("-")[0]
  );
  const UN_SELECTED_TAB_TEXT = "#606060";
  const { t } = useTranslation();
  const { profile } = useStore();

  const { openTableData, getTableDataStore, storeDetail } = useStore();
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
      title: "ຈັດການການຈອງ",
      key: "reservations",
      icon: faList,
      typeStore: "",
      hidden: !storeDetail?.hasReservation,
      system: "reservationManagement",
    },
    {
      title: "ລາຍງານການຈອງ",
      key: "reservationDashboard",
      icon: faChartBar,
      typeStore: "",
      hidden: !storeDetail?.hasReservation,
      system: "reservationManagement",
    },
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
      key: "reportmenu",
      typeStore: "",
      icon: faChartLine,
      hidden: !storeDetail?.hasSmartMenu,
      system: "reportManagement",
    },
    {
      title: "Dashboard (ໃໝ່)",
      key: "dashboardmenu",
      typeStore: "",
      icon: faChartLine,
      hidden: !storeDetail?.hasSmartMenu,
      system: "reportManagement",
      children: [
        {
          title: "Dashboard (ໃໝ່)",
          key: "dashboardmenu",
          typeStore: "",
          icon: faChartLine,
          hidden: !storeDetail?.hasSmartMenu,
          system: "reportManagement",
        },
      ],
    },
    {
      title: "ຕັ້ງຄ່າຮ້ານຄ້າ",
      key: "settingStore",
      typeStore: "",
      icon: faCogs,
      hidden: !storeDetail?.hasPOS,
      system: "settingManagement",
    },
    {
      title: "ປ່ຽນຕຣີມ",
      key: "settingTheme",
      typeStore: "",
      icon: faIcicles,
      // hidden: !storeDetail?.hasPOS,
      system: "themeManagement",
    },
  ];

  const listForRole = itemList.filter((e) => {
    const verify = role(profile?.data?.role, profile?.data);
    return verify?.[e?.system] ?? false;
  });

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
        // if (selected === "orders") {
        //   selected = selected + "/pagenumber/" + 1 + "/" + storeDetail?._id;
        // }
        if (selected === "histories") {
          selected = selected + "/pagenumber/" + 1 + "/" + storeDetail?._id;
        }
        if (selected === "users") {
          selected =
            selected + "/limit/" + 40 + "/page/" + 1 + "/" + storeDetail?._id;
        }
        if (selected === "category") {
          selected =
            selected + "/limit/" + 40 + "/page/" + 1 + "/" + storeDetail?._id;
        }
        if (selected === "settingStore") {
          selected = selected + `/${storeDetail?._id}`;
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
      </SideNav.Nav>
    </SideNav>
  );
}
