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

  // Predefined reasons for stock deletion
  const deletionReasons = [
    { value: "ໝົດອາຍຸ", label: "ໝົດອາຍຸ" },
    { value: "ເສຍຫາຍ", label: "ເສຍຫາຍ" },
    { value: "ສົ່ງຄືນ", label: "ສົ່ງຄືນ" },
    { value: "ສູນຫາຍ", label: "ສູນຫາຍ" },
    { value: "ຂາຍແລ້ວ", label: "ຂາຍແລ້ວ" },
    { value: "ໂອນຍ້າຍ", label: "ໂອນຍ້າຍ" },
    { value: "ມີບັນຫາຄຸນນະພາບ", label: "ມີບັນຫາຄຸນນະພາບ" }
  ];

  return (
    <Modal show={open} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("delete_stock")}</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          quantity: "",
          reason: "",
          note: ""
        }}
        validate={(values) => {
          const errors = {};
          const _currentQuantity = data?.quantity;
          const _minusQuantity = Number(values?.quantity);

          // Validate quantity
          if (!values.quantity) {
            errors.quantity = t("please_fill_quantity_to_delete");
          } else if (_minusQuantity > _currentQuantity) {
            errors.quantity = t("quantity_to_delete_incorrect");
          } else if (_minusQuantity <= 0) {
            errors.quantity = t("quantity_must_be_positive");
          }

          // Validate reason
          if (!values.reason) {
            errors.reason = t("please_select_reason");
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
                  data: { 
                    quantity: Number(values?.quantity),
                    reason: values?.reason,
                    note: values?.note || ""
                  },
                  storeId: _localData?.DATA?.storeId,
                },
                { headers: { ...header } }
              );
              if (res.status < 300) {
                callback(res.data);
                successAdd(
                  `${t("delete_stock")} ${data?.name} (${values?.quantity}) ${t(
                    "complete"
                  )}`
                );
              }
            } catch (err) {
              errorAdd(t("fail_to_delete_stock"));
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
              <Form.Group controlId="productName">
                <Form.Label>{t("product_name")}</Form.Label>
                <Form.Control type="text" value={data?.name || "-"} disabled />
              </Form.Group>
              
              <Form.Group controlId="productType">
                <Form.Label>{t("product_type")}</Form.Label>
                <Form.Control
                  type="text"
                  value={data?.stockCategoryId?.name || "-"}
                  disabled
                />
              </Form.Group>
              
              <Form.Group controlId="currentStock">
                <Form.Label>{t("current_stock")}</Form.Label>
                <Form.Control
                  type="number"
                  value={data?.quantity || 0}
                  disabled
                />
              </Form.Group>
              
              <Form.Group controlId="quantityToDelete">
                <Form.Label>{t("quantity_to_delete")}</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantity}
                  placeholder={t("quantity")}
                  isInvalid={touched.quantity && errors.quantity}
                />
                {touched.quantity && errors.quantity && (
                  <Form.Control.Feedback type="invalid">
                    {errors.quantity}
                  </Form.Control.Feedback>
                )}
              </Form.Group>

              <Form.Group controlId="deletionReason">
                <Form.Label>{t("reason")} *</Form.Label>
                <Form.Control
                  as="select"
                  name="reason"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.reason}
                  isInvalid={touched.reason && errors.reason}
                >
                  <option value="">{t("select_reason")}</option>
                  {deletionReasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
                      {reason.label}
                    </option>
                  ))}
                </Form.Control>
                {touched.reason && errors.reason && (
                  <Form.Control.Feedback type="invalid">
                    {errors.reason}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              
              <Form.Group controlId="additionalNote">
                <Form.Label>{t("note")}</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="note"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.note}
                  placeholder={t("note")}
                  isInvalid={touched.note && errors.note}
                />
                {touched.note && errors.note && (
                  <Form.Control.Feedback type="invalid">
                    {errors.note}
                  </Form.Control.Feedback>
                )}
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
                {isSubmitting ? t("processing") : t("delete_from_stock")}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}