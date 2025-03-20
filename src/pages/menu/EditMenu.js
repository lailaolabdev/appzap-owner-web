import React, { useEffect, useState } from "react";
import { Breadcrumb, Button } from "react-bootstrap";
import { fontMap } from "../../utils/font-map";
import { useTranslation } from "react-i18next";
import { BODY } from "../../constants";
import { useForm, Controller } from "react-hook-form";
import Upload from "../../components/Upload";
import { useLocation, useNavigate } from "react-router-dom";
import { useMenuStore } from "../../zustand/menuStore";
import { useStoreStore } from "../../zustand/storeStore";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import PopUpAddMenuOption from "./components/popup/PopUpAddMenuOption";
import { getLocalData } from "../../constants/api";
import { getCategories } from "../../services/menuCategory";
import Box from "../../components/Box";

export default function EditMenu() {
  const location = useLocation();
  const { data, index } = location.state || {};
  const [showOptionSetting, setShowOptionSetting] = useState(false);
  const [detailMenuOption, setDetailMenuOption] = useState(null);
  const [menuOptionsCount, setMenuOptionsCount] = useState({});
  const [categories, setCategories] = useState([]);
  const [isWeightMenu, setIsWeightMenu] = useState(false);
  const navigate = useNavigate();
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const { updateMenuItem } = useMenuStore();
  const { storeDetail } = useStoreStore();
  const [getTokken, setgetTokken] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _localData = await getLocalData();
        if (_localData) {
          setgetTokken(_localData);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    getCategoriesData(storeDetail?._id);
  }, [storeDetail]);

  const getCategoriesData = async (storeId) => {
    try {
      const res = await getCategories(storeId);
      setCategories(res);
    } catch (error) {
      console.error("Get categories failed:", error);
    }
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: data || {
      recommended: false,
      isWeightMenu: false,
      unitWeightMenu: "g",
      name: "",
      name_en: "",
      name_cn: "",
      name_kr: "",
      images: [],
      quantity: 1,
      sort: 1,
      menuOptionId: [],
      categoryId: "",
      price: 0,
      detail: "",
      unit: "ຈອກ",
      isOpened: true,
      type: "MENU",
    },
  });

  const handleUpdateMenuOptionsCount = (menuId, count) => {
    setMenuOptionsCount((prev) => ({ ...prev, [menuId]: count }));
  };

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        setValue(key, data[key]);
      });
    }
    setIsWeightMenu(data.isWeightMenu);
  }, [data, setValue]);

  const toggleWeightMenu = () => {
    setIsWeightMenu((prev) => !prev); // Toggle between true and false
  };

  useEffect(() => {
    // If needed, update the form state when isWeightMenu changes
    setValue("isWeightMenu", isWeightMenu);
  }, [isWeightMenu, setValue]);

  const onSubmit = async (formData) => {
    try {
      const menuData = {
        recommended: formData?.recommended,
        isWeightMenu: formData?.isWeightMenu,
        unitWeightMenu: formData?.unitWeightMenu,
        name: formData?.name,
        name_en: formData?.name_en,
        name_cn: formData?.name_cn,
        name_kr: formData?.name_kr,
        quantity: formData?.quantity,
        categoryId: formData?.categoryId?._id,
        price: formData?.price,
        detail: formData?.detail,
        unit: formData?.unit,
        images: [...formData?.images],
        type: formData?.type,
        sort: formData?.sort,
        storeId: storeDetail?._id,
      };
      const updatedMenu = await updateMenuItem(menuData, data?._id);
      if (updatedMenu?.status === 200) {
        successAdd(`${t("edit_success")}`);
        navigate("/menu");
      }
    } catch (error) {
      console.error("Update failed:", error);
      errorAdd(`${t("edit_failed")}`);
    }
  };
  console.log("DATA", data);
  console.log("formData?.isWeightMenu", data?.isWeightMenu);
  console.log("isWeightMenu", isWeightMenu);
  console.log("formData?.unitWeightMenu", data?.unitWeightMenu);

  return (
    <div style={BODY}>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate("/menu")}>
          <span className={fontMap[language]}>{t("menu")}</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item active>
          <span className={fontMap[language]}>{t("edit-menu")}</span>
        </Breadcrumb.Item>
      </Breadcrumb>

      <form onSubmit={handleSubmit(onSubmit)} className="p-4">
        {/* Upload Image */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Upload
            src={watch("images")?.[0] || ""}
            removeImage={() => setValue("images", [])}
            onChange={(e) => {
              setValue("images", [e.name]);
            }}
          />
        </Box>

        {/* Recommended and Weight Menu */}
        <div className="flex flex-row justify-between items-center mb-4">
          <div>
            <div className="flex items-center gap-4">
              <label>{t("sg_menu")}</label>
              <input
                type="checkbox"
                {...register("recommended")}
                checked={watch("recommended")}
                onChange={(e) => setValue("recommended", e.target.checked)}
              />
              <label>
                {watch("recommended") ? `${t("oppen")}` : `${t("close")}`}
              </label>
            </div>
            <div className="flex items-center gap-4">
              <label>{t("menu_sold_by_weight")}</label>
              <input
                type="checkbox"
                // {...register("isWeightMenu")}
                checked={isWeightMenu}
                onChange={toggleWeightMenu} // Toggle the state when checkbox is clicked
              />
              <label>
                {watch("isWeightMenu") ? `${t("oppen")}` : `${t("close")}`}
              </label>
            </div>
            {isWeightMenu && (
              <>
                <label>{t("ຫົວໜ່ວຍຂາຍເປັນນ້ຳໜັກ")}</label>
                <select
                  {...register("unitWeightMenu")}
                  className="w-full p-2 border rounded"
                >
                  <option value="g">g</option>
                  <option value="kg">kg</option>
                </select>
              </>
            )}
          </div>
          <div>
            <button
              type="button"
              className={`menuSetting whitespace-nowrap !w-fit px-2 ${fontMap[language]}`}
              onClick={() => {
                setShowOptionSetting(true);
                setDetailMenuOption({ data, index });
              }}
            >
              + {t("addition_options")}
            </button>
          </div>
        </div>

        {/* Sequence */}
        <div className="mb-4">
          <label>{t("sequence")}</label>
          <input
            type="number"
            {...register("sort", { required: true })}
            className="w-full p-2 border rounded"
          />
          {errors.sort && <span className="text-red-500">ກະລຸນາປ້ອນລຳດັບ</span>}
        </div>

        {/* Category Selection */}
        <div className="mb-4">
          <label>{t("category")}</label>
          <select
            {...register("categoryId")}
            className="w-full p-2 border rounded"
          >
            <option value={data?.categoryId?.name || t("select_category")}>
              {data?.categoryId?.name || t("select_category")}
            </option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Food Name */}
        <div className="flex flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <label>{t("food_name")}</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className={`w-full p-2 border rounded ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <span className="text-red-500">ກະລຸນາປ້ອນຊື່ອາຫານ</span>
            )}
          </div>
          <div className="flex-1">
            <label>{t("food_name")} (EN)</label>
            <input
              type="text"
              {...register("name_en")}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Food Name (CN) and (KR) */}
        <div className="flex flex-row justify-between gap-4 mb-4">
          <div className="flex-1">
            <label>{t("food_name")} (CN)</label>
            <input
              type="text"
              {...register("name_cn")}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label>{t("food_name")} (KR)</label>
            <input
              type="text"
              {...register("name_kr")}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          <label>{t("price")}</label>
          <Controller
            name="price"
            control={control}
            rules={{ required: true, min: 0 }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/[^0-9]/g, "");
                  field.onChange(rawValue);
                }}
                value={field.value}
                className={`w-full p-2 border rounded ${
                  errors.price ? "border-red-500" : ""
                }`}
              />
            )}
          />
          {errors.price && <span className="text-red-500">ກະລຸນາປ້ອນລາຄາ</span>}
        </div>

        {/* Note */}
        <div className="mb-4">
          <label>{t("note")}</label>
          <input
            type="text"
            {...register("detail")}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            type="submit"
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: 0,
            }}
          >
            {t("save")}
          </Button>
        </div>
      </form>
      <PopUpAddMenuOption
        showSetting={showOptionSetting}
        detailMenu={detailMenuOption}
        handleClose={() => {
          setShowOptionSetting(false);
          setDetailMenuOption(null);
        }}
        getTokken={getTokken}
        updateMenuOptionsCount={handleUpdateMenuOptionsCount}
      />
    </div>
  );
}
