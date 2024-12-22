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
import { moneyCurrency } from "../../helpers";
import { Breadcrumb, Nav, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { MdAssignmentAdd } from "react-icons/md";
import { BsCurrencyExchange } from "react-icons/bs";
import Loading from "../../components/Loading";
import moment from "moment";
import { useStore } from "../../store";
import { getStore } from "../../services/store";
import { useTranslation } from "react-i18next";
import {useStoreStore} from "../../zustand/storeStore"

export default function CurrencyList() {
  const { t } = useTranslation();
  // const { setStoreDetail } = useStore();
  // zustand state store
  const {
    storeDetail, 
    fetchStoreDetail,
    updateStoreDetail} = useStoreStore()

  const [getTokken, setgetTokken] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);
  const [currencyHistoryData, setCurrencyHistoryData] = useState([]);
  const [dataUpdate, setDataUpdate] = useState({});
  const [dataDelete, setDataDelete] = useState({});
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEditMainCurrency, setShowEditMainCurrency] = useState(false);

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);

  const handleShowEdit = (data) => {
    console.log({ data });
    setDataUpdate(data);
    setShowEdit(true);
  };
  const handleCloseEdit = () => setShowEdit(false);

  const handleShowDelete = (data) => {
    setDataDelete(data);
    setShowDelete(true);
  };
  const handleCloseDelete = () => setShowDelete(false);

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setgetTokken(_localData);
      }
    };
    getDataCurrencyHistory();
    fetchData();
    getDataCurrency();
  }, []);

  const getDataCurrency = async () => {
    try {
      const { DATA } = await getLocalData();
      if (DATA) {
        setIsLoading(true);
        const data = await Axios.get(
          `${QUERY_CURRENCIES}?storeId=${DATA?.storeId}`
        );
        if (data?.status == 200) {
          setCurrencyData(data?.data?.data);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };
  const getDataCurrencyHistory = async () => {
    try {
      // alert("jojo");
      const { DATA } = await getLocalData();
      if (DATA) {
        setIsLoading(true);
        const data = await Axios.get(
          `${QUERY_CURRENCY_HISTORY}?storeId=${DATA?.storeId}&p=createdBy`
        );
        if (data?.status == 200) {
          setCurrencyHistoryData(data?.data);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  const _create = async (values) => {
    console.log({ values });
    await Axios({
      method: "POST",
      url: CREATE_CURRENCY,
      headers: getTokken?.TOKEN,
      data: values,
    })
      .then(async (response) => {
        if (response?.status === 200) {
          successAdd(`${t("add_data_success")}`);
          handleCloseAdd();
          getDataCurrency();
          getDataCurrencyHistory();
        }
      })
      .catch((error) => {
        console.log("error", error);
        errorAdd(`${t("crc_exist")}`);
      });
  };

  const _update = async (values) => {
    await Axios({
      method: "PUT",
      url: `${UPDATE_CURRENCY}/${dataUpdate?._id}`,
      headers: getTokken?.TOKEN,
      data: values,
    })
      .then(async (response) => {
        if (response?.status === 200) {
          successAdd(`${t("edit_fail")}`);
          handleCloseEdit();
          getDataCurrency();
          getDataCurrencyHistory();
        }
      })
      .catch((error) => {
        console.log("error", error);
        errorAdd(`${t("edit_data_fail")}`);
      });
  };
  const _updateFirstCurrency = async (value) => {
    try {
      const data = await Axios.put(
        `${END_POINT_SEVER}/v4/store/update-first-currency`,
        {
          ...value,
        },
        { headers: getTokken?.TOKEN }
      );
      if (data?.data?.error) {
        throw new Error("errors");
      }

      // Zustand store
      await fetchStoreDetail(storeDetail?._id);
      // const dataStore = await getStore(storeDetail?._id);
      // setStoreDetail(dataStore);
      setShowEditMainCurrency(false);
      successAdd(`${t("edit_fail")}`);
    } catch {
      errorAdd("ແກ້ໄຂຂໍ້ມູນບໍ່ສຳເລັດ !");
    }
  };

  const _confirmeDelete = async () => {
    await Axios({
      method: "DELETE",
      url: `${DELETE_CURRENCY}/${dataDelete?._id}`,
      headers: getTokken?.TOKEN,
    })
      .then(async (response) => {
        if (response?.status === 200) {
          successAdd(`${t("delete_data_success")}`);
          handleCloseDelete();
          getDataCurrency();
        }
      })
      .catch((error) => {
        errorAdd(`${t("delete_data_fail")}`);
      });
  };

  return (
    <>
      {isLoading ? <Loading /> : ""}
      <Box
        sx={{ padding: { md: 20, xs: 10 } }}
        style={{
          maxHeight: "100vh",
          height: "100%",
          overflow: "auto",
          padding: "20px 20px 80px 20px",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("money_number_setting")}</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="currency-list">
          <Tab
            eventKey="currency-list"
            title={t("all_curency")}
            style={{ paddingTop: 20 }}
          >
            <Card border="primary" style={{ margin: 0, marginBottom: 20 }}>
              <Card.Header
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#fff",
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                <BsCurrencyExchange /> {t("m_ccrc")}
              </Card.Header>
              <Card.Body>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>{t("m_ccrc")}</th>
                    {/* <th>ຕົວຫຍໍ້ສະກຸນເງິນຫຼັກ</th> */}
                    <th>{t("mn_number")}</th>
                    <th>{t("manage_data")}</th>
                  </tr>
                  <tr>
                    <td className="text-left">{storeDetail?.firstCurrency}</td>
                    {/* <td className="text-left">LAK</td> */}
                    <td className="text-left">1</td>
                    <td className="text-left">
                      <FontAwesomeIcon
                        icon={faEdit}
                        style={{ color: COLOR_APP }}
                        onClick={() => setShowEditMainCurrency(true)}
                      />
                    </td>
                  </tr>
                </table>
              </Card.Body>
            </Card>
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
                  <BsCurrencyExchange /> {t("m_ccrc")}
                </span>
                <Button variant="dark" bg="dark" onClick={handleShowAdd}>
                  <MdAssignmentAdd /> {t("add_ccrc")}
                </Button>
              </Card.Header>
              <Card.Body style={{ overflowX: "auto" }}>
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>#</th>
                    <th style={{ textWrap: "nowrap" }}>{t("ccrc")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("short_ccrc")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("buy_cost")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("sale_cost")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("manage_data")}</th>
                    {/* <th style={{ textAlign: "left" }}>ວັນທີ່</th>
                        <th style={{ textAlign: "center" }}>ຍອດອໍເດີ</th>
                        <th style={{ textAlign: "center" }}>ຍອດບິນ</th>
                        <th style={{ textAlign: "center" }}>ສ່ວນຫຼຸດ</th>
                        <th style={{ textAlign: "center" }}>ຍອດກ່ອນ</th>
                        <th style={{ textAlign: "right" }}>ຍອດລວມ</th> */}
                  </tr>
                  {currencyData?.map((data, index) => (
                    <tr key={index}>
                      <td className="text-left">{index + 1}</td>
                      <td className="text-left">{data?.currencyName}</td>
                      <td className="text-left">{data?.currencyCode}</td>
                      <td className="text-left">{moneyCurrency(data?.buy)}</td>
                      <td className="text-left">{moneyCurrency(data?.sell)}</td>
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
          <Tab
            eventKey="currency-history"
            title={t("rate_history")}
            style={{ paddingTop: 20 }}
          >
            <Card
              border="secondary"
              bg="light"
              style={{ margin: 0, marginBottom: 20 }}
            >
              {" "}
              <Card.Header
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                }}
              >
                <BsCurrencyExchange /> {t("crc_history")}
              </Card.Header>
              <Card.Body
                style={{
                  overflowX: "auto",
                }}
              >
                <table style={{ width: "100%" }}>
                  <tr>
                    <th>#</th>
                    <th style={{ textWrap: "nowrap" }}>{t("m_ccrc")}</th>
                    <th style={{ textWrap: "nowrap" }}>
                      {t("short_main_crc")}
                    </th>
                    <th style={{ textWrap: "nowrap" }}>{t("buy_price")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("sales_price")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("editer")}</th>
                    <th style={{ textWrap: "nowrap" }}>{t("updated_at")}</th>
                  </tr>{" "}
                  {currencyHistoryData?.map((e, i) => (
                    <tr key={i}>
                      <td style={{ textWrap: "nowrap" }} className="text-left">
                        {i + 1}
                      </td>
                      <td style={{ textWrap: "nowrap" }} className="text-left">
                        {e?.currencyName}
                      </td>
                      <td style={{ textWrap: "nowrap" }} className="text-left">
                        {e?.currencyCode}
                      </td>
                      <td style={{ textWrap: "nowrap" }} className="text-left">
                        {e?.buy}
                      </td>
                      <td style={{ textWrap: "nowrap" }} className="text-left">
                        {e?.sell}
                      </td>
                      <td style={{ textWrap: "nowrap" }} className="text-left">
                        {e?.createdBy?.userId}
                      </td>
                      <td style={{ textWrap: "nowrap" }} className="text-left">
                        {moment(e?.createdAt).format("DD/MM/YYYY LT")}
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
            <Modal.Title>{t("add_rate")}</Modal.Title>
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
              // if (!values.currencyName) {
              //   errors.currencyName = `${t('please_fill')}`;
              // }
              // if (!values.currencyCode) {
              //   errors.currencyCode = `${t('please_fill')}`;
              // }
              // if (!values.sell) {
              //   errors.sell = `${t('please_fill')}`;
              // }
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
                      {t("crc_name")} <span style={{ color: "red" }}>*</span>
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
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("buy_price")}</Form.Label>
                    <Form.Control
                      type="number"
                      name="sell"
                      // onChange={handleChange}
                      onChange={(e) => {
                        handleChange(e);
                        // setFieldValue("buy", parseFloat(e.target.value));
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
                  <Form.Group controlId="exampleForm.ControlInput1">
                    <Form.Label>{t("sales_price")}</Form.Label>
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

        {/* update first currency */}
        <Modal
          show={showEditMainCurrency}
          onHide={() => setShowEditMainCurrency(false)}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("edit_crc")}</Modal.Title>
          </Modal.Header>
          <Formik
            initialValues={{
              firstCurrency: storeDetail?.firstCurrency,
              storeId: storeDetail?._id,
            }}
            validate={(values) => {
              const errors = {};
              if (!values.firstCurrency) {
                errors.firstCurrency = `${t("please_fill")}`;
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              console.log("values", values);
              _updateFirstCurrency(values);
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
                      {t("m_ccrc")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="firstCurrency"
                      onChange={(e) => {
                        handleChange(e);
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
                    onClick={() => setShowEditMainCurrency(false)}
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
