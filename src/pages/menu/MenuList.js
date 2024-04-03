import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import axios from "axios";
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
  END_POINT_SEVER,
  master_menu_api_dev,
} from "../../constants/api";
import { moneyCurrency } from "../../helpers";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import profileImage from "../../image/profile.png";
import { getHeaders } from "../../services/auth";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import Upload from "../../components/Upload";
import { useNavigate, useParams } from "react-router-dom";
import Box from "../../components/Box";
import PopUpIsOpenMenu from "./components/popup/PopUpIsOpenMenu";
import PopUpCaution from "../../components/popup/PopUpCaution";
import PopUpAddMenus from "../../components/popup/PopUpAddMenus";

export default function MenuList() {
  const navigate = useNavigate();
  const params = useParams();

  const [showSetting, setShowSetting] = useState(false);

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

  //update show menu
  const [detailMenu, setDetailMenu] = useState();
  // =====> getCategory
  const [Categorys, setCategorys] = useState();
  const [Menus, setMenus] = useState();
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
            `/?storeId=${_localData?.DATA?.storeId}${(filterCategory === "All") ? ""
              : `&categoryId=${filterCategory}`

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
        END_POINT_SEVER + `/v3/categories?storeId=${id}&isDeleted=false`,
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
        MENUS +
        `/?storeId=${id}${filterName && filterName !== "" ? `&name=${filterName}` : ""}${(categoryId && categoryId !== "All")
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
    let remove = dataMenuOption.splice(index, 1);
    let _newData = dataMenuOption?.filter((item) => item !== remove[0]);
    setDataMenuOption(_newData);
  };
  const _removeItemUpdate = (index) => {
    let remove = dataUpdateMenuOption.splice(index, 1);
    let _newData = dataUpdateMenuOption?.filter((item) => item !== remove[0]);
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

  // ======> create menu
  const _createMenu = async (values) => {
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    try {
      let createData = {
        recommended: values?.recommended,
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
        url: END_POINT_SEVER + "/v3/menu/create",
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
        successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
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
      errorAdd("ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !");
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
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const resData = await axios({
        method: "DELETE",
        url: END_POINT_SEVER + `/v3/menu/delete/${dateDelete?.id}`,
        headers: headers,
      });
      if (resData?.data) {
        const _localData = await getLocalData();
        setgetTokken(_localData);

        getMenu(_localData?.DATA?.storeId);

        handleClose3();
        successAdd("ການລົບຂໍ້ມູນສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ການລົບຂໍ້ມູນບໍ່ສຳເລັດ !");
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
  const _updateCategory = async (values) => {
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    const resData = await axios({
      method: "PUT",
      url: END_POINT_SEVER + `/v3/menu/update`,
      data: {
        id: dataUpdate?._id,
        data: {
          recommended: values?.recommended,
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
        },
      },
      headers: headers,
    });
    if (resData?.data) {
      handleClose2();
      successAdd("ການແກ້ໄຂຂໍ້ມູນສຳເລັດ");
    }
  };
  const _updateQtyCategory = async (values) => {
    await axios({
      method: "PUT",
      url: END_POINT_SEVER + "/v3/menu-stock/update",
      data: {
        id: getIdMenu,
        data: {
          quantity: parseInt(qtyMenu),
        },
      },
    })
      .then(async function () {
        handleClose4();
        successAdd("ການເພີ່ມຈຳນວນສຳເລັດ");
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(function (error) {
        errorAdd("ການເພີ່ມຈຳນວນບໍ່ສຳເລັດ !");
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
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      await axios({
        method: "PUT",
        url: END_POINT_SEVER + `/v3/menu/update/`,
        data: {
          id: id,
          data: {
            isShowCustomerWeb:
              isOpenMenuCustomerWeb === "true" ? "false" : "true",
          },
        },
        headers: headers,
      });

      let _newData = [...Menus];

      _newData[index].isShowCustomerWeb =
        isOpenMenuCustomerWeb === "true" ? "false" : "true";
      setMenus(_newData);
      let data = _newData[index];
      setDetailMenu({ data, index });
    } catch (err) {
      console.log("err:", err);
    }
  };

  const _onOpenMenuCustomerApp = async (id, isOpenMenuCustomerApp, index) => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      await axios({
        method: "PUT",
        url: END_POINT_SEVER + `/v3/menu/update/`,
        data: {
          id: id,
          data: {
            isShowCustomerApp:
              isOpenMenuCustomerApp === "true" ? "false" : "true",
          },
        },
        headers: headers,
      });

      let _newData = [...Menus];

      _newData[index].isShowCustomerApp =
        isOpenMenuCustomerApp === "true" ? "false" : "true";
      setMenus(_newData);
      let data = _newData[index];
      setDetailMenu({ data, index });
    } catch (err) {
      console.log("err:", err);
    }
  };

  const _onOpenMenuStaff = async (id, isOpenMenuStaff, index) => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      await axios({
        method: "PUT",
        url: END_POINT_SEVER + `/v3/menu/update/`,
        data: {
          id: id,
          data: {
            isShowStaffApp: isOpenMenuStaff === "true" ? "false" : "true",
          },
        },
        headers: headers,
      });

      let _newData = [...Menus];

      _newData[index].isShowStaffApp =
        isOpenMenuStaff === "true" ? "false" : "true";
      setMenus(_newData);
      let data = _newData[index];
      setDetailMenu({ data, index });
    } catch (err) {
      console.log("err:", err);
    }
  };

  const _onOpenMenuCounter = async (id, isShowCounterApp, index) => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "PUT",
        url: END_POINT_SEVER + `/v3/menu/update/`,
        data: {
          id: id,
          data: {
            isShowCounterApp: isShowCounterApp === "true" ? "false" : "true",
          },
        },
        headers: headers,
      });

      let _newData = [...Menus];
      _newData[index].isShowCounterApp =
        isShowCounterApp === "true" ? "false" : "true";
      setMenus(_newData);
      let data = _newData[index];
      setDetailMenu({ data, index });
    } catch (err) {
      console.log("err:", err);
    }
  };

  const _menuList = () => {
    navigate(`/settingStore/menu/limit/40/page/1/${params?.id}`);
  };
  const _category = () => {
    navigate(`/settingStore/menu/category/limit/40/page/1/${params?.id}`);
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
          <Breadcrumb.Item>ຕັ້ງຄ່າຮ້ານອາຫານ</Breadcrumb.Item>
          <Breadcrumb.Item active>ເມນູອາຫານ</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Nav variant="tabs" defaultActiveKey="/settingStore/menu">
            <Nav.Item>
              <Nav.Link
                eventKey="/settingStore/menu"
                onClick={() => _menuList()}
              >
                ເມນູອາຫານ
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="/settingStore/category"
                onClick={() => _category()}
              >
                ປະເພດອາຫານ
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <Row>
          <Col sm="12">
            <Row style={{ marginTop: 14, marginBottom: 14 }}>
              <Col md="4">
                <label>ເລືອກປະເພດ</label>
                <select
                  className="form-control"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="All">ທັງໝົດ</option>
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
                <label>ຄົ້ນຫາ</label>
                <Form.Control
                  type="text"
                  placeholder="ຄົ້ນຫາຊື່ອາຫານ..."
                  value={filterName}
                  onChange={(e) => {
                    setFilterName(e.target.value);
                  }}
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
                <Button
                  style={{
                    backgroundColor: COLOR_APP,
                    color: "#ffff",
                    border: 0,
                  }}
                  onClick={handleShowCaution}
                >
                  + ເພີ່ມເມນູຈຳນວນຫຼາຍ
                </Button>
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
                >
                  + ເພີ່ມເມນູອາຫານ
                </Button>
              </Col>
            </Row>
          </Col>
          <Col md="12">
            <table className="table table-hover" style={{ minWidth: 700 }}>
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ລຳດັບສະແດງ</th>
                  <th scope="col">ຮູບພາບ</th>
                  <th scope="col">ຊື່ປະເພດອາຫານ</th>
                  <th scope="col">ປະເພດເມນູ</th>
                  <th scope="col">ຊື່ອາຫານ</th>
                  <th scope="col">ລາຄາ</th>
                  <th scope="col">ກຳນົດສະຖານະການສະແດງ</th>
                  <th scope="col">ຈັດການຂໍ້ມູນ</th>
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
                          {data?.images.length > 0 ? (
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
                        <td>
                          <button
                            type="button"
                            className="menuSetting"
                            onClick={() => {
                              setShowSetting(true);
                              setDetailMenu({ data, index });
                            }}
                          >
                            ກຳນົດ
                          </button>
                        </td>

                        <td>
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
            <Modal.Title>ເພີ່ມເມນູອາຫານ</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              recommended: false,
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
                errors.name = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
              }


              if (parseInt(values.price) < 0 || isNaN(parseInt(values.price))) {
                errors.price = "ກະລຸນາປ້ອນລາຄາຂາຍ...";
              }
              if (!values.categoryId) {
                errors.categoryId = "ກະລຸນາປ້ອນ...";
              }
              for (let i = 0; i < dataMenuOption.length; i++) {
                if (dataMenuOption[i]?.name === "") {
                  errors.menuOptionName = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
                }
                if (!dataMenuOption[i]?.price) {
                  errors.menuOptionPrice = "ກະລຸນາປ້ອນລາຄາ...";
                }
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _createMenu(values);
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
                  <div
                    style={{ display: "flex", gap: 20, alignItems: "center" }}
                  >
                    <label>ສະຖານະເປີດ/ປິດ</label>
                    <input
                      type="checkbox"
                      id="isOpened"
                      checked={values?.isOpened}
                      onChange={() =>
                        setFieldValue("isOpened", !values.isOpened)
                      }
                    />
                    <label for="isOpened">
                      {values?.isOpened ? "ເປີດ" : "ປິດ"}
                    </label>
                  </div>
                  <div
                    style={{ display: "flex", gap: 20, alignItems: "center" }}
                  >
                    <label>ເມນູແນະນຳ</label>
                    <input
                      type="checkbox"
                      id="recommended"
                      checked={values?.recommended}
                      onChange={() =>
                        setFieldValue("recommended", !values.recommended)
                      }
                    />
                    <label for="recommended">
                      {values?.recommended ? "ເປີດ" : "ປິດ"}
                    </label>
                  </div>
                  <Form.Group>
                    <Form.Label>ລຳດັບ</Form.Label>
                    <Form.Control
                      type="number"
                      name="sort"
                      placeholder="ລຳດັບ"
                      value={values.sort}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>ປະເພດອາຫານ</Form.Label>
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
                        ເລືອກປະເພດອາຫານ
                      </option>
                      {Categorys?.map((item, index) => {
                        return <option value={item?._id}>{item?.name}</option>;
                      })}
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>ປະເພດ</Form.Label>
                    <Form.Control
                      as="select"
                      name="menuType"
                      onChange={handleChangeMenuType}
                      value={menuType}
                    >
                      <option value={"MENU"}>ເມນູ</option>
                      <option value={"MENUOPTION"}>ເມນູຍ່ອຍ</option>
                    </Form.Control>
                  </Form.Group>

                  {menuType === "MENUOPTION" && (
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>ເມນູທີ່ເຊື່ອມ</Form.Label>
                      <Form.Control
                        as="select"
                        name="connectMenuId"
                        onChange={handleChangeConnectMenu}
                        value={connectMenuId}
                      >
                        <option selected={true} disabled={true} value="">
                          ເລືອກເມນູທີ່ເຊື່ອມ
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
                        <Form.Label>ຊື່ອາຫານ</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          placeholder="ຊື່ອາຫານ..."
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
                        <Form.Label>ຊື່ອາຫານ (en)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_en"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name_en}
                          placeholder="ຊື່ອາຫານ..."
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
                        <Form.Label>ຊື່ອາຫານ (cn)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_cn"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name_cn}
                          placeholder="ຊື່ອາຫານ..."
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
                        <Form.Label>ຊື່ອາຫານ (kr)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_kr"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name_kr}
                          placeholder="ຊື່ອາຫານ..."
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
                    <Form.Label>ລາຄາ</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.price}
                      placeholder="ລາຄາ..."
                      style={{
                        border:
                          errors.price && touched.price && errors.price
                            ? "solid 1px red"
                            : "",
                      }}
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ເມນູສັ່ງເພີ່ມ</Form.Label>
                    {dataMenuOption?.length > 0 &&
                      dataMenuOption?.map((item, index) => (
                        <div key={index}>
                          <div className="pl-4 row">
                            <Col xs={11}>
                              <Row>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຊື່ອາຫານ</Form.Label>
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
                                      placeholder="ຊື່ອາຫານ..."
                                      isInvalid={!item?.name}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຊື່ອາຫານ (en)</Form.Label>
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
                                      placeholder="ຊື່ອາຫານ..."
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຊື່ອາຫານ (cn)</Form.Label>
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
                                      placeholder="ຊື່ອາຫານ..."
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຊື່ອາຫານ (kr)</Form.Label>
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
                                      placeholder="ຊື່ອາຫານ..."
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={6}>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ລາຄາ</Form.Label>
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
                                      placeholder="ລາຄາ..."
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
                        + ເມນູສັ່ງເພີ່ມ
                      </Button>
                    </div>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ໝາຍເຫດ</Form.Label>
                    <Form.Control
                      type="text"
                      name="detail"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.detail}
                      placeholder="ໝາຍເຫດ..."
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
                    ຍົກເລີກ
                  </Button>
                  <Button
                    style={{
                      backgroundColor: COLOR_APP,
                      color: "#ffff",
                      border: 0,
                    }}
                    onClick={() => handleSubmit()}
                  >
                    ບັນທືກ
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
            <Modal.Title>ອັບເດດເມນູອາຫານ</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              recommended: dataUpdate?.recommended,
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
                errors.name = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
              }
              if (parseInt(values.price) < 0 || isNaN(parseInt(values.price))) {
                errors.price = "ກະລຸນາປ້ອນລາຄາ...";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              const getData = async () => {
                await _updateCategory(values);
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
                  <div
                    style={{ display: "flex", gap: 20, alignItems: "center" }}
                  >
                    <label>ສະຖານະເປີດ/ປິດ</label>
                    <input
                      type="checkbox"
                      id="isOpened"
                      checked={values?.isOpened}
                      onChange={() =>
                        setFieldValue("isOpened", !values.isOpened)
                      }
                    />
                    <label for="isOpened">
                      {values?.isOpened ? "ເປີດ" : "ປິດ"}
                    </label>
                  </div>
                  <div
                    style={{ display: "flex", gap: 20, alignItems: "center" }}
                  >
                    <label>ເມນູແນະນຳ</label>
                    <input
                      type="checkbox"
                      id="recommended"
                      checked={values?.recommended}
                      onChange={() =>
                        setFieldValue("recommended", !values.recommended)
                      }
                    />
                    <label for="recommended">
                      {values?.recommended ? "ເປີດ" : "ປິດ"}
                    </label>
                  </div>
                  <Form.Group>
                    <Form.Label>ລຳດັບ</Form.Label>
                    <Form.Control
                      type="number"
                      name="sort"
                      placeholder="ລຳດັບ"
                      value={values.sort}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>ປະເພດອາຫານ</Form.Label>
                    <Form.Control
                      as="select"
                      name="categoryId"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.categoryId}
                    >
                      <option selected={true} disabled={true}>
                        ເລືອກປະເພດອາຫານ
                      </option>
                      {Categorys?.map((item, index) => {
                        return <option value={item?._id}>{item?.name}</option>;
                      })}
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlSelect1">
                    <Form.Label>ປະເພດ</Form.Label>
                    <Form.Control
                      as="select"
                      name="menuType"
                      onChange={handleChangeMenuType}
                      value={menuType}
                    >
                      <option value={"MENU"}>ເມນູ</option>
                      <option value={"MENUOPTION"}>ເມນູຍ່ອຍ</option>
                    </Form.Control>
                  </Form.Group>

                  {menuType === "MENUOPTION" && (
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label>ເມນູທີ່ເຊື່ອມ</Form.Label>
                      <Form.Control
                        as="select"
                        name="connectMenuId"
                        onChange={handleChangeConnectMenu}
                        value={connectMenuId}
                      >
                        <option selected={true} disabled={true} value="">
                          ເລືອກເມນູທີ່ເຊື່ອມ
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
                        <Form.Label>ຊື່ອາຫານ</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          placeholder="ຊື່ອາຫານ..."
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
                        <Form.Label>ຊື່ອາຫານ (en)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_en"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.name_en}
                          placeholder="ຊື່ອາຫານ..."
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
                        <Form.Label>ຊື່ອາຫານ (cn)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_cn"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.name_cn}
                          placeholder="ຊື່ອາຫານ..."
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
                        <Form.Label>ຊື່ອາຫານ (kr)</Form.Label>
                        <Form.Control
                          type="text"
                          name="name_kr"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values?.name_kr}
                          placeholder="ຊື່ອາຫານ..."
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
                    <Form.Label>ລາຄາ</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.price}
                      placeholder="ລາຄາ..."
                      style={{
                        border:
                          errors.price && touched.price && errors.price
                            ? "solid 1px red"
                            : "",
                      }}
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ເມນູສັ່ງເພີ່ມ</Form.Label>
                    {dataUpdateMenuOption?.length > 0 &&
                      dataUpdateMenuOption?.map((item, index) => (
                        <div key={index}>
                          <div className="pl-4 row">
                            <Col xs={11}>
                              <Row>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຊື່ອາຫານ</Form.Label>
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
                                      placeholder="ຊື່ອາຫານ..."
                                      isInvalid={!item?.name}
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຊື່ອາຫານ (en)</Form.Label>
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
                                      placeholder="ຊື່ອາຫານ..."
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຊື່ອາຫານ (cn)</Form.Label>
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
                                      placeholder="ຊື່ອາຫານ..."
                                    />
                                  </Form.Group>
                                </Col>
                                <Col>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ຊື່ອາຫານ (kr)</Form.Label>
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
                                      placeholder="ຊື່ອາຫານ..."
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={6}>
                                  <Form.Group controlId="exampleForm.ControlInput1">
                                    <Form.Label>ລາຄາ</Form.Label>
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
                                      placeholder="ລາຄາ..."
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
                        + ເມນູສັ່ງເພີ່ມ
                      </Button>
                    </div>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ໝາຍເຫດ</Form.Label>
                    <Form.Control
                      type="text"
                      name="detail"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.detail}
                      placeholder="ໝາຍເຫດ..."
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleClose2}>
                    ຍົກເລີກ
                  </Button>
                  <Button
                    style={{
                      backgroundColor: COLOR_APP,
                      color: "#ffff",
                      border: 0,
                    }}
                    onClick={() => handleSubmit()}
                  >
                    ບັນທືກ
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
              <div>ປ້ອນຈຳນວນສີນຄ້າ </div>
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
              ຍົກເລີກ
            </Button>
            <Button
              type="button"
              style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
              onClick={() => _updateQtyCategory()}
            >
              ຢືນຢັນການເພີ່ມ
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
      </Box>
    </div>
  );
}
