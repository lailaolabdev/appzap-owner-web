import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import useReactRouter from "use-react-router";

import { logout } from "../services/auth";
import { USER_KEY } from "../constants";
export default function NavBar() {
  const { history } = useReactRouter();

  const _onLogout = async () => {
    await logout();
    await localStorage.clear()
    history.push(`/`);
  };

  const _onDetailProfile = () => {
    alert("Hello world");
  };

  return (
    <div>
      <Navbar
        style={{
          backgroundColor: "#fff",
          boxShadow: "3px 0px 3px rgba(0, 0, 0, 0.16)",
          color: "#000",
          width: "100%",
          height: 60,
          position: "fixed",
          marginLeft: 50,
          paddingRight: 80,
          marginRight: 80,
          zIndex: 100,
        }}
      >
        <Navbar.Brand style={{ color: "#909090" }} href="/orders/pagenumber/1">
          {/* <h2>SELF ORDERING</h2> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            <NavDropdown
              title="admin"
              id="basic-nav-dropdown basic-navbar-nav"
              alignRight
            >
              <NavDropdown.Item href="#">Profile</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={_onLogout}>
                ອອກຈາກລະບົບ
              </NavDropdown.Item>

            </NavDropdown>
            <Image
              src={"/images/profile.png"}
              style={{ cursor: "pointer" }}
              height={40}
              width={40}
              roundedCircle
              onClick={_onDetailProfile}
            />
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
