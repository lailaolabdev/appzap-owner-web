import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import Upload from "../Upload";
import { COLOR_APP_CANCEL, COLOR_APP } from "../../constants";

export default function PopUpStoreEdit({ open, onClose, onSubmit, data }) {
  return (
    <Modal show={open} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>ແກ້ໄຂຂໍ້ມູນຮ້ານ</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          name: data?.name,
          adminName: data?.adminName,
          whatsapp: data?.whatsapp,
          phone: data?.phone,
          detail: data?.detail,
          note: data?.note,
          image: data?.image,

          // dateClose: data?.dateClose,
          // closeTime: data?.closeTime,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "ກະລຸນາປ້ອນ !";
          }
          if (!values.adminName) {
            errors.adminName = "ກະລຸນາປ້ອນ !";
          }
          if (!values.whatsapp) {
            errors.whatsapp = "ກະລຸນາປ້ອນ !";
          }
          if (!values.detail) {
            errors.detail = "ກະລຸນາປ້ອນ !";
          }
          if (!values.phone) {
            errors.phone = "ກະລຸນາປ້ອນ !";
          }
          // if (!values.dateClose) {
          //     errors.dateClose = 'ກະລຸນາປ້ອນ !';
          // }
          // if (!values.closeTime) {
          //     errors.closeTime = 'ກະລຸນາປ້ອນ !';
          // }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const Submit = async () => {
            await onSubmit(values);
            setSubmitting(false);
          };
          Submit();
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
          setFieldValue,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <div className="col-sm-12 center" style={{ textAlign: "center" }}>
                <Upload
                  src={values?.image}
                  onChange={(e) => setFieldValue("image", e)}
                />
              </div>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ຊື່ຮ້ານ</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder="ຊື່ຮ້ານ..."
                  style={{
                    border:
                      errors.name && touched.name && errors.name
                        ? "solid 1px red"
                        : "",
                  }}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ຊື່ເຈົ້າຂອງຮ້ານ</Form.Label>
                <Form.Control
                  type="text"
                  name="adminName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.adminName}
                  placeholder="ຊື່ເຈົ້າຂອງຮ້ານ..."
                  style={{
                    border:
                      errors.adminName && touched.adminName && errors.adminName
                        ? "solid 1px red"
                        : "",
                  }}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ຂໍ້ມູນທີ່ຢູ່</Form.Label>
                <Form.Control
                  type="text"
                  name="detail"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.detail}
                  style={{
                    border:
                      errors.detail && touched.detail && errors.detail
                        ? "solid 1px red"
                        : "",
                  }}
                  placeholder="ຂໍ້ມູນທີ່ຢູ່..."
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ເບີ whatsapp</Form.Label>
                <Form.Control
                  type="text"
                  name="whatsapp"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.whatsapp}
                  style={{
                    border:
                      errors.whatsapp && touched.whatsapp && errors.whatsapp
                        ? "solid 1px red"
                        : "",
                  }}
                  placeholder="whatsapp..."
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ເບີໂທ</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  style={{
                    border:
                      errors.phone && touched.phone && errors.phone
                        ? "solid 1px red"
                        : "",
                  }}
                  placeholder="ເບີໂທ..."
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ລາຍລະອຽດ</Form.Label>
              </Form.Group>
              <textarea
                id="note"
                name="note"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.note}
                placeholder="ຕົວຢາງເປີດບໍລິການ ວັນຈັນ - ວັນທິດ ເວລາ 9:00 - 9:30..."
                rows="4"
                cols="50"
              ></textarea>
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{ backgroundColor: COLOR_APP_CANCEL, color: "#ffff" }}
                onClick={onClose}
              >
                ຍົກເລີກ
              </Button>
              <Button
                style={{ backgroundColor: COLOR_APP, color: "#ffff" }}
                onClick={() => handleSubmit()}
              >
                ບັນທືກ
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
