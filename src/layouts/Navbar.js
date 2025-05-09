import React, { useState, useEffect, useRef } from "react";
import packageJson from "../../package.json";
import axios from "axios";
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
import { NotifyButton } from "../components/NotifyButton";
import { useStoreStore } from "../zustand/storeStore";
import { useMenuStore } from "../zustand/menuStore";
import { useClaimDataStore } from "../zustand/claimData";
import { Badge } from "../components/ui/Badge";

// sound
import messageSound from "../sound/message.mp3";
import { END_POINT_SERVER_JUSTCAN, getLocalData } from "../constants/api";
import { moneyCurrency } from "./../helpers/index";

export default function NavBar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // state
  const [userData, setUserData] = useState({});
  const [switchToDev, setSwitchToDev] = useState(0);
  const [claimableAmount, setClaimableAmount] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState("LA"); // ເພີ່ມ state ນີ້້ສຳລັບພາສາ
  const [notifyFilterToggle, setNotifyFilterToggle] = useState(0);

  // provider
  const { isConnectPrinter, profile, newNotify } = useStore();
  const { setTotalAmountClaim, TotalAmountClaim } = useClaimDataStore();

  // ref
  const soundPlayer = useRef();

  const { clearStoreDetail, storeDetail } = useStoreStore();
  const { clearMenus } = useMenuStore();

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
    getClaimAmountData();
  }, []);

  const _onLogout = () => {
    //
    clearMenus();
    // Clear all data from localStorage
    localStorage.clear();

    // Redirect the user to the home page or login page
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

  const getClaimAmountData = async () => {
    try {
      const { DATA } = await getLocalData();
      const _res = await axios.get(
        `${END_POINT_SERVER_JUSTCAN}/v6/checkout/amount/unclaimed?storeId=${DATA?.storeId}`
      );
      setTotalAmountClaim(_res?.data?.unclaimedAmount);
    } catch (err) {
      console.log(err);
    }
  };

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

        {profile.data?.role !== "APPZAP_STAFF" && (
          <div
            className="mr-2 md:mr-5 cursor-pointer"
            onClick={async () => {
              const { DATA } = await getLocalData();
              navigate(`/claim/${DATA?.storeId}`);
              // navigate(`/historyUse/${DATA?.storeId}`);
            }}
          >
            <div className="bg-gray-300  rounded-lg px-2 flex flex-row items-center">
              <p className="m-0 pr-2 text-sm md:text-base motion-reduce:">
                {t("price_amount")}{" "}
              </p>
              <p className="m-0  text-lg md:text-lg font-bold">
                {moneyCurrency(TotalAmountClaim) || 0}{" "}
                {storeDetail?.firstCurrency}
              </p>
            </div>
          </div>
        )}

        {/* <Badge>
          {t("price_amount")} {TotalAmountClaim || 0}{" "}
          {storeDetail?.firstCurrency}
        </Badge> */}

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
              <div className="flex items-center border-[1px] border-[#E97777] rounded-[4px] px-2 py-1 bg-[#ffd8d8] text-xs text-[#E97777] gap-1">
                <MdPrintDisabled /> {t("disconnected_pinter")} !
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
                style={{
                  color: "#909090",
                  textAlign: "center", // Center the text
                  transition: "color 0.3s",
                }}
                onClick={() => _onLogout()}
                onMouseEnter={(e) => (e.target.style.color = "red")} // Hover on mouse enter
                onMouseLeave={(e) => (e.target.style.color = "#909090")} // Reset color on mouse leave
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
