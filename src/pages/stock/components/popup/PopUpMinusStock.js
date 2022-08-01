import React from "react";
import { Formik } from "formik";
import { Button, Modal, Form, Nav, Image } from "react-bootstrap";
import * as consts from "../../../../constants";

// -------------------------------------------------------------- //
export default function PopUpAddStock({ open, onClose, data = {} }) {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>ລົບສະຕ໊ອກ</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{}}
        validate={(values) => {
          const errors = {};
          if (!values.note) {
            errors.note = "ກະລຸນາປ້ອນ...";
          }
          if (!values.quantity) {
            errors.quantity = "ກະລຸນາປ້ອນຈຳນວນທີ່ຕ້ອງການເພີ່ມ...";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          console.log("values:", values);
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
            <Modal.Body>
              <Form.Group controlId='exampleForm.ControlSelect1'>
                <Form.Label>ຊື່ສິນຄ້າ</Form.Label>
                <Form.Control type='text' value={data?.name || "-"} disabled />
              </Form.Group>
              <Form.Group controlId='exampleForm.ControlSelect1'>
                <Form.Label>ໝວດໝູ່ສິນຄ້າ</Form.Label>
                <Form.Control
                  type='text'
                  value={data?.categoryId?.name || "-"}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>ສະຕ໊ອກປັດຈຸບັນ</Form.Label>
                <Form.Control
                  type='number'
                  value={data?.quantity || 0}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>ຈຳນວນທີ່ຕ້ອງການລົບອອກຈາກສະຕ໊ອກ</Form.Label>
                <Form.Control
                  type='number'
                  name='quantity'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantity}
                  placeholder='ຈຳນວນ'
                  isInvalid={errors.quantity}
                />
              </Form.Group>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>ໝາຍເຫດ</Form.Label>
                <Form.Control
                  type='text'
                  name='note'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.note}
                  placeholder='ໝາຍເຫດ...'
                  isInvalid={errors.note}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <input
                className='btn btn-danger'
                type='button'
                value='ຍົກເລີກ'
                onClick={onClose}
              />
              <Button
                style={{
                  backgroundColor: consts.COLOR_APP,
                  color: "#ffff",
                  border: 0,
                }}
                onClick={handleSubmit}>
                ລົບອອກຈາກສະຕ໊ອກ
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
