import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { COLOR_APP } from "../../../../constants";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";

export default function PopUpAddMenuStocks({ open, onClose, onSubmit, data }) {
  const { t } = useTranslation();
  return (
    <Modal show={open} onHide={onClose}>
      <Formik
        initialValues={{
          _id: data?._id,
          stockCategoryId: data?.stockCategoryId,
          name: data?.name,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.quantity) errors.quantity = "-";
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values);
          onClose();
        }}>
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
            <Modal.Header closeButton>
              <Modal.Title>{t('add_menu_stoke')}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>{t('stoke_name')}</Form.Label>
                <Form.Control
                  type='text'
                  name='name'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  disabled
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.name && touched.name && errors.name}
              </div>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>{t('amount')}</Form.Label>
                <Form.Control
                  type='number'
                  name='quantity'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantity}
                  placeholder={t('amount')}
                  isInvalid={errors.quantity}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='danger' onClick={onClose}>
                {t('cancel')}
              </Button>
              <Button
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#ffff",
                  border: 0,
                }}
                onClick={() => handleSubmit()}>
                {t('save')}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
