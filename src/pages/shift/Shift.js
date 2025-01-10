import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Card, Table } from "react-bootstrap";
import { MdAssignmentAdd } from "react-icons/md";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { Breadcrumb, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { COLOR_APP } from "../../constants";
import Loading from "../../components/Loading";
import { useStore } from "../../store";
import {
  getAllDelivery,
  DeleteDelivery,
  updateDelivery,
} from "../../services/delivery";
import {
  getAllShift,
  CreateShift,
  DeleteShift,
  updateShift,
} from "../../services/shift";
import Swal from "sweetalert2";

import { useStoreStore } from "../../zustand/storeStore";
import TimeShift from "../../components/TimeShift";
import { values } from "lodash";

export default function ShiftList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { profile } = useStore();
  const { storeDetail } = useStoreStore();
  const [shift, setShift] = useState([]);
  const [edit, setEdit] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [formData, setFormData] = useState("");

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowEdit = async (data) => {
    setEdit(data);
    setShowEdit(true);
  };
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowDelete = (data) => {
    setEdit(data);
    setShowDelete(true);
  };
  const handleCloseDelete = () => setShowDelete(false);

  const fetchShift = async () => {
    setIsLoading(true);
    await getAllShift()
      .then((res) => {
        setShift(res?.data?.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchShift();
  }, []);

  const _create = async (values) => {
    const data = {
      ...values,
      storeId: storeDetail?._id,
      createdBy: profile?.data?._id,
    };

    setIsLoading(true);
    try {
      await CreateShift(data)
        .then((res) => {
          if (res.data) {
            Swal.fire({
              icon: "success",
              title: t("add_data_success"),
              showConfirmButton: false,
              timer: 1500,
            });
            handleCloseAdd();
            fetchShift();
            setFormData();
          } else {
            Swal.fire({
              icon: "error",
              title: t("error"),
              showConfirmButton: false,
              timer: 1500,
            });
            handleCloseAdd();
            setFormData();
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
      console.error("Error Create shift failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const _edit = async (values) => {
    const data = {
      ...values,
      storeId: storeDetail?._id,
      createdBy: profile?.data?._id,
    };
    setIsLoading(true);
    try {
      await updateShift(data, edit._id).then((res) => {
        if (res.status) {
          Swal.fire({
            icon: "success",
            title: t("updated"),
            showConfirmButton: false,
            timer: 1500,
          });
          handleCloseEdit();
          fetchShift();
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
      fetchShift();
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
      await DeleteShift(edit?._id).then((res) => {
        if (res.status) {
          Swal.fire({
            icon: "success",
            title: t("delete_data_success"),
            showConfirmButton: false,
            timer: 1500,
          });
          handleCloseDelete();
          fetchShift();
        } else {
          Swal.fire({
            icon: "error",
            title: t("error"),
            showConfirmButton: false,
            timer: 1500,
          });
          fetchShift();
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
          <Breadcrumb.Item
            onClick={() => navigate(`/settingStore/${useStoreStore?._id}`)}
          >
            {t("setting")}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{t("shift")}</Breadcrumb.Item>
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
                <span>{t("shift_list")}</span>
                <Button variant="dark" onClick={handleShowAdd} className="w-20">
                  <span className="flex gap-1 items-center ">
                    <MdAssignmentAdd /> {t("add")}
                  </span>
                </Button>
              </Card.Header>
              <Card.Body style={{ overflowX: "auto" }}>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th style={{ textWrap: "nowrap" }}>{t("shift_name")}</th>
                      <th style={{ textWrap: "nowrap" }}>{t("period")}</th>
                      <th style={{ textWrap: "nowrap" }}>{t("status")}</th>
                      <th style={{ textWrap: "nowrap" }}>{t("manage_data")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shift.length > 0 &&
                      shift.map((data, index) => (
                        <tr key={data._id}>
                          <td className="text-left">{index + 1}</td>
                          <td className="text-left">{data?.shiftName}</td>
                          <td className="text-left">
                            {`${data?.startTime} - ${data?.endTime}`}
                          </td>
                          <td className="text-left">
                            {data?.status === "OPEN" ? (
                              <span className="text-green-500 font-bold">
                                ເປິດ
                              </span>
                            ) : (
                              <span className="text-red-500 font-bold">
                                ປິດ
                              </span>
                            )}
                          </td>
                          <td className="text-left" disabled>
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
            <Modal.Title>{t("shift_list_add")}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              shiftName: "",
              startTime: "",
              endTime: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.shiftName) {
                errors.shiftName = t("enter_shift");
              }
              if (!values.startTime) {
                errors.startTime = t("ປ້ອນວັນທີເລີ່ມ");
              }
              if (!values.endTime) {
                errors.endTime = t("ປ້ອນວັນທີສິ້ນສຸດ");
              }

              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _create(values);
              setSubmitting(false); // reset submitting status

              console.log("Values", values);
            }}
          >
            {({
              handleChange,
              handleSubmit,
              isSubmitting,
              errors,
              touched,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_name")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="shiftName"
                      onChange={handleChange}
                      placeholder={t("shift_name")}
                      isInvalid={!!errors.shiftName && touched.shiftName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.shiftName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_open")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <TimeShift
                      name="startTime"
                      value={values?.startTime}
                      isInvalid={!!errors.startTime && touched.startTime}
                      onChange={(startTime) =>
                        setFieldValue("startTime", startTime)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.startTime}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_close")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <TimeShift
                      name="endTime"
                      value={values?.endTime}
                      isInvalid={!!errors.endTime && touched.endTime}
                      onChange={(endTime) => setFieldValue("endTime", endTime)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.endTime}
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
            <Modal.Title>{t("shift_list_edit")}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              shiftName: edit?.shiftName || "",
              startTime: edit?.startTime || "",
              endTime: edit?.endTime || "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.shiftName) {
                errors.shiftName = t("enter_shift");
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
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  {/* <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("name_delivery")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="shiftName"
                      value={values.shiftName}
                      onChange={handleChange}
                      placeholder={t("enter_delivery")}
                      isInvalid={!!errors.shiftName && touched.shiftName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.shiftName}
                    </Form.Control.Feedback>
                  </Form.Group> */}
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_name")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="shiftName"
                      value={values.shiftName}
                      onChange={handleChange}
                      placeholder={t("shift_name")}
                      isInvalid={!!errors.shiftName && touched.shiftName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.shiftName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_open")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <TimeShift
                      name="startTime"
                      value={values?.startTime}
                      isInvalid={!!errors.startTime && touched.startTime}
                      onChange={(startTime) =>
                        setFieldValue("startTime", startTime)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.startTime}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_close")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <TimeShift
                      name="endTime"
                      value={values?.endTime}
                      isInvalid={!!errors.endTime && touched.endTime}
                      onChange={(endTime) => setFieldValue("endTime", endTime)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.endTime}
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
            <Modal.Title>{t("delete_shift")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>ທ່ານຢືນຢັນບໍ່ວ່າຈະລຶບ {edit?.shiftName} ອອກຈາກລະບົບ?</p>
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
