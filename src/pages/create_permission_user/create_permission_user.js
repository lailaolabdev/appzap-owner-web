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
import {
  fetchPermissionUsers,
  createPermissionUser,
  updatePermissionUser,
  deletePermissionUser,
} from "../../services/permission_user";

export default function CreatePermisionUser() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const { profile, storeDetail } = useStore();
  const [permissionUsers, setPermissionUsers] = useState([]);
  const [editpermissionUsers, setEditpermissionUsers] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowEdit = (data) => {
    setEditpermissionUsers(data);
    setShowEdit(true);
  };
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowDelete = (data) => {
    setEditpermissionUsers(data);
    setShowDelete(true);
  };
  const handleCloseDelete = () => setShowDelete(false);
  
  console.log("permissionUsers:",permissionUsers)
  //console.log("storeDetail?._id:",storeDetail?._id)

  const fetchAllPermissionUsers = async () => {
    try {
      const data = await fetchPermissionUsers(storeDetail?._id);
      setPermissionUsers(data || []);
      setAlertMessage("");
    } catch (error) {
      console.error("Error fetching permission Users:", error);
    }
  };
  

  useEffect(() => {
    fetchAllPermissionUsers();
  }, [storeDetail?._id]);
  useEffect(() => {
    if (permissionUsers.length === 0) {
      setShowDelete(false); 
      setShowEdit(false); 
    }
  }, [permissionUsers]);
  

  const _create = async (values) => {
    const exispermissionUsers = permissionUsers.find(
      (permissionUsers) => permissionUsers.permissionUserName === values.permissionUserName 
    );
    if (exispermissionUsers) {
      setAlertMessage("ຊື່ສິດນີ້ມີແລ້ວ");
      setIsLoading(false);
      return;
    }
    try {
      await createPermissionUser(storeDetail?._id, values.permissionUserName);
      fetchAllPermissionUsers();
      setShowAdd(false);
      setAlertMessage("");
    } catch (error) {
      console.error("Error creating permission:", error);
    }
  };
  

  const _edit = async (values) => {
 
    const exispermissionUsers = permissionUsers.find(
      (permissionUsers) => permissionUsers.permissionUserName === values.permissionUserName && permissionUsers._id !== editpermissionUsers._id
    );
    if (exispermissionUsers) {
      setAlertMessage("ຊື່ສິດນີ້ມີແລ້ວ");
      setIsLoading(false);
      return;
    }
    try {
      await updatePermissionUser(editpermissionUsers._id, values.permissionUserName, profile.data?._id);
      fetchAllPermissionUsers();
      setShowEdit(false);
      setAlertMessage("");
    } catch (error) {
      console.error("Error updating permission:", error);
    }
  };
  

  const _confirmDelete = async () => {
    
    try {
      await deletePermissionUser(editpermissionUsers._id);
      const updatedUsers = await fetchPermissionUsers(storeDetail?._id);
      
      
      setPermissionUsers(updatedUsers || []);
      
      setShowDelete(false); 
      setAlertMessage(""); 
    } catch (error) {
      console.error("Error deleting permission:", error);
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
          <Breadcrumb.Item active>{t("ລາຍການພະນັກງານ")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("ສ້າງສິດ")}</Breadcrumb.Item>
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
                  <BsCurrencyExchange /> {t("ສິດທັງຫມົດ")}
                </span>
                <Button variant="dark" onClick={handleShowAdd}>
                  <MdAssignmentAdd /> {t("ເພີມສິດ")}
                </Button>
              </Card.Header>
              <Card.Body style={{ overflowX: "auto" }}>
                <table style={{ width: "100%" }}>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th style={{ textWrap: "nowrap" }}>{t("ຊື່ສິດ")}</th>
                      <th style={{ textWrap: "nowrap" }}>{t("manage_ສິດ")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(permissionUsers) &&
                      permissionUsers.map((data, index) => (
                        <tr key={index}>
                          <td className="text-left">{index + 1}</td>
                          <td className="text-left">{data.permissionUserName}</td>
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
            <Modal.Title>{t("ເພີ່ມສິດ")}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              permissionUserName: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.permissionUserName) {
                errors.permissionUserName = "ກະລຸນາໃສ່ຊື່ສິດ";
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
                      {t("ຊື່ສິດ")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="permissionUserName"
                      onChange={handleChange}
                      placeholder={t("ກະລຸນາໄສ່ຊື່ສິດ")}
                      isInvalid={!!errors.permissionUserName && touched.permissionUserName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.permissionUserName}
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
            <Modal.Title>{"ແກ້ໄຂຊື່ສິດ"}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              permissionUserName: editpermissionUsers?.permissionUserName || "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.permissionUserName) {
                errors.permissionUserName = "ກະລຸນາໃສ່ຊື່ສິດ";
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
                      {"ຊື່ສິດທີຕ້ອງການຈະແກ້ໄຂ"}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="permissionUserName"
                      value={values.permissionUserName} // ให้ใช้ค่าจาก Formik (values.permissionUserName)
                      onChange={handleChange} // อัปเดตค่าใน Formik เมื่อมีการพิมพ์
                      placeholder={"ກະລຸນາໃສ່ຊື່ສິດ"}
                      isInvalid={!!errors.permissionUserName && touched.permissionUserName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.permissionUserName}
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
            <p>ທ່ານຢືນຢັນບໍ່ວ່າຈະລຶບ {editpermissionUsers?.permissionUserName} ອອກຈາກລະບົບ?</p>
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
