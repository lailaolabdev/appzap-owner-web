import React, { useState, useEffect } from "react";
import { Form, Button, Modal, Carousel } from "react-bootstrap";
import packetJson from "../../../package.json";

import { Formik } from "formik";
import * as Yup from "yup";
import * as axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faHeadset,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate, useLocation } from "react-router-dom";
import Lottie from "react-lottie";
import { useStore } from "../../store";
import { getStore } from "../../services/store";
import Box from "../../components/Box";

// style
import "./login.css";

import { USER_KEY, END_POINT, COLOR_APP } from "../../constants";
import useWindowDimensions from "../../helpers/useWindowDimensions";
import AnimationLoading from "../../components/AnimationLoading";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  // const { match } = useReactRouter();

  const { height, width } = useWindowDimensions();

  const [checkUser, setCheckUser] = useState(false);
  const [popupDate, setPopupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordType, setIsPasswordType] = useState(true);
  const { setStoreDetail } = useStore();

  const _login = async ({ values }) => {
    try {
      const user = await axios.post(`${END_POINT}/v3/admin/login`, values);
      if (user?.data?.data?.role === "APPZAP_ADMIN") {
        await localStorage.setItem(USER_KEY, JSON.stringify(user?.data));
        const data = await getStore(user?.data?.data?.storeId);
        setStoreDetail(data);
        await navigate(
          `/settingStore/storeDetail/${user?.data?.data?.storeId}`
        );
      } else {
        setCheckUser(true);
      }
    } catch (error) {
      setCheckUser(true);
    }
  };

  let _imgaeSlide = ["/images/slide/pro1.png", "/images/slide/pro2.png"];

  return (
    <div>
      <Box
        sx={{
          backgroundColor: "#FB6E3B",
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#ffffff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Formik
            initialValues={{ userId: "", password: "" }}
            validationSchema={Yup.object({
              userId: Yup.string().required("ກາລຸນາປ້ອນຊື່ຜູ້ໃຊ້"),
              password: Yup.string().required("ກາລຸນາປ້ອນລະຫັດຜ່ານ"),
            })}
            validate={(values) => {
              const errors = {};
              if (!values.userId) {
                errors.userId = "ກາລຸນາປ້ອນຊື່ຜູ້ໃຊ້!";
              }
              if (!values.password) {
                errors.password = "ກາລຸນາປ້ອນລະຫັດຜ່ານ!";
              }
              return errors;
            }}
            onSubmit={async (values) => {
              await _login({ values });
            }}
          >
            {({
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              errors,
              values,
            }) => (
              <Form className="" style={{ width: "80%" }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Box
                    sx={{
                      textAlign: "center",
                      paddingBottom: { md: 45, xs: 22 },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        fontWeight: "bold",
                        color: COLOR_APP,
                        fontSize: { md: 55, xs: 30 },
                      }}
                    >
                      A P P Z A P
                    </Box>
                    <Box
                      sx={{
                        fontWeight: "bold",
                        color: COLOR_APP,
                        fontSize: { md: 30, xs: 16 },
                      }}
                    >
                      Lao Self Ordering
                    </Box>
                    <Box
                      sx={{
                        fontWeight: "bold",
                        color: COLOR_APP,
                        fontSize: { md: 30, xs: 24 },
                      }}
                    >
                      ສໍາລັບຮ້ານອາຫານ
                    </Box>
                  </Box>
                  <div style={{ height: 45 }} />
                  <div
                    className="text-start"
                    style={{ width: "100%", color: "#4B4A4A", fontSize: 20 }}
                  >
                    ຊື່ຜູ້ໃຊ້ລະບົບ
                  </div>
                  <Form.Control
                    type="text"
                    placeholder="ຊື່ຜູ້ໃຊ້..."
                    onChange={handleChange("userId")}
                    onBlur={handleBlur}
                    value={values.userId}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                  />
                  {errors.userId && (
                    <div className="text-start" style={{ width: "100%" }}>
                      <span style={{ fontSize: 12, color: "red" }}>
                        {errors.userId}
                      </span>
                    </div>
                  )}
                  <div style={{ height: 10 }} />
                  <div
                    className="text-start"
                    style={{ width: "100%", color: "#4B4A4A", fontSize: 20 }}
                  >
                    ລະຫັດຜ່ານ
                  </div>
                  <div
                    style={{
                      border: "1px solid #ced4da",
                      width: "100%",
                      borderRadius: 4,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Form.Control
                      type={isPasswordType ? "password" : "text"}
                      placeholder="ລະຫັດຜ່ານ..."
                      onChange={handleChange("password")}
                      onBlur={handleBlur}
                      value={values.password}
                      style={{ borderWidth: 0 }}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          handleSubmit();
                        }
                      }}
                    />
                    <FontAwesomeIcon
                      onClick={() => setIsPasswordType(!isPasswordType)}
                      style={{ float: "right", marginRight: 8 }}
                      icon={isPasswordType ? faEye : faEyeSlash}
                    />
                  </div>
                  <div style={{ width: "100%", display: "flex" }}>
                    {errors.password && (
                      <div className="text-start" style={{ width: "100%" }}>
                        <span style={{ fontSize: 12, color: "red" }}>
                          {errors.password}
                        </span>
                      </div>
                    )}
                    {/* <div className="text-end" style={{ width: "100%", color: "#4B4A4A", cursor: "pointer" }}><u>ລືມລະຫັດຜ່ານ ?</u></div> */}
                  </div>
                  <div style={{ height: 45 }} />
                  {/* <div
                    style={{
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "red",
                      display: checkUser === false ? "none" : "",
                    }}
                  >
                    ຊື່ຜູ້ໃຊ້ລະບົບ ຫຼື ຊື່ຜູ້ໃຊ້ລະບົບ ບໍ່ຖືກຕ້ອງ
                  </div> */}
                  <Button
                    style={{
                      backgroundColor: "#FB6E3B",
                      border: "1px #FB6E3B",
                      marginLeft: 0,
                      width: "100%",
                      fontSize: 18,
                    }}
                    onClick={handleSubmit}
                  >
                    ເຂົ້າສູ່ລະບົບ{" "}
                  </Button>
                  <div style={{ height: 50 }} />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{ color: COLOR_APP, textDecoration: "underline" }}
                      onClick={() => navigate("/privacy-policy")}
                    >
                      ນະໂຍບາຍການນໍາໃຊ້
                    </div>
                    <div style={{ color: "#ccc" }}>v{packetJson?.version}</div>
                  </div>
                  <div style={{ height: 40 }} />
                  {/* <div
                    style={{
                      width: 75,
                      height: 75,
                      padding: 15,
                      backgroundColor: "#fff",
                      cursor: "pointer",
                    }}
                  >
                    <FontAwesomeIcon
                      icon={faHeadset}
                      style={{ color: "#FB6E3B", fontSize: 60 }}
                    />
                  </div> */}
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <Box sx={{ display: { md: "block", xs: "none" }, minWidth: "60vw" }}>
          <div
            style={{
              padding: 40,
              backgroundColor: "#FB6E3B",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <Carousel
              interval={3000}
              style={{ height: "100%" }}
              prevIcon={false}
              nextIcon={false}
            >
              {_imgaeSlide?.map((item, index) => (
                <Carousel.Item
                  key={"carouse-" + index}
                  style={{ height: "90vh" }}
                >
                  <img
                    className="d-block"
                    src={item}
                    alt="First slide"
                    style={{ height: "100%" }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        </Box>
      </Box>

      {/* Config Modal */}
      <Modal show={isLoading} keyboard={false} size="lg">
        {" "}
        <div className="text-center" style={{ padding: 30 }}>
          <p style={{ fontSize: 30 }}>ກໍາລັງເຂົ້າສູ່ລະບົບ</p>
        </div>
        <AnimationLoading />
      </Modal>
      {popupDate && (
        <Modal
          show={popupDate?.isPublished}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {width > 700 ? (
              <h3>{popupDate?.title ?? ""}</h3>
            ) : (
              <h5>{popupDate?.title ?? ""}</h5>
            )}
          </Modal.Header>
          <Modal.Body
            style={{
              padding: 24,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
            }}
          >
            {width > 700 ? (
              <h5 style={{ textAlign: "center" }}>{popupDate?.detail ?? ""}</h5>
            ) : (
              <h6 style={{ textAlign: "center" }}>{popupDate?.detail ?? ""}</h6>
            )}
            <br />
            {popupDate?.animation && (
              <Lottie
                options={{ loop: true, path: popupDate?.animation }}
                width={width > 700 ? 400 : width * 0.8}
              />
            )}
          </Modal.Body>
        </Modal>
      )}
    </div>
  );
}

export default Login;
