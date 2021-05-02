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
  faBookMedical,
  faEdit,
  faEgg,
  faHistory,
  faMoneyBillAlt,
  faSms,
  faStoreAlt,
  faUserAlt,
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
        backgroundColor: "#fff",
        height: "100vh",
        display: "block",
        position: "fixed",
        zIndex: 1000,
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
        <NavItem eventKey="orders">
          <NavIcon>
            <FontAwesomeIcon
              icon={faBookMedical}
              style={{
                color:
                  selected === "orders"
                    ? "#FB6E3B"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selected === "orders" ? "#FB6E3B" : UN_SELECTED_TAB_TEXT,
            }}
          >
            ອໍເດີ
            </NavText>
        </NavItem>
        <NavItem eventKey="tables">
          <NavIcon>
            <FontAwesomeIcon
              icon={faStoreAlt}
              style={{
                color:
                  selected === "tables"
                    ? "#FB6E3B"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color: selected === "tables" ? "#FB6E3B" : UN_SELECTED_TAB_TEXT,
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
                      ? "#FB6E3B"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color:
                  selected === "histories" ? "#FB6E3B" : UN_SELECTED_TAB_TEXT,
              }}
            >
              ຂໍຄວາມຈາກລູກຄ້າ
            </NavText>
          </NavItem> */}
        <NavItem eventKey="checkBill">
          <NavIcon>
            <FontAwesomeIcon
              icon={faMoneyBillAlt}
              style={{
                color:
                  selected === "checkBill"
                    ? "#FB6E3B"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selected === "checkBill" ? "#FB6E3B" : UN_SELECTED_TAB_TEXT,
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
                    ? "#FB6E3B"
                    : selectedTabBackgroundColor,
              }}
            />
          </NavIcon>
          <NavText
            style={{
              color:
                selected === "histories" ? "#FB6E3B" : UN_SELECTED_TAB_TEXT,
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
                      ? "#FB6E3B"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color:
                  selected === "histories" ? "#FB6E3B" : UN_SELECTED_TAB_TEXT,
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
                      ? "#FB6E3B"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color:
                  selected === "histories" ? "#FB6E3B" : UN_SELECTED_TAB_TEXT,
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
                      ? "#FB6E3B"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color:
                  selected === "histories" ? "#FB6E3B" : UN_SELECTED_TAB_TEXT,
              }}
            >
              ຈັດການອາຫານ
            </NavText>
          </NavItem>
          <NavItem eventKey="histories">
            <NavIcon>
              <FontAwesomeIcon
                icon={faUserAlt}
                style={{
                  color:
                    selected === "histories"
                      ? "#FB6E3B"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color:
                  selected === "histories" ? "#FB6E3B" : UN_SELECTED_TAB_TEXT,
              }}
            >
              ຈັດການພະນັກງານ
            </NavText>
          </NavItem> */}
      </SideNav.Nav>
    </SideNav >
  );
}
