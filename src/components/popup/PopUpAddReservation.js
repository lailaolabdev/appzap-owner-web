import { Formik } from "formik";
import React, { useState } from "react";
import { COLOR_APP } from "../../constants";
import { Form, Modal, Button } from "react-bootstrap";
import moment from "moment";

const PopUpAddReservation = ({ open, text1, text2, onClose, onSubmit }) => {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const [startDate, setStartDate] = useState(
    moment.parseZone(Date.now()).format()
  );
  const [endDate, setEndDate] = useState(moment.parseZone(Date.now()).format());
  return (
    <Modal show={open} onHide={onClose}>
      <Modal.Header closeButton>ເພີ່ມງາຍການຈອງໂຕະ</Modal.Header>
      <Formik
        initialValues={{}}
        validate={(values) => {
          const errors = {};
          if (!values.clientPhone) {
            errors.clientPhone = "ກະລຸນາປ້ອນ...";
          }
          if (!values.clientWhatsapp) {
            errors.clientWhatsapp = "ກະລຸນາປ້ອນ...";
          }
          if (!values.clientNames[0]) {
            errors.clientNames = "ກະລຸນາປ້ອນ...";
          }
          if (!values.clientNumber) {
            errors.clientNumber = "ກະລຸນາປ້ອນ...";
          }
          if (values.clientNumber < 1) {
            errors.clientNumber = "ກະລຸນາປ້ອນ...";
          }
          if (!startTime) {
            errors.startTime = "ກະລຸນາປ້ອນ...";
          }
          if (!endTime) {
            errors.endTime = "ກະລຸນາປ້ອນ...";
          }
          if (!startDate) {
            errors.startDate = "ກະລຸນາປ້ອນ...";
          }
          if (!endDate) {
            errors.endDate = "ກະລຸນາປ້ອນ...";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          onSubmit(values).then(() => setSubmitting(false));
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
          setFieldValue,
        }) => (
          <form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>ຊື່ຜູ້ຈ້ອງ</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ຊື່"
                  name="clientNames[0]"
                  value={values?.clientNames?.[0]}
                  isInvalid={errors.clientNames}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>ເບີໂທລະສັບ</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ເບີໂທລະສັບ"
                  name="clientPhone"
                  value={values?.clientPhone}
                  isInvalid={errors.clientPhone}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>ເບີ Whatsapp</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="ເບີ Whatsapp"
                  name="clientWhatsapp"
                  value={values?.clientWhatsapp}
                  isInvalid={errors.clientWhatsapp}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>ຈຳນວນຄົນ</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ຈຳນວນຄົນ"
                  name="clientNumber"
                  value={values?.clientNumber}
                  isInvalid={errors.clientNumber}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flexGrow: 1 }}>
                    <Form.Label>ວັນທີມາ</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setFieldValue(
                          "startTime",
                          moment
                            .parseZone(
                              `${startDate} ${startTime}`,
                              "YYYY-MM-DD HH:mm"
                            )
                            .format()
                        );
                      }}
                      isInvalid={errors.startDate}
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <Form.Label>ເວລາມາ</Form.Label>
                    <Form.Control
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        setFieldValue(
                          "startTime",
                          moment
                            .parseZone(
                              `${startDate} ${startTime}`,
                              "YYYY-MM-DD HH:mm"
                            )
                            .format()
                        );
                      }}
                      isInvalid={errors.startTime}
                    />
                  </div>
                </div>
              </Form.Group>
              <Form.Group>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flexGrow: 1 }}>
                    <Form.Label>ວັນທີກັບ</Form.Label>
                    <Form.Control
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setFieldValue(
                          "endTime",
                          moment
                            .parseZone(
                              `${endDate} ${endTime}`,
                              "YYYY-MM-DD HH:mm"
                            )
                            .format()
                        );
                      }}
                      isInvalid={errors.endDate}
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <Form.Label>ເວລາກັບ</Form.Label>
                    <Form.Control
                      type="time"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        setFieldValue(
                          "endTime",
                          moment
                            .parseZone(
                              `${endDate} ${endTime}`,
                              "YYYY-MM-DD HH:mm"
                            )
                            .format()
                        );
                      }}
                      isInvalid={errors.endTime}
                    />
                  </div>
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>ຄອມເມນ</Form.Label>
                <Form.Control
                  as="textarea"
                  name="clientComment"
                  value={values?.clientComment}
                  onChange={handleChange}
                  isInvalid={errors.clientComment}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button
                disabled={buttonDisabled}
                variant="secondary"
                onClick={onClose}
              >
                ຍົກເລີກ
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#ffff",
                  border: 0,
                }}
              >
                ຢືນຢັນ
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
};

export default PopUpAddReservation;
