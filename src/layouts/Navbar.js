import React, { useState, useEffect } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import NavDropdown from "react-bootstrap/NavDropdown";
import useReactRouter from "use-react-router";

import { USER_KEY } from "../constants";
export default function NavBar() {
  const { history } = useReactRouter();
  //   const [userData, setUserData] = useState({});

  //   useEffect(() => {
  //     const staff = localStorage.getItem(USER_KEY);
  //     if (staff) {
  //       const user = JSON.parse(staff)["user"];
  //       if (user) {
  //         setUserData(user);
  //       } else {
  //         history.push(`/`);
  //       }
  //     } else {
  //       history.push(`/`);
  //     }
  //   }, []);

  const _onLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    history.push(`/`);
  };

  const _onDetailProfile = () => {
    //   history.push(`/pagenumber/${1}/profile/${userData.id}`);
    alert("Hello world");
  };

  return (
    <div>
      <Navbar
        style={{
          backgroundColor: "#fff",
          boxShadow: "3px 0px 3px rgba(0, 0, 0, 0.16)",
          color: "#000",
          width: "95%",
          height: 60,
          position: "fixed",
          marginLeft: 50,
          paddingRight: 80,
          marginRight: 80,
          zIndex: 10012,
        }}
      >
        <div style={{ float: "right" }}>
          <h3>Self Ordering</h3>
        </div>
        {/* <Navbar.Brand style={{ color: "#909090" }} href="/orders/pagenumber/1">
          <Image src={"/images/profile.png"} height={40} width={40} />
        </Navbar.Brand> */}
        {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
      </Navbar>
    </div>
  );
}
