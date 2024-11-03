import React, { useEffect, useState } from "react";
import { BODY, COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Card, Table } from "react-bootstrap";
import { Formik } from "formik";
import { END_POINT_SEVER } from "../../constants/api";
import Axios from "axios";
import { Breadcrumb, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { MdAssignmentAdd } from "react-icons/md";
import { BsCurrencyExchange } from "react-icons/bs";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";
import { useStore } from "../../store";

export default function BankList() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { profile, storeDetail } = useStore();
  const [banks, setBanks] = useState([]);
  const [editBank, setEditBank] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowEdit = (data) => {
    setEditBank(data);
    setShowEdit(true);
  };
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowDelete = (data) => {
    setEditBank(data);
    setShowDelete(true);
  };
  const handleCloseDelete = () => setShowDelete(false);

  const fetchAllBanks = async () => {
    try {
      const response = await Axios.get(
        `${END_POINT_SEVER}/v3/banks?storeId=${storeDetail?._id}`
      );
      setBanks(response.data.data);
    } catch (error) {
      console.error("Error fetching all banks:", error);
    }
  };

  useEffect(() => {
    fetchAllBanks();
  }, []);

  const _create = async (values) => {
    setIsLoading(true);
    const createdBy = profile.data?._id || "";
    const storeId = storeDetail?._id || "";

    const existingBank = banks.find(
      (bank) => bank.bankName === values.bankName
    );
    if (existingBank) {
      setAlertMessage("ຊື່ທະນາຄານນີ້ມີແລ້ວ");
      setIsLoading(false);
      return;
    }

    try {
      await Axios.post(`${END_POINT_SEVER}/v3/bank/create`, {
        storeId,
        bankName: values.bankName,
        createdBy,
      });
      fetchAllBanks();
      handleCloseAdd();
      setAlertMessage("");
    } catch (error) {
      console.error("Error creating new bank:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const _edit = async (values) => {
    setIsLoading(true);

    // ตรวจสอบว่ามีชื่อธนาคารซ้ำในฐานข้อมูลหรือไม่
    const existingBank = banks.find(
      (bank) => bank.bankName === values.bankName && bank._id !== editBank._id
    );
    if (existingBank) {
      setAlertMessage("ຊື່ທະນາຄານນີ້ມີແລ້ວ");
      setIsLoading(false);
      return;
    }

    try {
      await Axios.put(`${END_POINT_SEVER}/v3/bank/update/${editBank._id}`, {
        bankName: values.bankName,
        createdBy: profile.data?._id || "",
      });
      fetchAllBanks();
      handleCloseEdit();
      setAlertMessage("");
    } catch (error) {
      console.error("Error updating bank:", error);
      setAlertMessage("Error updating bank");
    } finally {
      setIsLoading(false);
    }
  };

  const _confirmDelete = async () => {
    setIsLoading(true);
    try {
      await Axios.delete(`${END_POINT_SEVER}/v3/bank/delete/${editBank._id}`);
      fetchAllBanks();
      handleCloseDelete();
      setAlertMessage("");
    } catch (error) {
      console.error("Error deleting bank:", error);
      setAlertMessage("Error deleting bank");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? <Loading /> : ""}
      <Box sx={{ padding: { md: 20, xs: 10 } }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("bank")}</Breadcrumb.Item>
        </Breadcrumb>
        <Tabs defaultActiveKey="currency-list">
          <Tab eventKey="currency-list" style={{ paddingTop: 20 }}>
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
                  <BsCurrencyExchange /> {t("main_Bank")}
                </span>
                <Button variant="dark" onClick={handleShowAdd}>
                  <MdAssignmentAdd /> {t("add_Bank")}
                </Button>
              </Card.Header>
              <Card.Body style={{ overflowX: "auto" }}>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th style={{ textWrap: "nowrap" }}>{t("bank_Name")}</th>
                      <th style={{ textWrap: "nowrap" }}>{t("manage_data")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(banks) &&
                      banks.map((data, index) => (
                        <tr key={index}>
                          <td className="text-left">{index + 1}</td>
                          <td className="text-left">{data.bankName}</td>
                          <td className="text-left">
                            <FontAwesomeIcon
                              icon={faEdit}
                              style={{ color: COLOR_APP, cursor: "pointer" }}
                              onClick={() => handleShowEdit(data)}
                            />
                            <FontAwesomeIcon
                              icon={faTrashAlt}
                              style={{
                                marginLeft: 20,
                                color: "red",
                                cursor: "pointer",
                              }}
                              onClick={() => handleShowDelete(data)}
                            />
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        {/* Create Modal */}
        <Modal
          show={showAdd}
          onHide={handleCloseAdd}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("add_Bank")}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              bankName: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.bankName) {
                errors.bankName = "ກະລຸນາໃສ່ຊື່ທະນາຄານ";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _create(values);
              setSubmitting(false); // reset submitting status
            }}
          >
            {({
              handleChange,
              handleSubmit,
              isSubmitting,
              errors,
              touched,
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  {alertMessage && (
                    <div style={{ color: "red", marginBottom: "10px" }}>
                      {alertMessage}
                    </div>
                  )}
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("bank_Name")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="bankName"
                      onChange={handleChange}
                      placeholder={t("please_enter_the_bank_name")}
                      isInvalid={!!errors.bankName && touched.bankName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.bankName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseAdd}>
                    {t("cancel")}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>

        {/* Edit Modal */}
        <Modal
          show={showEdit}
          onHide={handleCloseEdit}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{"ແກ້ໄຂຊື່ທະນາຄານ"}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              bankName: editBank?.bankName || "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.bankName) {
                errors.bankName = "ກະລຸນາໃສ່ຊື່ທະນາຄານ";
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _edit(values);
              setSubmitting(false); // reset submitting status
            }}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              isSubmitting,
              errors,
              touched,
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  {alertMessage && (
                    <div style={{ color: "red", marginBottom: "10px" }}>
                      {alertMessage}
                    </div>
                  )}
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {"ຊື່ທະນາຄານທີຕ້ອງການຈະແກ້ໄຂ"}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="bankName"
                      value={values.bankName} // ให้ใช้ค่าจาก Formik (values.bankName)
                      onChange={handleChange} // อัปเดตค่าใน Formik เมื่อมีการพิมพ์
                      placeholder={"ກະລຸນາໃສ່ຊື່ທະນາຄານ"}
                      isInvalid={!!errors.bankName && touched.bankName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.bankName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEdit}>
                    {t("cancel")}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>

        {/* Delete Modal */}
        <Modal
          show={showDelete}
          onHide={handleCloseDelete}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{"ລຶບທະນາຄານ"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>ທ່ານຢືນຢັນບໍ່ວ່າຈະລຶບ {editBank?.bankName} ອອກຈາກລະບົບ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              {t("cancel")}
            </Button>
            <Button variant="danger" onClick={_confirmDelete}>
              {"ລຶບ"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Box>
    </>
  );
}
