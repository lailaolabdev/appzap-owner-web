import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { useTranslation } from "react-i18next";
import {
  MENUS,
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
} from "../../../constants/api";
import { useStoreStore } from "../../../zustand/storeStore";

import { GetOnePromotion } from "../../../services/promotion";
import { moneyCurrency } from "../../../helpers";
import Loading from "../../../components/Loading";
import moment from "moment";
import { LuArrowLeft } from "react-icons/lu";

const BuyXGetYDetail = () => {
  const [formData, setFormData] = useState({
    name: "",
    buyQuantity: 1,
    getQuantity: 1,
    validFrom: "",
    validUntil: "",
    selectedMenus: [],
  });

  const { t } = useTranslation();
  const { promotionId } = useParams();
  const { storeDetail } = useStoreStore();
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterName, setFilterName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingGetOne, setIsLoadingGetOne] = useState(false);

  useEffect(() => {
    fetchPromotion();
  }, [promotionId]);

  const fetchPromotion = async () => {
    try {
      if (!promotionId) return;

      const response = await GetOnePromotion(promotionId);
      if (response?.status === 200) {
        const promoData = response.data;

        const menuWithFreeItems = promoData.menuId.map((menu) => ({
          _id: menu,
          freeItems: promoData.freeItems
            .filter((freeItem) => freeItem.mainMenuId === menu)
            .map((freeItem) => freeItem?._id),
        }));

        setFormData({
          name: promoData.name,
          buyQuantity: promoData.buyQuantity,
          getQuantity: promoData.getQuantity,
          validFrom: promoData.validFrom.split("T")[0],
          validUntil: promoData.validUntil.split("T")[0],
          selectedMenus: menuWithFreeItems,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _localData = await getLocalData();

        if (_localData) {
          getMenu(_localData?.DATA?.storeId);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (filterName || filterCategory) {
      const fetchFilter = async () => {
        try {
          const _localData = await getLocalData();

          setIsLoading(true);
          getMenu(_localData?.DATA?.storeId, filterCategory);

          await fetch(
            `${MENUS}/?storeId=${_localData?.DATA?.storeId}${
              filterCategory === "All" ? "" : `&categoryId=${filterCategory}`
            }${filterName && filterName !== "" ? `&name=${filterName}` : ""}`,
            {
              method: "GET",
            }
          )
            .then((response) => response.json())
            .then((json) => {
              setMenuData(json);
            });
          setIsLoading(false);
        } catch (err) {
          console.log(err);
          setIsLoading(false);
        }
      };
      fetchFilter();
    }
  }, [filterName, filterCategory]);

  const getMenu = async (id, categoryId) => {
    try {
      setIsLoading(true);
      await fetch(
        `${MENUS}/?storeId=${id}${
          filterName && filterName !== "" ? `&name=${filterName}` : ""
        }${
          categoryId && categoryId !== "All" ? `&categoryId=${categoryId}` : ""
        }`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => {
          setMenuData(json);
        });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  return (
    <div className="p-2 bg-gray-50 h-full w-full">
      {isLoadingGetOne || isLoading ? (
        <Loading />
      ) : (
        <Card className="bg-white rounded-xl p-4">
          <div className="flex justify-between mb-6 pb-2 border-b">
            <div
              onKeyDown={() => {}}
              onClick={() => navigate("/promotion")}
              className="text-lg flex gap-1 items-center cursor-pointer font-bold text-gray-600"
            >
              <LuArrowLeft />
              ຍ້ອນກັບ
            </div>
            <button
              type="button"
              onClick={() =>
                navigate(`/promotion/buyXGetX/edit/${promotionId}`)
              }
              className="bg-orange-600 text-[14px] w-[60px] text-white p-2 rounded-lg hover:bg-orange-700 transition duration-200"
            >
              ແກ້ໄຂ
            </button>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Left Column - Promotion Details */}
            <Card className="p-6  h-[400px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                ລາຍລະອຽດໂປຣໂມຊັນ
              </h3>

              <div className="space-y-5">
                <div className="border-b flex gap-4">
                  <p className="text-md font-medium text-gray-500 mb-1">
                    ຊື່ໂປຣໂມຊັນ:
                  </p>
                  <p className="text-base text-gray-800">{formData?.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b">
                  <div className="flex gap-4">
                    <p className="text-md font-medium text-gray-500 mb-1">
                      ຈຳນວນທີ່ຊື້:
                    </p>
                    <p className="text-base text-gray-800">
                      {formData?.buyQuantity}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <p className="text-md font-medium text-gray-500 mb-1">
                      ຈຳນວນທີ່ແຖມ:
                    </p>
                    <p className="text-base text-gray-800">
                      {formData?.getQuantity}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b">
                  <div className="flex gap-4">
                    <p className="text-md font-medium text-gray-500 mb-1">
                      ວັນທີ່ເລີ່ມຕົ້ນ:
                    </p>
                    <p className="text-base text-gray-800">
                      {formData?.validFrom}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <p className="text-md font-medium text-gray-500 mb-1">
                      ວັນທີ່ສິ້ນສຸດ:
                    </p>
                    <p className="text-base text-gray-800">
                      {formData?.validUntil}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Right Column - Menu Items */}
            <Card className="p-6 h-[400px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                ລາຍການແຖມ
              </h3>

              <div className="mb-4">
                {formData.selectedMenus.length > 0 ? (
                  <>
                    {formData.selectedMenus.map((menu) => (
                      <div
                        key={menu._id}
                        className="flex items-center border-b"
                      >
                        <div>
                          <h4 className="font-bold text-lg text-gray-800">
                            <span className="mr-2">ເມນູຫຼັກ :</span>
                            {menuData.find((m) => m._id === menu._id)?.name ??
                              "ບໍ່ມີຊື່ເມນູ"}
                            <span>
                              (
                              {moneyCurrency(
                                menuData.find((m) => m._id === menu._id)?.price
                              ) ?? "0"}{" "}
                              {storeDetail?.firstCurrency})
                            </span>
                          </h4>

                          {menu.freeItems.length > 0 && (
                            <ul>
                              {menu.freeItems.map((freeItemId) => (
                                <li
                                  key={freeItemId}
                                  className="flex gap-2 items-center"
                                >
                                  <span className="text-[14px] text-color-app font-bold">
                                    <span className="mr-2">ເມນູແຖມ :</span>
                                    {
                                      menuData.find((m) => m._id === freeItemId)
                                        ?.name
                                    }
                                    <span className="mx-2">
                                      (
                                      {moneyCurrency(
                                        menuData.find(
                                          (m) => m._id === freeItemId
                                        )?.price
                                      )}{" "}
                                      {storeDetail?.firstCurrency})
                                    </span>
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="font-bold text-lg text-gray-800 mt-40">
                      <span>ລາຄາເມນູຫຼັກທັງໝົດ:</span>{" "}
                      <span>
                        {moneyCurrency(
                          formData.selectedMenus.reduce((total, menu) => {
                            const mainMenu = menuData.find(
                              (m) => m._id === menu._id
                            );
                            return total + (mainMenu ? mainMenu.price : 0);
                          }, 0)
                        )}{" "}
                        {storeDetail?.firstCurrency}
                      </span>
                    </div>
                    <div className="font-bold text-lg text-gray-800 mt-2">
                      <span>ລາຄາເມນູແຖມທັງໝົດ:</span>{" "}
                      <span>
                        {moneyCurrency(
                          formData.selectedMenus.reduce((total, menu) => {
                            const freeItems = menu.freeItems.map(
                              (freeItemId) =>
                                menuData.find((m) => m._id === freeItemId)
                                  ?.price || 0
                            );
                            return (
                              total +
                              freeItems.reduce(
                                (itemTotal, price) => itemTotal + price,
                                0
                              )
                            );
                          }, 0)
                        )}{" "}
                        {storeDetail?.firstCurrency}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center mt-48">
                    ຍັງບໍ່ມີເມນູຫຼັກ
                  </p>
                )}
              </div>
            </Card>
          </div>

          <div className="mt-3 text-md text-gray-500 text-center">
            ຂໍ້ມູນໂປຣໂມຊັນສ້າງລ່າສຸດ{" "}
            {moment(formData?.createdAt).format("DD-MM-YYYY")}
          </div>
        </Card>
      )}
    </div>
  );
};

export default BuyXGetYDetail;
