import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import { Card } from "../../../components/ui/Card";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import {
  MENUS,
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
} from "../../../constants/api";
import { moneyCurrency } from "../../../helpers";
import { useStoreStore } from "../../../zustand/storeStore";
import { useMenuStore } from "../../../zustand/menuStore";
import { errorAdd } from "../../../helpers/sweetalert";
import Swal from "sweetalert2";
import { COLOR_APP, COLOR_APP_CANCEL } from "../../../constants";
import {
  UpdateDisCountPromotion,
  GetOnePromotion,
  RemoveMenuFromDiscount,
} from "../../../services/promotion";
import Loading from "../../../components/Loading";
const EditDiscountForm = () => {
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
  const [modalOpen, setModalOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [Categorys, setCategorys] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");

  const {
    menus,
    menuCategories,
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
          getcategory(_localData?.DATA?.storeId);
          getMenu(_localData?.DATA?.storeId);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    getcategory();
    if (promotionId) getOnePromotion();
  }, [promotionId]);

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

  const getcategory = async (id) => {
    try {
      if (!id) return;
      await fetch(
        `${END_POINT_SEVER_TABLE_MENU}/v3/categories?storeId=${id}&isDeleted=false`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => setCategorys(json));
    } catch (err) {
      console.log(err);
    }
  };

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

  const getOnePromotion = async () => {
    setIsLoading(true);
    const response = await GetOnePromotion(promotionId);
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

  const handleMenuSelect = (e) => {
    const menuId = e.target.value; // Get the ID of the selected menu
    const isChecked = e.target.checked;

    // Find the full menu object corresponding to the menuId
    const selectedMenu = menuData.find((menu) => menu._id === menuId);

    if (!selectedMenu) return; // Exit if the menu object is not found

    // Update selectedMenus based on whether the checkbox is checked or unchecked
    const updatedSelectedMenus = isChecked
      ? [...formData.selectedMenus, selectedMenu] // Add the menu object if checked
      : formData.selectedMenus.filter((menu) => menu._id !== menuId); // Remove the menu object if unchecked

    // Update selectedMenuIds based on whether the checkbox is checked or unchecked
    const updatedSelectedMenuIds = isChecked
      ? [...formData.selectedMenuIds, menuId] // Add the menuId if checked
      : formData.selectedMenuIds.filter((id) => id !== menuId); // Remove the menuId if unchecked

    // Update the state with the new selectedMenus and selectedMenuIds
    setFormData({
      ...formData,
      selectedMenus: updatedSelectedMenus,
      selectedMenuIds: updatedSelectedMenuIds,
    });
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.discountType ||
      !formData.discountValue ||
      formData.selectedMenus.length === 0
    ) {
      errorAdd("ກະລຸນາຕື່ມຂໍ້ມຼນໃຫ້ຄົບ");
      return;
    }

    const data = {
      name: formData.name,
      type: "DISCOUNT",
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      minPurchasePrice: formData.minPurchasePrice,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      menuId: formData.selectedMenuIds,
      storeId: storeDetail?._id,
      status: "ACTIVE",
    };

    await UpdateDisCountPromotion(promotionId, data)
      .then((res) => {
        navigate("/promotion");
      })
      .catch((err) => {
        if (err?.response?.data?.isExits) {
          // Validate menuId structure
          if (!Array.isArray(err?.response?.data?.data?.menuId)) {
            console.error("Invalid response data structure");
            return;
          }

          // Identify duplicate menus
          const duplicateMenus = formData.selectedMenus
            .map((mId) => {
              const foundMenu = err?.response?.data?.data?.menuId.find(
                (m) => m._id === mId
              );
              return foundMenu
                ? { name: foundMenu.name, id: foundMenu._id }
                : null;
            })
            .filter((menu) => menu !== null);

          // Handle case where no duplicates are found
          if (duplicateMenus.length === 0) {
            errorAdd("ບໍ່ພົບລາຍການທີ່ຊ້ຳກັນ");
            return;
          }

          // Extract names and IDs
          const duplicateMenuNames = duplicateMenus
            .map((menu) => menu.name)
            .join(", ");
          const duplicateMenuIds = duplicateMenus.map((menu) => menu.id);

          // Display warning message
          Swal.fire({
            title: "ເກີດຂໍ້ຜິດພາດ",
            text: `ລາຍການ ${duplicateMenuNames} ນີ້ຖຶກເພີ່ມໄປແລ້ວ, ກະລຸນາເພີ່ມລາຍການໃໝ່`,
            icon: "warning",
            showCancelButton: false,
            confirmButtonColor: COLOR_APP,
            cancelButtonColor: COLOR_APP_CANCEL,
            confirmButtonText: "ເພີ່ມໃໝ່",
            cancelButtonText: "ຍົກເລິກ",
          }).then((result) => {
            if (result.isConfirmed) {
              // duplicateMenuIds.forEach((id) => handleRemoveMenu(id));
              getOnePromotion();
            }
          });
        } else {
          errorAdd("ເພີ່ມບໍ່ສຳເລັດ");
        }
      });

    fetchData();
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleRemoveMenu = async (menuId) => {
    if (menuId) {
      const data = {
        menuId: menuId,
      };
      const response = await RemoveMenuFromDiscount(promotionId, data);

      if (response?.status === 200) {
        getOnePromotion();
        const updatedMenus = formData.selectedMenus.filter(
          (id) => id !== menuId?._id
        );
        setFormData({ ...formData, selectedMenus: updatedMenus });
        setSelectAllChecked(false); // Uncheck "Select All" if a menu is removed
      }
    }

    const updatedMenus = formData.selectedMenus.filter((id) => id !== menuId);
    setFormData({ ...formData, selectedMenus: updatedMenus });
    setSelectAllChecked(false); // Uncheck "Select All" if a menu is removed
  };

  // Select All Functionality
  const handleSelectAll = () => {
    const allMenuIds = menuData.map((menu) => menu._id);
    setFormData({ ...formData, selectedMenus: allMenuIds });
    setSelectAllChecked(true); // Check the "Select All" checkbox
  };

  // Deselect All Functionality
  const handleDeselectAll = () => {
    setFormData({ ...formData, selectedMenus: [] });
    setSelectAllChecked(false); // Uncheck the "Select All" checkbox
  };

  return (
    <div className="p-2 bg-gray-50 h-full w-full">
      {isLoading && <Loading />}
      <Card className="bg-white rounded-xl h-full">
        <form onSubmit={handleSubmit} className="p-4">
          <h2 className="text-lg font-bold">{t("discount_promotion")}</h2>
          <div className="flex gap-2">
            <Card className="bg-white w-[500px] rounded-xl h-[425px] overflow-hidden p-4">
              <div className="w-full">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="mt-2">
                    {t("promotion_name")}
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t("promotion_name")}
                    className="w-full h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="discountType" className="mt-2">
                    {t("choose_type_promotion")}
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-[220px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  >
                    <option value="" disabled>
                      {t("choose_type_promotion")}
                    </option>
                    <option value="PERCENTAGE">{t("percent")} (%)</option>
                    <option value="FIXED_AMOUNT">{t("fixed_amount")}</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="discountValue" className="mt-2">
                    {t("discount_amount")}
                  </label>
                  <input
                    type="number"
                    min={0}
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleChange}
                    className="w-[220px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="validFrom" className="mt-2">
                    {t("validFrom")}
                  </label>
                  <input
                    type="date"
                    name="validFrom"
                    value={moment(formData.validFrom).format("YYYY-MM-DD")}
                    onChange={handleChange}
                    className="w-[220px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="validUntil" className="mt-2">
                    {t("validUntil")}
                  </label>
                  <input
                    type="date"
                    name="validUntil"
                    value={moment(formData.validUntil).format("YYYY-MM-DD")}
                    onChange={handleChange}
                    className="w-[220px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-white flex-1 p-4  rounded-xl">
              <h3 className="font-semibold text-[18px] mb-2 text-center">
                {t("all_selected_menus_offer_discounts")}
              </h3>

              <div className="mb-4 flex justify-between items-center">
                {/* {formData?.selectedMenus?.length > 1 && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="bg-red-500 flex justify-center items-center h-[35px] text-white p-2 text-[14px] rounded-md hover:bg-red-600"
                    >
                      ຍົກເລິກທັງໝົດ
                    </button>
                  </div>
                )} */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={openModal}
                    className="bg-orange-600 flex justify-center items-center h-[35px] text-white p-2 text-[14px] rounded-md hover:bg-orange-700"
                  >
                    {t("choose_menu")}
                  </button>
                </div>
              </div>
              <div className="h-[250px] overflow-auto">
                <table className="w-full mt-4">
                  <thead>
                    <tr>
                      <th className="border-b p-2">{t("menuname")}</th>
                      <th className="border-b p-2">{t("name_type")}</th>
                      <th className="border-b p-2">{t("cost")}</th>
                      <th className="border-b p-2">{t("regular_price")}</th>
                      <th className="border-b p-2">{t("price_promotion")}</th>
                      <th className="border-b p-2">{t("delete")}</th>
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
                          <td className="border-b p-2">"--"</td>
                          <td className="border-b p-2">
                            {moneyCurrency(menu.price)}{" "}
                            {storeDetail?.firstCurrency}
                          </td>
                          <td className="border-b p-2">
                            {moneyCurrency(calculateDiscount(menu))}{" "}
                            {storeDetail?.firstCurrency}
                          </td>
                          <td className="border-b p-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveMenu(menu._id)}
                              className="bg-red-500 flex justify-center items-center text-white p-2 text-[14px] w-[50px] h-[30px] rounded-md hover:bg-red-600"
                            >
                              {t("delete")}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="flex justify-end pr-[80px]">
                <span className="text-[18px] text-orange-500 font-bold mt-2 text-end">
                  {t("all_promotional_prices")} :{" "}
                  {moneyCurrency(getTotalDiscountPrice())}{" "}
                  {storeDetail?.firstCurrency}
                </span>
              </div>
            </Card>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <button
              type="reset"
              onClick={() => navigate("/promotion")}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200 mt-4"
            >
              {t("back")}
            </button>
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition duration-200 mt-4"
            >
              {t("save")}
            </button>
          </div>
        </form>
      </Card>

      <Modal show={modalOpen} size="lg" onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{t("select_menu_for_discount")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex justify-center items-center">
            <div className="bg-white rounded-lg p-2 w-full">
              <div className="flex flex-row gap-2 items-center py-3">
                <select
                  className="w-[200px] border h-[40px] p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">{t("all")}</option>
                  {Categorys?.map((data) => (
                    <option key={`category${data?._id}`} value={data?._id}>
                      {data?.name}
                    </option>
                  ))}
                </select>
                <input
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-[350px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  type="text"
                  placeholder={t("search")}
                />
              </div>
              <div className="h-[450px] overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="border-b p-2">
                        <label className="flex gap-1 items-center mt-2">
                          <input
                            type="checkbox"
                            checked={selectAllChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleSelectAll();
                              } else {
                                handleDeselectAll();
                              }
                            }}
                          />
                          {t("select")}
                        </label>
                      </th>
                      <th className="border-b p-2">{t("username")}</th>
                      <th className="border-b p-2">{t("name_type")}</th>
                      <th className="border-b p-2">{t("price")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuData?.length > 0 ? (
                      menuData?.map((menu) => (
                        <tr key={menu._id}>
                          <td className="border-b p-2">
                            <input
                              type="checkbox"
                              value={menu._id}
                              checked={formData.selectedMenuIds.includes(
                                menu._id
                              )}
                              onChange={handleMenuSelect}
                            />
                          </td>
                          <td className="border-b p-2 text-ellipsis">
                            {menu.name}
                          </td>
                          <td className="border-b p-2">
                            {menu.categoryId?.name}
                          </td>
                          <td className="border-b p-2">
                            {moneyCurrency(menu.price)}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="border-b p-2" colSpan="3">
                          <div className="flex justify-center items-center">
                            <p className="text-lg text-gray-400">
                              {t("no_data")}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <button
            type="button"
            onClick={closeModal}
            className="bg-red-500 w-[150px] hover:bg-red-400 text-[14px] p-2 rounded-md text-white"
          >
            {t("cancel")}
          </button>
          <button
            type="submit"
            onClick={closeModal}
            className="bg-color-app w-[150px] hover:bg-orange-400 text-[14px] p-2 rounded-md text-white"
          >
            {t("save")}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditDiscountForm;
