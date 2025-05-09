import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { LuCalendarDays } from "react-icons/lu";
import {
  MENUS,
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
} from "../../../constants/api";
import { useStoreStore } from "../../../zustand/storeStore";
import { useShiftStore } from "../../../zustand/ShiftStore";
import { useMenuStore } from "../../../zustand/menuStore";
import { errorAdd } from "../../../helpers/sweetalert";
import {
  CreateFreePromotion,
  UpdateFreePromotion,
} from "../../../services/promotion";
import { moneyCurrency } from "../../../helpers";
import { FaRegTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { COLOR_APP, COLOR_APP_CANCEL, COLOR_GRAY } from "../../../constants";

const BuyXGetYForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    buyQuantity: 1,
    getQuantity: 1,
    validFrom: new Date(),
    validUntil: "",
    selectedMenus: [],
  });

  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const navigate = useNavigate();
  const [MenuData, SetMenuData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalFreeItemOpen, setModalFreeItemOpen] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);
  const [Categorys, setCategorys] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterName, setFilterName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showListMenu, setShowListMenu] = useState(false);

  const { shiftCurrent } = useShiftStore();
  const {
    menus,
    menuCategories,
    getMenus,
    getMenuCategories,
    setMenus,
    setMenuCategories,
    isMenuLoading,
  } = useMenuStore();

  const fetchData = async () => {
    if (storeDetail?._id) {
      const storeId = storeDetail?._id;

      const fetchedMenus = await getMenus(storeId);
      setMenus(fetchedMenus); // Save to zustand store

      const fetchedCategories = await getMenuCategories(storeId);
      setMenuCategories(fetchedCategories); // Save to zustand store
    }
  };

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
              SetMenuData(json);
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

  useEffect(() => {
    if (formData?.selectedMenus?.length === 0) {
      setShowListMenu(false);
    }
  }, [formData?.selectedMenus]);

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
          SetMenuData(json);
        });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMenuSelect = (e) => {
    const menuId = e.target.value;
    const isChecked = e.target.checked;

    setFormData((prevState) => ({
      ...prevState,
      selectedMenus: isChecked
        ? [...prevState.selectedMenus, { _id: menuId, freeItems: [] }]
        : prevState.selectedMenus.filter((menu) => menu._id !== menuId),
    }));
  };

  const handleShowListMainMenu = () => {
    setModalOpen(false);
    setShowListMenu(true);
  };

  const openModalFreeItem = (menuId) => {
    setSelectedMenuId(menuId);
    setModalFreeItemOpen(true);
  };

  const closeModalFreeItem = () => {
    setModalFreeItemOpen(false);
  };

  const handleFreeItemSelect = (e, menuId) => {
    const freeItemId = e.target.value;
    const isChecked = e.target.checked;

    setFormData((prevState) => ({
      ...prevState,
      selectedMenus: prevState.selectedMenus.map((menu) => {
        if (menu._id === menuId) {
          // if (isChecked && menu.freeItems.length >= prevState.getQuantity) {
          //   errorAdd(
          //     `ທ່ານສາມາດເລືອກເມນູແຖມໄດ້ສູງສຸດ ${prevState.getQuantity} ລາຍການ`
          //   );
          //   return menu;
          // }

          return {
            ...menu,
            freeItems: isChecked
              ? [...menu.freeItems, freeItemId]
              : menu.freeItems.filter((id) => id !== freeItemId),
          };
        }
        return menu;
      }),
    }));
  };

  const handleRemoveMenu = (menuId) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedMenus: prevState.selectedMenus.filter(
        (menu) => menu._id !== menuId
      ),
    }));
  };

  const handleRemoveFreeItem = (menuId, freeItemId) => {
    setFormData((prevState) => ({
      ...prevState,
      selectedMenus: prevState.selectedMenus.map((menu) =>
        menu._id === menuId
          ? {
              ...menu,
              freeItems: menu.freeItems.filter((id) => id !== freeItemId),
            }
          : menu
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || formData.selectedMenus.length === 0) {
      errorAdd("ກະລຸນາປ້ອນຂໍ້ມູນໃຫ້ຄົບ");
      return;
    }

    const formattedFreeItems = formData.selectedMenus.flatMap((menu) =>
      menu.freeItems.map((freeItem) => ({
        _id: freeItem,
        mainMenuId: menu._id,
      }))
    );

    const data = {
      name: formData.name,
      type: "BUY_X_GET_Y",
      buyQuantity: formData.buyQuantity,
      getQuantity: formData.getQuantity,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      menuId: formData.selectedMenus.map((menu) => menu._id),
      freeItems: formattedFreeItems,
      storeId: storeDetail?._id,
      shiftId: shiftCurrent ? shiftCurrent[0]?._id : null,
      status: "ACTIVE",
    };

    await CreateFreePromotion(data)
      .then((res) => {
        navigate("/promotion");
      })
      .catch((err) => {
        if (err?.response?.data?.isExits) {
          const duplicateMenus = formData.selectedMenus
            .map((menu) => {
              const foundMenu = err?.response?.data?.data?.menuId.find(
                (m) => m._id === menu._id
              );
              return foundMenu
                ? { name: foundMenu.name, id: foundMenu._id }
                : null;
            })
            .filter((menu) => menu !== null);

          const duplicateMenuNames = duplicateMenus
            .map((menu) => menu.name)
            .join(", ");
          const duplicateMenuIds = duplicateMenus.map((menu) => menu.id);

          Swal.fire({
            title: t("error"),
            text: `${t("list")} "${duplicateMenuNames} (${
              err?.response?.data?.data?.name
            })" ${t("exits_promotion")}`,
            icon: "warning",
            showDenyButton: true,
            confirmButtonColor: COLOR_APP,
            denyButtonColor: COLOR_GRAY,
            confirmButtonText: t("use_old"),
            denyButtonText: t("replace"),
          }).then(async (result) => {
            if (result.isConfirmed) {
              duplicateMenuIds.forEach((id) => handleRemoveMenu(id));
            } else if (result.isDenied) {
              await UpdateFreePromotion(err?.response?.data?.data?._id, data);
              // errorAdd("replace");
              navigate("/promotion");
              fetchData();
            }
          });
        } else {
          errorAdd("ເພີ່ມບໍ່ສຳເລັດ");
        }
      });
    fetchData();
  };

  const handleSelectAllFreeItems = (e, menuId) => {
    const isChecked = e.target.checked;

    setFormData((prevState) => ({
      ...prevState,
      selectedMenus: prevState.selectedMenus.map((menu) => {
        if (menu._id === menuId) {
          return {
            ...menu,
            freeItems: isChecked
              ? MenuData.map((m) => m._id).slice(0, prevState.getQuantity)
              : [],
          };
        }
        return menu;
      }),
    }));
  };
  const handleSelectAllMainItems = (e) => {
    const isChecked = e.target.checked;

    setFormData((prevState) => ({
      ...prevState,
      selectedMenus: isChecked
        ? MenuData.map((menu) => ({ _id: menu._id, freeItems: [] })) // Select all
        : [], // Deselect all
    }));
  };

  const CustomInput = ({ value, onClick }) => (
    <div className="relative flex items-center">
      <input
        type="text"
        value={value}
        onClick={onClick}
        readOnly
        placeholder="ເລືອກວັນທີ"
        className="w-[220px] h-[45px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
      />
      <LuCalendarDays
        className="absolute right-3 text-gray-500 cursor-pointer"
        size={20}
        onClick={onClick} // Trigger date picker when clicking the icon
      />
    </div>
  );

  return (
    <div className="p-2 bg-gray-50 h-full w-full">
      <Card className="bg-white rounded-xl p-4">
        <h2 className="text-lg font-bold">{t("buy_x_get_y")}</h2>

        <form onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <Card className="p-4">
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
                  <label htmlFor="buyQuantity" className="mt-2">
                    {t("buyQuantity")}
                  </label>
                  <input
                    type="number"
                    min={0}
                    name="buyQuantity"
                    value={formData.buyQuantity}
                    onChange={handleChange}
                    className="w-[220px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="getQuantity" className="mt-2">
                    {t("getQuantity")}
                  </label>
                  <input
                    type="number"
                    min={0}
                    name="getQuantity"
                    value={formData.getQuantity}
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

                  <div className=" w-[220px]">
                    {/* Date Picker */}
                    <DatePicker
                      selected={formData.validFrom}
                      onChange={(date) =>
                        setFormData({ ...formData, validFrom: date })
                      }
                      customInput={<CustomInput />} // Use the custom input component
                      placeholderText={t("choose_date")}
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="validUntil" className="mt-2">
                    ມື້ສິນສຸດ
                  </label>

                  <DatePicker
                    selected={formData.validUntil}
                    onChange={(date) =>
                      setFormData({ ...formData, validUntil: date })
                    }
                    customInput={<CustomInput />} // Use the custom input component
                    placeholderText={t("choose_date")}
                    dateFormat="dd/MM/yyyy"
                  />
                </div>
              </div>
            </Card>
            <Card className="p-2 flex-1 h-[400px] overflow-y-auto">
              {formData.selectedMenus.length > 0 && (
                <button
                  type="button"
                  className="bg-orange-600 text-[14px] text-white p-2 rounded-lg hover:bg-orange-700 transition duration-200"
                  onClick={() => setModalOpen(true)}
                >
                  {t("choose_menu_main")}
                </button>
              )}
              {formData.selectedMenus.length > 0 && showListMenu ? (
                formData.selectedMenus.map((menu) => (
                  <Card key={menu._id} className="p-2 border mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-[16px] font-bold text-gray-800">
                        {MenuData.find((m) => m._id === menu._id)?.name}
                      </h3>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          className="bg-orange-600 text-[12px] text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition duration-200"
                          onClick={() => openModalFreeItem(menu._id)}
                        >
                          {t("choose_menu_free")}
                        </button>
                        <button
                          className="bg-red-600 text-[12px] text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
                          type="button"
                          onClick={() => handleRemoveMenu(menu._id)}
                        >
                          {t("delete")}
                        </button>
                      </div>
                    </div>
                    {menu.freeItems.length > 0 && (
                      <ul>
                        {menu.freeItems.map((freeItemId) => (
                          <li
                            key={freeItemId}
                            className="flex gap-2 items-center"
                          >
                            <span className="text-[14px] text-gray-800">
                              {MenuData.find((m) => m._id === freeItemId)?.name}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveFreeItem(menu._id, freeItemId)
                              }
                            >
                              <FaRegTrashAlt className="  mt-2 text-[25px] text-red-500 p-1 rounded-lg hover:text-red-700  transition duration-200" />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                ))
              ) : (
                <div className="flex flex-col items-center mt-44">
                  <button
                    type="button"
                    className="bg-orange-600 text-[14px] text-white p-2 rounded-lg hover:bg-orange-700 transition duration-200"
                    onClick={() => setModalOpen(true)}
                  >
                    {t("choose_menu_main")}
                  </button>
                </div>
              )}
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

      <Modal show={modalOpen} onHide={() => setModalOpen(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("choose_menu_main")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-row gap-2 items-center py-3">
            <select
              className="w-[200px] border h-[40px] p-2 focus:outline-none focus-visible:outline-none rounded-md"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">{t("all")}</option>
              {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
              {Categorys &&
                Categorys?.map((data, index) => {
                  return (
                    <option key={`category${data?._id}`} value={data?._id}>
                      {data?.name}
                    </option>
                  );
                })}
            </select>
            <input
              onChange={(e) => setFilterName(e.target.value)}
              className="w-[350px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
              type="text"
              placeholder={t("search")}
            />
          </div>
          <div className="h-[400px] overflow-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border-b p-2 flex gap-2">
                    <input
                      type="checkbox"
                      id="selectAllMainItems"
                      checked={
                        formData.selectedMenus.length === MenuData.length
                      }
                      onChange={handleSelectAllMainItems}
                    />
                    <label htmlFor="selectAllMainItems" className="mt-2">
                      {t("select")}
                    </label>
                  </th>
                  <th className="border-b p-2">{t("menuname")}</th>
                  <th className="border-b p-2">{t("name_type")}</th>
                  <th className="border-b p-2">{t("price")}</th>
                </tr>
              </thead>
              <tbody>
                {MenuData?.length > 0 ? (
                  MenuData.map((menu) => (
                    <tr key={menu._id}>
                      <td className="border-b p-2">
                        <input
                          type="checkbox"
                          value={menu._id}
                          onChange={handleMenuSelect}
                          checked={formData.selectedMenus.some(
                            (m) => m._id === menu._id
                          )}
                        />
                      </td>
                      <td className="border-b p-2 text-ellipsis">
                        {menu.name}
                      </td>
                      <td className="border-b p-2">{menu.categoryId?.name}</td>
                      <td className="border-b p-2">
                        {moneyCurrency(menu.price)} {storeDetail?.firstCurrency}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border-b p-2" colSpan="6">
                      <div className="flex justify-center items-center">
                        <p className="text-lg text-gray-400">{t("no_menu")}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <button
            onClick={() => setModalOpen(false)}
            type="button"
            className="bg-red-500 w-[150px] hover:bg-red-400 text-[14px] p-2 rounded-md text-white"
          >
            {t("cancel")}
          </button>
          <button
            onClick={() => handleShowListMainMenu()}
            type="button"
            disabled={formData.selectedMenus?.length === 0}
            className={`${
              formData.selectedMenus?.length === 0
                ? " w-[150px] bg-orange-400 text-[14px] p-2 rounded-md text-white"
                : "bg-color-app w-[150px] hover:bg-orange-400 text-[14px] p-2 rounded-md text-white"
            }`}
          >
            {t("save")}
          </button>
        </Modal.Footer>
      </Modal>

      <Modal show={modalFreeItemOpen} onHide={closeModalFreeItem} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{t("choose_menu_free")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex flex-row gap-2 items-center py-3">
            <select
              className="w-[200px] border h-[40px] p-2 focus:outline-none focus-visible:outline-none rounded-md"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="All">{t("all")}</option>
              {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
              {Categorys &&
                Categorys?.map((data, index) => {
                  return (
                    <option key={`category${data?._id}`} value={data?._id}>
                      {data?.name}
                    </option>
                  );
                })}
            </select>
            <input
              onChange={(e) => setFilterName(e.target.value)}
              className="w-[350px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
              type="text"
              placeholder={t("search")}
            />
          </div>
          <div className="h-[400px] overflow-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border-b p-2 flex gap-2">
                    <input
                      type="checkbox"
                      id="selectAllFreeItems"
                      checked={
                        formData.selectedMenus.find(
                          (m) => m._id === selectedMenuId
                        )?.freeItems.length === formData.getQuantity
                      }
                      onChange={(e) =>
                        handleSelectAllFreeItems(e, selectedMenuId)
                      }
                    />
                    <label htmlFor="selectAllFreeItems" className="mt-2">
                      {t("select")}
                    </label>
                  </th>
                  <th className="border-b p-2">{t("menuname")}</th>
                  <th className="border-b p-2">{t("name_type")}</th>
                  <th className="border-b p-2">{t("price")}</th>
                </tr>
              </thead>
              <tbody>
                {MenuData?.length > 0 ? (
                  MenuData.map((menu) => (
                    <tr key={menu._id}>
                      <td className="border-b p-2">
                        <input
                          type="checkbox"
                          value={menu._id}
                          checked={formData.selectedMenus
                            .find((m) => m._id === selectedMenuId)
                            ?.freeItems.includes(menu._id)}
                          onChange={(e) =>
                            handleFreeItemSelect(e, selectedMenuId)
                          }
                        />
                      </td>
                      <td className="border-b p-2 text-ellipsis">
                        {menu.name}
                      </td>
                      <td className="border-b p-2">{menu.categoryId?.name}</td>
                      <td className="border-b p-2">
                        {moneyCurrency(menu.price)} {storeDetail?.firstCurrency}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="border-b p-2" colSpan="6">
                      <div className="flex justify-center items-center">
                        <p className="text-lg text-gray-400">{t("no_menu")}</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-center">
          <button
            onClick={closeModalFreeItem}
            type="button"
            className="bg-red-500 w-[150px] hover:bg-red-400 text-[14px] p-2 rounded-md text-white"
          >
            {t("cancel")}
          </button>
          <button
            onClick={closeModalFreeItem}
            type="button"
            className="bg-color-app w-[150px] hover:bg-orange-400 text-[14px] p-2 rounded-md text-white"
          >
            {t("save")}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BuyXGetYForm;
