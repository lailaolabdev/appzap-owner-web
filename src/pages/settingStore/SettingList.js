import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStore } from "../../store";

import {
  faCogs,
  faHistory,
  faTable,
  faUsers,
  faUtensils,
  faBoxes,
  faPrint,
  faFolderOpen,
  faVolumeUp,
  faStore,
  faDollarSign,
  faImages,
  faDatabase,
  faTh,
  faBuilding,
  faBuildingColumns,
  faBox,
  faClock,
  faDesktop,
  faUserShield,
} from "@fortawesome/free-solid-svg-icons";
// import { faRegClock } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import Box from "../../components/Box";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import PopUpConfirm from "../../components/popup/PopUpConfirm";
import { END_POINT_APP, getLocalData } from "../../constants/api";
import { MdPassword } from "react-icons/md";
import Axios from "axios";
import Swal from "sweetalert2";
import { fontMap } from "../../utils/font-map";
import { useStoreStore } from "../../zustand/storeStore";
import { Hidden } from "@material-ui/core";

export default function SettingList() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const params = useParams();
  const navigate = useNavigate();
  const [clickCount, setClickCount] = useState(0);
  const [showDeletem, setShowDelete] = useState(false);
  const { storeDetail } = useStoreStore();
  const { profile } = useStore();
  const [hasMangeStaff, setHasMangeStaff] = useState(false);
  const [hasMangeRole, setHasMangeRole] = useState(false);
  const [hasMangeMenu, setHasMangeMenu] = useState(false);
  const [hasMangeSound, setHasMangeSound] = useState(false);
  const [hasMangeCurrency, setHasMangeCurrency] = useState(false);
  const [hasMangeBanks, setHasMangeBanks] = useState(false);
  const [hasMangeDelivery, setHasMangeDelivery] = useState(false);
  const [hasMangeStock, setHasMangeStock] = useState(false);
  const [hasMangeZone, setHasMangeZone] = useState(false);
  const [hasMangeTable, setHasMangeTable] = useState(false);
  const [hasMangePrinter, setHasMangePrinter] = useState(false);
  const [hasMangePos, setHasMangePos] = useState(false);
  const [hasMangePin, setHasMangePin] = useState(false);
  const [hasMangeSecondScreen, setHasMangeSecondScreen] = useState(false);
  const [hasMangeBanner, setHasMangeBanner] = useState(false);
  const [hasHistory, setHasHistoryUsed] = useState(false);
  const [hasClearHistory, setHasClearHistory] = useState(false);
  const [hasStoreDetail, setHasStoreDetail] = useState(false);

  const permissionRole = profile?.data?.permissionRoleId;
  const profileRole = profile?.data?.role;
  const appzapStaff = [
    "APPZAP_DEALER",
    "APPZAP_ADMIN",
    "APPZAP_KITCHEN",
    "APPZAP_COUNTER",
    "APPZAP_STAFF",
  ];
  const appzapAdmin = "APPZAP_ADMIN";

  useEffect(() => {
    const permissionMap = [
      { set: setHasMangeStaff, check: "MANAGE_STAFF" },
      { set: setHasMangeRole, check: "MANAGE_ROLES" },
      { set: setHasMangeMenu, check: "MANAGE_MENU" },
      { set: setHasMangeSound, check: "MANAGE_SOUND" },
      { set: setHasMangeCurrency, check: "MANAGE_CURRENCY_RATES" },
      { set: setHasMangeBanks, check: "MANAGE_BANKS" },
      { set: setHasMangeDelivery, check: "MANAGE_DELIVERY" },
      { set: setHasMangeStock, check: "MANAGE_STOCK" },
      { set: setHasMangeZone, check: "CONFIGURE_ZONE" },
      { set: setHasMangeTable, check: "CONFIGURE_TABLE" },
      { set: setHasMangePrinter, check: "CONFIGURE_PRINTER" },
      { set: setHasMangePos, check: "CONFIGURE_POS" },
      { set: setHasMangePin, check: "CONFIGURE_PIN" },
      { set: setHasMangeSecondScreen, check: "CONFIGURE_SECOND_SCREEN" },
      { set: setHasMangeBanner, check: "MANAGE_BANNER" },
      { set: setHasHistoryUsed, check: "HISTORY_USED" },
      { set: setHasClearHistory, check: "CLRAR_HISTORY" },
      { set: setHasStoreDetail, check: "CONFIGURE_STORE_DETAIL" },
    ];

    permissionMap.forEach(({ set, check }) => {
      set(permissionRole?.permissions?.includes(check));
    });
  }, [profile]);

  const data = [
    {
      id: "479af7e5-1947-426d-b511-d95f0155f70f",
      title: t("restaurant_settings"),
      subTitle: t("restaurant_setting_desc"),
      icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faCogs} />,
      path: `/settingStore/storeDetail/${params?.id}`,
      hidden: !hasStoreDetail && appzapStaff.includes(profileRole),
    },
    {
      id: "0f83cb87-fc96-4212-b67d-2af6f33ed937",
      title: t("employeeManage"),
      subTitle: t("employee_manage_desc"),
      icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faUsers} />,
      path: `/user`,
      hidden: !hasMangeStaff && appzapStaff.includes(profileRole),
    },
    {
      id: "0f83cb87-fc96-4212-b67d-2af6f33ed937",
      title: t("Promotion"),
      subTitle: t("promotion_desc"),
      icon: (
        <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faFolderOpen} />
      ),
      // path: `/settingStore/users/limit/40/page/1/${params?.id}`,
      path: "/promotion",
    },
    {
      id: "ab2dd4fe-617d-48f7-afa6-645fa3b8e04e",
      title: t("menuManage"),
      subTitle: t("menu_manage_desc"),
      icon: (
        <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faUtensils} />
      ),
      path: `/settingStore/menu/limit/40/page/1/${params?.id}`,
      hidden: !hasMangeMenu && appzapStaff.includes(profileRole),
    },
    {
      id: "ab2dd4fe-d0e2-4808-89d1-ae6307b8abce",
      title: t("zone_setting"),
      subTitle: t("zone_setting_desc"),
      icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faTh} />,
      path: `/settingStore/settingZone/${params?.id}`,
      hidden: !hasMangeZone && appzapStaff.includes(profileRole),
    },
    {
      id: "1b76514a-d0e2-4808-89d1-3c66bc46d8ce",
      title: t("tableSetting"),
      subTitle: t("table_setting_desc"),
      icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faTable} />,
      path: `/settingStore/settingTable/${params?.id}`,
      hidden: !hasMangeTable && appzapStaff.includes(profileRole),
    },
    {
      id: "1cb62d9b-01bd-419b-a60e-9b5b43133d7a",
      title: t("transaction_history"),
      subTitle: t("activity_history_desc"),
      icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faHistory} />,
      path: `/historyUse/${params?.id}`,
      hidden: !hasHistory && appzapStaff.includes(profileRole),
    },
    {
      id: "42e27d60-6f12-446a-aa8f-ae6307b8ab34",
      title: t("stock_management"),
      subTitle: t("stok_manage_desc"),
      icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faBoxes} />,
      path: `/settingStore/stock/limit/40/page/1/${params?.id}`,
      hidden: !hasMangeStock && appzapStaff.includes(profileRole),
    },
    {
      id: "0f90941b-c594-4365-a279-a995868ede2a",
      title: t("printer_setting"),
      subTitle: t("printer_setting_desc"),
      icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faPrint} />,
      path: `/printer`,
      hidden: !hasMangePrinter && appzapStaff.includes(profileRole),
    },
    {
      id: "a2233469-a0b3-4247-9247-6282e2bafc1b",
      title: t("sound_manage"),
      subTitle: t("sound_manage_desc"),
      icon: (
        <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faVolumeUp} />
      ),
      path: `/audio`,
      hidden: !hasMangeSound && appzapStaff.includes(profileRole),
    },
    {
      id: "64bf476a-cbb6-43e1-abe1-29d4bdce7683",
      title: t("posconfig"),
      subTitle: t("pos_config_desc"),
      icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faStore} />,
      path: `/config`,
      hidden: !hasMangePos && appzapStaff.includes(profileRole),
    },
    // {
    //   id: "64bf476a-cbb6-43e1-abe1-29d4bdce7689",
    //   title: "ຈັດການເມນູພື້ນຖານຂອງຮ້ານ",
    //   icon: <FontAwesomeIcon style={{fontSize: "1.7rem"}} icon={faUtensils} />,
    //   path: `/food-setting/limit/40/page/1`,
    // },
    {
      id: "a84952ca-c02b-91a0-fa30-2930ab39f01b",
      title: t("currency_manage"),
      subTitle: t("currency_manage_desc"),
      icon: (
        <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faDollarSign} />
      ),
      path: `/settingStore/currency/${params?.id}`,
      hidden: !hasMangeCurrency && appzapStaff.includes(profileRole),
    },
    {
      id: "a84952ca-c02b-91a0-fa30-2930ab39f01b",
      title: t("bank"),
      subTitle: t("bank_manage_desc"),
      icon: (
        <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faBuilding} />
      ),
      path: `/settingStore/bank/${params?.id}`,
      hidden: !hasMangeBanks && appzapStaff.includes(profileRole),
    },
    {
      id: "a84952ca-c02b-91a0-fa30-2930ab39f01b",
      title: t("manage_role"),
      subTitle: t("manage_role"),
      icon: (
        <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faUserShield} />
      ),
      path: `/settingStore/role`,
      hidden:
        !hasMangeRole &&
        appzapStaff.includes(profileRole) &&
        profileRole !== "APPZAP_ADMIN",
    },
    {
      id: "f962968d-1bed-48da-9049-92551dcd7101",
      title: t("banner"),
      subTitle: t("banner_desc"),
      icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faImages} />,
      path: `/settingStore/banner`,
      hidden: !hasMangeBanner && appzapStaff.includes(profileRole),
    },
    {
      id: "f962968d-1bed-48da-9049-92551dcd7102",
      title: t("pin_setting"),
      subTitle: t("pin_desc"),
      icon: <MdPassword style={{ fontSize: "1.7rem" }} />,
      path: `/PIN`,
      hidden: !hasMangePin && appzapStaff.includes(profileRole),
    },
    {
      id: "f962968d-1bed-48da-9049-86351dcd7102",
      title: t("setting_delivery"),
      subTitle: "",
      icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faBox} />,
      path: `/settingStore/delivery/${params?.id}`,
      hidden: !hasMangeDelivery && appzapStaff.includes(profileRole),
    },

    {
      id: "64bf476a-cbb6-43e1-abe1-29d4bdce7689",
      title: "ການຕັ້ງຄ່າກ່ຽວກັບ 2 ໜ້າຈໍ",
      icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faDesktop} />,
      path: "/setting-screen",
      hidden: !hasMangeSecondScreen && appzapStaff.includes(profileRole),
    },
    // {
    //   id: "64bf476a-cbb6-43e1-abe1-29d4bdce7689",
    //   title: "ຈັດການກະ",
    //   icon: <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faClock} />,
    //   path: "/shift",
    // },
  ];

  const clickDeleteHistoryStore = async () => {
    if (clickCount > 5) {
      setShowDelete(true);
    }
    setClickCount((prev) => prev + 1);
  };
  const deleteHistoryStore = async () => {
    try {
      const url = `${END_POINT_APP}/v4/reset-history-store`;
      const { TOKEN } = await getLocalData();
      await Axios.post(url, null, {
        headers: TOKEN,
      });
      await Swal.fire({
        icon: "success",
        title: `${t("clear_history_success")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      setShowDelete(false);
    } catch (err) {
      setShowDelete(false);
      await Swal.fire({
        icon: "error",
        title: `${t("clear_history_fail")}`,
        showConfirmButton: false,
        timer: 1500,
      });
      console.log(err);
    }
  };

  return (
    <div
      style={{
        height: "100%",
        maxHeight: "100vh",
        overflow: "auto",
        padding: "0 0 40px 0",
      }}
    >
      <Box
        sx={{
          padding: 15,
          display: "grid",
          gridTemplateColumns: {
            md: "repeat(6,1fr)",
            sm: "repeat(3,1fr)",
            xs: "repeat(2,1fr)",
          },
          gridGap: 10,
          gridAutoRows: "200px",
        }}
      >
        {data
          .filter((e) => !e?.hidden)
          .map((e) => (
            <ItemBox onClick={() => navigate(e.path)} key={e.id}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <div>{e.icon}</div>
                <div
                  style={{ fontWeight: "bold", textAlign: "center" }}
                  className={fontMap[language]}
                >
                  {e.title}
                </div>
                <div
                  style={{ fontSize: 10, textAlign: "center" }}
                  className={fontMap[language]}
                >
                  {e?.subTitle}
                </div>
              </div>
            </ItemBox>
          ))}
        {(hasClearHistory && appzapStaff.includes(profileRole)) ||
        (profileRole && hasClearHistory) ? (
          <ItemBox onClick={clickDeleteHistoryStore}>
            <FontAwesomeIcon style={{ fontSize: "1.7rem" }} icon={faDatabase} />
            <span className={fontMap[language]}>
              {t("clear_restaurant_data")}
            </span>
          </ItemBox>
        ) : (
          ""
        )}
      </Box>
      <PopUpConfirm
        open={showDeletem}
        onClose={() => setShowDelete(false)}
        text1={t("confirm_clear_history")}
        text2=""
        onSubmit={deleteHistoryStore}
      />
    </div>
  );
}

const ItemBox = styled("div")({
  padding: 10,
  height: "100%",
  color: "#616161",
  outlineColor: "#FB6E3B",
  backgroundColor: "white",
  border: "1px solid  #E4E4E4",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
  gap: 10,
  borderRadius: 8,
  "&:hover": {
    backgroundColor: "rgba(251,110,59,0.2)",
    cursor: "pointer",
  },
});
