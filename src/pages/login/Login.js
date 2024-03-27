import React, { useState, useMemo } from "react";
import { Form, Button, Carousel, Spinner } from "react-bootstrap";
import packetJson from "../../../package.json";
import ReactGA from 'react-ga4';

import { Formik } from "formik";
import * as Yup from "yup";
import * as axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { getStore } from "../../services/store";
import Box from "../../components/Box";
import { toast } from "react-toastify";

// style
import "./login.css";

import { USER_KEY, END_POINT, COLOR_APP } from "../../constants";
import role from "../../helpers/role";
import LoadingAppzap from "../../components/LoadingAppzap";

function Login() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordType, setIsPasswordType] = useState(true);
  const { setStoreDetail, setProfile } = useStore();

  useMemo(() => {
    console.log("GOOGLE ANALYTICS STARTED")
    const TRACKING_ID = 'G-LLZP539QT0';
    ReactGA.initialize(TRACKING_ID, { debug: true })
}, [])

  const _login = async ({ values }) => {
    try {
      setIsLoading(true);
      const user = await axios.post(`${END_POINT}/v3/admin/login`, values);
      const { defaultPath } = role(user?.data?.data?.role, user?.data?.data);
      if (defaultPath) {
        // localStorage.setItem(USER_KEY, JSON.stringify(user?.data));
        setProfile(user?.data);
        const data = await getStore(user?.data?.data?.storeId);
        setStoreDetail(data);
          document.title = data?.name;
       
        ReactGA.send({ hitType: "pageview",  title: `${data?.name}` });
        navigate(defaultPath);
      } else {
        //  _orderSound.play();
        // toast.error("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ", {
        //   position: "bottom-left",
        //   autoClose: 1000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        // });
    setIsLoading(true);

      }
    } catch (error) {
      // toast.error("ຊື່ຜູ້ໃຊ້ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ", {
      //   position: "bottom-left",
      //   autoClose: 1000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
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
                  </div>
                  <div style={{ height: 15 }} />

                  {/* <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{ color: COLOR_APP, textDecoration: "underline" }}
                      onClick={() => navigate("/auth/signup")}
                    >
                      ຍັງບໍ່ມີບັນຊີ
                    </div>
                  </div> */}
                  <div style={{ height: 30 }} />
                  <Button
                    style={{
                      backgroundColor: "#FB6E3B",
                      border: "1px #FB6E3B",
                      width: "100%",
                      fontSize: 18,
                      fontWeight:'bold',
                      display:'flex', justifyContent:'center', alignItems:'center', gap:10
                    }}
                    onClick={handleSubmit}
                    // disabled={isLoading}
                  >
                    {isLoading && <Spinner  size="small" animation="border" />  }
                    ເຂົ້າສູ່ລະບົບ
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
    </div>
  );
}

export default Login;
