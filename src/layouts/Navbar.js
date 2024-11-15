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
import { useTranslation } from "react-i18next";

// sound
import messageSound from "../sound/message.mp3";
import { use } from "i18next";

export default function NavBar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // state
  const [userData, setUserData] = useState({});
  const { isConnectPrinter, profile } = useStore();
  const [switchToDev, setSwitchToDev] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("LA"); // ເພີ່ມ state ນີ້້ສຳລັບພາສາ

  // provider
  const { setStoreDetail, setProfile } = useStore();

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

    // const lang = localStorage.getItem("i18nextLng");
    // if (lang) {
    //   // const _localJson = JSON.parse(lang);
    //   i18n.changeLanguage(lang);

    // }
  }, []);

  const _onLogout = () => {
    setProfile({});
    setStoreDetail({});
    navigate(`/`);
  };

  const switchLanguage = (language) => {
    // localStorage.setItem("i18nextLng", language);
    // const lang = localStorage.getItem("i18nextLng");

    i18n.changeLanguage(language);
    localStorage.setItem("language", language); // ເກັບຄ່າພາສາໃນ localStorage
    setSelectedLanguage(language); // ອັບເດດ state ຂອງພາສາ
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language"); // ດຶງຄ່າພາສາເກ່າຈາກ localStorage
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage); // ປ່ຽນພາສາໃນ i18n
      setSelectedLanguage(savedLanguage); // ອັບເດດ state ໃຫ້ກົງກັບຄ່າທີ່ເກັບໄວ້
    }
  }, []);

  return (
    <div>
      <Navbar
        className="bg-white shadow-[3px_0px_3px_rgba(0,0,0,0.16)] w-full h-[64px] fixed top-0 left-0 z-[1] pl-[52px]"
        variant="dark"
      >
        <Navbar.Brand className="text-[#909090]" href="#"></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="visible">
          <Nav className="mr-auto" />
          <div></div>
          <p
            className="mt-[20px] text-[#bfbfbf] cursor-pointer"
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
          <div className="flex-grow" />

          <div className="mr-[25px]">
            <select
              value={selectedLanguage}
              onChange={(e) => switchLanguage(e.target.value)}
              className="p-1 border rounded-lg outline-none"
            >
              <option value="la">LA</option>
              <option value="en">EN</option>
              <option value="km">KM</option>
            </select>
          </div>
          <Box className="hidden sm:block">
            {isConnectPrinter ? (
              <div className="border border-[#68B984] p-1 text-[#68B984] bg-[#CFFDE1] rounded font-medium text-sm flex items-center">
                <MdPrint /> <span className="ml-1">{t("connect_pinter")}</span>
              </div>
            ) : (
              <a
                href="https://drive.google.com/drive/folders/1HdiRIRMvsX8acqWGi9OjASqBCDaNEqC2?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                <div className="border border-[#E97777] p-1 text-[#E97777] bg-[#ffd8d8] rounded font-medium text-sm flex items-center">
                  <MdPrintDisabled />
                  <span className="ml-1">{t("unconnect_pinter")} !</span>
                </div>
              </a>
            )}
          </Box>

          <div className="w-[8px]" />

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
                  {t("log_out")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}
