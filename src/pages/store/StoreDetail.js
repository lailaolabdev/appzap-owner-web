import React, { useEffect, useState } from "react";
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
import Loading from "../../components/Loading";
import { updateStore } from "../../services/store";
import { useParams } from "react-router-dom";
import StarRatings from "react-star-ratings";
import { useTranslation } from "react-i18next";


export default function StoreDetail() {
  const params = useParams();
  const { t } = useTranslation();


  // State
  const [isLoading, setIsLoading] = useState(false);
  const [dataStore, setStore] = useState();
  const [dataSwitch, setDataSwitch] = useState();
  const [numBerTable, setnumBerTable] = useState(0);
  const [numBerMenus, setnumBerMenus] = useState(0);
  const [getTokken, setgetTokken] = useState();
  const [popEditStroe, setPopEditStroe] = useState(false);
  
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
  const getData = async (storeId) => {
    setIsLoading(true);
    await fetch(STORE + `/?id=${params?.id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        setStore(json);
        setDataSwitch(json?.isOpen);
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
    <div>
      <div className="row" style={{ padding: 40 }}>
        <div className="col-sm-10" style={{ fontWeight: "bold", fontSize: 18 }}>
          ລາຍລະອຽດ
        </div>
        <div className="col-sm-2">
          <Button
            variant="outline-warnings"
            className="col-sm-8"
            style={{ color: "#606060", border: `solid 1px ${COLOR_APP}` }}
            onClick={() => setPopEditStroe(true)}
          >
            <FontAwesomeIcon icon={faEdit} style={{ marginRight: 10 }} />
            ແກ້ໄຂ
          </Button>
        </div>
      </div>
      <div className="row" style={{ padding: 40 }}>
        <div className="col-sm-5 text-center">
          {dataStore?.image ? (
            <center>
              <Image
                src={URL_PHOTO_AW3 + dataStore?.image}
                alt=""
                width="150"
                height="150"
                style={{
                  height: 200,
                  width: 200,
                  borderRadius: "50%",
                }}
              />
            </center>
          ) : (
            <center>
              <Image
                src={profileImage}
                alt=""
                width="150"
                height="150"
                style={{
                  height: 200,
                  width: 200,
                  borderRadius: "50%",
                }}
              />
            </center>
          )}
          <div style={{ fontWeight: "bold", fontSize: 20, padding: 10 }}>
            {" "}
            {dataStore?.name ? dataStore?.name : "-"}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <StarRatings
              rating={dataStore?.reviewStar || 0}
              starRatedColor="orange"
              starHoverColor="orange"
              // changeRating={3.48}
              numberOfStars={5}
              name="rating"
              starDimension="20px"
              starSpacing="4px"
            />
            <div>({dataStore?.reviewStarCount || 0})</div>
          </div>
          <div style={{ padding: 5 }}>ເປີດບໍລິການ</div>
          <div style={{ padding: 5 }}>{dataStore?.note}</div>
          <label className="switch">
            <input
              type="checkbox"
              defaultChecked={dataSwitch}
              onClick={() => _updateIsOpenStore(dataStore)}
            />
            <span className="slider round"></span>
          </label>
        </div>
        <div className="col-sm-7">
          <div
            style={{
              padding: 8,
              backgroundColor: COLOR_APP,
              fontWeight: "bold",
              color: "#FFFFFF",
            }}
          >
            ຂໍ້ມູນເຈົ້າຂອງຮ້ານ
          </div>
          <div style={{ height: 10 }}></div>
          <div className="row">
            <div className="col-5">ຊື່ແລະນາມສະກຸນ</div>
            <div className="col-5">
              {dataStore?.adminName ? dataStore?.adminName : "-"}
            </div>
          </div>
          <div style={{ height: 10 }}></div>
          <div className="row">
            <div className="col-5">ທີ່ຢູ່ຮ້ານ</div>
            <div className="col-5">
              {dataStore?.detail ? dataStore?.detail : "-"}
            </div>
          </div>
          <div style={{ height: 10 }}></div>
          <div className="row">
            <div className="col-5">whatsapp</div>
            <div className="col-5">
              {dataStore?.whatsapp ? dataStore?.whatsapp : "-"}
            </div>
          </div>
          <div style={{ height: 10 }}></div>
          <div className="row">
            <div className="col-5">ເບີໂທ</div>
            <div className="col-5">
              {dataStore?.phone ? dataStore?.phone : "-"}
            </div>
          </div>
          <div style={{ height: 10 }}></div>
          <div
            style={{
              padding: 8,
              backgroundColor: COLOR_APP,
              fontWeight: "bold",
              color: "#FFFFFF",
            }}
          >
            ຂໍ້ມູນທົ່ວໄປ
          </div>
          <div style={{ height: 10 }}></div>
          <div className="row">
            <div className="col-5">{t('totalTable')}</div>
            <div className="col-5"> {numBerTable} ໂຕະ</div>
          </div>
          <div style={{ height: 10 }}></div>
          <div className="row">
            <div className="col-5">ເມນູທັງໝົດ</div>
            <div className="col-5">{numBerMenus ? numBerMenus : "-"} ເມນູ</div>
          </div>
        </div>
      </div>
      {/* >>>>>>>>>>>>>>>>>>>>>>>>>>> PopUp <<<<<<<<<<<<<<<<<<<<<<<<<< */}
      <PopUpStoreEdit
        open={popEditStroe}
        data={dataStore}
        onClose={() => setPopEditStroe(false)}
        onSubmit={handleUpdateStore}
      />
    </div>
  );
}
