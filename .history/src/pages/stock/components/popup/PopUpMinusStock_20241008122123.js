import React from "react";
import { Formik } from "formik";
import { Button, Modal, Form } from "react-bootstrap";
import * as consts from "../../../../constants";
import { getHeaders } from "../../../../services/auth";
import { getLocalData } from "../../../../constants/api";
import { END_POINT_SEVER } from "../../../../constants/api";
import axios from "axios";
import { successAdd, errorAdd } from "../../../../helpers/sweetalert";
import { useTranslation } from "react-i18next";

// -------------------------------------------------------------- //
export default function PopUpAddStock({ open, onClose, data = {}, callback }) {
  const { t } = useTranslation();

  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("delete_stock")}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{}}
        validate={(values) => {
          const errors = {};
          const _currentQuantity = data?.quantity;
          const _minusQuantity = values?.quantity;

          if (_minusQuantity > _currentQuantity) {
            errors.quantity = "ຈຳນວນທີ່ຕ້ອງການລົບບໍ່ຖືກຕ້ອງ";
          }

          if (_minusQuantity.toString().includes("-")) {
            errors.quantity = "ຈຳນວນທີ່ຕ້ອງການລົບບໍ່ຖືກຕ້ອງ";
          }

          if (!values.quantity) {
            errors.quantity = "ກະລຸນາປ້ອນຈຳນວນທີ່ຕ້ອງການເພີ່ມ...";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const fetchData = async () => {
            try {
              const header = await getHeaders();
              const _localData = await getLocalData();
              console.log(header);
              const res = await axios.put(
                `${END_POINT_SEVER}/v3/stock-export`,
                {
                  id: data?._id,
                  data: { quantity: values?.quantity },
                  storeId: _localData?.DATA?.storeId,
                },
                { headers: { ...header } }
              );
              if (res.status < 300) {
                callback(res.data);
                successAdd(
                  `ລົບສະຕ໊ອກ ${data?.name} (${values?.quantity}) ສຳເລັດ`
                );
              }
            } catch (err) {
              errorAdd(t("delete_stock"));
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
                <Form.Label>{t("prod_name")}</Form.Label>
                <Form.Control type="text" value={data?.name || "-"} disabled />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>{t("prod_mode")}</Form.Label>
                <Form.Control
                  type="text"
                  value={data?.stockCategoryId?.name || "-"}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("current_stoke")}</Form.Label>
                <Form.Control
                  type="number"
                  value={data?.quantity || 0}
                  disabled
                />
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("amount_wanna_delete")}</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantity}
                  placeholder={t("quantity_")}
                  isInvalid={errors.quantity}
                />
                {errors && errors.quantity}
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label> {t("note")}</Form.Label>
                <Form.Control
                  type="text"
                  name="note"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.note}
                  placeholder={t("no_te")}
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
                {t("delete_from_stock")}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
