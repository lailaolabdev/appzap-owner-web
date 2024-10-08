//React and Third-Party Libraries
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Form, Nav, Breadcrumb } from "react-bootstrap";

// Local Imports
import Box from "../../components/Box";
import { useStore } from "../../store";
import { getLocalData, END_POINT_SEVER } from "../../constants/api";
import { BODY, COLOR_APP } from "../../constants";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import { getHeaders } from "../../services/auth";

// Styles and Resources

export default function FoodTypeList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  // State
  const [getTokken, setgetTokken] = useState();
  const { storeDetail } = useStore();
  const [CATEGORY, setCATEGORY] = useState();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  //--> modal delete
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const [dateDelete, setdateDelete] = useState("");
  const handleShow3 = (id, name) => {
    setdateDelete({ name, id });
    setShow3(true);
  };
  //--> update
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [dataUpdate, setdataUpdate] = useState("");
  const [Categorys, setCategorys] = useState([]);

  // Function
  const handleShow2 = async (item) => {
    setdataUpdate(item);
    setShow2(true);
  };
  // =======>
  const _confirmeDelete = async () => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      let _resData = await axios.delete(
        // CATEGORY + `/${dateDelete?.id}`
        END_POINT_SEVER + `/v3/category/delete/${dateDelete?.id}`,
        {
          headers: headers,
        }
      );
      if (_resData?.data) {
        setCategorys(_resData?.data);
        handleClose3();
        successAdd("ລົບຂໍ້ມູນສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ລົບຂໍ້ມູນບໍ່ສຳເລັດ !");
    }
  };
  const _createCategory = async (values) => {
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    const resData = await axios({
      method: "POST",
      url: END_POINT_SEVER + "/v3/category/create",
      data: {
        storeId: getTokken?.DATA?.storeId,
        name: values?.name,
        name_en: values?.name_en,
        name_cn: values?.name_cn,
        name_kr: values?.name_kr,
        note: values?.note,
        sort: values?.sort,
      },
      headers: headers,
    })
      .then(async function (response) {
        setCategorys(response?.data);
        handleClose();
        successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
      })
      .catch(function (error) {
        errorAdd("ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !");
      });
  };
  const _updateCategory = async (values) => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const resData = await axios.put(
        END_POINT_SEVER + `/v3/category/update`,
        {
          id: dataUpdate?._id,
          data: {
            name: values?.name,
            name_en: values?.name_en,
            name_cn: values?.name_cn,
            name_kr: values?.name_kr,
            note: values?.note,
            sort: values?.sort,
          },
        },
        {
          headers: headers,
        }
      );
      if (resData?.data) {
        // setCategorys(resData?.data);
        getData(getTokken?.DATA?.storeId);
        setShow2(false);
        successAdd(t("update_success"));
      }
    } catch (err) {
      errorAdd(t("update_fail"));
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setgetTokken(_localData);
        getData(_localData?.DATA?.storeId);
      }
    };
    fetchData();
  }, []);

  const getData = async (id) => {
    setIsLoading(true);
    const _resCategory = await axios({
      method: "get",
      url: END_POINT_SEVER + `/v3/categories?isDeleted=false&storeId=${id}`,
    });
    console.log("-----", _resCategory?.data);
    setCategorys(_resCategory?.data);
    setIsLoading(false);
  };
  const _menuList = () => {
    navigate(`/food-setting/limit/40/page/1/`);
  };
  const _category = () => {
    navigate(`/food-setting/food-type/limit/40/page/1`);
  };
  const _setting = () => {
    navigate(`/settingStore/${storeDetail?._id}`);
  };

  const getCate = async (id) => {
    try {
      await fetch(CATEGORY + `/?storeId=${id}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
          setCATEGORY(json);
        });
    } catch (err) {
      console.log(err);
    }
  };

  const _changeStatusCate = async (id, isShowCategory, index) => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      await axios({
        method: "PUT",
        url: END_POINT_SEVER + `/v3/category/update/`,
        data: {
          id: id,
          data: {
            isShowCategory: !isShowCategory,
          },
        },
        headers: headers,
      });

      let _newData = [...Categorys];

      _newData[index].isShowCategory = !isShowCategory;
      setCategorys(_newData);
    } catch (err) {
      console.log("err:", err);
    }
  };
  //New Section End Here

  return (
    <div style={BODY}>
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => _setting()}>
            ຕັ້ງຄ່າຮ້ານອາຫານ
          </Breadcrumb.Item>
          <Breadcrumb.Item active>ປະເພດອາຫານ</Breadcrumb.Item>
        </Breadcrumb>
        <div>
          <Nav variant="tabs" defaultActiveKey="/settingStore/category">
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
                {t("food_type")}
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </div>
        <div style={{ padding: 20, borderRadius: 8 }}>
          <div className="col-sm-12 text-right">
            <Button
              style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
              onClick={handleShow}
            >
              + {t("add_food_type")}
            </Button>{" "}
          </div>
          <div style={{ height: 20 }}></div>
          <div>
            <div className="col-sm-12">
              <table className="table table-hover">
                <thead className="thead-light">
                  <tr>
                    <th scope="col">{t("no")}</th>
                    <th scope="col">{t("food_type_name_lo")}</th>
                    <th scope="col">{t("food_type_name_en")}</th>
                    <th scope="col">{t("food_type_name_cn")}</th>
                    <th scope="col">{t("food_type_name_kr")}</th>
                    {/* <th scope="col">{t('note')}</th> */}
                    <th scope="col">{t("manage")}</th>
                  </tr>
                </thead>
                <tbody>
                  {Categorys &&
                    Categorys.map((data, index) => {
                      return (
                        <tr>
                          <td style={{ textAlign: "start" }}>{index + 1}</td>
                          <td style={{ textAlign: "start" }}>
                            {data?.name ?? ""}
                          </td>
                          <td style={{ textAlign: "start" }}>
                            {data?.name_en ?? ""}
                          </td>
                          <td style={{ textAlign: "start" }}>
                            {data?.name_cn ?? ""}
                          </td>
                          <td style={{ textAlign: "start" }}>
                            {data?.name_kr ?? ""}
                          </td>
                          {/* <td>{data?.note}</td> */}
                          <td style={{ textAlign: "start" }}>
                            <FontAwesomeIcon
                              icon={faEdit}
                              style={{ color: COLOR_APP }}
                              onClick={() => handleShow2(data)}
                            />
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              style={{ marginLeft: 20, color: "red" }}
                              onClick={() => handleShow3(data?._id, data?.name)}
                            />
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Formik
            initialValues={{
              name: "",
              name_en: "",
              name_cn: "",
              name_kr: "",
              note: "",
              sort: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = "ກະລຸນາປ້ອນຊື່ປະເພດອາຫານ...";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _createCategory(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                  <Modal.Title>ເພີ່ມປະເພດອາຫານ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label>ລຳດັບ</Form.Label>
                    <Form.Control
                      type="number"
                      name="sort"
                      placeholder="ລຳດັບ"
                      value={values?.sort}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ຊື່ປະເພດອາຫານ</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      placeholder="ຊື່ປະເພດອາຫານ..."
                    />
                  </Form.Group>
                  <div style={{ color: "red" }}>
                    {errors.name && touched.name && errors.name}
                  </div>

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ຊື່ປະເພດອາຫານພາສາອັງກິດ</Form.Label>
                    <Form.Control
                      type="text"
                      name="name_en"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name_en}
                      placeholder="ຊື່ປະເພດອາຫານພາສາອັງກິດ..."
                    />
                  </Form.Group>
                  <div style={{ color: "red" }}>
                    {errors.name_en && touched.name_en && errors.name_en}
                  </div>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ຊື່ປະເພດອາຫານພາສາຈີນ</Form.Label>
                    <Form.Control
                      type="text"
                      name="name_cn"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name_cn}
                      placeholder="ຊື່ປະເພດອາຫານພາສາຈີນ..."
                    />
                  </Form.Group>
                  <div style={{ color: "red" }}>
                    {errors.name_cn && touched.name_cn && errors.name_cn}
                  </div>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ຊື່ປະເພດອາຫານພາສາເກົາຫຼີ</Form.Label>
                    <Form.Control
                      type="text"
                      name="name_kr"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name_kr}
                      placeholder="ຊື່ປະເພດອາຫານພາສາເກົາຫຼີ..."
                    />
                  </Form.Group>
                  <div style={{ color: "red" }}>
                    {errors.name_kr && touched.name_kr && errors.name_kr}
                  </div>

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ໝາຍເຫດ</Form.Label>
                    <Form.Control
                      type="text"
                      name="note"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.note}
                      placeholder="ໝາຍເຫດ..."
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="danger" onClick={handleClose}>
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
        <Modal show={show2} onHide={handleClose2}>
          <Formik
            initialValues={{
              name: dataUpdate?.name,
              name_en: dataUpdate?.name_en,
              name_cn: dataUpdate?.name_cn,
              name_kr: dataUpdate?.name_kr,
              note: dataUpdate?.note,
              sort: dataUpdate?.sort,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = "ກະລຸນາປ້ອນຊື່ປະເພດອາຫານ...";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _updateCategory(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Header closeButton>
                  <Modal.Title>ແກ້ໄຂປະເພດອາຫານ</Modal.Title>
                </Modal.Header>
                <Modal.Body>
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
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ປະເພດອາຫານ</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                      placeholder="ຊື່ປະເພດອາຫານ..."
                    />
                  </Form.Group>
                  <div style={{ color: "red" }}>
                    {errors.name && touched.name && errors.name}
                  </div>

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ຊື່ປະເພດອາຫານພາສາອັງກິດ</Form.Label>
                    <Form.Control
                      type="text"
                      name="name_en"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name_en}
                      placeholder="ຊື່ປະເພດອາຫານພາສາອັງກິດ..."
                    />
                  </Form.Group>
                  <div style={{ color: "red" }}>
                    {errors.name_en && touched.name_en && errors.name_en}
                  </div>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ຊື່ປະເພດອາຫານພາສາຈີນ</Form.Label>
                    <Form.Control
                      type="text"
                      name="name_cn"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name_cn}
                      placeholder="ຊື່ປະເພດອາຫານພາສາຈີນ..."
                    />
                  </Form.Group>
                  <div style={{ color: "red" }}>
                    {errors.name_cn && touched.name_cn && errors.name_cn}
                  </div>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ຊື່ປະເພດອາຫານພາສາເກົາຫຼີ</Form.Label>
                    <Form.Control
                      type="text"
                      name="name_kr"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name_kr}
                      placeholder="ຊື່ປະເພດອາຫານພາສາເກົາຫຼີ..."
                    />
                  </Form.Group>
                  <div style={{ color: "red" }}>
                    {errors.name_kr && touched.name_kr && errors.name_kr}
                  </div>

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>ໝາຍເຫດ</Form.Label>
                    <Form.Control
                      type="text"
                      name="note"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.note}
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
        <Modal show={show3} onHide={handleClose3}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div style={{ textAlign: "center" }}>
              <div>ທ່ານຕ້ອງການລົບຂໍ້ມູນ? </div>
              <div style={{ color: "red" }}>{dateDelete?.name}</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose3}>
              ຍົກເລີກ
            </Button>
            <Button
              style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
              onClick={() => _confirmeDelete()}
            >
              ຢືນຢັນການລົບ
            </Button>
          </Modal.Footer>
        </Modal>
      </Box>
    </div>
  );
}
