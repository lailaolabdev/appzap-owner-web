import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import Upload from "../Upload";
import { COLOR_APP_CANCEL, COLOR_APP } from "../../constants";
import { useTranslation } from "react-i18next";

export default function PopUpStoreEdit({ open, onClose, onSubmit, data }) {
  const { t } = useTranslation();
  return (
    <Modal show={open} onHide={onClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>{t("edit_store")}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          _id: data?._id,
          name: data?.name,
          adminName: data?.adminName,
          whatsapp: data?.whatsapp,
          phone: data?.phone,
          detail: data?.detail,
          note: data?.note,
          image: data?.image,
        }}
        validate={(values) => {
          const errors = {};

          if (!values.name) {
            errors.name = t("please_fill");
          }
          if (!values.adminName) {
            errors.adminName = t("please_fill");
          }
          if (!values.whatsapp) {
            errors.whatsapp = t("please_fill");
          }
          if (!values.detail) {
            errors.detail = t("please_fill");
          }
          if (!values.phone) {
            errors.phone = t("please_fill");
          }
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
                <Form.Label>{t("restaurant_name")}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder={t("restaurant_name")}
                  isInvalid={errors.name && touched.name && errors.name}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ໄອດີຮ້ານ</Form.Label>
                <Form.Control
                  readOnly
                  type="text"
                  name="name"
                  value={values._id}
                  isInvalid={errors._id && touched._id && errors._id}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("restaurant_owner")}</Form.Label>
                <Form.Control
                  type="text"
                  name="adminName"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.adminName}
                  placeholder={t("restaurant_owner")}
                  isInvalid={
                    errors.adminName && touched.adminName && errors.adminName
                  }
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("location")}</Form.Label>
                <Form.Control
                  type="text"
                  name="detail"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.detail}
                  isInvalid={errors.detail && touched.detail && errors.detail}
                  placeholder="ຂໍ້ມູນທີ່ຢູ່..."
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("location")}</Form.Label>
                <Form.Control
                  type="text"
                  name="whatsapp"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.whatsapp}
                  isInvalid={
                    errors.whatsapp && touched.whatsapp && errors.whatsapp
                  }
                  placeholder="whatsapp..."
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("tel")}</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                  isInvalid={errors.phone && touched.phone && errors.phone}
                  placeholder={t("tel")}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("detial")}</Form.Label>
              </Form.Group>
              <Form.Control
                as="textarea"
                name="note"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.note}
                placeholder="ຕົວຢາງເປີດບໍລິການ ວັນຈັນ - ວັນທິດ ເວລາ 9:00 - 9:30..."
              ></Form.Control>
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{ backgroundColor: COLOR_APP_CANCEL, color: "#ffff" }}
                onClick={onClose}
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
  );
}
