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
import { errorAdd } from "../../../helpers/sweetalert";
import { CreatePromotion } from "../../../services/promotion";

const BuyXGetYForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    buyQuantity: 1, // จำนวนที่ซื้อ
    getQuantity: 1, // จำนวนที่ได้ฟรี
    validFrom: "",
    validUntil: "",
    selectedMenus: [], // เมนูที่เลือกซื้อ
    freeItems: [], // เมนูที่ได้รับฟรี
  });

  const { t } = useTranslation();
  const { storeDetail } = useStoreStore();
  const navigate = useNavigate();
  const [menus, setMenus] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // เปิด Modal
  const [modalFreeItemOpen, setModalFreeItemOpen] = useState(false); // Modal สำหรับเลือกเมนูฟรี
  const [filterName, setFilterName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [Categorys, setCategorys] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");

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
              setMenus(json);
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
          setMenus(json);
        });
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
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

  const handleFreeItemSelect = (e) => {
    const selected = e.target.checked
      ? [...formData.freeItems, e.target.value]
      : formData.freeItems.filter((id) => id !== e.target.value);

    setFormData({
      ...formData,
      freeItems: selected,
    });
  };

  // const handleRemoveMenu = (menuId) => {
  //   console.log("Removing menuId:", menuId);

  //   // Remove the menuId from selectedMenus
  //   const updatedMenus = formData.selectedMenus.filter((id) => id !== menuId);

  //   // Remove the menuId from freeItems if it exists
  //   const updatedFreeItems = formData.freeItems.filter((id) => id !== menuId);

  //   console.log("Updated selectedMenus:", updatedMenus);
  //   console.log("Updated freeItems:", updatedFreeItems);

  //   // Update the state using the functional form of setFormData
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     selectedMenus: updatedMenus,
  //     freeItems: updatedFreeItems,
  //   }));

  //   // Uncheck "Select All" if a menu is removed
  //   setSelectAllChecked(false);
  // };

  const handleRemoveMenu = (menuId) => {
    console.log("Removing Menu ID:", menuId);

    // Update selectedMenus to filter out the removed menu
    const updatedMenus = formData.selectedMenus.filter(
      (menu) => menu._id !== menuId // Ensure you use _id to compare, or simply use menuId if it's a string/number
    );

    // Update freeItems to remove the free item that corresponds to the removed menu
    const updatedFreeItems = formData.freeItems.filter(
      (freeItem) => freeItem.menuId !== menuId // Make sure you have a proper comparison here for freeItems
    );

    console.log("Updated Menus:", updatedMenus);
    console.log("Updated Free Items:", updatedFreeItems);

    // Set the updated state
    setFormData({
      ...formData,
      selectedMenus: updatedMenus,
      freeItems: updatedFreeItems,
    });

    // Optionally uncheck "Select All" when a menu is removed
    setSelectAllChecked(false);
  };

  const handleRemoveFreeItem = (freeItemId) => {
    // Filter out the free item by its ID
    const updatedFreeItems = formData.freeItems.filter(
      (freeItem) => freeItem._id !== freeItemId
    );

    // Update state with the filtered free items
    setFormData({
      ...formData,
      freeItems: updatedFreeItems,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      formData.selectedMenus.length === 0 ||
      formData.freeItems.length === 0
    ) {
      errorAdd("ກະລຸນາຕື່ມຂໍ້ມຼນໃຫ້ຄົບ");
      return;
    }

    const data = {
      name: formData.name,
      type: "BUY_X_GET_Y", // ใช้ประเภทใหม่
      buyQuantity: formData.buyQuantity,
      getQuantity: formData.getQuantity,
      validFrom: formData.validFrom,
      validUntil: formData.validUntil,
      menuId: formData.selectedMenus,
      freeItems: formData.freeItems,
      storeId: storeDetail?._id,
      status: "ACTIVE",
    };

    const response = await CreatePromotion(data);
    if (response?.status === 200) {
      navigate("/promotion");
    } else {
      errorAdd("ສ່ວນຫຼຸດບໍ່ສໍາເລັດ");
    }
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const openModalFreeItem = () => {
    setModalFreeItemOpen(true);
  };

  const closeModalFreeItem = () => {
    setModalFreeItemOpen(false);
  };

  // const handleSaveAllMenu = () => {
  //   setFormData({
  //     ...formData,
  //     freeItems: formData.freeItems.concat(formData.selectedMenus),
  //   });
  //   setModalFreeItemOpen(false);
  //   setModalOpen(false);
  // };

  const handleSaveAllMenu = () => {
    // อัปเดตเมนูที่เลือกให้แสดงในตาราง
    const updatedMenus = formData.selectedMenus.map((menuId) => {
      const menu = menus.find((m) => m._id === menuId);
      return menu;
    });

    const updatedFreeItems = formData.freeItems.map((menuId) => {
      const menu = menus.find((m) => m._id === menuId);
      return menu;
    });

    // อัปเดต state เมนูที่เลือกและเมนูฟรี
    setFormData({
      ...formData,
      selectedMenus: updatedMenus, // เก็บข้อมูลเมนูหลัก
      freeItems: updatedFreeItems, // เก็บข้อมูลเมนูแถม
    });

    closeModal(); // ปิด Modal หลังจากเลือกเมนู
    closeModalFreeItem(); // ปิด Modal สำหรับเมนูแถม
  };

  return (
    <div className="p-2 bg-gray-50 h-full w-full">
      <div className="flex gap-2">
        <Card className="bg-white rounded-xl h-full w-full">
          <form onSubmit={handleSubmit} className="p-4">
            <h2 className="text-lg font-bold">ໂປຣໂມຊັນຊື້ 1 ແຖມ 1</h2>
            <div className="flex gap-2">
              <Card className="bg-white w-[500px] rounded-xl h-[425px] overflow-hidden p-4">
                <div className="w-full gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="name" className="mt-2">
                      ຊື່ໂປຣໂມຊັນ
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="ຊື່ໂປຣໂມຊັນ"
                      className="w-full h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="buyQuantity" className="mt-2">
                      ຈຳນວນທີ່ຊື້
                    </label>
                    <input
                      type="text"
                      name="buyQuantity"
                      value={formData.buyQuantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          buyQuantity: e.target.value,
                        })
                      }
                      placeholder="ຈຳນວນທີ່ຊື້"
                      className="w-[220px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label htmlFor="getQuantity" className="mt-2">
                      ຈຳນວນທີ່ຈະແຖມ
                    </label>
                    <input
                      type="text"
                      name="getQuantity"
                      value={formData.getQuantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          getQuantity: e.target.value,
                        })
                      }
                      placeholder="ຈຳນວນທີ່ຈະແຖມ"
                      className="w-[220px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                    />
                  </div>
                </div>
              </Card>
              <Card className="bg-white flex-1 p-4 h-[425px] overflow-auto rounded-xl">
                <h3 className="font-semibold text-[18px]">
                  ເມນູທີ່ເລຶອກທັງໝົດ
                </h3>
                <div className="mb-4 flex justify-between items-center">
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
                {formData.selectedMenus.length > 0 &&
                  formData.selectedMenus.map((data) => (
                    <div key={data._id}>
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-[18px]">
                          {data.name}
                        </h3>
                        <div className="flex gap-2  justify-end">
                          <button
                            type="button"
                            onClick={() => openModalFreeItem()}
                            className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600"
                          >
                            ເພີ່ມລາຍການແຖມ
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveMenu(data?._id)}
                            className="bg-red-500 text-white p-2 w-[60px] rounded-md hover:bg-red-600"
                          >
                            ລົບ
                          </button>
                        </div>
                      </div>

                      <table className="w-full mt-4">
                        <thead>
                          <tr>
                            <th className="border-b p-2">ຊື່ເມນູ</th>
                            <th className="border-b p-2">ຊື່ປະເພດ</th>
                            <th className="border-b p-2">ລາຄາ</th>
                            <th className="border-b p-2">ລຶບ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {formData.freeItems.length > 0 ? (
                            formData.freeItems.map((menu, index) => (
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
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveFreeItem(
                                        formData.freeItems[index]._id
                                      )
                                    } // Calling remove for free item
                                    className="bg-red-500 text-white p-2 w-[60px] rounded-md hover:bg-red-600"
                                  >
                                    ລົບ
                                  </button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="border-b p-2" colSpan="5">
                                <p className="text-center text-gray-400">
                                  ບໍ່ມີຂໍ້ມູນ
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ))}
              </Card>
            </div>
          </form>
        </Card>
      </div>

      {/* Modal สำหรับเลือกเมนูหลัก */}
      <Modal show={modalOpen} size="lg" onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>ເລຶອກເມນູຫຼັກ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex justify-center items-center">
            <div className="bg-white rounded-lg p-2 w-full">
              <div className="h-[450px] overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="border-b p-2">ເລຶອກ</th>
                      <th className="border-b p-2">ຊື່ເມນູ</th>
                      <th className="border-b p-2">ຊື່ປະເພດ</th>
                      <th className="border-b p-2">ລາຄາ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus?.length > 0 ? (
                      menus.map((menu) => (
                        <tr key={menu._id}>
                          <td className="border-b p-2">
                            <input
                              type="checkbox"
                              value={menu._id}
                              onChange={handleMenuSelect}
                            />
                          </td>
                          <td className="border-b p-2 text-ellipsis">
                            {menu.name}
                          </td>
                          <td className="border-b p-2 text-ellipsis">
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
                            <p className="text-lg text-gray-400">ບໍ່ມີຂໍ້ມູນ</p>
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
            onClick={openModalFreeItem}
            type="button"
            className="bg-color-app w-[150px] hover:bg-orange-400 text-[14px] p-2 rounded-md text-white"
          >
            {t("ເລຶອກເມນູແຖມ")}
          </button>
        </Modal.Footer>
      </Modal>

      {/* Free Item Modal */}
      <Modal show={modalFreeItemOpen} size="lg" onHide={closeModalFreeItem}>
        <Modal.Header closeButton>
          <Modal.Title>ເລຶອກເມນູທີ່ຈະຮັບຟຣີ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="flex justify-center items-center">
            <div className="bg-white rounded-lg p-2 w-full">
              <div className="h-[450px] overflow-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="border-b p-2">ເລຶອກ</th>
                      <th className="border-b p-2">ຊື່ເມນູ</th>
                      <th className="border-b p-2">ຊື່ປະເພດ</th>
                      <th className="border-b p-2">ລາຄາ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menus?.length > 0 ? (
                      menus.map((menu) => (
                        <tr key={menu._id}>
                          <td className="border-b p-2">
                            <input
                              type="checkbox"
                              value={menu._id}
                              onChange={handleFreeItemSelect}
                            />
                          </td>
                          <td className="border-b p-2 text-ellipsis">
                            {menu.name}
                          </td>
                          <td className="border-b p-2 text-ellipsis">
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
                            <p className="text-lg text-gray-400">ບໍ່ມີຂໍ້ມູນ</p>
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
            onClick={closeModalFreeItem}
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

export default BuyXGetYForm;
