import React from "react";
import { Formik } from "formik";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { getHeaders } from "../../../../services/auth";
import { getLocalData } from "../../../../constants/api";
import * as consts from "../../../../constants";
import { END_POINT_SEVER } from "../../../../constants/api";
import { successAdd, errorAdd } from "../../../../helpers/sweetalert";
import { useTranslation } from "react-i18next";

// -------------------------------------------------------------- //
export default function PopUpAddStock({ open, onClose, data = {}, callback }) {
  const { t } = useTranslation();

  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("add_stock")}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{}}
        validate={(values) => {
          const errors = {};
          // let _currentQuantity = data?.quantity;
          const _minusQuantity = values?.quantity;

          if (_minusQuantity.toString().includes("-")) {
            errors.quantity = t("quantity_to_add_incorrect");
          }

          if (!values.quantity) {
            errors.quantity = t("fill_quantity_to_add");
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
                  storeId: _localData?.DATA?.storeId,
                },
                { headers }
              );
              if (res.status < 300) {
                callback(res.data);
                successAdd(
                  `${t("add_stock")} ${data?.name} (${values?.quantity}) ${t(
                    "complete"
                  )}`
                );
              }
            } catch (err) {
              errorAdd(t("fail_to_add_stock"));
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
                <Form.Label>{t("product_name")}</Form.Label>
                <Form.Control type="text" value={data?.name || "-"} disabled />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>{t("product_type")}</Form.Label>
                <Form.Control
                  type="text"
                  value={data?.stockCategoryId?.name || "-"}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("current_stock")}</Form.Label>
                <Form.Control
                  type="number"
                  value={data?.quantity || 0}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("quantity_to_add")}</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantity}
                  placeholder={t("quantity")}
                  isInvalid={errors.quantity}
                />
                {errors && errors.quantity}
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("note")}</Form.Label>
                <Form.Control
                  type="text"
                  name="note"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.note}
                  placeholder={t("note_")}
                  isInvalid={errors.note}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <input
                className="btn btn-danger"
                type="button"
                value={t("cancel")}
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
                {t("add_to_stock")}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
