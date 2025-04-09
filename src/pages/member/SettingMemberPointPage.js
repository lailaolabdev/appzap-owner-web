import React, { useEffect, useState } from "react";
import {
  // Card,
  Button,
  Form,
  Nav,
  Modal,
  Spinner,
} from "react-bootstrap";

import Swal from "sweetalert2";
import { COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { BsInfoCircle } from "react-icons/bs";
import { Plus, Edit, Trash2 } from "lucide-react";

import {
  MENUS,
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
} from "../../constants/api";
import { useNavigate } from "react-router-dom";
import DateTimeComponent from "../../components/DateTimeComponent";
import {
  addMemberPoint,
  getAllStorePoints,
  updatePointStore,
} from "../../services/member.service";
import { useStoreStore } from "../../zustand/storeStore";
import { useMenuStore } from "../../zustand/menuStore";
import { useTranslation } from "react-i18next";
import theme from "../../theme";
import { moneyCurrency } from "./../../helpers/index";
import { Card } from "./../../components/ui/Card";

import {
  creatExchangePointStore,
  getAllExchangePointStore,
  getExchangePointStore,
  DeleteExchangePointStore,
  updateExchangePointStore,
  updateStatusExchangePointStore,
} from "../../services/exchangePointStore";

export default function SettingMemberPointPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // state
  const [disabledButton, setDisabledButton] = useState(false);
  const [formData, setFormData] = useState({
    totalAmount: "",
    points: "",
    storeId: "",
  });
  const [loading, setLoading] = useState(true);
  const [loadingMenu, setLoadingMenu] = useState(false);
  const [error, setError] = useState(false);
  const [pointsData, setPointsData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [editMode, setEditMode] = useState(false);
  const [menuData, setMenuData] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterName, setFilterName] = useState("");
  const [Categorys, setCategorys] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [points, setPoints] = useState("");
  const [selectedMenuItem, setSelectedMenuItem] = useState("");
  const [redemptionItems, setRedemptionItems] = useState([]);
  const [formDataMenu, setFormDataMenu] = useState({
    exchangePoint: 0,
    status: "active",
    selectedMenus: [],
  });
  const handleShow = async () => {
    const { DATA } = await getLocalData();
    setFormData((prevData) => ({ ...prevData, storeId: DATA.storeId }));
    setShow(true);
  };

  // provider
  const { setStoreDetail, storeDetail } = useStoreStore();

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
    handleGetExchangePointStore();
  }, []);

  useEffect(() => {
    if (filterName || filterCategory) {
      const fetchFilter = async () => {
        try {
          const _localData = await getLocalData();

          setLoadingMenu(true);
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
          setLoadingMenu(false);
        } catch (err) {
          console.log(err);
          setLoadingMenu(false);
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
      setLoadingMenu(true);
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
      setLoadingMenu(false);
    } catch (err) {
      console.log(err);
      setLoadingMenu(false);
    }
  };

  const handleDeselectAll = () => {
    setFormDataMenu({ ...formDataMenu, selectedMenus: [] });
    setSelectAllChecked(false); // Uncheck the "Select All" checkbox
  };

  const handleSelectAll = () => {
    const allMenuIds = menuData.map((menu) => menu._id);
    setFormDataMenu({ ...formDataMenu, selectedMenus: allMenuIds });
    setSelectAllChecked(true); // Check the "Select All" checkbox
  };

  const handleMenuSelect = (e) => {
    // Ensure selectedMenus is always an array
    const selectedMenus = Array.isArray(formDataMenu.selectedMenus)
      ? formDataMenu.selectedMenus
      : [];

    const selected = e.target.checked
      ? [...selectedMenus, e.target.value] // Add the value to the array
      : selectedMenus.filter((id) => id !== e.target.value); // Remove the value from the array

    setFormDataMenu({
      ...formDataMenu,
      selectedMenus: selected,
    });
  };

  const handleSaveExchangePointStore = async () => {
    try {
      if (editingItem) {
        setLoadingMenu(true);
        const data = await updateExchangePointStore(
          formDataMenu,
          editingItem?._id
        );
        if (data.error) throw new Error("Cannot create point");
        setIsOpen(false);
        setFormDataMenu([]);
        handleGetExchangePointStore();
        fetchDataMenu();
      } else {
        setLoadingMenu(true);
        const data = await creatExchangePointStore(formDataMenu);
        if (data.error) throw new Error("Cannot create point");
        setIsOpen(false);
        setFormDataMenu([]);
        handleGetExchangePointStore();
        fetchDataMenu();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMenu(false);
    }
  };

  const handleGetExchangePointStore = async () => {
    await getAllExchangePointStore()
      .then((res) => {
        setRedemptionItems(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleEdit = async (item) => {
    setEditingItem(item);
    setIsOpen(true);
    await getExchangePointStore(item?._id)
      .then((res) => {
        console.log("getExchangePointStore", res);
        setFormDataMenu((prev) => ({
          ...prev,
          exchangePoint: res?.exchangePoint,
          selectedMenus: res?.menuId,
        }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      // title: t("are_you_sure"),
      text: t("are_you_sure"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: COLOR_APP,
      cancelButtonColor: COLOR_APP_CANCEL,
      confirmButtonText: t("confirm"),
      cancelButtonText: t("cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        await DeleteExchangePointStore(id)
          .then((res) => {
            if (res) {
              Swal.fire({
                title: t("deleted"),
                text: t("your_item_has_been_deleted"),
                icon: "success",
                timer: 2500,
                showConfirmButton: false,
              });
              handleGetExchangePointStore();
              fetchDataMenu();
            }
          })
          .catch((err) => {
            Swal.fire({
              title: t("error"),
              text: t("your_item_has_not_been_deleted"),
              icon: "error",
              timer: 2500,
              showConfirmButton: false,
            });
          });
      }
    });
  };

  const toggleItemEnabled = async (e, id) => {
    setLoading(true);
    const _type = e?.target?.checked;
    const isType = _type ? "active" : "inactive";

    const data = {
      status: isType,
    };

    await updateStatusExchangePointStore(data, id)
      .then((res) => {
        if (res) {
          setLoading(false);
          handleGetExchangePointStore();
          fetchDataMenu();
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log("err", err);
      });
  };

  const resetForm = () => {
    setIsOpen(false);
    setEditingItem(null);
    setPoints("");
    setSelectedMenuItem("");
    setFormDataMenu([]);
  };

  const createMemberPoint = async () => {
    try {
      setDisabledButton(true);
      const body = {
        money: formData.totalAmount,
        piont: formData.points,
        storeId: formData.storeId,
      };
      const _data = await addMemberPoint(body);
      if (_data.error) throw new Error("Cannot create point");
      handleClose();

      fetchPointsData();
    } catch (err) {
      console.error(err);
    } finally {
      setDisabledButton(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    const updatedPointsData = [...pointsData];
    updatedPointsData[0] = { ...updatedPointsData[0], [name]: value };
    setPointsData(updatedPointsData);
  };

  const fetchPointsData = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAllStorePoints();
      const { DATA } = await getLocalData();
      const filteredData = data.filter(
        (point) => point.storeId === DATA.storeId
      );
      setPointsData(filteredData);
      setStoreDetail({
        pointStore: filteredData[0].money,
      });
    } catch (error) {
      console.error("Failed to fetch points data: ", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const dataToSend = {
        piontStoreId: pointsData[0]._id,
        money: pointsData[0].money,
        point: pointsData[0].piont,
      };
      const response = await updatePointStore(dataToSend);
      if (response.error) throw new Error("Cannot update point");
      fetchPointsData();
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update points data: ", err);
    }
  };

  useEffect(() => {
    fetchPointsData();
    setStoreDetail({
      changeUi: "setting_point",
    });
  }, []);



  return (
    <>
      <div style={{ padding: 20 }}>
        <div className="font-bold bg-[#f2f2f0] h-[45px] border-none grid grid-cols-5 md:grid-cols-5 sm:grid-cols-3 xs:grid-cols-2 mb-[10px]">
          <Nav.Item>
            <Nav.Link
              eventKey="/listMember"
              style={{
                color: theme.primaryColor,
                backgroundColor:
                  storeDetail.changeUi === "setting_point"
                    ? theme.mutedColor
                    : "",
                border: "none",
                height: 45,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                setStoreDetail({
                  changeUi: "setting_point",
                });
              }}
            >
              {/* <FontAwesomeIcon icon={faList}></FontAwesomeIcon>{" "} */}
              <div style={{ width: 8 }} />
              <span>{t("point_setting")}</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/listRedeem/Point"
              style={{
                color: theme.primaryColor,
                backgroundColor:
                  storeDetail.changeUi === "setting_change_point"
                    ? theme.mutedColor
                    : "",
                border: "none",
                height: 45,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                setStoreDetail({
                  changeUi: "setting_change_point",
                });
              }}
            >
              {/* <FontAwesomeIcon icon={faBirthdayCake}></FontAwesomeIcon>{" "} */}
              <div style={{ width: 8 }} />{" "}
              <span>{t("setting_change_point")}</span>
            </Nav.Link>
          </Nav.Item>
        </div>
        {loading ? (
          <div className="pt-[15rem]">
            <center>
              <Spinner animation="border" variant="warning" />
            </center>
          </div>
        ) : (
          <>
            {storeDetail.changeUi === "setting_point" &&
              (pointsData.length > 0 ? (
                <Card className="w-[500px]">
                  <h3 className="p-3 rounded-t-lg bg-color-app text-white text-[16px] font-bold">
                    {t("point_setting_form")}
                  </h3>
                  <div className="p-4">
                    <div>
                      <div
                        className="mb-3"
                        style={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 20,
                          width: "100%",
                        }}
                      >
                        <div>
                          <Form.Label>{t("bill_total_price")}</Form.Label>
                          <Form.Control
                            name="money"
                            value={pointsData[0].money}
                            onChange={handleUpdateChange}
                            disabled={!editMode}
                          />
                        </div>
                        <div>
                          <Form.Label>{t("money_will_got")}</Form.Label>
                          <Form.Control
                            name="piont"
                            value={pointsData[0].piont}
                            onChange={handleUpdateChange}
                            disabled={!editMode}
                          />
                        </div>
                      </div>
                    </div>
                    {editMode ? (
                      <Button variant="primary" onClick={handleUpdate}>
                        {t("save")}
                      </Button>
                    ) : (
                      <Button
                        variant="secondary"
                        onClick={() => setEditMode(true)}
                      >
                        {t("update")}
                      </Button>
                    )}
                  </div>
                </Card>
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "80vh",
                  }}
                >
                  <Button
                    variant="primary"
                    onClick={handleShow}
                    disabled={disabledButton}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <BsInfoCircle />
                    {t("setting_point")}
                  </Button>
                </div>
              ))}

            {storeDetail.changeUi === "setting_change_point" && (
              <Card className="mx-auto py-1 p-4">
                <Card className="p-6 mb-2 flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">
                      {t("points_redemption_management")}
                    </h2>
                    <p className="text-gray-500">
                      {t("configure_menu_items_redeemed_points")}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="px-4 py-2 bg-orange-500 text-white rounded-md flex items-center hover:bg-orange-700"
                    onClick={() => {
                      resetForm();
                      setIsOpen(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {t("add_redemption_item")}
                  </button>
                </Card>
                <Card className="bg-white rounded-lg drop-shadow-lg overflow-hidden">
                  <div className="p-2 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200 overflow-auto">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-[17px] font-medium text-gray-500 uppercase ">
                            {t("points_required")}
                          </th>
                          <th className="px-6 py-3 text-left text-[17px] font-medium text-gray-500 uppercase ">
                            {t("menu_item")}
                          </th>

                          <th className="px-6 py-3 text-left text-[17px] font-medium text-gray-500 uppercase ">
                            {t("status")}
                          </th>
                          <th className="px-6 py-3 text-right text-[17px] font-medium text-gray-500 uppercase ">
                            {t("_manage")}
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 text-[16px]">
                        {redemptionItems?.length === 0 ? (
                          <tr>
                            <td
                              colSpan={4}
                              className="px-6 py-4 text-center text-gray-500"
                            >
                              No redemption items configured yet
                            </td>
                          </tr>
                        ) : (
                          redemptionItems.map((item) => (
                            <tr key={item.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {moneyCurrency(item.exchangePoint)} {t("point")}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap font-medium">
                                {item?.menuId?.map((item) => (
                                  <>
                                    <ul key={item}>
                                      <li>- {item?.name}</li>
                                    </ul>
                                  </>
                                ))}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  {/* <span className="mr-2 text-sm font-medium text-gray-700">
                                    {t("oppen")}
                                  </span> */}
                                  <label className="inline-flex relative items-center cursor-pointer">
                                    <input
                                      type="checkbox"
                                      className="sr-only"
                                      checked={item.status === "active"}
                                      onChange={(e) =>
                                        toggleItemEnabled(e, item._id)
                                      }
                                    />
                                    <div
                                      className={`w-10 h-5 rounded-full transition-colors ${
                                        item.status === "active"
                                          ? "bg-orange-500"
                                          : "bg-gray-200"
                                      }`}
                                    >
                                      <div
                                        className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform shadow-md ${
                                          item.status === "active"
                                            ? "transform translate-x-5"
                                            : ""
                                        }`}
                                      />
                                    </div>
                                  </label>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button
                                  type="button"
                                  className="text-orange-600 hover:text-orange-500 mr-3"
                                  onClick={() => handleEdit(item)}
                                >
                                  <Edit className="h-6 w-6" />
                                  <span className="sr-only">
                                    {t("edit_bill")}
                                  </span>
                                </button>
                                <button
                                  type="button"
                                  className="text-red-600 hover:text-red-900"
                                  onClick={() => handleDelete(item._id)}
                                >
                                  <Trash2 className="h-6 w-6" />
                                  <span className="sr-only">{t("delete")}</span>
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Modal Dialog */}
                {isOpen && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[600px] h-[600px]">
                      {loadingMenu ? (
                        <div className="pt-[20rem]">
                          <center>
                            <Spinner animation="border" variant="warning" />
                          </center>
                        </div>
                      ) : (
                        <div className="p-6">
                          <h3 className="text-lg font-bold text-color-app">
                            {editingItem
                              ? t("edit_redemption_item")
                              : t("add_redemption_item")}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {t(
                              "set_the_number_of_points_required_to_redeem_a_menu_item"
                            )}
                          </p>

                          <div className="mt-4 space-y-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <label
                                htmlFor="points"
                                className="col-span-1 text-md font-bold"
                              >
                                {t("point")}
                              </label>
                              <input
                                id="points"
                                type="number"
                                value={formDataMenu?.exchangePoint}
                                onChange={(e) =>
                                  setFormDataMenu((prev) => ({
                                    ...prev,
                                    exchangePoint: e.target.value,
                                  }))
                                }
                                className="col-span-3 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="2500"
                              />
                            </div>

                            <label
                              htmlFor="menu-item"
                              className="col-span-1 text-md font-bold"
                            >
                              {t("menu_item")}
                            </label>
                            <div className="flex justify-center items-center">
                              <div className="bg-white rounded-lg p-2 w-full">
                                <div className="flex flex-row gap-2 items-center py-3">
                                  <select
                                    className="w-[200px] border h-[40px] p-2 focus:outline-none focus-visible:outline-none rounded-md"
                                    value={filterCategory}
                                    onChange={(e) =>
                                      setFilterCategory(e.target.value)
                                    }
                                  >
                                    <option value="All">{t("all")}</option>
                                    {/* biome-ignore lint/complexity/useOptionalChain: <explanation> */}
                                    {Categorys &&
                                      Categorys?.map((data, index) => {
                                        return (
                                          <option
                                            key={`category${data?._id}`}
                                            value={data?._id}
                                          >
                                            {data?.name}
                                          </option>
                                        );
                                      })}
                                  </select>
                                  <input
                                    onChange={(e) =>
                                      setFilterName(e.target.value)
                                    }
                                    className="w-[350px] h-[40px] border flex-1 p-2 focus:outline-none focus-visible:outline-none rounded-md"
                                    type="text"
                                    placeholder={t("search")}
                                  />
                                </div>
                                <div className="h-[240px] overflow-auto">
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
                                        <th className="border-b p-2">
                                          {t("menuname")}
                                        </th>
                                        <th className="border-b p-2">
                                          {t("name_type")}
                                        </th>
                                        <th className="border-b p-2">
                                          {t("price")}
                                        </th>
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
                                                checked={
                                                  Array.isArray(
                                                    formDataMenu.selectedMenus
                                                  ) &&
                                                  formDataMenu.selectedMenus.includes(
                                                    menu._id
                                                  )
                                                } // Safe check
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
                                          <td
                                            className="border-b p-2"
                                            colSpan="3"
                                          >
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
                          </div>

                          <div className="mt-6 flex justify-center space-x-3">
                            <button
                              type="button"
                              onClick={resetForm}
                              className="px-4 py-2 border bg-red-500 w-[100px]  rounded-md text-sm font-medium text-white hover:bg-red-600"
                            >
                              {t("cancel")}
                            </button>
                            <button
                              type="button"
                              onClick={handleSaveExchangePointStore}
                              className="px-4 py-2 bg-orange-600 w-[100px] text-white rounded-md text-sm font-medium hover:bg-orange-700"
                            >
                              {editingItem
                                ? t("update_redemption_item")
                                : t("add")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            )}
          </>
        )}

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{t("point_setting_form")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div
                className="mb-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  width: "100%",
                }}
              >
                <Form.Group>
                  <Form.Label>{t("bill_total_price")}</Form.Label>
                  <Form.Control
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    type="number"
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>{t("point_will_got")}</Form.Label>
                  <Form.Control
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                    type="number"
                    required
                  />
                </Form.Group>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t("close")}
            </Button>
            <Button
              variant="primary"
              onClick={createMemberPoint}
              disabled={disabledButton}
            >
              {t("set_point")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* popup */}
    </>
  );
}
