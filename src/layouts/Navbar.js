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
import { FaBell } from "react-icons/fa";
import { useStore } from "../store";
import ReactAudioPlayer from "react-audio-player";
import i18n from "../i18n";
import { useTranslation } from "react-i18next";
import { NotifyButton } from "../components/NotifyButton";

// sound
import messageSound from "../sound/message.mp3";

export default function NavBar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // state
  const [userData, setUserData] = useState({});
  const { isConnectPrinter, profile } = useStore();
  const [switchToDev, setSwitchToDev] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("LA"); // ເພີ່ມ state ນີ້້ສຳລັບພາສາ
  const [notifyFilterToggle, setNotifyFilterToggle] = useState(0);

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
    <div className="bg-white shadow-[3px 0px 3px rgba(0, 0, 0, 0.16)] text-[#CC0000] w-full h-16 fixed top-0 left-0 z-10 pl-20 pr-3">
      <div className="flex items-center">
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

        <NotifyButton
          notifyFilterToggle={notifyFilterToggle}
          setNotifyFilterToggle={setNotifyFilterToggle}
        />

        <div className="mr-[30px]">
          {/* ໃຊ້ value={selectedLanguage} ເພື່ອສະແດງພາສາປັດຈຸບັນ */}
          <select
            value={selectedLanguage}
            onChange={(e) => switchLanguage(e.target.value)}
            className="border-[1px] border-gray-700 rounded-[4px] px-2 py-1 text-sm text-gray-700"
          >
            <option value="la">LA</option>
            <option value="en">EN</option>
            <option value="km">KM</option>
            <option value="th">TH</option>
          </select>
        </div>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {isConnectPrinter ? (
            <div className="flex items-center border-[1px] border-[#68B984] rounded-[4px] px-2 py-1 bg-[#CFFDE1] text-xs text-[#68B984] gap-1">
              <MdPrint /> <span>{t("connect_pinter")}</span>
            </div>
          ) : (
            <a
              href="https://drive.google.com/drive/folders/1HdiRIRMvsX8acqWGi9OjASqBCDaNEqC2?usp=sharing"
              target="_blank"
              rel="noreferrer"
            >
              <div className="flex items-center border-[1px] border-[#E97777] rounded-[4px] px-2 py-1 bg-[#ffd8d8] text-xs text-[E97777] gap-1">
                <MdPrintDisabled /> {t("unconnect_pinter")} !
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
                {t("log_out")}
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form>
      </div>
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
