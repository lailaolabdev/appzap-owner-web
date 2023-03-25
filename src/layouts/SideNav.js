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
} from "@fortawesome/free-solid-svg-icons";
import { COLOR_APP, WAITING_STATUS } from "../constants";
import "./sidenav.css";
import { useStore } from "../store";
import { useTranslation } from "react-i18next";

export default function Sidenav({ location, navigate, onToggle }) {
  const [selected, setSelectStatus] = useState(
    location.pathname.split("/")[1].split("-")[0]
  );
  const UN_SELECTED_TAB_TEXT = "#606060";
  const { t } = useTranslation();

  const {
    openTableData,
    callingCheckOut,
    getTableDataStore,
    getOrderItemsStore,
    storeDetail,
  } = useStore();

  const itemList = [
    {
      title: "ສະຖານະຂອງໂຕະ",
      key: "tables",
      icon: faHome,
      typeStore: "",
      hidden: !storeDetail?.hasPOS,
    },
    {
      title: "ລາຍການອໍເດີ້",
      key: "orders/waiting",
      typeStore: "",
      icon: faAddressCard,
      hidden: !storeDetail?.hasPOS,
    },
    {
      title: "ສະຖິຕິລວມ",
      key: "report",
      icon: faTachometerAlt,
      title: t("financialStatic"),
      typeStore: "",
    },
    {
      title: "ຈັດການການຈອງ",
      key: "reservations",
      icon: faList,
      typeStore: "",
      hidden: !storeDetail?.hasReservation,
    },
    {
      title: "ລາຍງານການຈອງ",
      key: "reservation-dashboard",
      icon: faChartBar,
      typeStore: "",
      hidden: !storeDetail?.hasReservation,
    },
    {
      title: "ຈັດການເມນູອາຫານ",
      key: "menu",
      typeStore: "",
      icon: faBoxOpen,
      hidden: !storeDetail?.hasSmartMenu,
    },
    {
      title: "ຕັ້ງຄ່າຮ້ານຄ້າ",
      key: `settingStore/${storeDetail?._id}`,
      typeStore: "",
      icon: faCogs,
      hidden: !storeDetail?.hasPOS,
    },
    {
      title: "ປ່ຽນຕຣີມ",
      key: "setting-theme",
      typeStore: "",
      icon: faIcicles,
      // hidden: !storeDetail?.hasPOS,
    },
  ];

  useEffect(() => {
    getTableDataStore();
    getOrderItemsStore(WAITING_STATUS);
    callingCheckOut();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
        if (selected === "orders") {
          selected = selected + "/pagenumber/" + 1 + "/" + storeDetail?._id;
        }
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
        {itemList
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
            </NavItem>
          ))}
      </SideNav.Nav>
    </SideNav>
  );
}
