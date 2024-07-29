import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Formik } from "formik";

export default function PopUpAddBranchStore({ open, onClose, onSubmit }) {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>ເພີ່ມເຂົ້າສາຂາຫຼັກ</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ childStores: "", checkChildStore: true }}
        validate={(values) => {
          const errors = {};
          if (!values.childStores) {
            errors.childStores = "ກະລຸນາເພີ່ມສາຂາ";
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
              <Form.Group controlId="childStores">
                <Form.Label>ຊື່ສາຂາ</Form.Label>
                <Form.Control
                  type="text"
                  name="childStores"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.childStores}
                  placeholder="ກະລຸນາເພີ່ມສາຂາ"
                  isInvalid={errors.childStores && touched.childStores}
                />
                {errors.childStores && touched.childStores && (
                  <Form.Control.Feedback type="invalid">
                    {errors.childStores}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={onClose}>
                ຍົກເລີກ
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                ເພີ່ມສາຂາ
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
