import { React, useState, useEffect } from "react";
import { getHeaders } from "../../services/auth";
import { Formik } from "formik";
import Box from "../../components/Box";
import axios from "axios";
import { BODY, COLOR_APP } from "../../constants";
import { Button, Modal, Form, Nav, Breadcrumb } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { END_POINT_SEVER_TABLE_MENU, getLocalData } from "../../constants/api";
import PopUpAddCategoryType from "../../components/popup/PopUpAddCategoryType";
import { getCategoryType } from "../../services/menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { faCubes } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { successAdd, errorAdd } from "./../../helpers/sweetalert";
import { fontMap } from "../../utils/font-map";
import { cn } from "../../utils/cn";

export default function CategoryType() {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const [popup, setPopup] = useState();
  const [storeId, setStoreId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [categoryTypes, setCategoryTypes] = useState([]);
  const [categorysType, setCategoryType] = useState([]);
  const [getTokken, setgetTokken] = useState();
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [dateDelete, setdateDelete] = useState("");
  const [dataUpdate, setdataUpdate] = useState("");
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

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setStoreId(_localData.DATA.storeId);
        fetchCategoryTypes(_localData?.DATA?.storeId);
        setgetTokken(_localData);
      }
    };
    fetchData();
  }, []);

  const fetchCategoryTypes = async (storeId) => {
    setIsLoading(true);
    const data = await getCategoryType(storeId);
    console.log({ data });
    setCategoryTypes(data);
    setIsLoading(false);
  };

  const createCategoryType = async (values) => {
    setIsLoading(true);
    try {
      await axios.post(
        `${END_POINT_SEVER_TABLE_MENU}/v3/category-type`,
        values
      );
      const _localData = await getLocalData();
      fetchCategoryTypes(_localData?.DATA?.storeId);
    } catch (error) {
      console.error("Error creating category type:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleShow2 = async (item) => {
    // console.log("ITEM: ", item.categoryTypeId.name);
    setdataUpdate(item);
    setShow2(true);
  };

  const handleShow3 = (id, name) => {
    setdateDelete({ name, id });
    setShow3(true);
  };

  const handleClose3 = () => setShow3(false);
  const handleClose2 = () => setShow2(false);

  // const getData = async (id) => {
  //   setIsLoading(true);
  //   const _resCategory = await axios({
  //     method: "get",
  //     url: END_POINT_SEVER_TABLE_MENU + `/v3/category-type`,
  //   });
  //   console.log("-----", _resCategory?.data);
  //   setCategoryType(_resCategory?.data);
  //   setIsLoading(false);
  // };

  const _updateCategory = async (values) => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      const resData = await axios.put(
        END_POINT_SEVER_TABLE_MENU + `/v3/update/category-type`,
        {
          id: dataUpdate?._id,
          data: {
            name: values?.name,
          },
        },
        {
          headers: headers,
        }
      );
      if (resData?.data) {
        setCategoryType(resData?.data);
        fetchCategoryTypes(getTokken?.DATA?.storeId);
        setShow2(false);
        successAdd(`${t("edit_success")}`);
      }
    } catch (err) {
      errorAdd(`${t("edit_fail")}`);
    }
  };

  const _confirmeDelete = async () => {
    try {
      const header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const _resData = await axios.delete(
        END_POINT_SEVER_TABLE_MENU +
          `/v3/delete/category-type/${dateDelete?.id}`,
        {
          headers: headers,
        }
      );
      if (_resData?.data) {
        setCategoryType(_resData?.data);
        handleClose3();
        successAdd(`${t("delete_success")}`);
        fetchCategoryTypes(getTokken?.DATA?.storeId);
      }
    } catch (err) {
      errorAdd(`${t("delete_fail")}`);
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
            <span className={fontMap[language]}>{t("categoryType")}</span>
          </Breadcrumb.Item>
        </Breadcrumb>
        <Nav variant="tabs" defaultActiveKey="/settingStore/category-type">
          <Nav.Item>
            <Nav.Link eventKey="/settingStore/menu" onClick={() => _menuList()}>
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
              eventKey="/settingStore/category"
              onClick={() => _category()}
            >
              <span className={fontMap[language]}>{t("foodType")}</span>
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
        <div className="col-sm-12 text-right">
          <Button
            className={cn("col-sm-2", fontMap[language])}
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => setPopup({ popUpAddCategoryType: true })}
          >
            + {t("create_category")}
          </Button>{" "}
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("no")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("food_category")}
                  </th>
                  <th
                    scope="col"
                    className={cn("whitespace-nowrap", fontMap[language])}
                  >
                    {t("manage")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {categoryTypes?.map((categoryType, index) => (
                  <tr key={categoryType?.id}>
                    <td>{index + 1}</td>
                    <td>{categoryType?.name}</td>
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
                        onClick={() => handleShow2(categoryType)}
                        style={{ color: COLOR_APP, cursor: "pointer" }}
                      />
                      <FontAwesomeIcon
                        icon={faTrashAlt}
                        style={{
                          marginLeft: 20,
                          color: "red",
                          cursor: "pointer",
                        }}
                        onClick={() =>
                          handleShow3(categoryType?._id, categoryType?.name)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Box>
      <PopUpAddCategoryType
        open={popup?.popUpAddCategoryType}
        onClose={() => setPopup()}
        onSubmit={createCategoryType}
        storeId={storeId}
      />
      <Modal show={show2} onHide={handleClose2}>
        <Formik
          initialValues={{
            name: dataUpdate?.name ?? "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = `${t("fill_type_name")}`;
            }

            // console.log("CATEGORYID: ", values.categoryTypeId);

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
                <Modal.Title>{t("edit_category")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>{t("food_category")}</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder={`${t("food_category")}...`}
                  />
                </Form.Group>
                <div style={{ color: "red" }}>
                  {errors.name && touched.name && errors.name}
                </div>
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
