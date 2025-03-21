import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Card } from "../../../components/ui/Card";
import { useTranslation } from "react-i18next";
import {
  MENUS,
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
} from "../../../constants/api";
import { moneyCurrency } from "../../../helpers";
import { useStoreStore } from "../../../zustand/storeStore";
import { useMenuStore } from "../../../zustand/menuStore";
import { GetOnePromotion } from "../../../services/promotion";
import Loading from "../../../components/Loading";
import { LuArrowLeft } from "react-icons/lu";
const DiscountDetail = () => {
  const [formData, setFormData] = useState({
    name: "",
    discountType: "",
    discountValue: 0,
    minPurchasePrice: 0,
    validFrom: "",
    validUntil: "",
    selectedMenus: [],
    selectedMenuIds: [],
  });
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const navigate = useNavigate();
  const { promotionId } = useParams();
  const [menuData, setMenuData] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    getMenus,
    getMenuCategories,
    setMenus,
    setMenuCategories,
    isMenuLoading,
  } = useMenuStore();

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
    if (promotionId) getOnePromotion(promotionId);
  }, [promotionId]);

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

  const getOnePromotion = async (id) => {
    setIsLoading(true);
    const response = await GetOnePromotion(id);
    if (response?.status === 200) {
      const data = response?.data;

      // Extract menu IDs from the response
      const selectedMenu = Array.isArray(data.menuId) ? data.menuId : [];
      const specialIds = selectedMenu?.map((item) => item);

      setFormData({
        name: data.name,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minPurchasePrice: data.minPurchasePrice,
        validFrom: data.validFrom,
        validUntil: data.validUntil,
        selectedMenus: selectedMenu, // Full menu objects
        selectedMenuIds: specialIds, // Only menu IDs
      });
      setIsLoading(false);
    }
  };

  const calculateDiscount = (menuPrice) => {
    const discountAmount =
      formData.discountType === "PERCENTAGE"
        ? (menuPrice?.price * formData.discountValue) / 100
        : formData.discountValue;
    return menuPrice?.price - discountAmount;
  };

  const getTotalDiscountPrice = () => {
    let total = 0;

    // biome-ignore lint/complexity/noForEach: <explanation>
    formData.selectedMenus.forEach((menuId) => {
      const menu = menuData.find((menu) => menu._id === menuId) || [];
      total += calculateDiscount(menu);
    });

    return total;
  };

  useEffect(() => {
    if (formData.selectedMenus.length > 0) {
      const totalPrice = getTotalDiscountPrice();
    }
  }, [formData.selectedMenus]);

  const fetchData = async () => {
    if (storeDetail?._id) {
      const storeId = storeDetail?._id;

      // Check if menuData and categories are already in the zustand store

      const fetchedMenus = await getMenus(storeId);
      setMenus(fetchedMenus); // Save to zustand store

      const fetchedCategories = await getMenuCategories(storeId);
      setMenuCategories(fetchedCategories); // Save to zustand store
    }
  };

  return (
    <div className="p-2 bg-gray-50 h-full w-full">
      {isLoading ? (
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
              {t("back")}
            </div>
            <button
              type="button"
              onClick={() =>
                navigate(`/promotion/discount/edit/${promotionId}`)
              }
              className="bg-orange-600 text-[14px] w-[80px] text-white p-2 rounded-lg hover:bg-orange-700 transition duration-200"
            >
              {t("edit_bill")}
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Left Column - Promotion Details */}
            <Card className="p-6  h-[400px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {t("detail_promotion")}
              </h3>

              <div className="space-y-5">
                <div className="border-b flex gap-4">
                  <p className="text-md font-medium text-gray-500 mb-1">
                    {t("promotion_name")}:
                  </p>
                  <p className="text-base text-gray-800">{formData?.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b">
                  <div className="flex gap-4">
                    <p className="text-md font-medium text-gray-500 mb-1">
                      {t("type_discount")}:
                    </p>
                    <p className="text-base text-gray-800">
                      {formData?.discountType === "FIXED_AMOUNT"
                        ? t("dis_fixed_amount")
                        : t("dis_discount_amount")}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <p className="text-md font-medium text-gray-500 mb-1">
                      {t("discount_price")}:
                    </p>
                    <p className="text-base text-gray-800">
                      {moneyCurrency(formData?.discountValue)}{" "}
                      {formData?.discountType === "FIXED_AMOUNT"
                        ? storeDetail?.firstCurrency
                        : "%"}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-b">
                  <div className="flex gap-4">
                    <p className="text-md font-medium text-gray-500 mb-1">
                      {t("validFrom")}:
                    </p>
                    <p className="text-base text-gray-800">
                      {moment(formData.validFrom).format("DD-MM-YYYY")}
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <p className="text-md font-medium text-gray-500 mb-1">
                      {t("validUntil")}:
                    </p>
                    <p className="text-base text-gray-800">
                      {moment(formData.validUntil).format("DD-MM-YYYY")}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Right Column - Menu Items */}
            <Card className="p-6 h-[400px] overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                {t("list_for_free")}
              </h3>

              <div className="mb-4">
                <table className="w-full mt-4">
                  <thead>
                    <tr>
                      <th className="border-b p-2">{t("menuname")}</th>
                      <th className="border-b p-2">{t("name_type")}</th>

                      <th className="border-b p-2">{t("regular_price")}</th>
                      <th className="border-b p-2">{t("price_promotion")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData?.selectedMenus?.map((menuId) => {
                      let menu = [];
                      if (menuId?._id) {
                        menu =
                          menuData.find((m) => m._id === menuId?._id) || [];
                      } else {
                        menu = menuData.find((m) => m._id === menuId) || [];
                      }
                      if (!menu) return null;
                      return (
                        <tr key={menu._id}>
                          <td className="border-b p-2">{menu.name}</td>
                          <td className="border-b p-2 text-ellipsis">
                            {menu.categoryId?.name}
                          </td>

                          <td className="border-b p-2">
                            {moneyCurrency(menu.price)}{" "}
                            {storeDetail?.firstCurrency}
                          </td>
                          <td className="border-b p-2">
                            {moneyCurrency(calculateDiscount(menu))}{" "}
                            {storeDetail?.firstCurrency}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end">
                <span className="text-[18px] text-orange-500 font-bold mt-2 text-end">
                  {t("all_promotional_prices")} :{" "}
                  {moneyCurrency(getTotalDiscountPrice())}{" "}
                  {storeDetail?.firstCurrency}
                </span>
              </div>
            </Card>
          </div>

          <div className="mt-3 text-md text-gray-500 text-center">
            {t("create_promotion_lasted")}{" "}
            {moment(formData?.createdAt).format("DD-MM-YYYY")}
          </div>
        </Card>
      )}
    </div>
  );
};

export default DiscountDetail;
