import React, { useEffect, useState } from "react";
import moment from "moment";
import { Button, Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import profileImage from "../../image/profile.png";
import axios from "axios";
import { STORE, TABLES, MENUS, getLocalData } from "../../constants/api";
import { END_POINT } from "../../constants";
import { COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import "./index.css";
import PopUpStoreEdit from "../../components/popup/PopUpStoreEdit";
import PopUpStoreEditQR from "../../components/popup/PopUpStoreEditQR";
import { useShiftStore } from "../../zustand/ShiftStore";
import Loading from "../../components/Loading";
import { updateStore } from "../../services/store";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { useTranslation } from "react-i18next";
import { useStoreStore } from "../../zustand/storeStore";
import { useStore } from "../../store";

export default function StoreDetail() {
  const params = useParams();
  const { t } = useTranslation();
  const { getShift } = useShiftStore();
  const { setStoreDetail } = useStoreStore();

  // State
  const [isLoading, setIsLoading] = useState(false);
  const [dataStore, setStore] = useState();
  const [dataSwitch, setDataSwitch] = useState();
  const [numBerTable, setnumBerTable] = useState(0);
  const [numBerMenus, setnumBerMenus] = useState(0);
  const [getTokken, setgetTokken] = useState();
  const [popEditStroe, setPopEditStroe] = useState(false);
  const [popEditQR, setPopEditQR] = useState(false);
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));

  const { profile } = useStore();
  const [hasConfigureStoreDetail, setHasConfigureStoreDetail] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setgetTokken(_localData);
        getData(_localData?.DATA?.storeId);
      }
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const permissionRole = profile?.data?.permissionRoleId;
  const profileRole = profile?.data?.role;
  const appzapStaff = "APPZAP_DEALER";
  const appzapAdmin = "APPZAP_ADMIN";

  useEffect(() => {
    setHasConfigureStoreDetail(
      permissionRole?.permissions?.includes("CONFIGURE_STORE_DETAIL")
    );
  }, []);

  const getData = async (storeId) => {
    setIsLoading(true);
    await fetch(STORE + `/?id=${params?.id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        setStore(json);
        setDataSwitch(json?.isOpen);
        setStoreDetail(json);
      });

    await fetch(TABLES + `/?storeId=${storeId}&&`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => setnumBerTable(json?.length));

    await fetch(MENUS + `/?storeId=${storeId}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => setnumBerMenus(json?.length));

    setIsLoading(false);
  };

  // function
  const handleUpdateStore = async (value) => {
    try {
      const _localData = await getLocalData();
      const id = _localData?.DATA?.storeId;
      await updateStore(value, id);
      setPopEditStroe(false);
      await getData(id);
      return;
    } catch (err) {
      console.log("err", err);
      return;
    }
  };

  // lung jak upload leo pic ja ma so u nee
  const _updateIsOpenStore = async (data) => {
    await axios({
      method: "PUT",
      url: END_POINT + `/store_update?id=` + params?.id,
      headers: getTokken?.TOKEN,
      data: {
        isOpen: data?.isOpen === true ? false : true,
      },
    });
  };
  if (isLoading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }
  return (
    <div className="max-h-screen h-screen overflow-x-hidden overflow-y-auto bg-gray-50">
      {/* Header with title and action buttons */}
      <div className="flex flex-col md:flex-row justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-3 md:mb-0">
          {t("detail")}
        </h1>
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-color-app hover:bg-orange-400 text-white border border-gray-300 rounded-md shadow-sm transition-all flex items-center"
            onClick={() => setPopEditStroe(true)}
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            {t("edit")}
          </button>
          <button
            className="px-4 py-2 bg-color-app hover:bg-orange-400 text-white border border-gray-300 rounded-md shadow-sm transition-all flex items-center"
            onClick={() => setPopEditQR(true)}
          >
            <FontAwesomeIcon icon={faEdit} className="mr-2" />
            {t("QR Code")}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-6 p-2">
        {/* Left column - Store profile */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md p-6 flex flex-col items-center">
          <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-gray-200">
            <Image
              src={dataStore?.image ? URL_PHOTO_AW3 + dataStore?.image : profileImage}
              alt={dataStore?.name || "Store profile"}
              className="object-cover w-full h-full"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {dataStore?.name || "-"}
          </h2>
          
          <div className="flex items-center gap-2 mb-4">
            <StarRatings
              rating={dataStore?.reviewStar || 0}
              starRatedColor="orange"
              starHoverColor="orange"
              numberOfStars={5}
              name="rating"
              starDimension="20px"
              starSpacing="4px"
            />
            <span className="text-gray-600">({dataStore?.reviewStarCount || 0})</span>
          </div>
          
          <p className="text-gray-600 mb-2">{t("open_service")}</p>
          <p className="text-gray-700 mb-4 text-center">{dataStore?.note}</p>
          
          {/* <div className="flex items-center">
            <label className="switch">
              <input
                type="checkbox"
                defaultChecked={dataSwitch}
                onClick={() => _updateIsOpenStore(dataStore)}
              />
              <span className="slider round"></span>
            </label>
            <span className="ml-2 text-sm text-gray-600">
              {dataSwitch ? t("Currently Open") : t("Currently Closed")}
            </span>
          </div> */}
        </div>

        {/* Right column - Store details */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md overflow-hidden">
          {/* Owner Information Section */}
          <div className="border-b">
            <div className="bg-gradient-to-r from-color-app to-color-app text-white font-bold py-3 px-4">
              {t("restaurantOwnerInformation")}
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">{t("surnameAndLastName")}</span>
                  <span className="font-medium">{dataStore?.adminName || "-"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">{t("location")}</span>
                  <span className="font-medium">{dataStore?.detail || "-"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">WhatsApp</span>
                  <span className="font-medium">{dataStore?.whatsapp || "-"}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">{t("phoneNumber")}</span>
                  <span className="font-medium">{dataStore?.phone || "-"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* General Information Section */}
          <div>
            <div className="bg-gradient-to-r from-color-app to-color-app text-white font-bold py-3 px-4">
              {t("generalInfo")}
            </div>
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">{t("totalTable")}</span>
                  <span className="font-medium">{numBerTable} {t("table")}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500 text-sm">{t("allMenu")}</span>
                  <span className="font-medium">{numBerMenus || "-"} {t("menu")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Popups */}
      <PopUpStoreEdit
        open={popEditStroe}
        data={dataStore}
        onClose={() => setPopEditStroe(false)}
        onSubmit={handleUpdateStore}
      />
      <PopUpStoreEditQR
        open={popEditQR}
        data={dataStore}
        onClose={() => setPopEditQR(false)}
        onSubmit={handleUpdateStore}
      />
    </div>
  );
}
