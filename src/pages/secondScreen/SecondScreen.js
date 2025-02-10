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
  useChangeMoney,
} from "../../zustand/slideImageStore";
import { useStoreStore } from "../../zustand/storeStore";
import { TypeEffect } from "./TypeEffect";
import { BsCartXFill } from "react-icons/bs";

const SecondScreen = () => {
  const { t } = useTranslation();
  const { setSelectedMenus, SelectedMenus } = useMenuSelectStore();
  const { storeDetail } = useStoreStore();
  const [total, setTotal] = React.useState(0);

  const { isToggled, isToggledSlide, isToggledTable } =
    useCombinedToggleSlide(); // Get current state
  const { ChangeAmount } = useChangeMoney();

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
        if (!document.fullscreenElement) {
          // เข้าสู่ Full Screen
          if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
          }
        }
      }
    };
    const storedState = localStorage.getItem("menuSlected");
    if (storedState) {
      const newState = JSON.parse(storedState);
      setSelectedMenus(newState.state.SelectedMenus);
    }
    // Clean up the event listener
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const storedState = localStorage.getItem("menuSlected");
    if (storedState) {
      const newState = JSON.parse(storedState);
      setSelectedMenus(newState.state.SelectedMenus);
    }

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
      <div className="h-screen w-screen">
        {isToggled && (
          <TypeEffect
            storeDetail={storeDetail}
            textEffect={UseSlideImage?.name}
          />
        )}

        {UseSlideImage?.isPublished ? (
          <div
            className={`${
              isToggled ? "pt-2" : "p-6"
            } flex gap-2 flex-row items-center justify-center`}
          >
            {/* Swiper Image Slider */}
            {isToggledSlide && !isToggledTable ? (
              <div
                className={` ${
                  isToggled ? "w-[1300px] h-[580px]" : "w-[1300px] h-[625px]"
                } 2xl:w-[1200px] 2xl:h-[875px] bg-white rounded-lg shadow-lg p-4 overflow-hidden`}
              >
                <Swiper
                  spaceBetween={30}
                  centeredSlides
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  modules={[Autoplay, Pagination]}
                  className="mySwiper"
                >
                  {UseSlideImage?.images?.map((item) => (
                    <SwiperSlide key={item}>
                      <img
                        src={`${URL_PHOTO_AW3}${item}`}
                        alt="Slide"
                        className="w-[1250px] h-[530px] 2xl:w-[1200px] 2xl:h-[800px] object-cover rounded-md"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : isToggledSlide ? (
              <div
                className={` ${
                  isToggled ? "w-[820px] h-[580px]" : "w-[820px] h-[625px]"
                } 2xl:w-[1200px] 2xl:h-[875px] bg-white rounded-lg shadow-lg p-4 overflow-hidden`}
              >
                <Swiper
                  spaceBetween={30}
                  centeredSlides
                  autoplay={{ delay: 2500, disableOnInteraction: false }}
                  pagination={{ clickable: true }}
                  modules={[Autoplay, Pagination]}
                  className="mySwiper"
                >
                  {UseSlideImage?.images?.map((item) => (
                    <SwiperSlide key={item}>
                      <img
                        src={`${URL_PHOTO_AW3}${item}`}
                        alt="Slide"
                        className="w-[900px] h-[530px] 2xl:w-[1200px] 2xl:h-[800px] object-cover rounded-md"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              ""
            )}

            {/* Table Section */}
            {isToggledTable && !isToggledSlide ? (
              <div className="w-[1300px] h-[580px] 2xl:h-[980px] bg-white rounded-lg shadow-lg p-4 overflow-hidden">
                <div className="w-full h-[400px] 2xl:h-[700px] overflow-y-auto">
                  <Table
                    responsive
                    className="table w-full border-collapse border border-black"
                  >
                    <thead style={{ backgroundColor: "#F1F1F1" }}>
                      <tr>
                        <th style={{ textAlign: "center" }}>{t("no")}</th>
                        <th style={{ textAlign: "left" }}>{t("menu_name")}</th>
                        <th style={{ textAlign: "center" }}>{t("amount")}</th>
                        <th style={{ textAlign: "left" }}>{t("price")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Array.isArray(SelectedMenus) &&
                      SelectedMenus.length > 0 ? (
                        SelectedMenus.map((data, index) => {
                          const optionsString = data.options?.length
                            ? data.options
                                .map((option) =>
                                  option.quantity > 1
                                    ? `[${option.quantity} x ${option.name}]`
                                    : `[${option.name}]`
                                )
                                .join(" ")
                            : "";
                          const itemPrice =
                            data?.price + (data?.totalOptionPrice || 0);
                          return (
                            <tr key={data.id}>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-left">
                                {data.name} {optionsString}
                              </td>
                              <td className="text-center">{data.quantity}</td>
                              <td>{moneyCurrency(itemPrice)}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center">
                            <div className="flex flex-col items-center mt-20">
                              <BsCartXFill className="text-[80px] text-orange-500 animate-bounce" />
                              <p className="text-[16px] mt-2 font-bold text-orange-500">
                                {t("no_order_list")}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </div>

                {/* Summary Section */}
                <div className="mt-1 flex flex-col ml-[39rem] 2xl:ml-[58rem] w-[25rem] gap-2">
                  <div className="flex justify-between">
                    <span>{t("amountTotal")}:</span>
                    <span className="font-bold">
                      {Array.isArray(SelectedMenus) && SelectedMenus.length > 0
                        ? TotalAmount().toFixed(2)
                        : 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("totalAmount")}:</span>
                    <span className="font-bold">
                      {Array.isArray(SelectedMenus) && SelectedMenus.length > 0
                        ? moneyCurrency(total + ChangeAmount)
                        : 0}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t("change")}:</span>
                    <span className="font-bold">
                      {Array.isArray(SelectedMenus) && SelectedMenus.length > 0
                        ? moneyCurrency(ChangeAmount)
                        : 0}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between text-[25px] font-bold">
                    <span>{t("totals")}:</span>
                    <span>
                      {Array.isArray(SelectedMenus) && SelectedMenus.length > 0
                        ? moneyCurrency(total)
                        : 0}{" "}
                      {storeDetail?.firstCurrency}
                    </span>
                  </div>
                </div>
              </div>
            ) : isToggledTable ? (
              <div
                className={`${
                  isToggled ? "w-[520px] h-[580px]" : "w-[820px] h-[625px]"
                } 2xl:w-[680px] 2xl:h-[875px] bg-white rounded-lg shadow-lg p-4 overflow-hidden`}
              >
                {/* Table Section */}
                <div className="h-[320px] 2xl:h-[560px] overflow-y-auto border border-gray-200 rounded-lg">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-100">
                      <tr className="border-b border-gray-200">
                        <th className="py-2 px-4 text-center font-bold text-gray-700 whitespace-nowrap">
                          {t("no")}
                        </th>
                        <th className="py-2 px-4 text-left font-bold text-gray-700 whitespace-nowrap">
                          {t("menu_name")}
                        </th>
                        <th className="py-2 px-4 text-center font-bold text-gray-700 whitespace-nowrap">
                          {t("amount")}
                        </th>
                        <th className="py-2 px-4 text-left font-bold text-gray-700 whitespace-nowrap">
                          {t("price")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {SelectedMenus?.length > 0 ? (
                        SelectedMenus.map((data, index) => {
                          // Create the options string if options exist
                          const optionsString =
                            data.options && data.options.length > 0
                              ? data.options
                                  .map((option) =>
                                    option.quantity > 1
                                      ? [`${option.quantity} x ${option.name}`]
                                      : [`${option.name}`]
                                  )
                                  .join(" ")
                              : "";
                          const totalOptionPrice = data?.totalOptionPrice || 0;
                          const itemPrice = data?.price + totalOptionPrice;

                          return (
                            <tr
                              key={data.id}
                              className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <td className="py-2 px-4 text-center">
                                {index + 1}
                              </td>
                              <td className="py-2 px-4 text-left">
                                {data.name} {optionsString}
                              </td>
                              <td className="py-2 px-4 text-center">
                                <p>{data.quantity}</p>
                              </td>
                              <td className="py-2 px-4 text-left">
                                <p>{moneyCurrency(itemPrice)}</p>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={5}>
                            <div className="h-[500] mt-20 flex justify-center items-center">
                              <div className="flex flex-col items-center">
                                <BsCartXFill className="text-[80px] text-orange-500 animate-bounce" />
                                <p className="text-[16] mt-2 font-bold text-orange-500">
                                  {t("no_order_list")}
                                </p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Summary Section */}
                <div className="mt-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center border-b border-gray-200 py-2">
                      <span className="text-gray-700">{t("amountTotal")}:</span>
                      <span className="font-bold text-gray-900">
                        {SelectedMenus?.length > 0
                          ? Number.parseFloat(TotalAmount())
                          : 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 py-2">
                      <span className="text-gray-700">{t("totalAmount")}:</span>
                      <span className="font-bold text-gray-900">
                        {SelectedMenus?.length > 0
                          ? moneyCurrency(total + ChangeAmount)
                          : 0}{" "}
                        {storeDetail?.firstCurrency}
                      </span>
                    </div>
                    {/* <div className="flex justify-between items-center border-b border-gray-200 py-2">
                      <span className="text-gray-700">{t("discount")}:</span>
                      <span className="font-bold text-gray-900">
                        {SelectedMenus?.length > 0 ? moneyCurrency(20000) : 0}{" "}
                        {storeDetail?.firstCurrency}
                      </span>
                    </div> */}
                    <div className="flex justify-between items-center border-b border-gray-200 py-2">
                      <span className="text-gray-700">{t("change")}:</span>
                      <span className="font-bold text-gray-900">
                        {ChangeAmount ? moneyCurrency(ChangeAmount) : 0}{" "}
                        {storeDetail?.firstCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold text-[30px] text-gray-800">
                        {t("totals")}:
                      </span>
                      <span className="font-bold text-[25px] text-gray-800">
                        {SelectedMenus?.length > 0 ? moneyCurrency(total) : 0}{" "}
                        {storeDetail?.firstCurrency}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          // Case when UseSlideImage is NOT published
          <div className="flex justify-center items-center">
            <div className="w-[1300px] h-[580px] 2xl:h-[980px] bg-white rounded-lg shadow-lg p-4 overflow-hidden">
              <div className="w-full h-[400px] 2xl:h-[700px] overflow-y-auto">
                <Table
                  responsive
                  className="table w-full border-collapse border border-black"
                >
                  <thead style={{ backgroundColor: "#F1F1F1" }}>
                    <tr>
                      <th style={{ textAlign: "center" }}>{t("no")}</th>
                      <th style={{ textAlign: "left" }}>{t("menu_name")}</th>
                      <th style={{ textAlign: "center" }}>{t("amount")}</th>
                      <th style={{ textAlign: "left" }}>{t("price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(SelectedMenus) &&
                    SelectedMenus.length > 0 ? (
                      SelectedMenus.map((data, index) => {
                        const optionsString = data.options?.length
                          ? data.options
                              .map(
                                (option) =>
                                  `[${option.quantity} x ${option.name}]`
                              )
                              .join(" ")
                          : "";
                        const itemPrice =
                          data?.price + (data?.totalOptionPrice || 0);
                        return (
                          <tr key={data.id}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-left">
                              {data.name} {optionsString}
                            </td>
                            <td className="text-center">{data.quantity}</td>
                            <td>{moneyCurrency(itemPrice)}</td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center">
                          <div className="flex flex-col items-center mt-20">
                            <BsCartXFill className="text-[80px] text-orange-500 animate-bounce" />
                            <p className="text-[16px] mt-2 font-bold text-orange-500">
                              {t("no_order_list")}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
              {/* Summary Section */}
              <div className="mt-1 flex flex-col ml-[39rem] 2xl:ml-[58rem] w-[25rem] gap-2">
                <div className="flex justify-between">
                  <span>{t("amountTotal")}:</span>
                  <span className="font-bold">
                    {Array.isArray(SelectedMenus) && SelectedMenus.length > 0
                      ? TotalAmount().toFixed(2)
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("totalAmount")}:</span>
                  <span className="font-bold">
                    {Array.isArray(SelectedMenus) && SelectedMenus.length > 0
                      ? moneyCurrency(total + ChangeAmount)
                      : 0}{" "}
                    {storeDetail?.firstCurrency}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t("change")}:</span>
                  <span className="font-bold">
                    {Array.isArray(SelectedMenus) && SelectedMenus.length > 0
                      ? moneyCurrency(ChangeAmount)
                      : 0}{" "}
                    {storeDetail?.firstCurrency}
                  </span>
                </div>
                <div className="flex justify-between text-[25px] font-bold">
                  <span>{t("totals")}:</span>
                  <span>
                    {Array.isArray(SelectedMenus) && SelectedMenus.length > 0
                      ? moneyCurrency(total)
                      : 0}{" "}
                    {storeDetail?.firstCurrency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SecondScreen;
