import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
// Assuming you are using a translation library like i18next
import { useTranslation } from "react-i18next";

const PopUpAddCategoryType = ({ open, onClose, onSubmit }) => {
  const { t } = useTranslation(); // Translation hook

  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{t("create_category")}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{ name: "", storeId: storeId }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = t("please_add_category"); // Ensure error message is localized
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
                <Form.Label htmlFor="name">{t("food_category")}</Form.Label>
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
                {t("cancel")}
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {t("add")}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default PopUpAddCategoryType;
