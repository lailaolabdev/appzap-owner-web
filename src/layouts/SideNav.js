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
  faAd,
  faAddressCard,
  faBell,
  faBookOpen,
  faCartArrowDown,
  faCogs,
  faHistory,
  faHome,
  faTachometerAlt,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { Badge } from 'react-bootstrap'
import { COLOR_APP, WAITING_STATUS } from '../constants'
import "./sidenav.css";
import { useStore } from "../store";

export default function Sidenav({ location, history }) {

  const [selected, setSelectStatus] = useState(
    location.pathname.split("/")[1].split("-")[0]
  );
  const UN_SELECTED_TAB_TEXT = "#606060";


  const {
    userData,
    openTableData,
    orderLoading,
    getTableDataStore,
    waitingOrderItems,
    getOrderItemsStore,
    initialOrderSocket,
    initialTableSocket
  } = useStore();


  /**
   * Initial Application
   */
  useEffect(() => {
    getTableDataStore()
    getOrderItemsStore(WAITING_STATUS)
    initialOrderSocket()
    initialTableSocket()
  }, [])

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
        if (selected === "orders") {
          selected = selected + "/pagenumber/" + 1 + "/" + userData?.DATA?.storeId;
        }
        if (selected === "tables") {
          selected = selected + "/pagenumber/" + 1 + "/tableid/00" + "/" + userData?.DATA?.storeId;;
        }
        if (selected === "histories") {
          selected = selected + "/pagenumber/" + 1 + "/" + userData?.DATA?.storeId;
        }
        if (selected === "users") {
          selected = selected + "/limit/" + 40 + "/page/" + 1 + "/" + userData?.DATA?.storeId;
        }
        // if (selected === "menu") {
        //   selected = selected + "/limit/" + 40 + "/page/" + 1 + "/" + userData?.DATA?.storeId;
        // }
        if (selected === "category") {
          selected = selected + "/limit/" + 40 + "/page/" + 1 + "/" + userData?.DATA?.storeId;
        }
        const to = "/" + selected;

        if (location.pathname !== to) {
          history.push(to);
        }
      }}
      onToggle={(expanded) => {
      }}
    >
      <Toggle />
      <SideNav.Nav value={location.pathname.split("/")[1]}>
        <NavItem eventKey="tables" style={{ backgroundColor: selected === "tables" ? "#ffff" : "" }}>
          <NavIcon>
            <FontAwesomeIcon
              className={openTableData.length > 0 ? "scale-animation" : ""}
              icon={faHome}
              style={{
                color:
                  selected === "tables"
                    ? COLOR_APP
                    : UN_SELECTED_TAB_TEXT,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selected === "tables" ? COLOR_APP : UN_SELECTED_TAB_TEXT,
            }}
          >
            ສະຖານະຂອງໂຕະ
          </NavText>
        </NavItem>
        <NavItem eventKey="orders" style={{ backgroundColor: selected === "orders" ? "#FFFFFF" : "" }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faCartArrowDown}
              style={{
                color:
                  selected === "orders"
                    ? COLOR_APP
                    : UN_SELECTED_TAB_TEXT,
              }}
            />
            {waitingOrderItems?.length != 0 ?
              <Badge variant="danger" style={{ borderRadius: 50, fontSize: 10 }}>{waitingOrderItems?.length}</Badge>
              : ""
            }
          </NavIcon>
          <NavText
            style={{
              color: selected === "orders" ? COLOR_APP
                : UN_SELECTED_TAB_TEXT,
            }}
          >
            ອໍເດີ
          </NavText>
        </NavItem>

        <NavItem eventKey={`checkBill/${userData?.DATA?.storeId}`} style={{ backgroundColor: selected === "checkBill" ? "#ffff" : "" }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faBell}
              style={{
                color:
                  selected === "checkBill"
                    ? COLOR_APP
                    : UN_SELECTED_TAB_TEXT,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selected === "checkBill" ? COLOR_APP : UN_SELECTED_TAB_TEXT,
            }}
          >
            ແຈ້ງເຕືອນ Checkbill
          </NavText>
        </NavItem>
        <NavItem eventKey="histories" style={{ backgroundColor: selected === "histories" ? "#ffff" : "" }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faHistory}
              style={{
                color:
                  selected === "histories"
                    ? COLOR_APP
                    : UN_SELECTED_TAB_TEXT,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selected === "histories" ? COLOR_APP : UN_SELECTED_TAB_TEXT,
            }}
          >
            ປະຫວັດການຂາຍ
          </NavText>
        </NavItem>
        <NavItem eventKey="dashboard" style={{ backgroundColor: selected === "dashboard" ? "#ffff" : "" }}>
          <NavIcon>
            <FontAwesomeIcon
              className={openTableData.length > 0 ? "scale-animation" : ""}
              icon={faTachometerAlt}
              style={{
                color:
                  selected === "dashboard"
                    ? COLOR_APP
                    : UN_SELECTED_TAB_TEXT,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selected === "dashboard" ? COLOR_APP : UN_SELECTED_TAB_TEXT,
            }}
          >
            ຂໍມູນສະຖິຕິ
          </NavText>
        </NavItem>
        <NavItem eventKey="promotion" style={{ backgroundColor: selected === "promotion" ? "#ffff" : "" }}>
          <NavIcon>
            <FontAwesomeIcon
              className={openTableData.length > 0 ? "scale-animation" : ""}
              icon={faAd}
              style={{
                color:
                  selected === "promotion"
                    ? COLOR_APP
                    : UN_SELECTED_TAB_TEXT,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selected === "promotion" ? COLOR_APP : UN_SELECTED_TAB_TEXT,
            }}
          >
            ການຕະຫຼາດ
          </NavText>
        </NavItem>
        <NavItem eventKey={`settingStore/${userData?.DATA?.storeId}`} style={{ backgroundColor: selected === "settingStore" ? "#ffff" : "" }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faCogs}
              style={{
                color:
                  selected === "settingStore"
                    ? COLOR_APP
                    : UN_SELECTED_TAB_TEXT,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selected === "settingStore" ? COLOR_APP : UN_SELECTED_TAB_TEXT,
            }}
          >
            ຕັ້ງຄ່າຮ້ານຄ້າ
          </NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav >
  );
}
