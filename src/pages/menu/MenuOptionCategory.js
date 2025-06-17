import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  Modal,
  Form,
  Nav,
  Row,
  Col,
  Spinner,
  Breadcrumb,
} from "react-bootstrap";
import { BODY, COLOR_APP } from "../../constants";
import {
  MENUS,
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
} from "../../constants/api";
import { moneyCurrency } from "../../helpers";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import { getHeaders } from "../../services/auth";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { useNavigate, useParams } from "react-router-dom";
import Box from "../../components/Box";
import { useTranslation } from "react-i18next";
import { fontMap } from "../../utils/font-map";

const OPTION_PRICE_CURRENCY = {
  LAK: "LAK",
  THB: "THB",
  USD: "USD",
  CNY: "CNY",
};

export default function MenuOptionCategory() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();

  const [show, setShow] = useState(false);
  const [showAddMenus, setShowAddMenus] = useState(false);
  const [showCaution, setShowCaution] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show2, setShow2] = useState(false);
  const [show4, setShow4] = useState(false);
  const [isOpened, setIsOpened] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [getIdMenu, setGetIdMenu] = useState();
  const [qtyMenu, setQtyMenu] = useState(0);
  const [getTokken, setgetTokken] = useState();
  const [filterName, setFilterName] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [optionPriceCurrency, setOptionPriceCurrency] = useState(
    OPTION_PRICE_CURRENCY.LAK
  );
  const [dataMenuOption, setDataMenuOption] = useState([]);
  const [dataUpdateMenuOption, setDataUpdateMenuOption] = useState([]);
  const [detailMenu, setDetailMenu] = useState();
  const [Categorys, setCategorys] = useState();
  const [Menus, setMenus] = useState();
  const [menuOptions, setMenuOptions] = useState([]);
  const [menuOptionCategory, setMenuOptionCategory] = useState([]);
  const [dataUpdate, setdataUpdate] = useState("");
  const [dateDelete, setdateDelete] = useState("");
  const [chooseOnlyOne, setChooseOnlyOne] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _localData = await getLocalData();
        if (_localData) {
          setgetTokken(_localData);
          getcategory(_localData?.DATA?.storeId);
          getMenuOptions(_localData?.DATA?.storeId);
          getMenuOptionCategory(_localData?.DATA?.storeId);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (filterName || filterCategory) {
      const fetchFilter = async () => {
        try {
          const _localData = await getLocalData();
          setIsLoading(true);
          await fetch(
            MENUS +
            `/?storeId=${_localData?.DATA?.storeId}${filterCategory === "All" ? "" : `&categoryId=${filterCategory}`
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



  const handleClose = () => setShow(false);
  const handleShow = () => {
    setOptionPriceCurrency(OPTION_PRICE_CURRENCY.LAK); // Set default currency for create modal
    setShow(true);
  };
  const handleClose4 = () => setShow4(false);
  const handleShow3 = (id, name) => {
    setdateDelete({ name, id });
    setShow3(true);
  };
  const handleClose3 = () => setShow3(false);
  const handleShow2 = async (item) => {
    setdataUpdate(item);
    setDataUpdateMenuOption(item?.menuOption);
    setOptionPriceCurrency(item?.currency || OPTION_PRICE_CURRENCY.LAK); // Set currency based on item data for update modal
    setShow2(true);
  };
  const handleClose2 = () => setShow2(false);

  const getMenuOptions = async (storeId) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        END_POINT_SEVER_TABLE_MENU + `/v3/restaurant/${storeId}/menu-options`
      );
      setMenuOptions(res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const getMenuOptionCategory = async (storeId) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        END_POINT_SEVER_TABLE_MENU + `/v7/restaurant/${storeId}/menu-option-category`
      );
      setMenuOptionCategory(res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
    }
  };

  const _createMenuOptionCategory = async (values) => {
    try {
      const _localData = await getLocalData();
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const selectedOptions = values?.selectedOptions || [];
      if (selectedOptions.length === 0) {
        console.warn("No options selected");
      }
      // ແປ່ງ selectedOptions ຈາກ array ຂອງ string ເປັນ array ຂອງ objects
      const selectedOptionsWithPrice = selectedOptions.map(optionName => {
        const option = menuOptions.find(opt => opt.name === optionName);
        return {
          name: optionName,
          price: option ? option.price : 0
        };
      });
      const totalPrice = selectedOptionsWithPrice.reduce((total, option) => {
        return total + option.price;
      }, 0);

      const createData = {
        name: values?.name,
        selectedOptions: selectedOptionsWithPrice,
        price: totalPrice,
        isChooseOnlyOne: chooseOnlyOne,
        storeId: _localData?.DATA?.storeId,
      };

      const resData = await axios.post(`${END_POINT_SEVER_TABLE_MENU}/v7/restaurant/${_localData?.DATA?.storeId}/menu-option-category/create`,
        createData,
        { headers: headers }
      );

      if (resData?.data) {
        getMenuOptions(_localData?.DATA?.storeId);
        getMenuOptionCategory(_localData?.DATA?.storeId);
        handleClose();
        successAdd(t("add_success"));
      }
    } catch (err) {
      console.error("Error creating menu option category:", err);
      errorAdd(t("add_fail"));
    }
  };

  const _updateMenuOption = async (values) => {
    try {
      const _localData = await getLocalData();
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      const selectedOptions = values?.selectedOptions || [];

      if (selectedOptions.length === 0) {
        console.warn("No options selected");
      }

      const selectedOptionsWithPrice = selectedOptions.map(optionName => {
        const option = menuOptions.find(opt => opt.name === optionName);
        return {
          name: optionName,
          price: option ? option.price : 0
        };
      });

      const totalPrice = selectedOptionsWithPrice.reduce((total, option) => {
        return total + option.price;
      }, 0);

      const requestData = {
        data: {
          name: values?.name,
          selectedOptions: selectedOptionsWithPrice, 
          price: totalPrice,
          isChooseOnlyOne: values?.isChooseOnlyOne || false,
        }
      };

      const resData = await axios.put(`${END_POINT_SEVER_TABLE_MENU}/v7/restaurant/menu-option-category/${dataUpdate._id}/update`,
        requestData,
        { headers: headers }
      );

      if (resData?.data) {
        handleClose2();
        getMenuOptions(_localData?.DATA?.storeId);
        getMenuOptionCategory(_localData?.DATA?.storeId);
        successAdd(t("edit_success"));
      }
    } catch (err) {
      console.error("Error updating menu option category:", err);
      errorAdd(t("edit_failed"));
    }
  };


  const _confirmeDelete = async () => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const resData = await axios.delete(`${END_POINT_SEVER_TABLE_MENU}/v7/menu-option-category/${dateDelete?.id}/delete`,
        { headers: headers }
      );

      if (resData?.data) {
        getMenuOptions(getTokken?.DATA?.storeId);
        getMenuOptionCategory(getTokken?.DATA?.storeId);
        handleClose3();
        successAdd(t("delete_success"));
      }
    } catch (err) {
      errorAdd(t("delete_failed"));
    }
  };

  const handleChangeOptionPriceCurrency = (e) => {
    setOptionPriceCurrency(e.target.value);
  };

  const _menuList = () => {
    navigate(`/settingStore/menu/limit/40/page/1/${params?.id}`);
  };
  const _menuOptionList = () => {
    navigate(`/settingStore/menu-option/limit/40/page/1/${params?.id}`);
  };
  const _menuOptionListCategory = () => {
    navigate(`/settingStore/menu-option-category/limit/40/page/1/${params?.id}`);
  };
  const _category = () => {
    navigate(`/settingStore/menu/category/limit/40/page/1/${params?.id}`);
  };
  const _categoryType = () => {
    navigate(`/settingStore/menu/category-type`);
  };

  return (
    <div style={BODY}>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>
            <span className={fontMap[language]}>{t("restaurant_setting")}</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item active>
            <span className={fontMap[language]}>{t("ປະເພດອ໋ອບຊັນ")}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Nav variant="tabs" defaultActiveKey="/settingStore/menu-option">
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
                <span className={fontMap[language]}>{t("option_menu")}</span>
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="/settingStore/menu-option-category"
                onClick={() => _menuOptionListCategory()}
              >
                <span className={fontMap[language]}>{t("ປະເພດອ໋ອບຊັນ")}</span>
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
                eventKey="/settingStore/category-type"
                onClick={() => _categoryType()}
              >
                <span className={fontMap[language]}>{t("categoryType")}</span>
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>

        <Row>
          <Col sm="12">
            <Row
              style={{
                marginTop: 14,
                marginBottom: 14,
                justifyContent: "flex-end",
              }}
            >


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
                  + {t("ເພີ່ມປະເພດອ໋ອບຊັນ")}
                </Button>
              </Col>
            </Row>
          </Col>

          <Col md="12">
            <table className="table table-hover" style={{ minWidth: 700 }}>
              <thead className="thead-light">
                <tr>
                  <th scope="col" className={fontMap[language]}>
                    #
                  </th>
                  <th scope="col" className={fontMap[language]}>
                    {t("ຊື່ປະເພດອ໋ອບຊັນ")}
                  </th>
                  {/* <th scope="col" className={fontMap[language]}>
                    {t("price_addjust")}
                  </th> */}
                  <th scope="col" className={fontMap[language]}>
                    {t("ຈັດການປະເພດອ໋ອບຊັນ")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={9}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                ) : (
                  menuOptionCategory?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td style={{ textAlign: "left", display: "flex", alignItems: "center" }}>
                          <div>
                            {data?.name ?? ""}:
                            {data?.selectedOptions?.length > 0 && (
                              <span style={{ marginLeft: 5 }}>
                                (
                                {data?.selectedOptions.map((option, idx) => (
                                  <span key={idx}>
                                    {option?.name} 
                                    {idx < data?.selectedOptions.length - 1 ? ", " : ""}
                                  </span>
                                ))}
                                )
                              </span>
                            )}
                          </div>
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

        {/* add menu */}
        <Modal show={show} onHide={handleClose} size="lg" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>{t("ເພີ່ມປະເພດອ໋ອບຊັນ")}</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              name: "",
              price: 0,
              currency: OPTION_PRICE_CURRENCY.LAK,
              selectedOptions: [],
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = "Please Enter Option Name...";
              }
              if (parseInt(values.price) < 0 || isNaN(parseInt(values.price))) {
                errors.price = "Please Enter Price Adjustment...";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _createMenuOptionCategory(values);
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
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("ຊື່ປະເພດອ໋ອບຊັນ")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      placeholder={t("enter_options_name")}
                      style={{
                        border:
                          errors.name && touched.name && errors.name
                            ? "solid 1px red"
                            : "",
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="allowMultipleSelection" style={{ marginBottom: "20px" }}>
                    <Form.Check
                      type="checkbox"
                      id="allowMultipleSelection"
                      label="ສາມາດເລືອກໄດ້ອັນດຽວ"
                      checked={values.allowMultipleSelection}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setChooseOnlyOne(isChecked);
                      }}
                      style={{ fontSize: "16px", fontWeight: "500" }}
                    />
                  </Form.Group>

                  {/* ສະແດງ Menu Options */}
                  <Form.Group controlId="menuOptionsSelect">
                    <Form.Label>ເລືອກລາຍການອ໋ອບຊັນ</Form.Label>
                    <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #dee2e6", borderRadius: "4px", padding: "10px" }}>
                      {menuOptions && menuOptions.length > 0 ? (
                        menuOptions.map((option, index) => (
                          <Form.Check
                            key={option._id}
                            type="checkbox"
                            id={`option-${option._id}`}
                            label={
                              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                <span>{option?.name}</span>
                                {/* <span style={{ color: "#888", marginLeft: "10px" }}>
                                  {option?.price > 0
                                    ? `${moneyCurrency(option?.price)} ${option?.currency}`
                                    : ""}
                                </span> */}

                              </div>
                            }
                            checked={values.selectedOptions.includes(option.name)}
                            onChange={(e) => {
                              const optionName = option.name;
                              const currentSelected = values.selectedOptions;

                              if (e.target.checked) {

                                setFieldValue("selectedOptions", [...currentSelected, optionName]);
                              } else {

                                setFieldValue("selectedOptions", currentSelected.filter(name => name !== optionName));
                              }
                            }}
                            style={{ marginBottom: "8px" }}
                          />
                        ))
                      ) : (
                        <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>
                          ບໍ່ມີລາຍການອ໋ອບຊັນໃນລາຍການນີ້
                        </div>
                      )}
                    </div>
                  </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleClose}>
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
        <Modal show={show2} onHide={handleClose2} keyboard={false} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{t("update_options")}</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              name: dataUpdate?.name || "",
              selectedOptions: dataUpdate?.selectedOptions?.map(option => option.name) || [],
              isChooseOnlyOne: dataUpdate?.isChooseOnlyOne || false,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = "ກະລຸນາປ້ອນຊື່ອ໋ອບຊັນ...";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _updateMenuOption(values);
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
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("options_name")}</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      placeholder={t("enter_options_name")}
                      style={{
                        border:
                          errors.name && touched.name && errors.name
                            ? "solid 1px red"
                            : "",
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="allowMultipleSelection" style={{ marginBottom: "20px" }}>
                    <Form.Check
                      type="checkbox"
                      id="allowMultipleSelection"
                      label="ສາມາດເລືອກໄດ້ອັນດຽວ"
                      checked={values.isChooseOnlyOne} // เปลี่ยนจาก values.allowMultipleSelection เป็น values.isChooseOnlyOne
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setChooseOnlyOne(isChecked);
                        setFieldValue("isChooseOnlyOne", isChecked); // อัปเดต form value
                      }}
                      style={{ fontSize: "16px", fontWeight: "500" }}
                    />
                  </Form.Group>

                  {/* ສະແດງ Menu Options */}
                  <Form.Group controlId="menuOptionsSelectUpdate">
                    <Form.Label>ເລືອກລາຍການອ໋ອບຊັນ</Form.Label>
                    <div style={{ maxHeight: "200px", overflowY: "auto", border: "1px solid #dee2e6", borderRadius: "4px", padding: "10px" }}>
                      {menuOptions && menuOptions.length > 0 ? (
                        menuOptions.map((option, index) => (
                          <Form.Check
                            key={option._id}
                            type="checkbox"
                            id={`update-option-${option._id}`}
                            label={
                              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                                <span>{option?.name}</span>
                                {/* <span style={{ color: "#888", marginLeft: "10px" }}>
                                  {option?.price > 0
                                    ? `${moneyCurrency(option?.price)} ${option?.currency}`
                                    : ""}
                                </span> */}
                              </div>
                            }
                            checked={values.selectedOptions.includes(option.name)}
                            onChange={(e) => {
                              const optionName = option.name;
                              const currentSelected = values.selectedOptions;

                              if (e.target.checked) {
                                setFieldValue("selectedOptions", [...currentSelected, optionName]);
                              } else {
                                setFieldValue("selectedOptions", currentSelected.filter(name => name !== optionName));
                              }
                            }}
                            style={{ marginBottom: "8px" }}
                          />
                        ))
                      ) : (
                        <div style={{ textAlign: "center", color: "#666", padding: "20px" }}>
                          ບໍ່ມີລາຍການອ໋ອບຊັນໃນລາຍການນີ້
                        </div>
                      )}
                    </div>
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
      </Box>
    </div>
  );
}
