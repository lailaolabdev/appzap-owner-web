import React, { useEffect, useState } from "react";
import useReactRouter from "use-react-router";
import { Formik } from "formik";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import TimePicker from "react-bootstrap-time-picker";
import moment from "moment";
import { Modal, Button, Image, Form } from "react-bootstrap";
import {
  END_POINT,
  HEADER,
  BODY,
  COLOR_APP,
  COLOR_APP_CANCEL,
  URL_PHOTO_AW3,
} from "../../constants";
import {
  USERS,
  USER,
  USERS_UPDATE,
  USERS_CREATE,
  USERS_DELETE,
  PRESIGNED_URL,
  getLocalData,
} from "../../constants/api";
import AnimationLoading from "../../constants/loading";
import profileImage from "../../image/profile.png";
import { STATUS_USERS } from "../../helpers";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import ButtonPrimary from "../../components/button/ButtonPrimary";
// services
import {
  addReservation,
  getReservation,
  updateReservation,
} from "../../services/reservation";
// popup
import PopUpConfirm from "../../components/popup/PopUpConfirm";
import { set } from "lodash";
import {
  RemoveFromQueue,
  StayCurrentLandscapeOutlined,
} from "@material-ui/icons";

// ---------------------------------------------------------------------------------------------------------- //
export default function ReservationList() {
  const { history, location, match } = useReactRouter();
  const _limit = match.params.limit;
  const _page = match.params.page;
  const [isLoading, setIsLoading] = useState(false);

  //   state
  const [reservationsData, setReservationsData] = useState();
  const [select, setSelect] = useState();
  const [popup, setPopup] = useState({
    delete: false,
    add: false,
    confirm: false,
    edit: false,
  });

  // functions
  const onReject = (select) => {
    setPopup((prev) => ({ ...prev, delete: true }));
    setSelect(select);
  };
  const onSubmitReject = async () => {
    updateReservation({ status: "CANCEL" }, select?._id).then(() => {
      setPopup((prev) => ({ ...prev, delete: false }));
      getData();
    });
  };
  const onConfirm = (select) => {
    setPopup((prev) => ({ ...prev, confirm: true }));
    setSelect(select);
  };
  const onSubmitConfirm = async () => {
    updateReservation({ status: "STAFF_CONFIRM" }, select?._id).then(() => {
      setPopup((prev) => ({ ...prev, confirm: false }));
      getData();
    });
  };
  const getData = async () => {
    const _localData = await getLocalData();
    const storeId = _localData?.DATA?.storeId;
    console.log("_localData", _localData);
    getReservation(storeId).then((e) => {
      setReservationsData(e);
    });
  };
  // useEffect
  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      {isLoading ? (
        <AnimationLoading />
      ) : (
        <>
          <div
            style={{
              padding: 30,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ fontSize: "20px" }}>
              ຈຳນວນລາຍການການຈອງໂຕະ ({reservationsData?.length})
            </div>
            <div>
              <ButtonPrimary
                style={{ color: "white" }}
                onClick={() => setPopup((prev) => ({ ...prev, add: true }))}
              >
                ເພີ່ມການຈອງ
              </ButtonPrimary>
            </div>
          </div>

          <div>
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ຊື່ລູກຄ້າ</th>
                  <th scope="col">ເບີໂທລະສັບ / Whatsapp</th>
                  <th scope="col">ສະຖານະ</th>
                  <th scope="col">ເວລາຈອງ</th>
                  <th scope="col">ຄອມເມນ</th>
                  <th scope="col">ຈັດການ</th>
                </tr>
              </thead>
              <tbody>
                {reservationsData?.map((item, index) => (
                  <tr key={index}>
                    <th scope="row">{index + 1}</th>
                    <td>{item?.clientNames?.[0]}</td>
                    <td>
                      {item?.clientPhone}/{item?.clientWhatsapp}
                    </td>
                    <td>
                      <div style={{ color: "green" }}>{item?.status}</div>
                    </td>
                    <td>
                      {(item?.startTime &&
                        moment.parseZone(item?.startTime).format("MM/HH:SS")) ||
                        "ບໍ່ໄດ້ຕັ້ງເວລາ"}{" "}
                      -{" "}
                      {(item?.endTime &&
                        moment.parseZone(item?.endTime).format("MM/HH:SS")) ||
                        "ບໍ່ໄດ້ຕັ້ງເວລາ"}
                    </td>
                    <td></td>
                    <td>
                      <div style={{ display: "flex", gap: 10 }}>
                        <ButtonPrimary
                          style={{ color: "white" }}
                          onClick={() => onConfirm(item)}
                        >
                          ຍືນຍັນ
                        </ButtonPrimary>
                        <ButtonPrimary
                          style={{ color: "white", backgroundColor: "red" }}
                          onClick={() => onReject(item)}
                        >
                          ປະຕິເສດ
                        </ButtonPrimary>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {/* >>>>>>>>>>>>> popup <<<<<<<<<<<<<<< */}
      <PopUpConfirm
        text1="ຖ່ານຕ້ອງການປະຕິເສດບໍ?"
        text2={select?.clientPhone}
        open={popup?.delete}
        onClose={() => setPopup((prev) => ({ ...prev, delete: false }))}
        onSubmit={onSubmitReject}
      />
      <PopUpConfirm
        text1="ຍືນຍັນການຈອງ"
        text2={select?.clientPhone}
        open={popup?.confirm}
        onClose={() => setPopup((prev) => ({ ...prev, confirm: false }))}
        onSubmit={onSubmitConfirm}
      />
      <PopAddReservation
        open={popup?.add}
        onClose={() => setPopup((prev) => ({ ...prev, add: false }))}
        onSubmit={async (e) => {
          alert(JSON.stringify(e));
          await addReservation(e);
          getData();
          setPopup((prev) => ({ ...prev, add: false }));
        }}
      />
    </div>
  );
}

const PopAddReservation = ({ open, text1, text2, onClose, onSubmit }) => {
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
