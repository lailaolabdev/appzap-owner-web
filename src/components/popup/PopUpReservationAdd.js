import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { COLOR_APP } from "../../constants";
import { Form, Modal, Button } from "react-bootstrap";
import moment from "moment";
import { useTranslation } from "react-i18next";

const PopUpReservationAdd = ({ value, open, onClose, onSubmit }) => {
  const { t } = useTranslation();
  const [startTime, setStartTime] = useState(
    moment(value?.startTime).format("HH:mm")
  );
  const [startDate, setStartDate] = useState(
    moment(value?.startTime).format("YYYY-MM-DD")
  );
  const handleClose = () => {
    setStartTime();
    setStartDate();
    onClose();
  };
  useEffect(() => {
    const _time = moment(value?.startTime).format("HH:mm");
    setStartDate(moment(value?.startTime).format("YYYY-MM-DD"));
    setStartTime(_time === "0:00" ? "12:00" : _time);
  }, [value]);
  return (
    <Modal show={open} onHide={handleClose}>
      <Modal.Header closeButton>{t('addBooking')}</Modal.Header>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...value,
          startTime: value?.startTime
        }}
        validate={(values) => {
          const errors = {};
          if (!values?.clientPhone) {
            errors.clientPhone = "ກະລຸນາປ້ອນ...";
          }
          if (values?.clientPhone < 1) {
            errors.clientPhone = "ກະລຸນາປ້ອນ...";
          }
          if (values?.clientPhone?.length < 8) {
            errors.clientPhone = "ກະລຸນາປ້ອນ...";
          }
          if (isNaN(parseInt(values?.clientPhone))) {
            errors.clientPhone = "ກະລຸນາປ້ອນ...";
          }
          if (!values?.clientNames?.[0]) {
            errors.clientNames = "ກະລຸນາປ້ອນ...";
          }
          if (!values?.clientNumber) {
            errors.clientNumber = "ກະລຸນາປ້ອນ...";
          }
          if (values?.clientNumber < 1) {
            errors.clientNumber = "ກະລຸນາປ້ອນ...";
          }
          if (isNaN(parseInt(values?.clientNumber))) {
            errors.clientNumber = "ກະລຸນາປ້ອນ...";
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const _startTime = moment(
            startDate + " " + startTime,
            "YYYY-MM-DD HH:mm"
          ).format();
          const _value = { ...values, startTime: _startTime };
          onSubmit(_value).then(() => {
            setStartTime();
            setStartDate();
            setSubmitting(false);
            // {
            //   ("YYYY-MM-DD HH:mm");
            // }
          });
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
                <Form.Label>{t('bookedBy')}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ຊື່"
                  name="clientNames[0]"
                  value={values?.clientNames?.[0]}
                  isInvalid={errors.clientNames}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{t('phoneNumberOfBooked')}</Form.Label>
                <Form.Control
                  type="text"
                  maxlength="8"
                  placeholder="ເບີໂທລະສັບ 8 ໂຕເລກ"
                  name="clientPhone"
                  value={values?.clientPhone}
                  isInvalid={errors.clientPhone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>{t('numberOfPeople')}</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="ຈຳນວນຄົນ"
                  name="clientNumber"
                  value={values?.clientNumber}
                  isInvalid={errors.clientNumber}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </Form.Group>
              <Form.Group>
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flexGrow: 1 }}>
                    <Form.Label>{t('date')}</Form.Label>
                    <Form.Control
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                      }}
                      isInvalid={!startDate}
                      onBlur={handleBlur}
                    />
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <Form.Label>{t('time')}</Form.Label>
                    <Form.Control
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                      }}
                      onBlur={handleBlur}
                      isInvalid={!startTime}
                    />
                  </div>
                </div>
              </Form.Group>
              <Form.Group>
                <Form.Label>{t('comment')}</Form.Label>
                <Form.Control
                  as="textarea"
                  name="clientComment"
                  value={values?.clientComment}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={errors.clientComment}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>{t('tableStatus2')}</Form.Label>
                <Form.Control
                  as="textarea"
                  name="note"
                  value={values?.note}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isInvalid={errors.note}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button type="button" variant="secondary" onClick={handleClose}>
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

export default PopUpReservationAdd;
