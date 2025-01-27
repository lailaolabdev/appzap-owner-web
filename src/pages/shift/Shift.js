import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { faEdit, faTrashAlt, faClock } from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal, Card, Nav, Pagination } from "react-bootstrap";
import { MdAssignmentAdd } from "react-icons/md";
import { BsFillCalendarWeekFill } from "react-icons/bs";
import ReactPaginate from "react-paginate";
import { Formik } from "formik";
import { useTranslation } from "react-i18next";
import { Breadcrumb, Tab, Tabs } from "react-bootstrap";
import Box from "../../components/Box";
import { COLOR_APP } from "../../constants";
import Loading from "../../components/Loading";
import { useStore } from "../../store";
import theme from "../../theme";
import EmptyImage from "../../image/empty-removebg.png";
import PopUpSetStartAndEndDate from "../../components/popup/PopUpSetStartAndEndDate";
import {
  getAllShift,
  CreateShift,
  DeleteShift,
  updateShift,
  CloseShift,
  OpenShift,
  GetHistoryShift,
} from "../../services/shift";
import Swal from "sweetalert2";

import { useStoreStore } from "../../zustand/storeStore";
import { useShiftStore } from "../../zustand/ShiftStore";
import TimeShift from "../../components/TimeShift";
import { values } from "lodash";
import ButtonPrimary from "../../components/button/ButtonPrimary";
import { errorAdd, successAdd } from "../../helpers/sweetalert";
import convertNumber from "./../../helpers/convertNumber";

