import React, { useEffect, useState } from "react";
import AnimationLoading from "../../constants/loading";
import { BODY, COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Card, Table } from "react-bootstrap";
import { Formik } from "formik";
import {
  CREATE_CURRENCY,
  DELETE_CURRENCY,
  END_POINT_SEVER,
  QUERY_CURRENCIES,
  QUERY_CURRENCY_HISTORY,
  UPDATE_CURRENCY,
  getLocalData,
} from "../../constants/api";
import Axios from "axios";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import { Breadcrumb, Nav, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { MdAssignmentAdd } from "react-icons/md";
import { BsCurrencyExchange } from "react-icons/bs";
import Loading from "../../components/Loading";
import moment from "moment";
import { useStore } from "../../store";
import { getStore } from "../../services/store";
import { useTranslation } from "react-i18next";

export default function BankList() {
  const { t } = useTranslation();
  const { storeDetail, setStoreDetail } = useStore();

  const [getTokken, setgetTokken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const [currencyHistoryData, setCurrencyHistoryData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [dataDelete, setDataDelete] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);


  //new

  const [banks, setBanks] = useState([]);
  const [newBank, setNewBank] = useState({ name: "", code: "" });
  const [editBank, setEditBank] = useState(null);  // เก็บข้อมูลธนาคารที่กำลังแก้ไข
  const [isEditing, setIsEditing] = useState(false);  // เก็บสถานะการแก้ไข
  const [newBankName, setNewBankName] = useState(""); // เก็บชื่อธนาคารที่แก้ไข


  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);

  useEffect(() => {
    const fetchAllBanks = async () => {
      try {
        const response = await Axios.get(`${END_POINT_SEVER}/v3/banks`); // Fetch all banks
        setBanks(response.data.data); // เข้าถึงเฉพาะ data ภายใน object
        console.log("banks data", response.data.data); // Log ข้อมูล bank ที่เป็น array
      } catch (error) {
        console.error("Error fetching all banks:", error);
      }
    };

    fetchAllBanks();
  }, []);

  console.log("bank", banks);

  

  const handleShowEdit = (data) => {
  };
  const handleCloseEdit = () => setShowEdit(false);

  const handleShowDelete = (data) => {
  };
  const handleCloseDelete = () => setShowDelete(false);


  const _create = async (values) => {

  };

  const _update = async (values) => {
    
  };

  const _confirmeDelete = async () => {
    
  };

  return (
    <>
      {isLoading ? <Loading /> : ""}
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>ຈັດການທະນາຄານ</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="currency-list">
          <Tab
            eventKey="currency-list"
            //title={t("all_curency")}
            style={{ paddingTop: 20 }}
          >
            <Card border="primary" style={{ margin: 0 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: 10,
                }}
              >
                <span>
                  <BsCurrencyExchange /> {"ທະນາຄານຫລັກ"}
                </span>
                <Button variant="dark" bg="dark" onClick={handleShowAdd}>
                  <MdAssignmentAdd /> {t("add_ccrc")}
                </Button>
              </Card.Header>
              <Card.Body style={{ overflowX: "auto" }}>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>#</th>
                    <th style={{ textWrap: "nowrap" }}>ຊື່ບັນຊີ</th>
                    <th style={{ textWrap: "nowrap" }}>{t("manage_data")}</th>
                  </tr>
                  {Array.isArray(banks) &&
                    banks.map((data, index) => (
                      <tr key={index}>
                        <td className="text-left">{index + 1}</td>
                        <td className="text-left">{data.bankName}</td>
                        <td className="text-left">
                          <FontAwesomeIcon
                            icon={faEdit}
                            style={{ color: COLOR_APP }}
                            onClick={() => handleShowEdit(data)}
                          />
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{ marginLeft: 20, color: "red" }}
                            onClick={() => handleShowDelete(data)}
                          />
                        </td>
                      </tr>
                    ))}
                </table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        {/* create */}
        <Modal
          show={showAdd}
          onHide={handleCloseAdd}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{"ເພີມທະນາຄານ"}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              currencyName: "",
              currencyCode: "",
              buy: "",
              sell: "",
              storeId: getTokken?.DATA?.storeId ?? "",
            }}
            validate={(values) => {
              const errors = {};
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _create(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {"ຊື່ທະນາຄານ"} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="currencyName"
                      onChange={(e) => {
                        handleChange(e);
                        console.log(e.target.value);
                        setFieldValue("currencyCode", e.target.value);
                      }}
                    >
                      <option value="">--{t("select_crc")}--</option>
                      <option value="LAK">{t("kip_lak")}</option>
                      <option value="THB">{t("b_th")}</option>
                      <option value="USD">{t("dolar_usd")}</option>
                      <option value="CNY">{t("y_cn")}</option>
                    </Form.Control>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    style={{
                      backgroundColor: COLOR_APP_CANCEL,
                      color: "#ffff",
                    }}
                    onClick={handleCloseAdd}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    style={{ backgroundColor: COLOR_APP, color: "#ffff" }}
                    onClick={() => handleSubmit()}
                  >
                    {t("save")}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>

        {/* update */}
        <Modal
          show={showEdit}
          onHide={handleCloseEdit}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("edit_rate")}</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              currencyName: dataUpdate?.currencyName,
              currencyCode: dataUpdate?.currencyCode,
              buy: dataUpdate?.buy,
              sell: dataUpdate?.sell,
              storeId: dataUpdate?.storeId,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.currencyName) {
                errors.currencyName = `${t("please_fill")}`;
              }
              if (!values.currencyCode) {
                errors.currencyCode = `${t("please_fill")}`;
              }
              if (!values.sell) {
                errors.sell = `${t("please_fill")}`;
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              console.log("values", values);
              _update(values);
            }}
          >
            {({
              values,
              errors,
              touched,
              setFieldValue,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("crc_name")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="currencyName"
                      onChange={(e) => {
                        handleChange(e);
                        setFieldValue("currencyCode", e.target.value);
                      }}
                    >
                      <option value="">--{t("select_crc")}--</option>
                      <option value="LAK">{t("kip_lak")}</option>
                      <option value="THB">{t("b_th")}</option>
                      <option value="USD">{t("dolar_usd")}</option>
                      <option value="CNY">{t("y_cn")}</option>
                    </Form.Control>
                  </Form.Group>

                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("buy_price")}</Form.Label>
                    <Form.Control
                      type="number"
                      name="buy"
                      // onChange={handleChange}
                      onChange={(e) => {
                        handleChange(e);
                        // setFieldValue("buy", parseFloat(e.target.value));
                      }}
                      onBlur={handleBlur}
                      value={values.buy}
                      isInvalid={!!errors.buy}
                      placeholder={t("fill_rate")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.buy}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("sales_price")}</Form.Label>
                    <Form.Control
                      type="number"
                      name="sell"
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      value={values.sell}
                      isInvalid={!!errors.sell}
                      placeholder={t("fill_rate")}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.sell}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    style={{
                      backgroundColor: COLOR_APP_CANCEL,
                      color: "#ffff",
                    }}
                    onClick={handleCloseEdit}
                  >
                    {t("cancel")}
                  </Button>
                  <Button
                    style={{ backgroundColor: COLOR_APP, color: "#ffff" }}
                    onClick={() => handleSubmit()}
                  >
                    {t("save")}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>

        {/* delete */}
        <Modal show={showDelete} onHide={handleCloseDelete}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <div style={{ textAlign: "center" }}>
              <div>{t("sure_to_delect_crc")}</div>
              <div
                style={{ color: "red" }}
              >{`${dataDelete?.currencyName} (${dataDelete?.currencyCode})`}</div>
              <div>{t("realy")} ?</div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              {t("cancel")}
            </Button>
            <Button
              style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
              onClick={() => _confirmeDelete()}
            >
              {t("confirm_delect")}
            </Button>
          </Modal.Footer>
        </Modal>
      </Box>
    </>
  );
}
