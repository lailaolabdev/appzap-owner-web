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

const OPTION_PRICE_TYPE = {
    MONEY: "MONEY",
    PERCENT: "PERCENT"
}

export default function MenuListOption() {
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

  const [menuType, setMenuType] = useState(OPTION_PRICE_TYPE.MONEY);
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
        name: values?.name,
        price: values?.price,
        type: menuType,
      };

      console.log({createData})

    //   if (connectMenuId && connectMenuId !== "" && menuType === "MENUOPTION")
    //     createData = { ...createData, menuId: connectMenuId };
    //   const resData = await axios({
    //     method: "POST",
    //     url: END_POINT_SEVER + "/v3/menu/create",
    //     data: createData,
    //     headers: headers,
    //   });
    //   const _localData = await getLocalData();
    //   if (resData?.data) {
    //     setMenus(resData?.data);
    //     handleClose();
    //     // handleShow();
    //     setgetTokken(_localData);
    //     getMenu(_localData?.DATA?.storeId);
    //     setMenuType("MENU");
    //     setConnectMenuId("");
    //     successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
    //     values.name = "";
    //     values.name_en = "";
    //     values.name_cn = "";
    //     values.name_kr = "";
    //     values.quantity = "";
    //     values.categoryId = "";
    //     values.price = "";
    //     values.detail = "";
    //     values.unit = "";
    //   }
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
  const _updateMenuOption = async (values) => {
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };

    console.log({values})
    const updateData = {
        name: values?.name,
        price: values?.price,
        type: menuType,
    }

    console.log(updateData)

    // const resData = await axios({
    //   method: "PUT",
    //   url: END_POINT_SEVER + `/v3/menu/update`,
    //   data: {
    //     id: dataUpdate?._id,
    //     data: {
    //       recommended: values?.recommended,
    //       name: values?.name,
    //       name_en: values?.name_en,
    //       name_cn: values?.name_cn,
    //       name_kr: values?.name_kr,
    //       quantity: values?.quantity,
    //       categoryId: values?.categoryId,
    //       menuOptionId: menuOptions,
    //       price: values?.price,
    //       detail: values?.detail,
    //       unit: values?.unit,
    //       isOpened: isOpened,
    //       images: [...values?.images],
    //       type: values?.type,
    //       sort: values?.sort,
    //       menuOption: dataUpdateMenuOption,
    //     },
    //   },
    //   headers: headers,
    // });
    // if (resData?.data) {
    //   handleClose2();
    //   successAdd("ການແກ້ໄຂຂໍ້ມູນສຳເລັດ");
    // }
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
  const _menuOptionList = () => {
    navigate(`/settingStore/menu-option/limit/40/page/1/${params?.id}`);
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
                eventKey="/settingStore/menu-option"
                onClick={() => _menuOptionList()}
              >
                ອ໋ອບເຊິນ
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
            <Row style={{ marginTop: 14, marginBottom: 14, justifyContent: "flex-end" }}>
            <Col
                md="10"
                style={{
                  marginTop: 32,
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                ** ເຊັ່ນ: ຮ້ອນ,ເຢັນ,ປັ່ນ,ນ້ອຍ,ກາງ,ໃຫຍ່ (ບໍ່ຕັດສະຕ໋ອກ)
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
                  + ເພີ່ມອ໋ອບຊັນໃຫມ່
                </Button>
              </Col>
            </Row>
          </Col>

          <Col md="12">
            <table className="table table-hover" style={{ minWidth: 700 }}>
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ຊື່ອ໋ອບຊັນ</th>
                  <th scope="col">ລາຄາທີ່ຈະເພີ່ມຂຶ້ນ</th>
                  <th scope="col">ຈັດການ</th>
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
            <Modal.Title>ເພີ່ມອ໋ອບຊັນ</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              name: ""
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = "ກະລຸນາປ້ອນຊື່";
              }

              if (parseInt(values.price) < 0 || isNaN(parseInt(values.price))) {
                errors.price = "ກະລຸນາປ້ອນລາຄາທີ່ເພີ່ມຂຶ້ນ";
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
                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>ຊື່ອ໋ອບຊັນ</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          placeholder="ຊື່ອ໋ອບຊັນ..."
                          style={{
                            border:
                              errors.name && touched.name && errors.name
                                ? "solid 1px red"
                                : "",
                          }}
                        />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>ລາຄາທີ່ຈະເພີ່ມຂຶ້ນ</Form.Label>
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

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control
                        as="select"
                        name="menuType"
                        onChange={handleChangeMenuType}
                        value={menuType}
                        >
                        <option value={OPTION_PRICE_TYPE.MONEY}>ເງິນ</option>
                        <option value={OPTION_PRICE_TYPE.PERCENT}>%</option>
                        </Form.Control>
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
            <Modal.Title>ອັບເດດອ໋ອບຊັນ</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              name: dataUpdate?.name,
              price: dataUpdate?.price,
              type: dataUpdate?.type,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = "ກະລຸນາປ້ອນຊື່ອ໋ອບຊັນ...";
              }
              if (parseInt(values.price) < 0 || isNaN(parseInt(values.price))) {
                errors.price = "ກະລຸນາປ້ອນລາຄາ...";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              const getData = async () => {
                await _updateMenuOption(values);
                // const _localData = await getLocalData();
                // if (_localData) {
                //   setgetTokken(_localData);
                //   getMenu(_localData?.DATA?.storeId, filterCategory);
                // }
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
                <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>ຊື່ອ໋ອບຊັນ</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.name}
                          placeholder="ຊື່ອ໋ອບຊັນ..."
                          style={{
                            border:
                              errors.name && touched.name && errors.name
                                ? "solid 1px red"
                                : "",
                          }}
                        />
                    </Form.Group>

                    <Form.Group controlId="exampleForm.ControlInput1">
                        <Form.Label>ລາຄາທີ່ຈະເພີ່ມຂຶ້ນ</Form.Label>
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

                    <Form.Group controlId="exampleForm.ControlSelect1">
                        <Form.Control
                        as="select"
                        name="menuType"
                        onChange={handleChangeMenuType}
                        value={menuType}
                        >
                        <option value={"MONEY"}>ເງິນ</option>
                        <option value={"PERCENT"}>%</option>
                        </Form.Control>
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
