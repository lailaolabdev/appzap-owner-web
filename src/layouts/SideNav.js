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
        <NavItem eventKey="category">
          <NavIcon>
            <FontAwesomeIcon
              icon={faUtensils}
              style={{
                color:
                  selected === "category"
                    ? "#ffff"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selected === "category" ? "#ffff" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ເພີ່ມອາຫານ
            </NavText>
        </NavItem>
        <NavItem eventKey="orders">
          <NavIcon>
            <FontAwesomeIcon
              icon={faBookMedical}
              style={{
                color:
                  selected === "orders"
                    ? "#ffff"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selected === "orders" ? "#ffff" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ອໍເດີ
            </NavText>
        </NavItem>
        <NavItem eventKey="tables">
          <NavIcon>
            <FontAwesomeIcon
              icon={faTabletAlt}
              style={{
                color:
                  selected === "tables"
                    ? "#ffff"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selected === "tables" ? "#ffff" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ສະຖານະຂອງໂຕະ
            </NavText>
        </NavItem>
        {/* <NavItem eventKey="histories">
            <NavIcon>
              <FontAwesomeIcon
                icon={faSms}
                style={{
                  color:
                    selected === "histories"
                      ? "#ffff"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color:
                  selected === "histories" ? "#ffff" : UN_SELECTED_TAB_TEXT,
              }}
            >
              ຂໍຄວາມຈາກລູກຄ້າ
            </NavText>
          </NavItem> */}
        <NavItem eventKey="checkBill">
          <NavIcon>
            <FontAwesomeIcon
              icon={faBell}
              style={{
                color:
                  selected === "checkBill"
                    ? "#ffff"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selected === "checkBill" ? "#ffff" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ແຈ້ງເຕືອນ Checkbill
          </NavText>
        </NavItem>
        <NavItem eventKey="histories">
          <NavIcon>
            <FontAwesomeIcon
              icon={faHistory}
              style={{
                color:
                  selected === "histories"
                    ? "#ffff"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selected === "histories" ? "#ffff" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ປະຫວັດການຂາຍ
            </NavText>
        </NavItem>
        {/* <NavItem eventKey="histories">
            <NavIcon>
              <FontAwesomeIcon
                icon={faStoreAlt}
                style={{
                  color:
                    selected === "histories"
                      ? "#ffff"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color:
                  selected === "histories" ? "#ffff" : UN_SELECTED_TAB_TEXT,
              }}
            >
              ຈັດການຮ້ານຄ້າ
            </NavText>
          </NavItem> */}
        {/* <NavItem eventKey="histories">
            <NavIcon>
              <FontAwesomeIcon
                icon={faEgg}
                style={{
                  color:
                    selected === "histories"
                      ? "#ffff"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color:
                  selected === "histories" ? "#ffff" : UN_SELECTED_TAB_TEXT,
              }}
            >
              ຈັດການປະເພດອາຫານ
            </NavText>
          </NavItem>
          <NavItem eventKey="histories">
            <NavIcon>
              <FontAwesomeIcon
                icon={faWallet}
                style={{
                  color:
                    selected === "histories"
                      ? "#ffff"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color:
                  selected === "histories" ? "#ffff" : UN_SELECTED_TAB_TEXT,
              }}
            >
              ຈັດການອາຫານ
            </NavText>
          </NavItem>*/}
        <NavItem eventKey="users">
          <NavIcon>
            <FontAwesomeIcon
              icon={faUserAlt}
              style={{
                color:
                  selected === "users"
                    ? "#ffff"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selected === "users" ? "#ffff" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ຈັດການພະນັກງານ
            </NavText>
        </NavItem>
      </SideNav.Nav>
    </SideNav >
  );
}
