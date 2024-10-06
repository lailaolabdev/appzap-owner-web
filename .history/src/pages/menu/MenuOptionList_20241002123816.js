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
import { MENUS, getLocalData, END_POINT_SEVER } from "../../constants/api";
import { moneyCurrency } from "../../helpers";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import { getHeaders } from "../../services/auth";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import { useNavigate, useParams } from "react-router-dom";
import Box from "../../components/Box";
import { useTranslation } from "react-i18next";

const OPTION_PRICE_CURRENCY = {
  LAK: "LAK",
  THB: "THB",
  USD: "USD",
};

export default function MenuListOption() {
  const { t } = useTranslation();
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
  const [dataUpdate, setdataUpdate] = useState("");
  const [dateDelete, setdateDelete] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _localData = await getLocalData();
        if (_localData) {
          setgetTokken(_localData);
          getcategory(_localData?.DATA?.storeId);
          getMenuOptions(_localData?.DATA?.storeId);
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

  const getMenuOptions = async (storeId) => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        END_POINT_SEVER + `/v3/restaurant/${storeId}/menu-options`
      );
      setMenuOptions(res.data);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setIsLoading(false);
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

  const _createMenuOption = async (values) => {
    try {
      const _localData = await getLocalData();
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      const createData = {
        name: values?.name,
        price: values?.price,
        storeId: _localData?.DATA?.storeId,
        currency: optionPriceCurrency,
      };

      const resData = await axios.post(
        END_POINT_SEVER +
          `/v3/restaurant/${_localData?.DATA?.storeId}/menu-option/create`,
        createData,
        { headers: headers }
      );

      if (resData?.data) {
        getMenuOptions(_localData?.DATA?.storeId);
        handleClose();
        successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !");
    }
  };

  const _updateMenuOption = async (values) => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      const updateData = {
        name: values?.name,
        price: values?.price,
        currency: optionPriceCurrency,
      };

      const resData = await axios.put(
        END_POINT_SEVER +
          `/v3/restaurant/${getTokken?.DATA?.storeId}/menu-option/${dataUpdate._id}/update`,
        updateData,
        { headers: headers }
      );

      if (resData?.data) {
        handleClose2();
        getMenuOptions(getTokken?.DATA?.storeId);
        successAdd("ການແກ້ໄຂຂໍ້ມູນສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ການແກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ !");
    }
  };

  const _confirmeDelete = async () => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      const resData = await axios.delete(
        END_POINT_SEVER + `/v3/menu-option/${dateDelete?.id}/delete`,
        { headers: headers }
      );

      if (resData?.data) {
        getMenuOptions(getTokken?.DATA?.storeId);
        handleClose3();
        successAdd("ການລົບຂໍ້ມູນສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ການລົບຂໍ້ມູນບໍ່ສຳເລັດ !");
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
  const _category = () => {
    navigate(`/settingStore/menu/category/limit/40/page/1/${params?.id}`);
  };

  return (
    <div style={BODY}>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("restaurant_setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("option_menu")}</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Nav variant="tabs" defaultActiveKey="/settingStore/menu-option">
            <Nav.Item>
              <Nav.Link
                eventKey="/settingStore/menu"
                onClick={() => _menuList()}
              >
                {t("menu")}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="/settingStore/menu-option"
                onClick={() => _menuOptionList()}
              >
                {t("option_menu")}
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="/settingStore/category"
                onClick={() => _category()}
              >
                {t("food_type")}
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
                  + {t("add_new_options")}
                </Button>
              </Col>
            </Row>
          </Col>

          <Col md="12">
            <table className="table table-hover" style={{ minWidth: 700 }}>
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">{t("options_name")}</th>
                  <th scope="col">{t("price_addjust")}</th>
                  <th scope="col">{t("manage_options")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <td colSpan={9}>
                    <Spinner animation="border" variant="warning" />
                  </td>
                ) : (
                  menuOptions?.map((data, index) => {
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td style={{ textAlign: "left" }}>
                          {data?.name ?? ""}
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

        {/* add menu */}
        <Modal show={show} onHide={handleClose} size="lg" keyboard={false}>
          <Modal.Header closeButton>
            <Modal.Title>{t("add_options")}</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              name: "",
              price: 0,
              currency: OPTION_PRICE_CURRENCY.LAK,
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
              _createMenuOption(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
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
                      placeholder="Enter Option Name..."
                      style={{
                        border:
                          errors.name && touched.name && errors.name
                            ? "solid 1px red"
                            : "",
                      }}
                    />
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("price_addjust")}</Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values?.price}
                      placeholder="Enter price adjustment..."
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
                      name="optionPriceCurrency"
                      onChange={handleChangeOptionPriceCurrency}
                      value={optionPriceCurrency}
                    >
                      <option value={OPTION_PRICE_CURRENCY.LAK}>LAK</option>
                      <option value={OPTION_PRICE_CURRENCY.THB}>THB</option>
                      <option value={OPTION_PRICE_CURRENCY.USD}>USD</option>
                    </Form.Control>
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
            <Modal.Title>ອັບເດດອ໋ອບຊັນ</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              name: dataUpdate?.name,
              price: dataUpdate?.price,
              currency: dataUpdate?.currency,
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
                      name="optionPriceCurrency"
                      onChange={handleChangeOptionPriceCurrency}
                      value={optionPriceCurrency}
                    >
                      <option value={OPTION_PRICE_CURRENCY.LAK}>LAK</option>
                      <option value={OPTION_PRICE_CURRENCY.THB}>THB</option>
                      <option value={OPTION_PRICE_CURRENCY.USD}>USD</option>
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
      </Box>
    </div>
  );
}
