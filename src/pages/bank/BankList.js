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

  // New state variables
  const { profile } = useStore();
  const [banks, setBanks] = useState([]);
  const [editBank, setEditBank] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alertMessage, setAlertMessage] = useState(""); // Message for alerts
  const [bankToDelete, setBankToDelete] = useState(null); // State for bank to delete

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);

  // Fetch all banks
  const fetchAllBanks = async () => {
    try {
      const response = await Axios.get(`${END_POINT_SEVER}/v3/banks`);
      setBanks(response.data.data);
      console.log("banks data", response.data.data);
    } catch (error) {
      console.error("Error fetching all banks:", error);
    }
  };

  useEffect(() => {
    fetchAllBanks();
  }, []);

  const handleShowEdit = (data) => {};
  const handleCloseEdit = () => setShowEdit(false);

  const handleShowDelete = (data) => {
    setBankToDelete(data); // Store the bank to be deleted
    setShowDelete(true); // Show delete modal
  };
  const handleCloseDelete = () => {
    setShowDelete(false);
    setBankToDelete(null); // Clear bank to delete
  };

  const _create = async (values) => {
    setIsLoading(true); // Show loading when saving
    const createdBy = profile.data?._id || ""; // Use createdBy instead of userId
    console.log(createdBy);

    // Check if the bank name already exists
    const existingBank = banks.find((bank) => bank.bankName === values.bankName);
    if (existingBank) {
      setAlertMessage("ธนาคารนี้มีอยู่แล้วในระบบ"); // Show alert message
      setIsLoading(false); // Hide loading
      return; // Stop execution if the bank already exists
    }

    try {
      const response = await Axios.post(`${END_POINT_SEVER}/v3/bank/create`, {
        bankName: values.bankName,
        createdBy, // Send the user who created the bank
      });

      if (response) {
        fetchAllBanks(); // Refresh data after successful creation
        handleCloseAdd(); // Close modal after saving
        setAlertMessage(""); // Clear alert message
      }
    } catch (error) {
      console.error("Error creating new bank:", error);
    } finally {
      setIsLoading(false); // Hide loading when finished
    }
  };

  const _confirmDelete = async () => {
    if (!bankToDelete) return; // Check if there's a bank to delete
    setIsLoading(true); // Show loading

    try {
      await Axios.delete(`${END_POINT_SEVER}/v3/bank/delete/${bankToDelete._id}`);
      fetchAllBanks(); // Refresh banks after deletion
      setAlertMessage("ລົບທະນາຄານແລ້ວ"); // Show success message
    } catch (error) {
      console.error("Error deleting bank:", error);
      setAlertMessage("ມີບັດເສດໃນການລົບ"); // Show error message
    } finally {
      setIsLoading(false); // Hide loading
      handleCloseDelete(); // Close delete modal
    }
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
                  <BsCurrencyExchange /> {"ທະນາຄານຫລັກ"}
                </span>
                <Button variant="dark" onClick={handleShowAdd}>
                  <MdAssignmentAdd /> {"ເພີມທະນາຄານ"}
                </Button>
              </Card.Header>
              <Card.Body style={{ overflowX: "auto" }}>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th style={{ textWrap: "nowrap" }}>ຊື່ບັນຊີ</th>
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
            <Modal.Title>{"ເພີມທະນາຄານ"}</Modal.Title>
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
                    <div style={{ color: "red", marginBottom: "10px" }}>{alertMessage}</div>
                  )}
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {"ຊື່ທະນາຄານ"} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="bankName"
                      onChange={handleChange}
                      placeholder={"ກະລຸນາໃສ່ຊື່ທະນາຄານ"}
                    />
                    {errors.bankName && touched.bankName && (
                      <div style={{ color: "red" }}>{errors.bankName}</div>
                    )}
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
                  <Button variant="primary" type="submit">
                    {isSubmitting ? "ກຳລັงບັນທຶກ..." : "ບັນທຶກ"}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>

        {/* Delete Modal */}
        <Modal show={showDelete} onHide={handleCloseDelete}>
          <Modal.Header closeButton>
            <Modal.Title>{"ຢືນຢັນການລົບ"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {"ທ່ານຕ້ອງການລົບທະນາຄານ: " + (bankToDelete ? bankToDelete.bankName : "")}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              {t("cancel")}
            </Button>
            <Button variant="danger" onClick={_confirmDelete}>
              {"ລົບ"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Box>
    </>
  );
}
