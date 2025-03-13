import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import { useShiftStore } from "../../../zustand/ShiftStore";
import { useMenuStore } from "../../../zustand/menuStore";
import { errorAdd } from "../../../helpers/sweetalert";
import {
  CreateDiscountPromotion,
  AddPromotionToMenu,
} from "../../../services/promotion";
const DiscountForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    discountType: "",
    discountValue: 0,
    minPurchasePrice: 0,
    validFrom: "",
    validUntil: "",
    selectedMenus: [],
  });
  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const navigate = useNavigate();
  const [menuData, setMenuData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [filterName, setFilterName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [Categorys, setCategorys] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");

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

  const fetchDataMenu = async () => {
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

  const calculateDiscount = (menuPrice) => {
    const discountAmount =
      formData.discountType === "PERCENTAGE"
        ? (menuPrice * formData.discountValue) / 100
        : formData.discountValue;
    return menuPrice - discountAmount;
  };

  const handleMenuSelect = (e) => {
    const selected = e.target.checked
      ? [...formData.selectedMenus, e.target.value]
      : formData.selectedMenus.filter((id) => id !== e.target.value);

    setFormData({
      ...formData,
      selectedMenus: selected,
    });
  };

  const getTotalDiscountPrice = () => {
    let total = 0;

    // biome-ignore lint/complexity/noForEach: <explanation>
    formData.selectedMenus.forEach((menuId) => {
      const menu = menuData.find((menu) => menu._id === menuId);
      total += calculateDiscount(menu.price);
    });

    return total;
  };

  useEffect(() => {
    // Whenever selectedMenus changes, calculate the total price
    if (formData.selectedMenus.length > 0) {
      const totalPrice = getTotalDiscountPrice();
      console.log("Total after discount: ", totalPrice);
    }
  }, [formData.selectedMenus]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      menuId: formData.selectedMenus,
      storeId: storeDetail?._id,
      shiftId: shiftCurrent ? shiftCurrent[0]?._id : null,
      status: "ACTIVE",
    };
    await CreateDiscountPromotion(data)
      .then((res) => {
        navigate("/promotion");
      })
      .catch((err) => {
        console.log("errors", err?.response?.data?.isExits);
        if (err?.response?.data?.isExits) {
          errorAdd("ລາຍການນີ້ຖຶກເພີ່ມໄປແລ້ວ");
        } else {
          errorAdd("ເພີ່ມບໍ່ສຳເລັດ");
        }
      });
    fetchDataMenu();
  };
  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleRemoveMenu = (menuId) => {
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

  const handleSaveAllMenu = () => {
    closeModal();
  };

  return (
    <div className="p-2 bg-gray-50 h-full w-full">
      <Card className="bg-white rounded-xl h-full">
        <form onSubmit={handleSubmit} className="p-4">
          <h2 className="text-lg font-bold">ໂປຣໂມຊັນສ່ວນຫຼຸດ</h2>
          <div className="flex gap-2">
            <Card className="bg-white w-[500px] rounded-xl h-[425px] overflow-hidden p-4">
              <div className="flex gap-4">
                <div className="flex flex-col gap-2 w-full">
                  <label htmlFor="name" className="mt-2">
                    ຊື່ໂປຣໂມຊັນ
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="ຊື່ໂປຣໂມຊັນ"
                    className="w-full h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="discountType" className="mt-2">
                    ເລຶອກປະເພດສ່ວນຫຼຸດ
                  </label>
                  <select
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleChange}
                    className="w-[220px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  >
                    <option value="" disabled>
                      ເລຶອກປະເພດສ່ວນຫຼຸດ
                    </option>
                    <option value="PERCENTAGE">ເປີເຊັນ (%)</option>
                    <option value="FIXED_AMOUNT">ຈຳນວນເງິນ</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="discountValue" className="mt-2">
                    ຈຳນວນສ່ວນຫຼຸດ
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
                {/* <div className="flex flex-col gap-2">
                  <label htmlFor="minPurchasePrice" className="mt-2">
                    ລາຄາຊື້ຂັ້ນຕ່ຳ
                  </label>
                  <input
                    type="number"
                    name="minPurchasePrice"
                    value={formData.minPurchasePrice}
                    onChange={handleChange}
                    className="w-[220px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  />
                </div> */}
              </div>
              <div className="flex gap-4">
                <div className="flex flex-col gap-2">
                  <label htmlFor="validFrom" className="mt-2">
                    ມື້ເລີ່ມຕົ້ນ
                  </label>
                  <input
                    type="date"
                    name="validFrom"
                    value={formData.validFrom}
                    onChange={handleChange}
                    className="w-[220px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="validUntil" className="mt-2">
                    ມື້ສິນສຸດ
                  </label>
                  <input
                    type="date"
                    name="validUntil"
                    value={formData.validUntil}
                    onChange={handleChange}
                    className="w-[220px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                  />
                </div>
              </div>
            </Card>

            <Card className="bg-white flex-1 p-4 h-[425px] overflow-auto rounded-xl">
              <h3 className="font-semibold text-[18px]">ເມນູທີ່ເລຶອກທັງໝົດ</h3>
              <div className="mb-4 flex justify-between items-center">
                {formData.selectedMenus.length > 1 && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleDeselectAll}
                      className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    >
                      ຍົກເລິກທັງໝົດ
                    </button>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={openModal}
                    className="bg-orange-600 text-white p-2 rounded-md hover:bg-orange-700"
                  >
                    ເລຶອກເມນູ
                  </button>
                </div>
              </div>
              <table className="w-full mt-4">
                <thead>
                  <tr>
                    <th className="border-b p-2">ຊື່ເມນູ</th>
                    <th className="border-b p-2">ຊື່ປະເພດ</th>
                    <th className="border-b p-2">ຕົ້ນທຶນ</th>
                    <th className="border-b p-2">ລາຄາປົກກະຕິ</th>
                    <th className="border-b p-2">ລາຄາໂປຣໂມຊັນ</th>
                    <th className="border-b p-2">ລົບ</th>
                  </tr>
                </thead>
                <tbody>
                  {formData?.selectedMenus?.length > 0 ? (
                    formData?.selectedMenus?.map((menuId) => {
                      const menu = menuData.find((m) => m._id === menuId);
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
                            {moneyCurrency(calculateDiscount(menu.price))}{" "}
                            {storeDetail?.firstCurrency}
                          </td>
                          <td className="border-b p-2">
                            <button
                              type="button"
                              onClick={() => handleRemoveMenu(menu._id)}
                              className="bg-red-500 text-white p-2 w-[60px] rounded-md hover:bg-red-600"
                            >
                              ລົບ
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6}>
                        <p className="text-gray-500 text-center mt-40">
                          ຍັງບໍ່ມີເມນູ
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card>
          </div>
          <div className="flex gap-2 justify-center items-center">
            <button
              type="reset"
              onClick={() => navigate("/promotion")}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition duration-200 mt-4"
            >
              ຍ້ອນກັບ
            </button>
            <button
              type="submit"
              className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition duration-200 mt-4"
            >
              ບັນທຶກ
            </button>
          </div>
        </form>
      </Card>

      <Modal show={modalOpen} size="lg" onHide={() => setModalOpen(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("ເລຶອກເມນູທີ່ຕ້ອງການໃຫ້ສ່ວນຫຼຸດ")}</Modal.Title>
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
                  placeholder="ຄົ້ນຫາ....."
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
                          {t("ເລຶອກ")}
                        </label>
                      </th>
                      <th className="border-b p-2">ຊື່ເມນູ</th>
                      <th className="border-b p-2">ຊື່ປະເພດ</th>
                      <th className="border-b p-2">ລາຄາ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuData?.length > 0 ? (
                      menuData.map((menu) => (
                        <tr key={menu._id}>
                          <td className="border-b p-2">
                            <input
                              type="checkbox"
                              value={menu._id}
                              checked={formData.selectedMenus.includes(
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
                            {moneyCurrency(menu.price)}{" "}
                            {storeDetail?.firstCurrency}
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
            onClick={closeModal}
            type="button"
            className="bg-red-500 w-[150px] hover:bg-red-400 text-[14px] p-2 rounded-md text-white"
          >
            {t("cancel")}
          </button>
          <button
            onClick={handleSaveAllMenu}
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

export default DiscountForm;
