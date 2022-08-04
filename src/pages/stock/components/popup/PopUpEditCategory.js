import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import { BODY, COLOR_APP } from "../../../../constants";
import { END_POINT_SEVER, getLocalData } from "../../../../constants/api";
import { getHeaders } from "../../../../services/auth";
import axios from "axios";

export default function PopUpEditCategory({ onClose, data, open, callback }) {
  const _createCategory = async (values) => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        let header = await getHeaders();
        const headers = {
          "Content-Type": "application/json",
          Authorization: header.authorization,
        };

        await axios({
          method: "PUT",
          url: END_POINT_SEVER + "/v3/stock-category/update",
          data: {
            id: data._id,
            data: { name: values?.name, note: values?.note },
          },
          headers: headers,
        })
          .then((response) => {
            onClose();
            // successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
            callback(response);
          })
          .catch(function (error) {
            // errorAdd("ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !");
          });
      }
    } catch (error) {
      console.log("error:", error);
    }
  };
  return (
    <Modal show={open} onHide={onClose}>
      <Formik
        initialValues={{
          name: data?.name,
          note: data?.note,
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "ກະລຸນາປ້ອນຊື່ປະເພດສະຕ໊ອກ...";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          _createCategory(values);
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
              <Modal.Title>ແກ້ໄຂປະເພດສະຕ໊ອກ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>ຊື່ປະເພດສະຕ໊ອກ</Form.Label>
                <Form.Control
                  type='text'
                  name='name'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder='ຊື່ປະເພດສະຕ໊ອກ...'
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.name && touched.name && errors.name}
              </div>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>ໝາຍເຫດ</Form.Label>
                <Form.Control
                  type='text'
                  name='note'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.note}
                  placeholder='ໝາຍເຫດ...'
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
                ເພີ່ມ
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
