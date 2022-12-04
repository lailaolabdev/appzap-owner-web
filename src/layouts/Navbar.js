import React, { useState, useEffect, useContext } from "react";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import Dropdown from "react-bootstrap/Dropdown";
import {
  USER_KEY,
  END_POINT,
  URL_PHOTO_AW3,
  VERSION,
  COLOR_APP,
} from "../constants";
import { useNavigate } from "react-router-dom";
import ImageProfile from "../image/profile.png";
import { Badge, Modal, Button, Table } from "react-bootstrap";
import moment from "moment";
import axios from "axios";
import { SocketContext } from "../services/socket";
import { socket } from "../services/socket";
import { GiHamburgerMenu } from "react-icons/gi";
import SideNav, {
  Toggle,
  NavItem,
  NavIcon,
  NavText,
} from "@trendmicro/react-sidenav";
import Box from "../components/Box";

export default function NavBar() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [messageData, setmessageData] = useState(0);

  useEffect(() => {
    const getData = () => {
      const ADMIN = localStorage.getItem(USER_KEY);
      const _localJson = JSON.parse(ADMIN);
      setUserData(_localJson);
      if (!ADMIN) {
        navigate(`/`);
      }
    };
    getData();
  }, []);

  const _onLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate(`/`);
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // socket.on(`MESSAGE_STORE:${userData?.data?.storeId}`, (data) => {
  //   setmessageData(data);
  // });

  return (
    <div>
      <Navbar
        style={{
          backgroundColor: "#fff",
          boxShadow: "3px 0px 3px rgba(0, 0, 0, 0.16)",
          color: "#CC0000",
          width: "100%",
          height: 64,
          position: "fixed",
          zIndex: 1,
          // marginLeft: 60,
          // paddingRight: 80,
        }}
        variant="dark"
      >
        <Navbar.Brand style={{ color: "#909090" }} href="#"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
          <div style={{ flexGrow: 1 }} />
          <Language />
          {/* <p style={{ marginTop: 20 }}>Version:{VERSION}</p> */}
          {/* <div style={{ marginLeft: 20 }}></div> */}
          {/* <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqimBa5dxfPceCwDPT8DBZeD-X7tjbzxU6nDbP8fCt2pXuxlJHeAD93uZJjiVOkiW5G4Q&usqp=CAU"
            width={35}
            height={35}
            roundedCircle
            onClick={() => navigate("/messagerList")}
            style={{ cursor: "pointer" }}
            // onClick={handleShow}
          />
          <Badge variant="danger">{messageData ?? 0}</Badge>
          <div style={{ marginLeft: 30 }}></div> */}
          <Form inline>
            <Dropdown>
              <Dropdown.Toggle
                style={{ color: "#909090" }}
                variant=""
                id="dropdown-basic"
              >
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  {userData
                    ? (userData?.data?.firstname
                        ? userData?.data?.firstname
                        : "") +
                      " " +
                      (userData?.data?.lastname ? userData?.data?.lastname : "")
                    : ""}
                </Box>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item
                  style={{ color: "#909090" }}
                  onClick={() => _onLogout()}
                >
                  ອອກຈາກລະບົບ
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* <Image
              src={
                userData?.data?.image
                  ? URL_PHOTO_AW3 + userData?.data?.image
                  : ImageProfile
              }
              width={45}
              height={45}
              roundedCircle
            /> */}
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

const Language = () => {
  let _l = ["LA", "EN", "中文"];
  return (
    <Box sx={{ display: "flex" }}>
      {_l.map((e, i) => (
        <Box
          sx={{
            padding: 10,
            borderLeft: i > 0 ? "1px solid #ccc" : "",
            color: COLOR_APP,
          }}
          key={i}
        >
          {e}
        </Box>
      ))}
    </Box>
  );
};
