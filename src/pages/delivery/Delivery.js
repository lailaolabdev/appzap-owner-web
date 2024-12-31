import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Card, Table } from "react-bootstrap";
import { MdAssignmentAdd } from "react-icons/md";
import { Formik } from "formik";
import Axios from "axios";
import { useTranslation } from "react-i18next";
import { BsCurrencyExchange } from "react-icons/bs";
import { Breadcrumb, Tab, Tabs } from "react-bootstrap";
import { END_POINT_SEVER } from "../../constants/api";
import Box from "../../components/Box";
import { BODY, COLOR_APP, COLOR_APP_CANCEL } from "../../constants";
import Loading from "../../components/Loading";
import { useStore } from "../../store";
import {
  getAllDelivery,
  creatDelivery,
  DeleteDelivery,
  updateDelivery,
} from "../../services/delivery";
import Swal from "sweetalert2";

import { useStoreStore } from "../../zustand/storeStore";

export default function DeliveryList() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { profile } = useStore();
  const { storeDetail } = useStoreStore()
  const [delivery, setDelivery] = useState([]);
  const [editName, setEditName] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowEdit = (data) => {
    setEditName(data);
    setShowEdit(true);
  };
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowDelete = (data) => {
    setEditName(data);
    setShowDelete(true);
  };
  const handleCloseDelete = () => setShowDelete(false);

  const fetchDelivery = async () => {
    await getAllDelivery().then((res) => {
      setDelivery(res.data);
    });
  };

  useEffect(() => {
    fetchDelivery();
  }, []);

  const _create = async (values) => {
    // console.log("Creating", values);
    setIsLoading(true);
    try {
      await creatDelivery(values)
        .then((res) => {
          console.log("Create", res);
          if (res.data) {
            Swal.fire({
              icon: "success",
              title: t("add_data_success"),
              showConfirmButton: false,
              timer: 1500,
            });
            handleCloseAdd();
            fetchDelivery();
          } else {
            Swal.fire({
              icon: "error",
              title: t("error"),
              showConfirmButton: false,
              timer: 1500,
            });
            handleCloseAdd();
          }
        })
        .catch((err) => {
          if (err) {
            Swal.fire({
              icon: "error",
              title: t("error"),
              showConfirmButton: false,
              timer: 1500,
            });
            handleCloseAdd();
          }
        });
    } catch (error) {
      console.error("Error Create delivery failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const _edit = async (values) => {
    setIsLoading(true);
    try {
      await updateDelivery(values, editName._id).then((res) => {
        if (res.status) {
          Swal.fire({
            icon: "success",
            title: t("updated"),
            showConfirmButton: false,
            timer: 1500,
          });
          handleCloseEdit();
          fetchDelivery();
        } else {
          Swal.fire({
            icon: "error",
            title: t("error"),
            showConfirmButton: false,
            timer: 1500,
          });
          handleCloseEdit();
        }
      });
      fetchDelivery();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("error"),
        showConfirmButton: false,
        timer: 1500,
      });
      handleCloseEdit();
    } finally {
      setIsLoading(false);
    }
  };

  const _confirmDelete = async () => {
    setIsLoading(true);
    try {
      await DeleteDelivery(editName?._id).then((res) => {
        if (res.status) {
          Swal.fire({
            icon: "success",
            title: t("delete_data_success"),
            showConfirmButton: false,
            timer: 1500,
          });
          handleCloseDelete();
          fetchDelivery();
        } else {
          Swal.fire({
            icon: "error",
            title: t("error"),
            showConfirmButton: false,
            timer: 1500,
          });
          fetchDelivery();
          handleCloseDelete();
        }
      });
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
      <Box
        sx={{ padding: { md: 20, xs: 10 } }}
        style={{
          maxHeight: "100vh",
          height: "100%",
          overflowY: "auto",
          padding: "20px 20px 80px 20px",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
          <Breadcrumb.Item active>Delivery</Breadcrumb.Item>
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
                <span>{t("list_delivery")}</span>
                <Button variant="dark" onClick={handleShowAdd}>
                  <MdAssignmentAdd /> {t("add")}
                </Button>
              </Card.Header>
              <Card.Body style={{ overflowX: "auto" }}>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th style={{ textWrap: "nowrap" }}>
                        {t("name_delivery")}
                      </th>
                      <th style={{ textWrap: "nowrap" }}>{t("manage_data")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {delivery.length > 0 &&
                      delivery.map((data, index) => (
                        <tr key={data._id}>
                          <td className="text-left">{index + 1}</td>
                          <td className="text-left">{data.name}</td>
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
            <Modal.Title>{t("add_list")}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              name: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = t("enter_delivery");
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
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("name_delivery")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      onChange={handleChange}
                      placeholder={t("enter_delivery")}
                      isInvalid={!!errors.name && touched.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
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
            <Modal.Title>{t("edit_delivery")}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              name: editName?.name || "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.name) {
                errors.name = t("enter_delivery");
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
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("name_delivery")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      placeholder={t("enter_delivery")}
                      isInvalid={!!errors.name && touched.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
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
            <Modal.Title>{"Delivery"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>ທ່ານຢືນຢັນບໍ່ວ່າຈະລຶບ {editName?.name} ອອກຈາກລະບົບ?</p>
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