export default function ShiftList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showOpenShiftPopUp, setShowOpenShiftPopUp] = useState(false);

  const { profile } = useStore();

  const { storeDetail, setStoreDetail } = useStoreStore();
  const { getShift, shiftList } = useShiftStore();
  const [shiftHistory, setShiftHistory] = useState([]);
  const [edit, setEdit] = useState(null);
  const [shifData, setShifData] = useState(null);
  const [changeUi, setChangeUi] = useState("");
  const [startDate, setStartDate] = useState(moment().format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment().format("YYYY-MM-DD"));
  const [startTime, setStartTime] = useState("00:00:00");
  const [endTime, setEndTime] = useState("23:59:59");
  const [popup, setPopup] = useState(false);

  const [pagination, setPagination] = useState(1);
  const [totalPages, setTotalPages] = useState();

  let limitData = 10;

  const handleShowAdd = () => setShowAdd(true);
  const handleCloseAdd = () => setShowAdd(false);
  const handleShowEdit = async (data) => {
    setEdit(data);
    setShowEdit(true);
  };
  const handleCloseEdit = () => setShowEdit(false);
  const handleShowDelete = (data) => {
    setEdit(data);
    setShowDelete(true);
  };
  const handleShowShiftPopUp = (data) => {
    setShifData(data);
    setShowOpenShiftPopUp(true);
  };
  const handleCloseDelete = () => setShowDelete(false);
  const handleCloseShiftPopUp = () => setShowOpenShiftPopUp(false);

  const fetchShift = async () => {
    setIsLoading(true);
    await getAllShift()
      .then((res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  const fetchHistoryShift = async () => {
    let findBy = "";
    findBy += `skip=${(pagination - 1) * limitData}&`;
    findBy += `limit=${limitData}&`;
    findBy += `startDate=${startDate}&endDate=${endDate}`;
    await GetHistoryShift(findBy)
      .then((res) => {
        setShiftHistory(res?.data?.data);
        setTotalPages(Math.ceil(res?.data?.count / limitData));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const GetOpenShift = async (startDate) => {
    const endDate = startDate; // Same date range for a single day
    const findBy = `startDate=${startDate}&endDate=${endDate}&status=OPEN`;
    await getShift(findBy);
  };

  const handleCloseShift = async () => {
    await CloseShift(shifData?._id)
      .then((res) => {
        successAdd("ປິດກະສຳເລັດ");
        setShowOpenShiftPopUp(false);
        fetchShift();
        GetOpenShift(startDate);
      })
      .catch((err) => {
        setShowOpenShiftPopUp(false);
        if (err?.response?.data?.type === "table") {
          Swal.fire({
            title: "ຄຳເຕືອນ!",
            text: "ກະລຸນາປິດໂຕະທັງໝົດກ່ອນທີ່ຈະປິດກະລົງ",
            icon: "warning",
            // confirmButtonColor: COLOR_APP,
            // confirmButtonText: "ປິດ",
            showConfirmButton: false,
            timer: 2500,
          });
        } else {
          errorAdd("ບໍ່ສາມາດປິດກະສໄດ້ !!");
        }
      });
  };
  const handleOpenShift = async (values) => {
    await OpenShift(shifData?._id)
      .then((res) => {
        successAdd("ເປິດກະສຳເລັດ");
        setShowOpenShiftPopUp(false);
        fetchShift();
        GetOpenShift(startDate);
      })
      .catch((err) => {
        errorAdd("ກະລຸນາປິດກະທີ່ເປີດຢູ່ກ່ອນທີ່ຈະເປີດກະໃໝ່");
        setShowOpenShiftPopUp(false);
        console.log(err);
      });
  };

  useEffect(() => {
    fetchShift();
    fetchHistoryShift();
    setStoreDetail({
      changeUi: "LIST_SHIFT",
    });
  }, []);
  useEffect(() => {
    fetchHistoryShift();
  }, [startDate, endDate]);

  const _create = async (values) => {
    const data = {
      ...values,
      storeId: storeDetail?._id,
      createdBy: profile?.data?._id,
    };

    setIsLoading(true);
    try {
      await CreateShift(data)
        .then((res) => {
          if (res.data) {
            Swal.fire({
              icon: "success",
              title: t("add_data_success"),
              showConfirmButton: false,
              timer: 1500,
            });
            handleCloseAdd();
            fetchShift();
          } else {
            Swal.fire({
              icon: "error",
              title: "ກະນີ້ມີຢູ່ໃນລະບົບແລ້ວ. ກະລຸນາເພີ່ມກະໃໝ່",
              showConfirmButton: false,
              timer: 1500,
            });
            handleCloseAdd();
          }
        })
        .catch((err) => {
          if (err) {
            Swal.fire({
              icon: "error",
              title: t("error_add_shift"),
              showConfirmButton: false,
              timer: 1500,
            });
            handleCloseAdd();
          }
        });
    } catch (error) {
      console.error("Error Create shift failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const _edit = async (values) => {
    const data = {
      ...values,
      storeId: storeDetail?._id,
      createdBy: profile?.data?._id,
    };
    setIsLoading(true);
    try {
      await updateShift(data, edit._id).then((res) => {
        if (res.status) {
          Swal.fire({
            icon: "success",
            title: t("updated"),
            showConfirmButton: false,
            timer: 1500,
          });
          handleCloseEdit();
          fetchShift();
        } else {
          Swal.fire({
            icon: "error",
            title: t("error"),
            showConfirmButton: false,
            timer: 1500,
          });
          handleCloseEdit();
        }
      });
      fetchShift();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("error"),
        showConfirmButton: false,
        timer: 1500,
      });
      handleCloseEdit();
    } finally {
      setIsLoading(false);
    }
  };

  const _confirmDelete = async () => {
    setIsLoading(true);
    try {
      await DeleteShift(edit?._id).then((res) => {
        if (res.status) {
          Swal.fire({
            icon: "success",
            title: t("delete_data_success"),
            showConfirmButton: false,
            timer: 1500,
          });
          handleCloseDelete();
          fetchShift();
        } else {
          Swal.fire({
            icon: "error",
            title: t("error"),
            showConfirmButton: false,
            timer: 1500,
          });
          fetchShift();
          handleCloseDelete();
        }
      });
    } catch (error) {
      console.error("Error deleting bank:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? <Loading /> : ""}
      <Box
        sx={{ padding: { md: 20, xs: 10 } }}
        style={{
          maxHeight: "100vh",
          height: "100%",
          overflowY: "auto",
          padding: "20px 20px 80px 20px",
        }}
      >
        <Breadcrumb>
          <Breadcrumb.Item
            onClick={() => navigate(`/settingStore/${useStoreStore?._id}`)}
          >
            {t("setting")}
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{t("shift")}</Breadcrumb.Item>
        </Breadcrumb>
        <Box
          sx={{
            fontWeight: "bold",
            backgroundColor: "#f2f2f0",
            border: "none",
            display: "grid",
            gridTemplateColumns: {
              md: "repeat(5,1fr)",
              sm: "repeat(3,1fr)",
              xs: "repeat(2,1fr)",
            },
            marginBottom: "10px",
            height: 35,
          }}
        >
          <Nav.Item>
            <Nav.Link
              eventKey="/listShift"
              style={{
                color: theme.primaryColor,
                backgroundColor:
                  storeDetail.changeUi === "LIST_SHIFT" ? theme.mutedColor : "",
                border: "none",
                height: 35,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                setChangeUi("LIST_SHIFT");
                fetchShift();
                setStoreDetail({
                  changeUi: "LIST_SHIFT",
                });
              }}
            >
              {/* <FontAwesomeIcon icon={faList}></FontAwesomeIcon>{" "} */}
              <div style={{ width: 8 }} />
              <span>{t("shift")}</span>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/list_Shift_history"
              style={{
                color: theme.primaryColor,
                backgroundColor:
                  storeDetail.changeUi === "LIST_SHIFT_HISTORY"
                    ? theme.mutedColor
                    : "",
                border: "none",
                height: 35,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
              onClick={() => {
                setChangeUi("LIST_SHIFT_HISTORY");
                fetchHistoryShift();
                setStoreDetail({
                  changeUi: "LIST_SHIFT_HISTORY",
                });
              }}
            >
              {/* <FontAwesomeIcon icon={faList}></FontAwesomeIcon>{" "} */}
              <div style={{ width: 8 }} />
              <span>{t("shift_history")}</span>
            </Nav.Link>
          </Nav.Item>
        </Box>
        {storeDetail.changeUi === "LIST_SHIFT" && (
          <Tabs defaultActiveKey="currency-list">
            <Tab eventKey="currency-list" style={{ paddingTop: 20 }}>
              <Card border="primary" style={{ margin: 0 }}>
                <Card.Header
                  style={{
                    backgroundColor: COLOR_APP,
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <span>{t("shift_list")}</span>
                  {profile?.data?.role === "APPZAP_ADMIN" && (
                    <Button
                      variant="dark"
                      onClick={handleShowAdd}
                      className="w-20 h-9"
                    >
                      <span className="flex gap-1 items-center ">
                        <MdAssignmentAdd /> {t("add")}
                      </span>
                    </Button>
                  )}
                </Card.Header>
                <Card.Body style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th style={{ textWrap: "nowrap" }}>
                          {t("shift_name")}
                        </th>
                        <th style={{ textWrap: "nowrap" }}>{t("period")}</th>
                        <th style={{ textWrap: "nowrap" }}>{t("status")}</th>
                        <th className="text-center">{t("manage_data")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shiftList?.length > 0 ? (
                        shiftList?.map((data, index) => (
                          <tr key={data._id}>
                            <td className="text-left">{index + 1}</td>
                            <td className="text-left">{data?.shiftName}</td>
                            <td className="text-left">
                              {`${data?.startTime} - ${data?.endTime}`}
                            </td>
                            <td className="text-left">
                              {data?.status === "OPEN" ? (
                                <span className="text-green-500 font-bold">
                                  {t("open_shift")}
                                </span>
                              ) : (
                                <span className="text-red-500 font-bold">
                                  {t("close")}
                                </span>
                              )}
                            </td>
                            <td className="flex gap-2 justify-center">
                              <ButtonPrimary
                                onClick={() => handleShowShiftPopUp(data)}
                                // disabled={data?.status === "OPEN"}
                                className="w-16 h-8 text-white flex gap-1 items-center"
                              >
                                <FontAwesomeIcon
                                  className="text-[12px]"
                                  icon={faClock}
                                />{" "}
                                {data?.status === "OPEN"
                                  ? t("close")
                                  : t("open_shift")}
                              </ButtonPrimary>
                              {profile?.data?.role === "APPZAP_ADMIN" && (
                                <>
                                  <ButtonPrimary
                                    onClick={() => handleShowEdit(data)}
                                    disabled={data?.status === "OPEN"}
                                    className="w-16 h-8 text-white"
                                  >
                                    <FontAwesomeIcon icon={faEdit} />
                                  </ButtonPrimary>
                                  <ButtonPrimary
                                    onClick={() => handleShowDelete(data)}
                                    disabled={data?.status === "OPEN"}
                                    className="w-16 h-8 text-white"
                                  >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                  </ButtonPrimary>
                                </>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">
                            <div className="flex justify-center items-center">
                              <img
                                src={EmptyImage}
                                alt=""
                                width={300}
                                height={200}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        )}
        {storeDetail.changeUi === "LIST_SHIFT_HISTORY" && (
          <Tabs defaultActiveKey="currency-list">
            <Tab eventKey="currency-list" style={{ paddingTop: 20 }}>
              <Card border="primary" style={{ margin: 0 }}>
                <Card.Header
                  style={{
                    backgroundColor: COLOR_APP,
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "bold",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: 10,
                  }}
                >
                  <span>{t("shift_history")}</span>
                </Card.Header>
                <Card.Body style={{ overflowX: "auto" }}>
                  <div className="flex items-center gap-2">
                    <div>ເລືອກວັນທີ : </div>
                    <Button
                      variant="outline-primary"
                      size="small"
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                      className="flex gap-2"
                      onClick={() => setPopup({ popupfiltter: true })}
                    >
                      <BsFillCalendarWeekFill />
                      <div>
                        {startDate} {startTime}
                      </div>{" "}
                      ~{" "}
                      <div>
                        {endDate} {endTime}
                      </div>
                    </Button>
                  </div>
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th style={{ textWrap: "nowrap" }}>
                          {t("shift_name")}
                        </th>
                        <th style={{ textWrap: "nowrap" }}>{t("period")}</th>
                        <th style={{ textWrap: "nowrap" }}>{t("status")}</th>
                        {/* <th className="text-right">{t("pricesTotal")}</th> */}
                        <th className="text-center">{t("time")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shiftHistory.length > 0 ? (
                        shiftHistory.map((data, index) => (
                          <tr key={data._id}>
                            <td className="text-left">{index + 1}</td>
                            <td className="text-left">
                              {data?.shiftId?.shiftName}
                            </td>
                            <td className="text-left">
                              {`${data?.shiftId?.startTime} - ${data?.shiftId?.endTime}`}
                            </td>
                            <td className="text-left">
                              {data?.status === "OPEN" ? (
                                <span className="text-green-500 font-bold">
                                  ເປິດ
                                </span>
                              ) : (
                                <span className="text-red-500 font-bold">
                                  ປິດ
                                </span>
                              )}
                            </td>
                            {/* <td className="text-right">
                              {convertNumber(data?.initialCashShift)}
                            </td> */}
                            <td className="flex gap-2 justify-center">
                              {moment(data?.createdAt).format(
                                "YYYY-MM-DD HH:ss A"
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="text-center">
                            <div className="flex justify-center items-center">
                              <img
                                src={EmptyImage}
                                alt=""
                                width={300}
                                height={200}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      width: "100%",
                      bottom: 20,
                    }}
                  >
                    <ReactPaginate
                      previousLabel={
                        <span className="glyphicon glyphicon-chevron-left">
                          {"ກ່ອນໜ້າ"}
                        </span>
                      }
                      nextLabel={
                        <span className="glyphicon glyphicon-chevron-right">
                          {"ຕໍ່ໄປ"}
                        </span>
                      }
                      breakLabel={
                        <Pagination.Item disabled>...</Pagination.Item>
                      }
                      breakClassName={"break-me"}
                      pageCount={totalPages} // Replace with the actual number of pages
                      marginPagesDisplayed={1}
                      pageRangeDisplayed={3}
                      onPageChange={(e) => {
                        console.log(e);
                        setPagination(e?.selected + 1);
                      }}
                      containerClassName={"pagination justify-content-center"} // Bootstrap class for centering
                      pageClassName={"page-item"}
                      pageLinkClassName={"page-link"}
                      activeClassName={"active"}
                      previousClassName={"page-item"}
                      nextClassName={"page-item"}
                      previousLinkClassName={"page-link"}
                      nextLinkClassName={"page-link"}
                    />
                  </div>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        )}

        {/* Create Modal */}

        <Modal
          show={showAdd}
          onHide={handleCloseAdd}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("shift_list_add")}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              shiftName: "",
              startTime: "",
              endTime: "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.shiftName) {
                errors.shiftName = t("enter_shift");
              }
              if (!values.startTime) {
                errors.startTime = t("ກະລຸນາປ້ອນເວລາເປີດ"); // "Please enter the start time"
              }
              if (!values.endTime) {
                errors.endTime = t("ກະລຸນາປ້ອນເວລາປີດ"); // "Please enter the end time"
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _create(values); // Call the _create function
              setSubmitting(false); // Reset submitting status
              console.log("Submitted Values", values); // Debugging
            }}
          >
            {({
              handleChange,
              handleSubmit,
              isSubmitting,
              errors,
              touched,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  {/* Shift Name Input */}
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_name")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="shiftName"
                      onChange={handleChange}
                      placeholder={t("shift_name")}
                      isInvalid={!!errors.shiftName && touched.shiftName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.shiftName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {/* Start Time Input */}
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_time_open")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <TimeShift
                      name="startTime"
                      value={values.startTime}
                      isInvalid={!!errors.startTime && touched.startTime}
                      onChange={(startTime) =>
                        setFieldValue("startTime", startTime)
                      }
                    />
                    {errors.startTime && touched.startTime && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        {errors.startTime}
                      </div>
                    )}
                  </Form.Group>

                  {/* End Time Input */}
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_time_close")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <TimeShift
                      name="endTime"
                      value={values.endTime}
                      isInvalid={!!errors.endTime && touched.endTime}
                      onChange={(endTime) => setFieldValue("endTime", endTime)}
                    />
                    {errors.endTime && touched.endTime && (
                      <div
                        style={{
                          color: "red",
                          fontSize: "12px",
                          marginTop: "5px",
                        }}
                      >
                        {errors.endTime}
                      </div>
                    )}
                  </Form.Group>
                </Modal.Body>

                {/* Modal Footer */}
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseAdd}>
                    {t("cancel")}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("saving") : t("save")}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>

        {/* Edit Modal */}
        <Modal
          show={showEdit}
          onHide={handleCloseEdit}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("shift_list_edit")}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              shiftName: edit?.shiftName || "",
              startTime: edit?.startTime || "",
              endTime: edit?.endTime || "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.shiftName) {
                errors.shiftName = t("enter_shift");
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              _edit(values);
              setSubmitting(false); // reset submitting status
            }}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              isSubmitting,
              errors,
              touched,
              setFieldValue,
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_name")} <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="shiftName"
                      value={values.shiftName}
                      onChange={handleChange}
                      placeholder={t("shift_name")}
                      isInvalid={!!errors.shiftName && touched.shiftName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.shiftName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_time_open")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <TimeShift
                      name="startTime"
                      value={values?.startTime}
                      isInvalid={!!errors.startTime && touched.startTime}
                      onChange={(startTime) =>
                        setFieldValue("startTime", startTime)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.startTime}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("shift_time_close")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <TimeShift
                      name="endTime"
                      value={values?.endTime}
                      isInvalid={!!errors.endTime && touched.endTime}
                      onChange={(endTime) => setFieldValue("endTime", endTime)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.endTime}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleCloseEdit}>
                    {t("cancel")}
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "ກຳລັງບັນທຶກ..." : "ບັນທຶກ"}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>

        {/* Open shift */}
        <Modal
          show={showOpenShiftPopUp}
          onHide={handleCloseShiftPopUp}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header
            closeButton
            style={{
              backgroundColor: COLOR_APP,
              color: "#fff",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            <Modal.Title>
              {shifData?.status === "OPEN" ? t("shift_close") : t("shift_open")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {shifData?.status === "OPEN" ? (
              <div className="flex flex-col items-center">
                <div>
                  <FontAwesomeIcon
                    className="text-[5rem] text-orange-500"
                    icon={faClock}
                  />
                </div>
                <div className="mt-4">
                  <p>ທ່ານຕ້ອງການປິດກະ {shifData?.shiftName} ແມ່ນບໍ່ ? </p>
                </div>

                <div className="flex gap-2 justify-center items-center">
                  <Button variant="danger" onClick={handleCloseShiftPopUp}>
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleCloseShift}>{t("confirm")}</Button>
                </div>
              </div>
            ) : (
              <Formik
                enableReinitialize
                initialValues={{
                  initialCashShift: "",
                }}
                validate={(values) => {
                  const errors = {};
                  if (!values.initialCashShift) {
                    errors.initialCashShift = t("enter_money_shift");
                  }
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  handleOpenShift(values);
                  setSubmitting(false); // reset submitting status
                }}
              >
                {({
                  handleChange,
                  handleSubmit,
                  isSubmitting,
                  errors,
                  touched,
                }) => (
                  <form onSubmit={handleSubmit}>
                    <Modal.Body>
                      {/* <Form.Group>
                        <Form.Label
                          style={{ fontWeight: "bold", marginBottom: "25px" }}
                        >
                          {t("enter_amount_to_start")}{" "}
                          <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="initialCashShift"
                          value={values?.initialCashShift}
                          onChange={handleChange}
                          placeholder="0"
                          isInvalid={
                            !!errors.initialCashShift &&
                            touched.initialCashShift
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.initialCashShift}
                        </Form.Control.Feedback>
                      </Form.Group> */}
                      <div className="flex flex-col items-center">
                        <div>
                          <FontAwesomeIcon
                            className="text-[5rem] text-orange-500"
                            icon={faClock}
                          />
                        </div>
                        <div className="mt-4">
                          <p>
                            ທ່ານຕ້ອງການເປິດກະ {shifData?.shiftName} ແມ່ນບໍ່ ?{" "}
                          </p>
                        </div>
                      </div>
                    </Modal.Body>
                    <Modal.Footer
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      {shifData?.status === "OPEN" ? (
                        <div className="flex gap-2 justify-center items-center">
                          <Button
                            variant="danger"
                            onClick={handleCloseShiftPopUp}
                          >
                            {t("cancel")}
                          </Button>
                          <Button onClick={handleCloseShift}>
                            {t("confirm")}
                          </Button>
                        </div>
                      ) : (
                        <Button
                          style={{ width: "100%" }}
                          type="submit"
                          onClick={handleOpenShift}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "ກຳລັງ..." : t("shift_open")}
                        </Button>
                      )}
                    </Modal.Footer>
                  </form>
                )}
              </Formik>
            )}
          </Modal.Body>
        </Modal>

        {/* Delete Modal */}
        <Modal
          show={showDelete}
          onHide={handleCloseDelete}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("delete_shift")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>ທ່ານຢືນຢັນບໍ່ວ່າຈະລຶບ {edit?.shiftName} ອອກຈາກລະບົບ?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseDelete}>
              {t("cancel")}
            </Button>
            <Button variant="danger" onClick={_confirmDelete}>
              {"ລຶບ"}
            </Button>
          </Modal.Footer>
        </Modal>
      </Box>

      <PopUpSetStartAndEndDate
        open={popup?.popupfiltter}
        onClose={() => setPopup()}
        startDate={startDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        endDate={endDate}
        setStartTime={setStartTime}
        startTime={startTime}
        setEndTime={setEndTime}
        endTime={endTime}
      />
    </>
  );
}
