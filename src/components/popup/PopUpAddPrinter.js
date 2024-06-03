import React from "react";
import { Modal, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import { useStore } from "../../store/useStore";

export default function PopUpAddPrinter({ open, onClose, onSubmit, value }) {

  const { t } = useTranslation();

  // state
  const { storeDetail } = useStore();

  return (
    <Modal show={open} onHide={onClose} keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>ເພີ່ມປິນເຕີ້</Modal.Title>
      </Modal.Header>
      <Formik
        enableReinitialize={true}
        initialValues={{
          storeId: storeDetail?._id,
          name: value?.name,
          width: value?.width || "",
          type: value?.type || "",
          ip: value?.ip,
          cutPaper: value?.cutPaper || "cut", // Set default to "cut"
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "-";
          }
          if (!values.width) {
            errors.width = "-";
          }
          if (!values.type) {
            errors.type = "-";
          }
          if (!values.ip) {
            errors.ip = "-";
          }
          if (!values.cutPaper) { // Validate new field
            errors.cutPaper = "-";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values).then((e) => {});
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>
                  ຊື່ປິນເຕີ້ <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.name}
                  placeholder="ຊື່ປິນເຕີ້..."
                  isInvalid={errors?.name}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>
                  ຂະໜາດເຈ້ຍ <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="width"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.width}
                  isInvalid={errors?.width}
                >
                  <option value="" disabled>
                    -ເລືອກຂະໜາດເຈ້ຍ-
                  </option>
                  <option value="80mm">80mm</option>
                  <option value="58mm">58mm</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  ປະເພດປິນເຕີ <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="type"
                  onChange={(e) => {
                    handleChange(e);
                    if (e.target.value === "USB") {
                      setFieldValue("ip", "192.168.1.1");
                    } else {
                      setFieldValue("ip", "");
                    }
                  }}
                  onBlur={handleBlur}
                  value={values?.type}
                  isInvalid={errors?.type}
                >
                  <option value="" disabled>
                    -ເລືອກປະເພດປິນເຕີ-
                  </option>
                  <option value="ETHERNET">ETHERNET</option>
                  <option value="BLUETOOTH">BLUETOOTH</option>
                  <option value="USB">USB</option>
                </Form.Control>
              </Form.Group>
              {values?.type !== "USB" ? (
                <Form.Group>
                  <Form.Label>
                    IP or BT <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="ip"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values?.ip}
                    placeholder="192.168.x.x..."
                    isInvalid={errors?.ip}
                  />
                </Form.Group>
              ) : (
                ""
              )}
              <Form.Group>
                <Form.Label>
                  {t("billCutPaperTitle")} <span style={{ color: "red" }}>*</span>
                </Form.Label>
                <Form.Control
                  as="select"
                  name="cutPaper"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.cutPaper}
                  isInvalid={errors?.cutPaper}
                >
                  <option value="" disabled>
                    -Select Option-
                  </option>
                  <option value={"cut"}>{t("billCut")}</option>
                  <option value="not_cut">{t("billNoCut")}</option>
                </Form.Control>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#ffff",
                  border: 0,
                }}
                onClick={() => handleSubmit()}
              >
                ບັນທຶກປິນເຕີ້
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
