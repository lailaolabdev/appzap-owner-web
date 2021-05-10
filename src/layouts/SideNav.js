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
  faBell,
  faBookMedical,
  faEdit,
  faEgg,
  faFolderOpen,
  faHistory,
  faHome,
  faMoneyBillAlt,
  faSms,
  faStoreAlt,
  faTablet,
  faTabletAlt,
  faUserAlt,
  faUtensils,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";
import { END_POINT } from '../constants'
import "./sidenav.css";

const selectedTabBackgroundColor = "#606060";
const UN_SELECTED_TAB_TEXT = "#606060";

export default function Sidenav({ location, history }) {

  const [selected, setSelectStatus] = useState(
    location.pathname.split("/")[1].split("-")[0]
  );
  const [expandedStatus, setExpandedStatus] = useState(false);

  return (
    <SideNav
      style={{
        backgroundColor: "#FB6E3B",
        height: "100vh",
        display: "block",
        position: "fixed",
      }}
      onSelect={(selected) => {
        setSelectStatus(selected.split("/")[0].split("-")[0]);
        if (selected === "orders") {
          selected = selected + "/pagenumber/" + 1;
        }
        if (selected === "tables") {
          selected = selected + "/pagenumber/" + 1 + "/tableid/00";
        }
        if (selected === "histories") {
          selected = selected + "/pagenumber/" + 1;
        }
        if (selected === "users") {
          selected = selected + "/limit/" + 40 + "/page/" + 1;
        }
        if (selected === "category") {
          selected = selected + "/limit/" + 40 + "/page/" + 1;
        }
        if (selected === "menu") {
          selected = selected + "/limit/" + 40 + "/page/" + 1;
        }
        const to = "/" + selected;

        if (location.pathname !== to) {
          history.push(to);
        }
      }}
      onToggle={(expanded) => {
        setExpandedStatus(expanded);
      }}
    >
      <Toggle />
      <SideNav.Nav value={location.pathname.split("/")[1]}>
        <NavItem eventKey="category" style={{ backgroundColor: selected === "category" ? "#ffff" : "", border: `solid 1px #FB6E3B` }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faUtensils}
              style={{
                color:
                  selected === "category"
                    ? "red"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selected === "category" ? "red" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ເພີ່ມອາຫານ
            </NavText>
        </NavItem>
        <NavItem eventKey="orders" style={{ backgroundColor: selected === "orders" ? "#ffff" : "", border: `solid 1px #FB6E3B` }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faBookMedical}
              style={{
                color:
                  selected === "orders"
                    ? "red"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selected === "orders" ? "red" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ອໍເດີ
            </NavText>
        </NavItem>
        <NavItem eventKey="tables" style={{ backgroundColor: selected === "tables" ? "#ffff" : "", border: `solid 1px #FB6E3B` }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faHome}
              style={{
                color:
                  selected === "tables"
                    ? "red"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selected === "tables" ? "red" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ສະຖານະຂອງໂຕະ
            </NavText>
        </NavItem>
        <NavItem eventKey="checkBill" style={{ backgroundColor: selected === "checkBill" ? "#ffff" : "", border: `solid 1px #FB6E3B` }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faBell}
              style={{
                color:
                  selected === "checkBill"
                    ? "red"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selected === "checkBill" ? "red" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ແຈ້ງເຕືອນ Checkbill
          </NavText>
        </NavItem>
        <NavItem eventKey="histories" style={{ backgroundColor: selected === "histories" ? "#ffff" : "", border: `solid 1px #FB6E3B` }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faHistory}
              style={{
                color:
                  selected === "histories"
                    ? "red"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selected === "histories" ? "red" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ປະຫວັດການຂາຍ
            </NavText>
        </NavItem>
        <NavItem eventKey="users" style={{ backgroundColor: selected === "users" ? "#ffff" : "", border: `solid 1px #FB6E3B` }}>
          <NavIcon>
            <FontAwesomeIcon
              icon={faUserAlt}
              style={{
                color:
                  selected === "users"
                    ? "red"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selected === "users" ? "red" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ຈັດການພະນັກງານ
            </NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav >
  );
}
