import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCubes, faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Modal,
  Form,
  Nav,
  Image,
  Row,
  Col,
  Spinner,
  Breadcrumb,
} from "react-bootstrap";
import { BODY, COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import {
  MENUS,
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
  master_menu_api_dev,
} from "../../constants/api";
import { moneyCurrency } from "../../helpers";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import profileImage from "../../image/profile.png";
import { getHeaders } from "../../services/auth";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import Upload from "../../components/Upload";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Box from "../../components/Box";
import PopUpIsOpenMenu from "./components/popup/PopUpIsOpenMenu";
import PopUpAddMenuOption from "./components/popup/PopUpAddMenuOption";
import PopUpCaution from "../../components/popup/PopUpCaution";
import PopUpAddMenus from "../../components/popup/PopUpAddMenus";
import { fontMap } from "../../utils/font-map";
import { cn } from "../../utils/cn";
import { useMenuStore } from "../../zustand/menuStore";
import { useStoreStore } from "../../zustand/storeStore";
import { createMenu } from "../../services/menu";

export default function MenuList() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();

  const [showSetting, setShowSetting] = useState(false);
  const [showOptionSetting, setShowOptionSetting] = useState(false);

  const [isOpened, setIsOpened] = useState(true);
  const [show, setShow] = useState(false);
  const [showAddMenus, setShowAddMenus] = useState(false);
  const [showCaution, setShowCaution] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [getIdMenu, setGetIdMenu] = useState();
  const [qtyMenu, setQtyMenu] = useState(0);
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const handleShowAddMenus = () => setShowAddMenus(true);
  const handleCloseAddMenus = () => setShowAddMenus(false);
  const handleShowCaution = () => setShowCaution(true);
  const handleCloseCaution = () => setShowCaution(false);
  const handleShow4 = (id) => {
    setGetIdMenu(id);
    setShow4(true);
  };

  const [getTokken, setgetTokken] = useState();
  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  const [menuType, setMenuType] = useState("MENU");
  const [connectMenues, setConnectMenues] = useState([]);
  const [connectMenuId, setConnectMenuId] = useState("");
  const [dataMenuOption, setDataMenuOption] = useState([]);
  const [dataUpdateMenuOption, setDataUpdateMenuOption] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(false);
  const [formattedPrice, setFormattedPrice] = useState("");

  //update show menu
  const [detailMenu, setDetailMenu] = useState();
  const [detailMenuOption, setDetailMenuOption] = useState();
  const [menuOptionsCount, setMenuOptionsCount] = useState({});

  const [allMenuOptions, setAllMenuOptions] = useState([]);
  const [menuSpecificOptions, setMenuSpecificOptions] = useState([]);

  // =====> getCategory
  const [Categorys, setCategorys] = useState();
  const [Menus, setMenus] = useState([]);
  const { updateMenuItem, createMenuItem, deleteMenuItem } = useMenuStore();
  const { storeDetail } = useStoreStore();

  const location = useLocation();
  const pathParts = location.pathname.split("/");
  const defaultActiveKey = `/settingStore/${pathParts[2]}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _localData = await getLocalData();
        if (_localData) {
          setgetTokken(_localData);
          getcategory(_localData?.DATA?.storeId);
          getMenu(_localData?.DATA?.storeId);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    getCategory();
  }, []);

  useEffect(() => {
    if (filterName || filterCategory) {
      const fetchFilter = async () => {
        try {
          const _localData = await getLocalData();

          setIsLoading(true);
          // getMenu(_localData?.DATA?.storeId, filterCategory)

          await fetch(
            MENUS +
              `/?storeId=${_localData?.DATA?.storeId}${
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
      await fetch(
        END_POINT_SEVER_TABLE_MENU +
          `/v3/categories?storeId=${id}&isDeleted=false`,
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

  const handleUpdateMenuOptionsCount = (menuId, count) => {
    setMenuOptionsCount((prev) => ({ ...prev, [menuId]: count }));
  };

  const getMenu = async (id, categoryId) => {
    try {
      setIsLoading(true);
      await fetch(
        MENUS +
          `/?storeId=${id}${
            filterName && filterName !== "" ? `&name=${filterName}` : ""
          }${
            categoryId && categoryId !== "All"
              ? `&categoryId=${categoryId}`
              : ""
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

  const _addMenuOption = () => {
    setDataMenuOption([
      ...dataMenuOption,
      {
        name: "",
        name_en: "",
        name_cn: "",
        name_kr: "",
        price: 0,
      },
    ]);
  };
  const _addUpdateMenuOption = () => {
    setDataUpdateMenuOption([
      ...dataUpdateMenuOption,
      {
        name: "",
        name_en: "",
        name_cn: "",
        name_kr: "",
        price: 0,
      },
    ]);
  };

  const _removeItem = (index) => {
    const remove = dataMenuOption.splice(index, 1);
    const _newData = dataMenuOption?.filter((item) => item !== remove[0]);
    setDataMenuOption(_newData);
  };
  const _removeItemUpdate = (index) => {
    const remove = dataUpdateMenuOption.splice(index, 1);
    const _newData = dataUpdateMenuOption?.filter((item) => item !== remove[0]);
    setDataUpdateMenuOption(_newData);
  };

  const _handleChangeMenuOption = (index, field, value) => {
    const updateMenuOption = [...dataMenuOption];
    updateMenuOption[index][field] = value;
    setDataMenuOption(updateMenuOption);
  };
  const _handleChangeUpdateMenuOption = (index, field, value) => {
    const updateMenuOption = [...dataUpdateMenuOption];
    updateMenuOption[index][field] = value;
    setDataUpdateMenuOption(updateMenuOption);
  };

  const [menuOptions, setMenuOptions] = useState([]);
  // lung jak upload leo pic ja ma so u nee

  //TODO: ======> create menu
  const _createMenu = async (values) => {
    const header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    try {
      let createData = {
        recommended: values?.recommended,
        isWeightMenu: values?.isWeightMenu,
        name: values?.name,
        name_en: values?.name_en,
        name_cn: values?.name_cn,
        name_kr: values?.name_kr,
        quantity: values?.quantity,
        categoryId: values?.categoryId,
        menuOptionId: menuOptions,
        price: values?.price,
        detail: values?.detail,
        unit: values?.unit,
        isOpened: isOpened,
        images: [...values?.images],
        storeId: getTokken?.DATA?.storeId,
        type: menuType,
        sort: values?.sort,
        menuOption: dataMenuOption,
      };

      if (connectMenuId && connectMenuId !== "" && menuType === "MENUOPTION")
        createData = { ...createData, menuId: connectMenuId };
      const resData = await axios({
        method: "POST",
        url: END_POINT_SEVER_TABLE_MENU + "/v3/menu/create",
        data: createData,
        headers: headers,
      });
      const _localData = await getLocalData();
      if (resData?.data) {
        setMenus(resData?.data);
        handleClose();
        // handleShow();
        setgetTokken(_localData);
        getMenu(_localData?.DATA?.storeId);
        setMenuType("MENU");
        setConnectMenuId("");
        successAdd(`${t("add_success")}`);
        values.name = "";
        values.name_en = "";
        values.name_cn = "";
        values.name_kr = "";
        values.quantity = "";
        values.categoryId = "";
        values.price = "";
        values.detail = "";
        values.unit = "";
      }
    } catch (err) {
      errorAdd(`${t("add_fail")}`);
    }
  };
  //TODO: CREATE MENU FORM ZUSTAND
  const createMenuData = async (values) => {
    try {
      const body = {
        recommended: values?.recommended,
        isWeightMenu: values?.isWeightMenu,
        name: values?.name,
        name_en: values?.name_en,
        name_cn: values?.name_cn,
        name_kr: values?.name_kr,
        quantity: values?.quantity,
        categoryId: values?.categoryId,
        menuOptionId: menuOptions,
        price: values?.price,
        detail: values?.detail,
        unit: values?.unit,
        isOpened: isOpened,
        images: [...values?.images],
        storeId: getTokken?.DATA?.storeId,
        type: menuType,
        sort: values?.sort,
        menuOption: dataMenuOption,
      };
      if (connectMenuId && connectMenuId !== "" && menuType === "MENUOPTION")
        body = { ...body, menuId: connectMenuId };
      const resData = await createMenuItem(body);
      const _localData = await getLocalData();
      if (resData?.data) {
        setMenus(resData?.data);
        handleClose();
        // handleShow();
        setgetTokken(_localData);
        getMenu(_localData?.DATA?.storeId);
        setMenuType("MENU");
        setConnectMenuId("");
        successAdd(`${t("add_success")}`);
        values.name = "";
        values.name_en = "";
        values.name_cn = "";
        values.name_kr = "";
        values.quantity = "";
        values.categoryId = "";
        values.price = "";
        values.detail = "";
        values.unit = "";
      }
    } catch (error) {
      console.error("Create menu error:", error.message);
      errorAdd(`${t("add_fail")}`);
    }
  };
  // detele menu
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const [dateDelete, setdateDelete] = useState("");
  const handleShow3 = (id, name) => {
    setdateDelete({ name, id });
    setShow3(true);
  };
  const _confirmeDelete = async () => {
    try {
      // const header = await getHeaders();
      // const headers = {
      //   "Content-Type": "application/json",
      //   Authorization: header.authorization,
      // };
      // const resData = await axios({
      //   method: "DELETE",
      //   url: END_POINT_SEVER_TABLE_MENU + `/v3/menu/delete/${dateDelete?.id}`,
      //   headers: headers,
      // });
      const resData = await deleteMenuItem(dateDelete?.id);
      if (resData?.data) {
        const _localData = await getLocalData();
        setgetTokken(_localData);
        getMenu(_localData?.DATA?.storeId);
        handleClose3();
        successAdd(`${t("delete_success")}`);
      }
    } catch (err) {
      errorAdd(`${t("delete_fail")}`);
    }
  };
  // =======>
  // update
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [dataUpdate, setdataUpdate] = useState("");
  const handleShow2 = async (item) => {
    setdataUpdate(item);
    setDataUpdateMenuOption(item?.menuOption);
    setShow2(true);
  };
  //TODO: UPDATE MENU FORM ZUSTAND

  const _updateMenu = async (values) => {
    try {
      const menuData = {
        recommended: values?.recommended,
        isWeightMenu: values?.isWeightMenu,
        name: values?.name,
        name_en: values?.name_en,
        name_cn: values?.name_cn,
        name_kr: values?.name_kr,
        quantity: values?.quantity,
        categoryId: values?.categoryId,
        menuOptionId: menuOptions,
        price: values?.price,
        detail: values?.detail,
        unit: values?.unit,
        isOpened: isOpened,
        images: [...values?.images],
        type: values?.type,
        sort: values?.sort,
        menuOption: dataUpdateMenuOption,
        storeId: storeDetail?._id,
      };
      const updatedMenu = await updateMenuItem(menuData, dataUpdate?._id);
      if (updatedMenu?.data) {
        handleClose2();
        successAdd(`${t("edit_success")}`);
      }
    } catch (error) {
      console.error("Update menu item error:", error.message);
      errorAdd(`${t("edit_fail")}`);
    }
  };

  const _updateCategory = async (values) => {
    const header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    const resData = await axios({
      method: "PUT",
      url: END_POINT_SEVER_TABLE_MENU + `/v3/menu/update`,
      data: {
        id: dataUpdate?._id,
        data: {
          recommended: values?.recommended,
          isWeightMenu: values?.isWeightMenu,
          name: values?.name,
          name_en: values?.name_en,
          name_cn: values?.name_cn,
          name_kr: values?.name_kr,
          quantity: values?.quantity,
          categoryId: values?.categoryId,
          menuOptionId: menuOptions,
          price: values?.price,
          detail: values?.detail,
          unit: values?.unit,
          isOpened: isOpened,
          images: [...values?.images],
          type: values?.type,
          sort: values?.sort,
          menuOption: dataUpdateMenuOption,
          storeId: storeDetail?._id,
        },
      },
      headers: headers,
    });
    console.log("resData", resData);
    if (resData?.data) {
      handleClose2();
      successAdd(`${t("edit_success")}`);
    }
  };

  const _updateQtyCategory = async (values) => {
    await axios({
      method: "PUT",
      url: END_POINT_SEVER_TABLE_MENU + "/v3/menu-stock/update",
      data: {
        id: getIdMenu,
        data: {
          quantity: Number.parseInt(qtyMenu),
        },
      },
    })
      .then(async () => {
        handleClose4();
        successAdd(`${t("edd_amount_success")}`);
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        errorAdd(`${t("add_amount_fail")}`);
      });
  };

  const handleChangeMenuType = async (e) => {
    setMenuType(e.target.value);

    if (e.target.value === "MENUOPTION") {
      await fetch(
        MENUS + `/?isOpened=true&storeId=${getTokken?.DATA?.storeId}&type=MENU`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => {
          setConnectMenues(json);
        });
    }
  };

  const handleChangeConnectMenu = (e) => {
    setConnectMenuId(e.target.value);
  };

  const _onOpenMenu = async (id, isOpenMenuCustomerWeb, index) => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      await axios({
        method: "PUT",
        url: END_POINT_SEVER_TABLE_MENU + `/v3/menu/update/`,
        data: {
          id: id,
          data: {
            isShowCustomerWeb:
              isOpenMenuCustomerWeb === "true" ? "false" : "true",
          },
        },
        headers: headers,
      });

      const _newData = [...Menus];

      _newData[index].isShowCustomerWeb =
        isOpenMenuCustomerWeb === "true" ? "false" : "true";
      setMenus(_newData);
      const data = _newData[index];
      setDetailMenu({ data, index });
    } catch (err) {
      console.log("err:", err);
    }
  };

  const _onOpenMenuCustomerApp = async (id, isOpenMenuCustomerApp, index) => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      await axios({
        method: "PUT",
        url: END_POINT_SEVER_TABLE_MENU + `/v3/menu/update/`,
        data: {
          id: id,
          data: {
            isShowCustomerApp:
              isOpenMenuCustomerApp === "true" ? "false" : "true",
          },
        },
        headers: headers,
      });

      const _newData = [...Menus];

      _newData[index].isShowCustomerApp =
        isOpenMenuCustomerApp === "true" ? "false" : "true";
      setMenus(_newData);
      const data = _newData[index];
      setDetailMenu({ data, index });
    } catch (err) {
      console.log("err:", err);
    }
  };

  const _onOpenMenuStaff = async (id, isOpenMenuStaff, index) => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      await axios({
        method: "PUT",
        url: END_POINT_SEVER_TABLE_MENU + `/v3/menu/update/`,
        data: {
          id: id,
          data: {
            isShowStaffApp: isOpenMenuStaff === "true" ? "false" : "true",
          },
        },
        headers: headers,
      });

      const _newData = [...Menus];

      _newData[index].isShowStaffApp =
        isOpenMenuStaff === "true" ? "false" : "true";
      setMenus(_newData);
      const data = _newData[index];
      setDetailMenu({ data, index });
    } catch (err) {
      console.log("err:", err);
    }
  };

  const _onOpenMenuCounter = async (id, isShowCounterApp, index) => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "PUT",
        url: END_POINT_SEVER_TABLE_MENU + `/v3/menu/update/`,
        data: {
          id: id,
          data: {
            isShowCounterApp: isShowCounterApp === "true" ? "false" : "true",
          },
        },
        headers: headers,
      });

      const _newData = [...Menus];
      _newData[index].isShowCounterApp =
        isShowCounterApp === "true" ? "false" : "true";
      setMenus(_newData);
      const data = _newData[index];
      setDetailMenu({ data, index });
    } catch (err) {
      console.log("err:", err);
    }
  };

  const _menuList = () => {
    navigate(`/settingStore/menu/limit/40/page/1/${params?.id}`);
  };
  const _menuOptionList = () => {
    navigate(`/settingStore/menu-option/limit/40/page/1/${params?.id}`);
  };
  const _category = () => {
    navigate(`/settingStore/menu/category/limit/40/page/1/${params?.id}`);
  };

  const _categoryType = () => {
    navigate(`/settingStore/menu/category-type`);
  };

  const [categoriesRestaurant, setCategoriesRestaurant] = useState([]);

  const getCategory = async () => {
    try {
      await fetch(master_menu_api_dev + `/api/restaurant-categories`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((json) => setCategoriesRestaurant(json));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={BODY}>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <span className={fontMap[language]}>{t("restaurant_setting")}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <span className={fontMap[language]}>{t("menu")}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Nav variant="tabs" defaultActiveKey={defaultActiveKey}>
            <Nav.Item>
              <Nav.Link
                eventKey="/settingStore/menu"
                onClick={() => _menuList()}
              >
                <span className={fontMap[language]}>{t("menu")}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="/settingStore/menu-option"
                onClick={() => _menuOptionList()}
              >
                <span className={fontMap[language]}> {t("option_menu")}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="/settingStore/category"
                onClick={() => _category()}
              >
                <span className={fontMap[language]}>{t("food_type")}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="/settingStore/category"
                onClick={() => _categoryType()}
              >
                <span className={fontMap[language]}>{t("categoryType")}</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <Row>
          <Col sm="12">
            <Row style={{ marginTop: 14, marginBottom: 14 }}>
              <Col md="4">
                <label className={fontMap[language]}>{t("chose_type")}</label>
                <select
                  className={cn(fontMap[language], "form-control")}
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">{t("all")}</option>
                  {Categorys &&
                    Categorys?.map((data, index) => {
                      return (
                        <option key={"category" + index} value={data?._id}>
                          {data?.name}
                        </option>
                      );
                    })}
                </select>
              </Col>
              <Col md="4">
                <label className={fontMap[language]}>{t("search")}</label>
                <Form.Control
                  type="text"
                  placeholder={t("search_food_name")}
                  value={filterName}
                  onChange={(e) => {
                    setFilterName(e.target.value);
                  }}
                  className={fontMap[language]}
                />
              </Col>
              <Col
                md="2"
                style={{
                  marginTop: 32,
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                {/* <Button
                  style={{
                    backgroundColor: COLOR_APP,
                    color: "#ffff",
                    border: 0,
                  }}
                  onClick={handleShowCaution}
                >
                  + ເພີ່ມເມນູຈຳນວນຫຼາຍ
                </Button> */}
              </Col>
              <Col
                md="2"
                style={{
                  marginTop: 32,
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <Button
                  style={{
                    backgroundColor: COLOR_APP,
                    color: "#ffff",
                    border: 0,
                  }}
                  onClick={handleShow}
                  className={fontMap[language]}
                >
                  + {t("add_menu")}
                </Button>
              </Col>
            </Row>
          </Col>
          <Col
            md="12"
            style={{
              overflowX: "auto",
            }}
          >
            <table
              className="table table-hover"
              // style={{ maxWidth: 700 }}
              // style={{
              // 	width: "100%",
              // 	overflowX: "scroll",
              // }}
            >
              <thead className="thead-light">
                <tr>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    #
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("no_show")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("picture")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("type_name")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("menu_type")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("food_name")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("price")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("status")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("setting_show")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("options")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("manage_data")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={9}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                ) : (
                  Menus?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data?.sort ?? 0}</td>
                        <td>
                          {data?.images?.length > 0 ? (
                            <center>
                              <Image
                                src={URL_PHOTO_AW3 + data?.images[0]}
                                width="150"
                                height="150"
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: "50%",
                                }}
                              />
                            </center>
                          ) : (
                            <center>
                              <Image
                                src={profileImage}
                                width="150"
                                height="150"
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: "50%",
                                }}
                              />
                            </center>
                          )}
                        </td>
                        <td>{data?.categoryId?.name}</td>
                        <td>{data?.type}</td>
                        <td style={{ textAlign: "left" }}>
                          {data?.name ?? ""}
                          <br />
                          {data?.name_en ?? ""}
                          <br />
                          {data?.name_cn ?? ""}
                          <br />
                          {data?.name_kr ?? ""}
                        </td>
                        <td>{moneyCurrency(data?.price)}</td>
                        <td style={{ textAlign: "center", color: "red" }}>
                          {data?.isShowStaffApp === "false"
                            ? t("staff") + " : " + t("Close")
                            : ""}
                          <br />
                          {data?.isShowCounterApp === "false"
                            ? t("counter") + " : " + t("Close")
                            : ""}
                          <br />
                          {data?.isShowCustomerApp === "false"
                            ? t("app") + " : " + t("Close")
                            : ""}
                          <br />
                          {data?.isShowCustomerWeb === "false"
                            ? t("web") + " : " + t("Close")
                            : ""}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={cn("menuSetting", fontMap[language])}
                            onClick={() => {
                              setShowSetting(true);
                              setDetailMenu({ data, index });
                            }}
                          >
                            {t("define")}
                          </button>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={cn(
                              "menuSetting whitespace-nowrap !w-fit px-2",
                              fontMap[language]
                            )}
                            onClick={() => {
                              setShowOptionSetting(true);
                              setDetailMenuOption({ data, index });
                            }}
                          >
                            + {t("addition_options")} (
                            {menuOptionsCount[data._id] ||
                              data?.menuOptions?.length ||
                              0}
                            )
                          </button>
                        </td>

                        {/* manage icon */}
                        <td
                          // className="manage"
                          style={{
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() => handleShow2(data)}
                            style={{ color: COLOR_APP, cursor: "pointer" }}
                          />
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{
                              marginLeft: 20,
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => handleShow3(data?._id, data?.name)}
                          />
                          <FontAwesomeIcon
                            icon={faCubes}
                            style={{
                              marginLeft: 20,
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              navigate(
                                `/settingStore/menu/menu-stock/${data?._id}`
                              )
                            }
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </Col>
        </Row>
        {/* >>>>>>>>>>>>> popup >>>>>>>>>>>> */}
        <PopUpConfirmDeletion
          open={show3}
          text={dateDelete?.name}
          onClose={handleClose3}
          onSubmit={_confirmeDelete}
        />

        <PopUpCaution
          open={showCaution}
          onClose={handleCloseCaution}
          setShowAddMenus={setShowAddMenus}
        />
        <PopUpAddMenus
          open={showAddMenus}
          onClose={handleCloseAddMenus}
          categoriesRestaurant={categoriesRestaurant}
          // onSubmit={_confirmeDelete}
        />

        {/* add menu */}
        <Modal show={show} onHide={handleClose} size="lg" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>{t("add_menu")}</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              recommended: false,
              isWeightMenu: false,
              name: "",
              name_en: "",
              name_cn: "",
              name_kr: "",
              quantity: 1,
              menuOptionId: [],
              categoryId: "",
              detail: "",
              images: [],
              unit: "",
              isOpened: true,
              type: "",
              sort: 0,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = `${t("fill_food_name")}`;
              }

              if (
                Number.parseInt(values.price) < 0 ||
                isNaN(Number.parseInt(values.price))
              ) {
                errors.price = `${t("fill_price")}`;
              }
              if (!values.categoryId) {
                errors.categoryId = `${t("please_fill")}`;
              }
              for (let i = 0; i < dataMenuOption?.length; i++) {
                if (dataMenuOption[i]?.name === "") {
                  errors.menuOptionName = `${t("fill_food_name")}`;
                }
                if (!dataMenuOption[i]?.price) {
                  errors.menuOptionPrice = `${t("fill_price")}`;
                }
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              createMenuData(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
              handleSubmit,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Upload
                      src={values?.images?.[0] || ""}
                      removeImage={() => setFieldValue("images", [])}
                      onChange={(e) => {
                        setFieldValue("images", [e.name]);
                      }}
                    />
                  </Box>
                  {/* <div
                    style={{ display: "flex", gap: 20, alignItems: "center" }}
                  >
                    <label>{t("close_open_status")}</label>
                    <input
                      type="checkbox"
                      id="isOpened"
                      checked={values?.isOpened}
                      onChange={() =>
                        setFieldValue("isOpened", !values.isOpened)
                      }
                    />
                    <label for="isOpened">
                      {values?.isOpened ? `${t("oppen")}` : `${t("close")}`}
                    </label>
                  </div> */}
                  <div
                    style={{ display: "flex", gap: 20, alignItems: "center" }}
                  >
                    <label>{t("sg_menu")}</label>
                    <input
                      type="checkbox"
                      id="recommended"
                      checked={values?.recommended}
                      onChange={() =>
                        setFieldValue("recommended", !values.recommended)
                      }
                    />
                    <label for="recommended">
                      {values?.recommended ? `${t("oppen")}` : `${t("close")}`}
                    </label>
                  </div>
                  <div
                    style={{ display: "flex", gap: 20, alignItems: "center" }}
                  >
                    <label>{t("menu_sold_by_weight")}</label>
                    <input
                      type="checkbox"
                      id="isWeightMenu"
                      checked={values?.isWeightMenu}
                      onChange={() =>
                        setFieldValue("isWeightMenu", !values.isWeightMenu)
                      }
                    />
                    <label for="isWeightMenu">
                      {values?.isWeightMenu ? `${t("oppen")}` : `${t("close")}`}
                    </label>
                  </div>
                  <Form.Group>
                    <Form.Label>{t("sequence")}</Form.Label>
                    <Form.Control
                      type="number"
                      name="sort"
                      placeholder={t("sequence")}
                      value={values.sort}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {/* <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>{t("food_type")}</Form.Label>
                    <Form.Control
                      as="select"
                      name="categoryId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.categoryId}
                      style={{
                        border:
                          errors.categoryId &&
                          touched.categoryId &&
                          errors.categoryId
                            ? "solid 1px red"
                            : "",
                      }}
                    >
                      <option selected={true} disabled={true} value="">
                        {t("chose_type")}
                      </option>
                      {Categorys?.map((item, index) => {
                        return <option value={item?._id}>{item?.name}</option>;
                      })}
                    </Form.Control>
                  </Form.Group> */}

                  {/* <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>{t("type")}</Form.Label>
                    <Form.Control
                      as="select"
                      name="menuType"
                      onChange={handleChangeMenuType}
                      value={menuType}
                    >
                      <option value={"MENU"}>{t("menu")}</option>
                      <option value={"MENUOPTION"}>{t("sub_menu")}</option>
                    </Form.Control>
                  </Form.Group> */}

                  {menuType === "MENUOPTION" && (
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>{t("menu_hide")}</Form.Label>
                      <Form.Control
                        as="select"
                        name="connectMenuId"
                        onChange={handleChangeConnectMenu}
                        value={connectMenuId}
                      >
                        <option selected={true} disabled={true} value="">
                          {t("chose_mune_hide")}
                        </option>
                        {connectMenues.map((item, index) => (
                          <option key={index} value={item?._id}>
                            {item?.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  )}

                  <Row>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>{t("food_name")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          placeholder={t("food_name")}
                          style={{
                            border:
                              errors.name && touched.name && errors.name
                                ? "solid 1px red"
                                : "",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>{t("food_name")} (EN)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_en"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name_en}
                          placeholder={t("food_name")}
                          style={{
                            border:
                              errors.name_en && touched.name && errors.name_en
                                ? "solid 1px red"
                                : "",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>{t("food_name")} (CN)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_cn"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name_cn}
                          placeholder={t("food_name")}
                          style={{
                            border:
                              errors.name_cn && touched.name && errors.name_cn
                                ? "solid 1px red"
                                : "",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>{t("food_name")} (KR)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_kr"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name_kr}
                          placeholder={t("food_name")}
                          style={{
                            border:
                              errors.name_kr && touched.name && errors.name_kr
                                ? "solid 1px red"
                                : "",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("price")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="price"
                      onFocus={() => {
                        setFieldValue("price", "0");
                        setFormattedPrice("");
                      }}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, "");
                        const formattedValue = rawValue
                          ? new Intl.NumberFormat("la-LA", {
                              style: "currency",
                              currency: "LAK",
                              minimumFractionDigits: 0,
                            }).format(rawValue)
                          : "";
                        setFieldValue("price", rawValue);
                        setFormattedPrice(formattedValue);
                      }}
                      onBlur={() => {
                        handleBlur("price");
                        if (!formattedPrice) {
                          setFormattedPrice("LAK 0");
                          setFieldValue("price", "0");
                        }
                      }}
                      value={
                        formattedPrice ||
                        (values?.price
                          ? new Intl.NumberFormat("la-LA", {
                              style: "currency",
                              currency: "LAK",
                              minimumFractionDigits: 0,
                            }).format(values.price)
                          : "LAK 0")
                      }
                      placeholder={t("food_name")}
                      style={{
                        border:
                          errors.price && touched.price && errors.price
                            ? "solid 1px red"
                            : "",
                      }}
                    />
                  </Form.Group>

                  {/* <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("order_add")}</Form.Label>
                    {dataMenuOption?.length > 0 &&
                      dataMenuOption?.map((item, index) => (
                        <div key={index}>
                          <div className="pl-4 row">
                            <Col xs={11}>
                              <Row>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>{t("food_name")}</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="name"
                                      onChange={(e) =>
                                        _handleChangeMenuOption(
                                          index,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      value={item?.name}
                                      placeholder={t("food_name")}
                                      isInvalid={!item?.name}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>
                                      {t("food_name")} (EN)
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="name_en"
                                      onChange={(e) =>
                                        _handleChangeMenuOption(
                                          index,
                                          "name_en",
                                          e.target.value
                                        )
                                      }
                                      value={item?.name_en}
                                      placeholder={t("food_name")}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>
                                      {t("food_name")} (CN)
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="name_cn"
                                      onChange={(e) =>
                                        _handleChangeMenuOption(
                                          index,
                                          "name_cn",
                                          e.target.value
                                        )
                                      }
                                      value={item?.name_cn}
                                      placeholder={t("food_name")}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>
                                      {t("food_name")} (KR)
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="name_kr"
                                      onChange={(e) =>
                                        _handleChangeMenuOption(
                                          index,
                                          "name_kr",
                                          e.target.value
                                        )
                                      }
                                      value={item?.name_kr}
                                      placeholder={t("food_name")}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={6}>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>{t("price")}</Form.Label>
                                    <Form.Control
                                      type="number"
                                      name="price"
                                      onChange={(e) =>
                                        _handleChangeMenuOption(
                                          index,
                                          "price",
                                          e.target.value
                                        )
                                      }
                                      value={item?.price}
                                      placeholder={t("food_name")}
                                      min="0"
                                      isInvalid={!item?.price ? "required" : ""}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                            <Col className="d-flex align-items-center justify-content-center">
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                style={{ color: "red", cursor: "pointer" }}
                                onClick={() => _removeItem(index)}
                              />
                            </Col>
                          </div>
                          <hr />
                        </div>
                      ))}
                    <div>
                      <Button
                        style={{
                          backgroundColor: COLOR_APP,
                          color: "#ffff",
                          border: 0,
                          marginTop: 10,
                        }}
                        onClick={() => _addMenuOption()}
                      >
                        + {t("order_add")}
                      </Button>
                    </div>
                  </Form.Group> */}
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("note")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="detail"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.detail}
                      placeholder={`${t("note")}...`}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="danger"
                    onClick={() => {
                      handleClose();
                      setDataMenuOption([]);
                    }}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    style={{
                      backgroundColor: COLOR_APP,
                      color: "#ffff",
                      border: 0,
                    }}
                    onClick={() => handleSubmit()}
                  >
                    {t("save")}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>
        {/* update menu */}
        <Modal
          show={show2}
          onHide={handleClose2}
          // backdrop="static"
          keyboard={false}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("edit-menu")}</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              recommended: dataUpdate?.recommended,
              isWeightMenu: dataUpdate?.isWeightMenu,
              name: dataUpdate?.name,
              name_en: dataUpdate?.name_en,
              name_cn: dataUpdate?.name_cn,
              name_kr: dataUpdate?.name_kr,
              images: dataUpdate?.images,
              quantity: dataUpdate?.quantity,
              sort: dataUpdate?.sort,
              menuOptionId: dataUpdate?.menuOptions,
              categoryId: dataUpdate?.categoryId?._id,
              price: dataUpdate?.price,
              detail: dataUpdate?.detail,
              unit: dataUpdate?.unit,
              isOpened: dataUpdate?.isOpened,
              type: dataUpdate?.type,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = `${t("fill_food_name")}`;
              }
              if (
                Number.parseInt(values.price) < 0 ||
                isNaN(Number.parseInt(values.price))
              ) {
                errors.price = `${t("fill_price")}`;
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              const getData = async () => {
                await _updateMenu(values);
                const _localData = await getLocalData();
                if (_localData) {
                  setgetTokken(_localData);
                  getMenu(_localData?.DATA?.storeId, filterCategory);
                }
              };
              getData();
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Upload
                    src={values?.images?.[0] || ""}
                    removeImage={() => setFieldValue("images", [])}
                    onChange={(e) => {
                      setFieldValue("images", [e.name]);
                    }}
                  />
                  {/* <div
                    style={{ display: "flex", gap: 20, alignItems: "center" }}
                  >
                    <label>{t("close_open_statuss")}</label>
                    <input
                      type="checkbox"
                      id="isOpened"
                      checked={values?.isOpened}
                      onChange={() =>
                        setFieldValue("isOpened", !values.isOpened)
                      }
                    />
                    <label for="isOpened">
                      {values?.isOpened ? `${t("oppen")}` : `${t("close")}`}
                    </label>
                  </div> */}
                  <div
                    style={{ display: "flex", gap: 20, alignItems: "center" }}
                  >
                    <label>{t("sg_menu")}</label>
                    <input
                      type="checkbox"
                      id="recommended"
                      checked={values?.recommended}
                      onChange={() =>
                        setFieldValue("recommended", !values.recommended)
                      }
                    />
                    <label for="recommended">
                      {values?.recommended ? `${t("oppen")}` : `${t("close")}`}
                    </label>
                  </div>
                  <div
                    style={{ display: "flex", gap: 20, alignItems: "center" }}
                  >
                    <label>{t("menu_sold_by_weight")}</label>
                    <input
                      type="checkbox"
                      id="isWeightMenu"
                      checked={values?.isWeightMenu}
                      onChange={() =>
                        setFieldValue("isWeightMenu", !values.isWeightMenu)
                      }
                    />
                    <label for="isWeightMenu">
                      {values?.isWeightMenu ? `${t("oppen")}` : `${t("close")}`}
                    </label>
                  </div>
                  <Form.Group>
                    <Form.Label>{t("sequence")}</Form.Label>
                    <Form.Control
                      type="number"
                      name="sort"
                      placeholder={t("menu_no")}
                      value={values.sort}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  {/* <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>{t("food_type")}</Form.Label>
                    <Form.Control
                      as="select"
                      name="categoryId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.categoryId}
                    >
                      <option selected={true} disabled={true}>
                        {t("chose_food_type")}
                      </option>
                      {Categorys?.map((item, index) => {
                        return <option value={item?._id}>{item?.name}</option>;
                      })}
                    </Form.Control>
                  </Form.Group>
                  {/* <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>{t("type")}</Form.Label>
                    <Form.Control
                      as="select"
                      name="menuType"
                      onChange={handleChangeMenuType}
                      value={menuType}
                    >
                      <option value={"MENU"}>{t("menu")}</option>
                      <option value={"MENUOPTION"}>{t("sub_menu")}</option>
                    </Form.Control>
                  </Form.Group> */}

                  {menuType === "MENUOPTION" && (
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>{t("menu_hide")}</Form.Label>
                      <Form.Control
                        as="select"
                        name="connectMenuId"
                        onChange={handleChangeConnectMenu}
                        value={connectMenuId}
                      >
                        <option selected={true} disabled={true} value="">
                          {t("chose_menu_hide")}
                        </option>
                        {connectMenues.map((item, index) => (
                          <option key={index} value={item?._id}>
                            {item?.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  )}
                  <Row>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>{t("food_name")}</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          placeholder={t("food_name")}
                          style={{
                            border:
                              errors.name && touched.name && errors.name
                                ? "solid 1px red"
                                : "",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>{t("food_name")} (EN)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_en"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.name_en}
                          placeholder={t("food_name")}
                          style={{
                            border:
                              errors.name_en &&
                              touched.name_en &&
                              errors.name_en
                                ? "solid 1px red"
                                : "",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>{t("food_name")} (CN)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_cn"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.name_cn}
                          placeholder={t("food_name")}
                          style={{
                            border:
                              errors.name_cn &&
                              touched.name_cn &&
                              errors.name_cn
                                ? "solid 1px red"
                                : "",
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>{t("food_name")} (KR)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_kr"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.name_kr}
                          placeholder={t("food_name")}
                          style={{
                            border:
                              errors.name_kr &&
                              touched.name_kr &&
                              errors.name_kr
                                ? "solid 1px red"
                                : "",
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("price")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="price"
                      onFocus={() => {
                        setFieldValue("price", "0");
                        setFormattedPrice("");
                      }}
                      onChange={(e) => {
                        const rawValue = e.target.value.replace(/[^0-9]/g, "");
                        const formattedValue = rawValue
                          ? new Intl.NumberFormat("la-LA", {
                              style: "currency",
                              currency: "LAK",
                              minimumFractionDigits: 0,
                            }).format(rawValue)
                          : "";
                        setFieldValue("price", rawValue);
                        setFormattedPrice(formattedValue);
                      }}
                      onBlur={() => {
                        handleBlur("price");
                        if (!formattedPrice) {
                          setFormattedPrice("LAK 0");
                          setFieldValue("price", "0");
                        }
                      }}
                      value={
                        formattedPrice ||
                        (values?.price
                          ? new Intl.NumberFormat("la-LA", {
                              style: "currency",
                              currency: "LAK",
                              minimumFractionDigits: 0,
                            }).format(values.price)
                          : "LAK 0")
                      }
                      placeholder={t("food_name")}
                      style={{
                        border:
                          errors.price && touched.price && errors.price
                            ? "solid 1px red"
                            : "",
                      }}
                    />
                  </Form.Group>

                  {/* <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("order_add")}</Form.Label>
                    {dataUpdateMenuOption?.length > 0 &&
                      dataUpdateMenuOption?.map((item, index) => (
                        <div key={index}>
                          <div className="pl-4 row">
                            <Col xs={11}>
                              <Row>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>{t("food_name")}</Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="name"
                                      onChange={(e) =>
                                        _handleChangeUpdateMenuOption(
                                          index,
                                          "name",
                                          e.target.value
                                        )
                                      }
                                      value={item?.name}
                                      placeholder={t("food_name")}
                                      isInvalid={!item?.name}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>
                                      {t("food_name")} (EN)
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="name_en"
                                      onChange={(e) =>
                                        _handleChangeUpdateMenuOption(
                                          index,
                                          "name_en",
                                          e.target.value
                                        )
                                      }
                                      value={item?.name_en}
                                      placeholder={t("food_name")}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>
                                      {t("food_name")} (CN)
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="name_cn"
                                      onChange={(e) =>
                                        _handleChangeUpdateMenuOption(
                                          index,
                                          "name_cn",
                                          e.target.value
                                        )
                                      }
                                      value={item?.name_cn}
                                      placeholder={t("food_name")}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>
                                      {t("food_name")} (KR)
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      name="name_kr"
                                      onChange={(e) =>
                                        _handleChangeUpdateMenuOption(
                                          index,
                                          "name_kr",
                                          e.target.value
                                        )
                                      }
                                      value={item?.name_kr}
                                      placeholder={t("food_name")}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={6}>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>{t("price")}</Form.Label>
                                    <Form.Control
                                      type="number"
                                      name="price"
                                      onChange={(e) =>
                                        _handleChangeUpdateMenuOption(
                                          index,
                                          "price",
                                          e.target.value
                                        )
                                      }
                                      value={item?.price}
                                      placeholder={t("food_name")}
                                      min="0"
                                      isInvalid={!item?.price ? "required" : ""}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </Col>
                            <Col className="d-flex align-items-center justify-content-center">
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                style={{ color: "red", cursor: "pointer" }}
                                onClick={() => _removeItemUpdate(index)}
                              />
                            </Col>
                          </div>
                          <hr />
                        </div>
                      ))}
                    <div>
                      <Button
                        style={{
                          backgroundColor: COLOR_APP,
                          color: "#ffff",
                          border: 0,
                          marginTop: 10,
                        }}
                        onClick={() => _addUpdateMenuOption()}
                      >
                        + {t("order_add")}
                      </Button>
                    </div>
                  </Form.Group> */}
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("note")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="detail"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.detail}
                      placeholder={`${t("note")}...`}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleClose2}>
                    {t("cancel")}
                  </Button>
                  <Button
                    style={{
                      backgroundColor: COLOR_APP,
                      color: "#ffff",
                      border: 0,
                    }}
                    onClick={() => handleSubmit()}
                  >
                    {t("save")}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>
        {/* add qty menu */}
        <Modal show={show4} onHide={handleClose4}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div style={{ textAlign: "center" }}>
              <div>{t("file_prod_amount")} </div>
              <div style={{ height: 20 }}></div>
              <input
                type="number"
                className="form-control"
                onChange={(e) => setQtyMenu(e?.target?.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button type="button" variant="secondary" onClick={handleClose4}>
              {t("cancel")}
            </Button>
            <Button
              type="button"
              style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
              onClick={() => _updateQtyCategory()}
            >
              {t("approve_add")}
            </Button>
          </Modal.Footer>
        </Modal>
        {/* <<<<<<<<<<<<<< popup <<<<<<<<<<<<<< */}

        <PopUpIsOpenMenu
          showSetting={showSetting}
          detailMenu={detailMenu}
          handleClose={async () => {
            await setShowSetting(false);
            await setDetailMenu();
          }}
          _handOpenMenu={(id, isOpenMenuCustomerWeb, index) =>
            _onOpenMenu(id, isOpenMenuCustomerWeb, index)
          }
          _handOpenMenuCounterApp={(id, isShowCounterApp, index) =>
            _onOpenMenuCounter(id, isShowCounterApp, index)
          }
          _handOpenMenuCustomerApp={(id, isOpenMenuCustomerApp, index) =>
            _onOpenMenuCustomerApp(id, isOpenMenuCustomerApp, index)
          }
          _handOpenMenuShowStaff={(id, isOpenMenuStaff, index) =>
            _onOpenMenuStaff(id, isOpenMenuStaff, index)
          }
        />

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
      </Box>
    </div>
  );
}
