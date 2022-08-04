import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { COLOR_APP } from "../../../../constants";
import { Formik } from "formik";
import axios from "axios";
import { getHeaders } from "../../../../services/auth";
import { END_POINT_SEVER } from "../../../../constants/api";

export default function PopUpAddMenuStocks({ open, onClose, onSubmit, data }) {
  return (
    <Modal show={open} onHide={onClose}>
      <Formik
        initialValues={{
          _id: data?.id,
          stockCategoryId: data?.stockCategoryId,
          name: data?.name,
        }}
        validate={(values) => {
          const errors = {};
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
              <Modal.Title>ເພີ່ມເມນູສະຕ໊ອກ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>ຊື່ສະຕ໊ອກ</Form.Label>
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
                <Form.Label>ໝາຍເຫດ</Form.Label>
                <Form.Control
                  type='number'
                  name='quantity'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantity}
                  placeholder='ຈຳນວນ'
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='danger' onClick={onClose}>
                ຍົກເລີກ
              </Button>
              <Button
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#ffff",
                  border: 0,
                }}
                onClick={() => handleSubmit()}>
                ບັນທືກ
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
