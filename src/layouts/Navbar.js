import React, { useState, useEffect, useRef } from "react";
import packageJson from "../../package.json";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Form from "react-bootstrap/Form";
import Dropdown from "react-bootstrap/Dropdown";
import { USER_KEY } from "../constants";
import { useNavigate } from "react-router-dom";
import Box from "../components/Box";
import { MdPrint, MdPrintDisabled } from "react-icons/md";
import { useStore } from "../store";
import ReactAudioPlayer from "react-audio-player";
import i18n from "../i18n";

// sound
import messageSound from "../sound/message.mp3";

export default function NavBar() {
  const navigate = useNavigate();

  // state
  const [userData, setUserData] = useState({});
  const { isConnectPrinter } = useStore();
  const [switchToDev, setSwitchToDev] = useState(0);

  // ref
  const soundPlayer = useRef();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _onLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate(`/`);
  };
  const switchLanguage = (language) => {
    i18n.changeLanguage(language);
  };

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
          top: 0,
          left: 0,
          zIndex: 1,
          paddingLeft: 52,
          // marginLeft: 60,
          // paddingRight: 80,
        }}
        variant="dark"
      >
        <Navbar.Brand style={{ color: "#909090" }} href="#"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" />
          <p
            style={{ marginTop: 20, color: "#bfbfbf" }}
            onClick={() => {
              setSwitchToDev((prev) => prev + 1);
              if (switchToDev >= 5) {
                window.location.href =
                  "http://staging.restaurant.appzap.la.s3-website-ap-southeast-1.amazonaws.com/tables";
              }
            }}
          >
            v{packageJson?.version}
          </p>
          <ReactAudioPlayer src={messageSound} ref={soundPlayer} />
          <div style={{ flexGrow: 1 }} />

          {/* <button onClick={() => switchLanguage("en")}>en</button>
          <button onClick={() => switchLanguage("la")}>la</button> */}
          <div
            style={{
              marginRight: "30px",
              backgroundColor: "orange",
              boxShadow: "2px 2px 2px 4px rgba(0, 0, 0, 0.06)",
            }}
          >
            <select onChange={(e) => switchLanguage(e.target.value)}>
              <option value="la">LA</option>
              <option value="en">EN</option>
            </select>
          </div>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {isConnectPrinter ? (
              <div
                style={{
                  border: "1px solid #68B984",
                  padding: 4,
                  color: "#68B984",
                  backgroundColor: "#CFFDE1",
                  borderRadius: 4,
                  fontSize: 12,
                }}
              >
                <MdPrint /> <span>ເຊື່ອມຕໍ່</span>
              </div>
            ) : (
              <a
                href="https://drive.google.com/drive/folders/1HdiRIRMvsX8acqWGi9OjASqBCDaNEqC2?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                <div
                  style={{
                    border: "1px solid #E97777",
                    padding: 4,
                    color: "#E97777",
                    backgroundColor: "#ffd8d8",
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  <MdPrintDisabled /> ບໍ່ໄດ້ເຊື່ອມປິນເຕີ້ !
                </div>
              </a>
            )}
          </Box>

          <div style={{ width: 10 }} />
          <Form inline>
            <Dropdown>
              <Dropdown.Toggle
                style={{
                  color: "#909090",
                  display: "flex",
                  alignItems: "center",
                }}
                variant=""
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
              <Dropdown.Menu className="dropdown-menu-right">
                <Dropdown.Item
                  style={{ color: "#909090" }}
                  onClick={() => _onLogout()}
                >
                  ອອກຈາກລະບົບ
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

// const Language = () => {
//   let _l = ["LA", "EN", "中文"];
//   return (
//     <Box sx={{ display: "flex" }}>
//       {_l.map((e, i) => (
//         <Box
//           sx={{
//             padding: 10,
//             borderLeft: i > 0 ? "1px solid #ccc" : "",
//             color: COLOR_APP,
//           }}
//           key={i}
//         >
//           {e}
//         </Box>
//       ))}
//     </Box>
//   );
// };
