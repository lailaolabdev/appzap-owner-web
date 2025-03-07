import React, { useEffect, useState } from "react";
import {
  Card,
  Breadcrumb,
  Button,
  InputGroup,
  Form,
  Modal,
  Spinner,
} from "react-bootstrap";
import {
  BsArrowCounterclockwise,
  BsFillCalendarWeekFill,
  BsInfoCircle,
} from "react-icons/bs";
import { MdAssignmentAdd, MdOutlineCloudDownload } from "react-icons/md";
import { AiFillPrinter } from "react-icons/ai";
import Box from "../../components/Box";
import ReportChartWeek from "../../components/report_chart/ReportChartWeek";
import { useStore } from "../../store";
import moment from "moment";
import { COLOR_APP } from "../../constants";
import ButtonDropdown from "../../components/button/ButtonDropdown";
import { FaSearch } from "react-icons/fa";
import { getLocalData } from "../../constants/api";
import { useNavigate } from "react-router-dom";
import DateTimeComponent from "../../components/DateTimeComponent";
import {
  addMemberPoint,
  getAllStorePoints,
  updatePointStore,
} from "../../services/member.service";
import { useStoreStore } from "../../zustand/storeStore";
import { useTranslation } from "react-i18next";

export default function SettingMemberPointPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // state
  const [disabledButton, setDisabledButton] = useState(false);
  const [formData, setFormData] = useState({
    totalAmount: "",
    points: "",
    storeId: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [pointsData, setPointsData] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [editMode, setEditMode] = useState(false);
  const { setStoreDetail, storeDetail } = useStoreStore();
  const handleShow = async () => {
    const { DATA } = await getLocalData();
    setFormData((prevData) => ({ ...prevData, storeId: DATA.storeId }));
    setShow(true);
  };

  // provider

  // useEffect

  // function
  // const createMember = async () => {
  //   try {
  //     if (disabledButton) return;
  //     setDisabledButton(true);
  //     const { TOKEN } = await getLocalData();
  //     const _data = await addMember(formData, TOKEN);
  //     if (_data.error) throw new Error("can not create member");
  //     navigate("/reports/members-report");
  //   } catch (err) {
  //     setDisabledButton(true);
  //     console.error(err);
  //   }
  // };

  const createMemberPoint = async () => {
    try {
      setDisabledButton(true);
      const body = {
        money: formData.totalAmount,
        piont: formData.points,
        storeId: formData.storeId,
      };
      console.log("Submitting formData: ", body);
      const _data = await addMemberPoint(body);
      if (_data.error) throw new Error("Cannot create point");
      handleClose();

      fetchPointsData();
    } catch (err) {
      console.error(err);
    } finally {
      setDisabledButton(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    const updatedPointsData = [...pointsData];
    updatedPointsData[0] = { ...updatedPointsData[0], [name]: value };
    setPointsData(updatedPointsData);
  };

  const fetchPointsData = async () => {
    setLoading(true);
    setError(false);
    try {
      const data = await getAllStorePoints();
      const { DATA } = await getLocalData();
      const filteredData = data.filter(
        (point) => point.storeId === DATA.storeId
      );
      setPointsData(filteredData);
      setStoreDetail({
        pointStore: filteredData[0].money,
      });
    } catch (error) {
      console.error("Failed to fetch points data: ", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      const dataToSend = {
        piontStoreId: pointsData[0]._id,
        money: pointsData[0].money,
        point: pointsData[0].piont,
      };
      const response = await updatePointStore(dataToSend);
      if (response.error) throw new Error("Cannot update point");
      fetchPointsData();
      setEditMode(false);
    } catch (err) {
      console.error("Failed to update points data: ", err);
    }
  };

  useEffect(() => {
    fetchPointsData();
  }, []);

  return (
    <>
      <div style={{ padding: 20 }}>
        <Breadcrumb>
          <Breadcrumb.Item>{t("report")}</Breadcrumb.Item>
          <Breadcrumb.Item active>{t("point_setting")}</Breadcrumb.Item>
        </Breadcrumb>
        {loading ? (
          <div>
            <center>
              <Spinner animation="border" variant="warning" />
            </center>
          </div>
        ) : pointsData.length > 0 ? (
          <Card border="primary" style={{ maxWidth: 500 }}>
            <Card.Header
              style={{
                backgroundColor: COLOR_APP,
                color: "#fff",
                fontSize: 18,
                fontWeight: "bold",
              }}
            >
              {t("point_setting_form")}
            </Card.Header>
            <Card.Body>
              <div>
                <div
                  className="mb-3"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                    width: "100%",
                  }}
                >
                  <div>
                    <Form.Label>{t("bill_total_price")}</Form.Label>
                    <Form.Control
                      name="money"
                      value={pointsData[0].money}
                      onChange={handleUpdateChange}
                      disabled={!editMode}
                    />
                  </div>
                  <div>
                    <Form.Label>{t("money_will_got")}</Form.Label>
                    <Form.Control
                      name="piont"
                      value={pointsData[0].piont}
                      onChange={handleUpdateChange}
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </div>
              {editMode ? (
                <Button variant="primary" onClick={handleUpdate}>
                  {t("save")}
                </Button>
              ) : (
                <Button variant="secondary" onClick={() => setEditMode(true)}>
                  {t("update")}
                </Button>
              )}
            </Card.Body>
          </Card>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
            }}
          >
            <Button
              variant="primary"
              onClick={handleShow}
              disabled={disabledButton}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <BsInfoCircle />
              {t("setting_point")}
            </Button>
          </div>
        )}
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{t("point_setting_form")}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <div
                className="mb-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 20,
                  width: "100%",
                }}
              >
                <Form.Group>
                  <Form.Label>{t("bill_total_price")}</Form.Label>
                  <Form.Control
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={handleChange}
                    type="number"
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>{t("point_will_got")}</Form.Label>
                  <Form.Control
                    name="points"
                    value={formData.points}
                    onChange={handleChange}
                    type="number"
                    required
                  />
                </Form.Group>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              {t("close")}
            </Button>
            <Button
              variant="primary"
              onClick={createMemberPoint}
              disabled={disabledButton}
            >
              {t("set_point")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      {/* popup */}
    </>
  );
}
