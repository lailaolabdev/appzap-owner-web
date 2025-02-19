import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useTranslation } from "react-i18next";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { moneyCurrency } from "../../helpers";
import ImageEmpty from "../../image/empty.png";
import matchRoundNumber from "../../helpers/matchRound";
import { URL_PHOTO_AW3 } from "../../constants";
import { useMenuSelectStore } from "../../zustand/menuSelectStore";
import {
  useSlideImageStore,
  useCombinedToggleSlide,
} from "../../zustand/slideImageStore";
import { useStoreStore } from "../../zustand/storeStore";
import { TypeEffect } from "./TypeEffect";

const PreviewSlide = () => {
  const { t } = useTranslation();
  const { setSelectedMenus, SelectedMenus } = useMenuSelectStore();
  const { storeDetail } = useStoreStore();
  const [total, setTotal] = React.useState(0);

  const { isToggled, isToggledSlide, isToggledTable } =
    useCombinedToggleSlide(); // Get current state

  // Get current state
  useEffect(() => {
    _calculateTotal();
  }, [SelectedMenus]);

  const _calculateTotal = () => {
    let _total = 0;
    for (const _data of SelectedMenus || []) {
      const totalOptionPrice = _data?.totalOptionPrice || 0;
      const itemPrice = _data?.price + totalOptionPrice;
      // _total += _data?.totalPrice || (_data?.quantity * itemPrice);
      _total += _data?.quantity * itemPrice;
    }

    const roundedNumber = matchRoundNumber(_total);
    setTotal(roundedNumber);
  };

  const TotalAmount = () => {
    return SelectedMenus.reduce((currentValue, nextValue) => {
      return currentValue + nextValue.quantity;
    }, 0);
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === "FULLSCREEN") {
        const element = document.documentElement;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
          element.webkitRequestFullscreen();
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
        }
      }
    };

    // Clean up the event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "menuSlected") {
        const newState = JSON.parse(event.newValue);
        setSelectedMenus(newState.state.SelectedMenus);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [setSelectedMenus]);

  const { UseSlideImage } = useSlideImageStore();

  return (
    <>
      <div className="h-[320px] w-[310px]">
        {isToggled && (
          <h2 className="text-[14px] font-bold text-center text-orange-500">
            {storeDetail?.name}
          </h2>
        )}
        {UseSlideImage[0]?.isPublished === true ? (
          <div
            className={`${
              isToggled ? "pt-2" : "p-6"
            } flex gap-4 flex-row items-center justify-center`}
          >
            {isToggledSlide && (
              <div
                className={` ${
                  isToggled ? "w-[250px] h-[80px]" : "w-[250px] h-[80px]"
                } rounded-md`}
              >
                <Swiper
                  spaceBetween={30}
                  centeredSlides={true}
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                  }}
                  pagination={{
                    clickable: true,
                  }}
                  // navigation={true}
                  modules={[Autoplay, Pagination]}
                  className="mySwiper"
                >
                  {UseSlideImage[0]?.isPublished === true &&
                    UseSlideImage[0]?.images.map((item) => (
                      <SwiperSlide key={item}>
                        <img
                          src={`${URL_PHOTO_AW3}${item}`}
                          alt="placeholder"
                          className="w-[250px] h-[280px] object-cover rounded-md"
                        />
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
            )}
            {isToggledTable && (
              <div
                className={` ${
                  isToggled
                    ? "w-[250px] h-[80px]"
                    : "w-[250px] h-[80px] border-1 border-slate-400"
                }`}
              >
                <div className="w-[250px] h-[180px] overflow-y-auto">
                  <Table
                    responsive
                    className="table  border-collapse border border-black"
                  >
                    <thead style={{ backgroundColor: "#F1F1F1" }}>
                      <tr style={{ fontSize: "bold", border: "none" }}>
                        <th
                          style={{
                            border: "none",
                            textWrap: "nowrap",
                            textAlign: "center",
                            fontSize: "10px",
                          }}
                        >
                          {t("no")}
                        </th>
                        <th
                          style={{
                            border: "none",
                            textWrap: "nowrap",
                            textAlign: "left",
                            fontSize: "10px",
                          }}
                        >
                          {t("menu_name")}
                        </th>
                        <th
                          style={{
                            border: "none",
                            textWrap: "nowrap",
                            textAlign: "center",
                            fontSize: "10px",
                          }}
                        >
                          {t("amount")}
                        </th>
                        <th
                          style={{
                            border: "none",
                            textWrap: "nowrap",
                            textAlign: "left",
                            fontSize: "10px",
                          }}
                        >
                          {t("price")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.from({ length: 2 }).map((_, index) => (
                        <tr key={index} className="text-[10px]">
                          <td>{index + 1}</td>
                          <td>ລາຍການ {index + 1}</td>
                          <td>
                            <p>2</p>
                          </td>
                          <td>
                            <p>{moneyCurrency(20000)}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="mt-1">
                  <div className="mb-3 flex flex-col gap-2">
                    <div className="flex flex-row justify-between">
                      <span className="font-bold text-[10px]">
                        {t("amountTotal")} :{" "}
                      </span>
                      <span className="font-bold text-[10px]">
                        {SelectedMenus?.length > 0 ? Number.parseFloat(4) : 0}{" "}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between">
                      <span className="font-bold text-[10px]">
                        {t("totalAmount")} :{" "}
                      </span>
                      <span className="font-bold text-[10px]">
                        {SelectedMenus?.length > 0 ? moneyCurrency(40000) : 0}{" "}
                        {t("nameCurrency")}
                      </span>
                    </div>
                    {/* <div className="flex flex-row justify-between">
                      <span className="font-bold text-[10px]">
                        {t("discount")} :{" "}
                      </span>
                      <span className="font-bold text-[10px]">
                        {SelectedMenus?.length > 0 ? moneyCurrency(0) : 0}{" "}
                        {t("nameCurrency")}
                      </span>
                    </div> */}
                    <div className="flex flex-row justify-between">
                      <span className="font-bold text-[10px]">
                        {t("change")} :{" "}
                      </span>
                      <span className="font-bold text-[10px]">
                        {SelectedMenus?.length > 0 ? moneyCurrency(0) : 0}{" "}
                        {t("nameCurrency")}
                      </span>
                    </div>
                    <div className="flex flex-row justify-between">
                      <span className="font-bold text-[12px]">
                        {t("totals")} :{" "}
                      </span>
                      <span className="font-bold text-[12px]">
                        {SelectedMenus?.length > 0 ? moneyCurrency(40000) : 0}{" "}
                        {t("nameCurrency")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-[330px] w-[310px] p-4 flex justify-center ">
            <div>
              <div className="w-[550px] h-[180px] overflow-y-auto">
                <Table
                  responsive
                  className="table  w-full border-collapse border border-black"
                >
                  <thead style={{ backgroundColor: "#F1F1F1" }}>
                    <tr style={{ fontSize: "bold", border: "none" }}>
                      <th
                        style={{
                          border: "none",
                          textWrap: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        {t("no")}
                      </th>
                      <th
                        style={{
                          border: "none",
                          textWrap: "nowrap",
                          textAlign: "left",
                        }}
                      >
                        {t("menu_name")}
                      </th>
                      <th
                        style={{
                          border: "none",
                          textWrap: "nowrap",
                          textAlign: "center",
                        }}
                      >
                        {t("amount")}
                      </th>
                      <th
                        style={{
                          border: "none",
                          textWrap: "nowrap",
                          textAlign: "left",
                        }}
                      >
                        {t("price")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.from({ length: 2 }).map((_, index) => (
                      <tr key={index} className="text-[10px]">
                        <td>{index + 1}</td>
                        <td>ລາຍການ {index + 1}</td>
                        <td>
                          <p>2</p>
                        </td>
                        <td>
                          <p>{moneyCurrency(20000)}</p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <div className="">
                <div className="mb-3 flex flex-col gap-2">
                  <div className="flex flex-row justify-between">
                    <span className="font-bold text-[10px]">
                      {t("amountTotal")} :{" "}
                    </span>
                    <span className="font-bold text-[10px]">
                      {SelectedMenus?.length > 0 ? Number.parseFloat(0) : 0}{" "}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span className="font-bold text-[10px]">
                      {t("totalAmount")} :{" "}
                    </span>
                    <span className="font-bold text-[10px]">
                      {SelectedMenus?.length > 0 ? moneyCurrency(0) : 0}{" "}
                      {t("nameCurrency")}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span className="font-bold text-[10px]">
                      {t("discount")} :{" "}
                    </span>
                    <span className="font-bold text-[10px]">
                      {SelectedMenus?.length > 0 ? moneyCurrency(0) : 0}{" "}
                      {t("nameCurrency")}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span className="font-bold text-[10px]">
                      {t("change")} :{" "}
                    </span>
                    <span className="font-bold text-[10px]">
                      {SelectedMenus?.length > 0 ? moneyCurrency(0) : 0}{" "}
                      {t("nameCurrency")}
                    </span>
                  </div>
                  <div className="flex flex-row justify-between">
                    <span className="font-bold text-[10px]">
                      {t("totals")} :{" "}
                    </span>
                    <span className="font-bold text-[10px]">
                      {SelectedMenus?.length > 0 ? moneyCurrency(0) : 0}{" "}
                      {t("nameCurrency")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PreviewSlide;
