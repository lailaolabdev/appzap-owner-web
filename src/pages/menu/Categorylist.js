import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Form, Nav, Breadcrumb } from "react-bootstrap";
import { BODY, COLOR_APP } from "../../constants";
import {
  CATEGORY,
  getLocalData,
  END_POINT_SEVER_TABLE_MENU,
} from "../../constants/api";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import { getHeaders } from "../../services/auth";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Box from "../../components/Box";

export default function Categorylist() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const [getTokken, setgetTokken] = useState();

  const [CATEGORY, setCATEGORY] = useState();

  // create
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // modal delete
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const handleShow3 = (id, name) => {
    setdateDelete({ name, id });
    setShow3(true);
  };
  // update
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [dateDelete, setdateDelete] = useState("");
  const [dataUpdate, setdataUpdate] = useState("");
  const [Categorys, setCategorys] = useState([]);
  const [categorysType, setCategorysType] = useState([]);

  const handleShow2 = async (item) => {
    // console.log("ITEM: ", item.categoryTypeId.name);
    setdataUpdate(item);
    setShow2(true);
  };
  // =======>
  const _confirmeDelete = async () => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const _resData = await axios.delete(
        // CATEGORY + `/${dateDelete?.id}`
        END_POINT_SEVER_TABLE_MENU + `/v3/category/delete/${dateDelete?.id}`,
        {
          headers: headers,
        }
      );
      if (_resData?.data) {
        setCategorys(_resData?.data);
        handleClose3();
        successAdd(`${t("delete_success")}`);
      }
    } catch (err) {
      errorAdd(`${t("delete_fail")}`);
    }
  };
  const _createCategory = async (values) => {
    // console.log("DATA VALUES: ", values.categoryTypeId);
    const header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    const resData = await axios({
      method: "POST",
      url: END_POINT_SEVER_TABLE_MENU + "/v3/category/create",
      data: {
        storeId: getTokken?.DATA?.storeId,
        name: values?.name,
        name_en: values?.name_en,
        name_cn: values?.name_cn,
        name_kr: values?.name_kr,
        note: values?.note,
        sort: values?.sort,
        categoryTypeId: values?.categoryTypeId,
      },
      headers: headers,
    })
      .then(async (response) => {
        setCategorys(response?.data);
        handleClose();
        successAdd(`${t("add_success")}}`);
      })
      .catch((error) => {
        errorAdd(`${t("add_fail")}`);
      });
  };
  const _updateCategory = async (values) => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      console.log("============>", values);

      const resData = await axios.put(
        END_POINT_SEVER_TABLE_MENU + `/v3/category/update`,
        {
          id: dataUpdate?._id,
          data: {
            name: values?.name,
            name_en: values?.name_en,
            name_cn: values?.name_cn,
            name_kr: values?.name_kr,
            note: values?.note,
            sort: values?.sort,
            categoryTypeId: values?.categoryTypeId,
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
        successAdd(`${t("edit_success")}`);
      }
    } catch (err) {
      errorAdd(`${t("edit_fail")}`);
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setgetTokken(_localData);
        getData(_localData?.DATA?.storeId);
        getCategoryTypeData(_localData?.DATA?.storeId);
      }
    };
    fetchData();
  }, []);

  const getData = async (id) => {
    setIsLoading(true);
    const _resCategory = await axios({
      method: "get",
      url:
        END_POINT_SEVER_TABLE_MENU +
        `/v3/categories?isDeleted=false&storeId=${id}`,
    });
    console.log("-----", _resCategory?.data);
    setCategorys(_resCategory?.data);
    setIsLoading(false);
  };

  const getCategoryTypeData = async (id) => {
    setIsLoading(true);
    const _resCategoryType = await axios({
      method: "get",
      url: END_POINT_SEVER_TABLE_MENU + `/v3/category-type?storeId=${id}`,
    });
    setCategorysType(_resCategoryType?.data?.data);
    setIsLoading(false);
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

  ////New Section Here

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

  const _changeStatusCate = async (id, showForCustomer, index) => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      await axios({
        method: "PUT",
        url: END_POINT_SEVER_TABLE_MENU + `/v3/category/update/`,
        data: {
          id: id,
          data: {
            showForCustomer: !showForCustomer,
          },
        },
        headers: headers,
      });

      const _newData = [...Categorys];

      _newData[index].showForCustomer = !showForCustomer;
      setCategorys(_newData);
    } catch (err) {
      console.log("err:", err);
    }
  };
  //New Section End Here

  return (
    <div style={BODY}>
      <Breadcrumb>
        <Breadcrumb.Item>{t("restaurant_setting")}</Breadcrumb.Item>
        <Breadcrumb.Item active>{t("food_type")}</Breadcrumb.Item>
      </Breadcrumb>
      <div>
        <Nav variant="tabs" defaultActiveKey="/settingStore/category">
          <Nav.Item>
            <Nav.Link eventKey="/settingStore/menu" onClick={() => _menuList()}>
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
          <Nav.Item>
            <Nav.Link
              eventKey="/settingStore/category-type"
              onClick={() => _categoryType()}
            >
              {t("categoryType")}
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>

      <div>
        <div className="col-sm-12 text-right">
          <Button
            className="col-sm-2"
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={handleShow}
          >
            {t("addFoodType")}
          </Button>{" "}
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <div
            className="col-sm-12"
            style={{
              overflowX: "auto",
            }}
          >
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("no")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("foodTypeName")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("foodTypeName")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("foodTypeName")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("foodTypeName")}
                  </th>
                  {/* <th scope="col">{t('note')}</th> */}
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("manage")}
                  </th>
                  <th style={{ textWrap: "nowrap" }} scope="col">
                    {t("status")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {Categorys &&
                  Categorys.map((data, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{data?.name ?? ""}</td>
                        <td>{data?.name_en ?? ""}</td>
                        <td>{data?.name_cn ?? ""}</td>
                        <td>{data?.name_kr ?? ""}</td>
                        {/* <td>{data?.categoryTypeId?.name ?? ""}</td> */}
                        <td>
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
                        {/*adamHere*/}
                        <td
                          style={{
                            color: data?.showForCustomer ? "green" : "red",
                          }}
                        >
                          <label className="switch">
                            <input
                              type="checkbox"
                              checked={data?.showForCustomer}
                              onClick={() =>
                                _changeStatusCate(
                                  data?._id,
                                  data?.showForCustomer,
                                  index
                                )
                              }
                            />
                            <span className="slider round"></span>
                          </label>
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
            categoryTypeId: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = `${t("foodTypeName")}`;
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
                <Modal.Title>{t("add_food_type")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>{t("no")}</Form.Label>
                  <Form.Control
                    type="number"
                    name="sort"
                    placeholder={t("no_")}
                    value={values?.sort}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("type_name")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder={t("type_name")}
                  />
                </Form.Group>
                <div style={{ color: "red" }}>
                  {errors.name && touched.name && errors.name}
                </div>

                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("type_name_en")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_en"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name_en}
                    placeholder={t("type_name_en")}
                  />
                </Form.Group>
                <div style={{ color: "red" }}>
                  {errors.name_en && touched.name_en && errors.name_en}
                </div>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("type_name_cn")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_cn"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name_cn}
                    placeholder={t("type_name_cn")}
                  />
                </Form.Group>
                <div style={{ color: "red" }}>
                  {errors.name_cn && touched.name_cn && errors.name_cn}
                </div>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("type_name_kr")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_kr"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name_kr}
                    placeholder={t("type_name_kr")}
                  />
                </Form.Group>
                <div style={{ color: "red" }}>
                  {errors.name_kr && touched.name_kr && errors.name_kr}
                </div>

                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("note")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="note"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.note}
                    placeholder={t("note")}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("categories")}</Form.Label>
                  <Form.Control
                    as="select"
                    name="categoryTypeId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.categoryTypeId}
                  >
                    <option value="">{t("chose_type")}</option>
                    {categorysType &&
                      categorysType.map((data, index) => (
                        <option key={"categorytype" + index} value={data._id}>
                          {data.name}
                        </option>
                      ))}
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
      <Modal show={show2} onHide={handleClose2}>
        <Formik
          initialValues={{
            name: dataUpdate?.name ?? "",
            name_en: dataUpdate?.name_en,
            name_cn: dataUpdate?.name_cn,
            name_kr: dataUpdate?.name_kr,
            note: dataUpdate?.note,
            sort: dataUpdate?.sort,
            categoryTypeId: dataUpdate?.categoryTypeId,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = `${t("fill_type_name")}`;
            }

            console.log("CATEGORYID: ", values.categoryTypeId);

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
                <Modal.Title>{t("edit_food_type")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group>
                  <Form.Label>{t("no")}</Form.Label>
                  <Form.Control
                    type="number"
                    name="sort"
                    placeholder={t("no")}
                    value={values.sort}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("food_type")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder={t("food_type")}
                  />
                </Form.Group>
                <div style={{ color: "red" }}>
                  {errors.name && touched.name && errors.name}
                </div>

                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("type_name_en")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_en"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name_en}
                    placeholder={t("type_name_en")}
                  />
                </Form.Group>
                <div style={{ color: "red" }}>
                  {errors.name_en && touched.name_en && errors.name_en}
                </div>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("type_name_cn")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_cn"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name_cn}
                    placeholder={t("type_name_cn")}
                  />
                </Form.Group>
                <div style={{ color: "red" }}>
                  {errors.name_cn && touched.name_cn && errors.name_cn}
                </div>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("type_name_kr")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_kr"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name_kr}
                    placeholder={t("type_name_kr")}
                  />
                </Form.Group>
                <div style={{ color: "red" }}>
                  {errors.name_kr && touched.name_kr && errors.name_kr}
                </div>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("note")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="note"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.note}
                    placeholder={t("note")}
                  />
                </Form.Group>

                {/* <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>categories</Form.Label>
                  <Form.Control
                    type="text"
                    name="category"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.categoryTypeId?.name ?? ""}
                    placeholder={t("note")}
                  />
                </Form.Group> */}
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("food_title")}</Form.Label>
                  <Form.Control
                    as="select"
                    name="categoryTypeId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.categoryTypeId}
                  >
                    <option value="">
                      {dataUpdate?.categoryTypeId?.name ?? t("chose_type")}
                    </option>
                    {categorysType &&
                      categorysType.map((data, index) => (
                        <option key={"categorytype" + index} value={data._id}>
                          {data.name}
                        </option>
                      ))}
                  </Form.Control>
                </Form.Group>
                {/* <>
                  <select>
                    <option value="All">
                      {dataUpdate?.categoryTypeId?.name ?? "ເລືອກປະເພດ"}
                    </option>
                    {categorysType &&
                      categorysType?.map((data, index) => {
                        return (
                          <option
                            key={"categorytype" + index}
                            value={data?._id}
                          >
                            {data?.name}
                          </option>
                        );
                      })}
                  </select>
                </> */}
                {/* {dataUpdate?.categoryTypeId?.name ?? ""} */}
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
      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <div>{t("would_delete")}? </div>
            <div style={{ color: "red" }}>{dateDelete?.name}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
            {t("cancel")}
          </Button>
          <Button
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => _confirmeDelete()}
          >
            {t("approve_delete")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
