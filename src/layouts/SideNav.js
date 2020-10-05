import React, { Component } from "react";
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
  faHistory, faStoreAlt
} from "@fortawesome/free-solid-svg-icons";

import "./sidenav.css";

const selectedTabBackgroundColor = "#606060";
const UN_SELECTED_TAB_TEXT = "#606060";

export default class Sidenav extends Component {
  handleChange = (panel) => (event, isExpanded) => {
    this.setExpanded(isExpanded ? panel : false);
  };

  constructor() {
    super();
    this.state = {
      expanded: false,
      selected: "category",
    };
  }

  componentDidMount() {
    const { location } = this.props;
    const currentSelectedTab = location.pathname.split("/")[1];
    this.setState({ selected: currentSelectedTab });
  }

  _onToggle = (expanded) => {
    this.setState({ expanded });
    this.props.onToggle(expanded);
  };

  render() {
    const { location, history } = this.props;
    console.log("location", location);
    const { selected } = this.state;
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
          this.setState({ selected });

          if (selected === "orders") {
            selected = selected + "/pagenumber/" + 1;
          }
          if (selected === "tables") {
            selected = selected + "/pagenumber/" + 1;
          }
          if (selected === "histories") {
            selected = selected + "/pagenumber/" + 1;
          }
          const to = "/" + selected;

          if (location.pathname !== to) {
            history.push(to);
          }
        }}
        expanded={this.state.expanded}
        onToggle={(expanded) => this._onToggle(expanded)}
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
                      ? "#2372A3"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color: selected === "orders" ? "#2372A3" : UN_SELECTED_TAB_TEXT,
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
                      ? "#2372A3"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color: selected === "tables" ? "#2372A3" : UN_SELECTED_TAB_TEXT,
              }}
            >
              ສະຖານະຂອງໂຕະ
            </NavText>
          </NavItem>
          <NavItem eventKey="histories">
            <NavIcon>
              <FontAwesomeIcon
                icon={faHistory}
                style={{
                  color:
                    selected === "histories"
                      ? "#2372A3"
                      : selectedTabBackgroundColor,
                }}
              />
            </NavIcon>
            <NavText
              style={{
                color: selected === "histories" ? "#2372A3" : UN_SELECTED_TAB_TEXT,
              }}
            >
              ປະຫວັດການຂາຍ
            </NavText>
          </NavItem>
        </SideNav.Nav>
      </SideNav>
    );
  }
}
