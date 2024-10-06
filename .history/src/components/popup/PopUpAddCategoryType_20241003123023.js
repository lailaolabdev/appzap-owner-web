import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Formik } from "formik";

const PopUpAddCategoryType = ({ open, onClose, onSubmit, t }) => {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>ສ້າງໝວດໝູ່</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "ກະລຸນາເພີ່ມສາຂາ";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values);
          setSubmitting(false);
          onClose();
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
            <Modal.Body>
              <Form.Group controlId="name">
                <Form.Label>{t("name_category")}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder={t("enter_category")}
                  isInvalid={errors.name && touched.name}
                />
                {errors.name && touched.name && (
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onClose}>
                ຍົກເລີກ
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                ເພີ່ມໝວດໝູ່
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default PopUpAddCategoryType;
