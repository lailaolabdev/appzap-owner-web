import React, { useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import { BODY, COLOR_APP } from "../../../../constants";
import { END_POINT_SEVER, getLocalData } from "../../../../constants/api";
import { getHeaders } from "../../../../services/auth";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function PopUpAddCategory({ onClose, data, open, callback }) {
  const { t } = useTranslation();
  const _createCategory = async (values) => {
    const _localData = await getLocalData();
    if (_localData) {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      await axios({
        method: "POST",
        url: END_POINT_SEVER + "/v3/stock-category/create",
        data: {
          storeId: _localData?.DATA?.storeId,
          name: values?.name,
          note: values?.note,
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
  };
  return (
    <Modal show={open} onHide={onClose}>
      <Formik
        initialValues={{
          name: "",
          note: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = `${t("fill_stock_type_name")}`;
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          _createCategory(values);
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
            <Modal.Header closeButton>
              <Modal.Title>{t("add_stock_type")}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("stock_type_name")}</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder={t("stock_type_name")}
                />
              </Form.Group>
              <div style={{ color: "red" }}>
                {errors.name && touched.name && errors.name}
              </div>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>{t("note")}</Form.Label>
                <Form.Control
                  type="text"
                  name="note"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.note}
                  placeholder={t("note")}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={onClose}>
                {t("cancel")}
              </Button>
              <Button
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#ffff",
                  border: 0,
                }}
                onClick={() => handleSubmit()}
              >
                {t("add")}
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
