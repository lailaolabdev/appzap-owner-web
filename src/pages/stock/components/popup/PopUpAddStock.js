import React from "react";
import { Formik } from "formik";
import { Button, Modal, Form, Nav, Image } from "react-bootstrap";
import axios from "axios";
import { getHeaders } from "../../../../services/auth";
import { getLocalData } from "../../../../constants/api";
import * as consts from "../../../../constants";
import { END_POINT_SEVER } from "../../../../constants/api";
import { successAdd, errorAdd } from "../../../../helpers/sweetalert";

// -------------------------------------------------------------- //
export default function PopUpAddStock({ open, onClose, data = {}, callback }) {
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>ເພີ່ມສະຕ໊ອກ</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{}}
        validate={(values) => {
          const errors = {};
          // if (!values.note) {
          //   errors.note = "ກະລຸນາປ້ອນ...";
          // }
          if (!values.quantity) {
            errors.quantity = "ກະລຸນາປ້ອນຈຳນວນທີ່ຕ້ອງການເພີ່ມ...";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const fetchData = async () => {
            try {
              const headers = await getHeaders();
              const _localData = await getLocalData();
              const res = await axios.put(
                `${END_POINT_SEVER}/v3/stock-import`,
                {
                  id: data._id,
                  data: { quantity: values.quantity },
                  storeId:_localData?.DATA?.storeId
                },
                { headers }
              );
              if (res.status < 300) {
                callback(res.data);
                successAdd(
                  `ເພີ່ມສະຕ໊ອກ ${data?.name} (${values?.quantity}) ສຳເລັດ`
                );
              }
            } catch (err) {
              errorAdd(`ເພີ່ມສະຕ໊ອກ ບໍ່ສຳເລັດ`);
              console.log("error:", err);
            }
            onClose();
            setSubmitting(false);
          };
          fetchData();
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
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>ຊື່ສິນຄ້າ</Form.Label>
                <Form.Control type="text" value={data?.name || "-"} disabled />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>ໝວດໝູ່ສິນຄ້າ</Form.Label>
                <Form.Control
                  type="text"
                  value={data?.stockCategoryId?.name || "-"}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ສະຕ໊ອກປັດຈຸບັນ</Form.Label>
                <Form.Control
                  type="number"
                  value={data?.quantity || 0}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ຈຳນວນທີ່ຕ້ອງການເພີ່ມ</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantity}
                  placeholder="ຈຳນວນ"
                  isInvalid={errors.quantity}
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ໝາຍເຫດ</Form.Label>
                <Form.Control
                  type="text"
                  name="note"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.note}
                  placeholder="ໝາຍເຫດ..."
                  isInvalid={errors.note}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <input
                className="btn btn-danger"
                type="button"
                value="ຍົກເລີກ"
                onClick={onClose}
              />
              <Button
                style={{
                  backgroundColor: consts.COLOR_APP,
                  color: "#ffff",
                  border: 0,
                }}
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                ເພີ່ມເຂົ້າສະຕ໊ອກ
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
