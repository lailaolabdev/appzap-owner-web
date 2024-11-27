import React, { useEffect, useState } from "react";
import {
  Card,
  Breadcrumb,
  Modal,
  Tab,
  Tabs,
  Form,
  Button,
} from "react-bootstrap";
import { BsCurrencyExchange } from "react-icons/bs";
import Box from "../../components/Box";
import { useTranslation } from "react-i18next";
import { COLOR_APP } from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import { Formik } from "formik";
import { useStore } from "../../store";
import { manageCounterService } from "../../services/manageCounterService";

export default function ManageCounterList() {
  const { t } = useTranslation();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCounter, setSelectedCounter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { storeDetail } = useStore();
  const [count, setCount] = useState(null);

  const storeId = storeDetail._id;

  const [data, setData] = useState([{ label: `${t("inc_expe")}` }]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await manageCounterService.getManageCounter(storeId);
      setCount(response?.data[0] || null);
    } catch (error) {
      console.error(
        "Error fetching manage counter:",
        error.response?.data || error.message
      );
      setError(error.response?.data?.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [storeId]);

  const handleShowPopup = (counter) => {
    setSelectedCounter({
      ...counter,
      manageCounter: counter?.manageCounter || 1,
    });
    setShowPopup(true);
  };

  const handleCloseEdit = () => {
    setShowPopup(false);
    setSelectedCounter(null);
    setError(null);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setSubmitting(true);
      setError(null);

      if (!count?._id) {
        await manageCounterService.createManageCounter({
          manageCounter: values.manageCounter,
          storeId: storeId,
        });
      } else {
        await manageCounterService.updateManageCounter(count._id, values);
      }

      await fetchData();
      handleCloseEdit();
    } catch (error) {
      console.error("Error saving counter:", error);
      setError(error.response?.data?.message || "Error saving counter");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
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
          <Breadcrumb.Item>{t("setting")}</Breadcrumb.Item>
          <Breadcrumb.Item>{t("staff_report")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("manage_counter")}</Breadcrumb.Item>
        </Breadcrumb>

        {error && <div className="alert alert-danger">{error}</div>}

        <Tabs defaultActiveKey="counter-list">
          <Tab eventKey="counter-list" style={{ paddingTop: 20 }}>
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
                <span>
                  <BsCurrencyExchange /> {t("manage_counter")}
                </span>
              </Card.Header>
              <Card.Body style={{ overflowX: "auto" }}>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <table style={{ width: "100%" }}>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>{t("list")}</th>
                        <th>{t("_manage")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((e, index) => (
                        <tr key={e._id}>
                          <td>{index + 1}</td>
                          <td>{e.label}</td>
                          <td
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "10px",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              style={{ color: COLOR_APP, cursor: "pointer" }}
                              onClick={() => handleShowPopup(count)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Card.Body>
            </Card>
          </Tab>
        </Tabs>

        <Modal
          show={showPopup}
          onHide={handleCloseEdit}
          backdrop="static"
          keyboard={false}
        >
          <Modal.Header closeButton>
            <Modal.Title>{t("edit_number_of_day")}</Modal.Title>
          </Modal.Header>
          <Formik
            enableReinitialize
            initialValues={{
              manageCounter: selectedCounter?.manageCounter ?? 0,
            }}
            validate={(values) => {
              const errors = {};
              if (values.manageCounter === "" || values.manageCounter === 0) {
                errors.manageCounter = t("please_enter_valid_number_of_day");
              }
              return errors;
            }}
            onSubmit={handleSubmit}
          >
            {({
              handleChange,
              handleSubmit,
              values,
              isSubmitting,
              errors,
              touched,
            }) => (
              <form onSubmit={handleSubmit}>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label style={{ fontWeight: "bold" }}>
                      {t("number_of_day")}{" "}
                      <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="manageCounter"
                      value={values.manageCounter}
                      onChange={handleChange}
                      isInvalid={
                        !!errors.manageCounter && touched.manageCounter
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.manageCounter}
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
                    {isSubmitting ? t("confirm...") : t("confirm")}
                  </Button>
                </Modal.Footer>
              </form>
            )}
          </Formik>
        </Modal>
      </Box>
    </>
  );
}
