import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  FormControl,
  InputGroup,
  Image,
  Modal,
  Carousel
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import * as axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faEye, faEyeSlash, faHeadset, faLock, faUser  } from "@fortawesome/free-solid-svg-icons";
import useReactRouter from "use-react-router";
import Lottie from 'react-lottie';

// style
import './login.css';

import { USER_KEY, END_POINT,COLOR_APP } from "../../constants";
import useWindowDimensions from "../../helpers/useWindowDimensions";
import AnimationLoading from "../../components/AnimationLoading";

function Login() {
  const { history } = useReactRouter();
  const { height, width } = useWindowDimensions();

  const [checkUser, setCheckUser] = useState(false);
  const [popupDate, setPopupData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordType, setIsPasswordType] = useState(true);


  const _login = async ({ values }) => {
    try {
      const user = await axios.post(`${END_POINT}/login`, values)
      await localStorage.setItem(USER_KEY, JSON.stringify(user.data));
      await history.push(`/orders/pagenumber/1/${user?.data?.data?.storeId}`);
    } catch (error) {
      setCheckUser(true)
    }
  }
  return (
    // <div style={{ backgroundColor: "#FB6E3B", paddingTop: 160, paddingBottom: 200, paddingLeft: 280, paddingRight: 280 }}>
    //   {/* <Container> */}
    //   <Row>
    //     <Col xs={6} md={2}></Col>
    //     <Col md={8} className="bg-light" style={{ borderRadius: "10px" }}>
    //       <Col className="pb-5" >
    //         <Formik
    //           initialValues={{ userId: "", password: "" }}
    //           validationSchema={Yup.object({
    //             userId: Yup.string().required("ກາລຸນາປ້ອນຊື່ຜູ້ໃຊ້"),
    //             password: Yup.string().required("ກາລຸນາປ້ອນລະຫັດຜ່ານ"),
    //           })}
    //           onSubmit={async (values) => {
    //             await _login({ values });
    //           }}
    //         >
    //           {({
    //             touched,
    //             handleBlur,
    //             handleChange,
    //             handleSubmit,
    //             errors,
    //             values,
    //           }) => (
    //             <Form className="contain" style={{ paddingLeft: 130 }}>
    //               <div style={{ textAlign: "center", paddingTop: 30 }}>
    //                 <Image src="https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/175875900_915432132566987_7559427731032625098_n.png" rounded style={{ height: 110, width: 110 }} />
    //               </div>
    //               <h5 className="text-center text mt-3 mb-3" style={{ fontWeight: "bold" }}>
    //                 ຍິນດີຕ້ອນຮັບ
    //                 </h5>
    //               <label>ຊື່ຜູ້ໃຊ້ລະບົບ</label>
    //               <InputGroup className="form" >
    //                 <FormControl
    //                   id="inlineFormInputGroup1"
    //                   type="text"
    //                   placeholder="ຊື່ຜູ້ໃຊ້"
    //                   onChange={handleChange("userId")}
    //                   onBlur={handleBlur}
    //                   isInvalid={!!errors.userId}
    //                   value={values.userId}
    //                 />

    //                 <Form.Control.Feedback type="invalid">
    //                   {touched.userId && errors.userId}
    //                 </Form.Control.Feedback>
    //               </InputGroup>


    //               <Form.Label htmlFor="inlineFormInputGroup2" srOnly>
    //                 Password
    //     </Form.Label>
    //               <div style={{ height: 10 }}></div>
    //               <label>ລະຫັດຜ່ານ</label>
    //               <InputGroup className=" mb-3 form">
    //                 <FormControl
    //                   id="inlineFormInputGroup2"
    //                   placeholder="ລະຫັດຜ່ານ"
    //                   type="password"
    //                   onChange={handleChange("password")}
    //                   onBlur={handleBlur}
    //                   isInvalid={!!errors.password}
    //                   value={values.password}
    //                 />
    //                 <Form.Control.Feedback type="invalid">
    //                   {touched.password && errors.password}
    //                 </Form.Control.Feedback>
    //               </InputGroup>
    //               <div style={{ textAlign: "center", fontWeight: "bold", color: "red", display: checkUser === false ? "none" : "" }}>ຊື່ຜູ້ໃຊ້ລະບົບ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ</div>
    //               <Button
    //                 style={{ backgroundColor: "#FB6E3B", border: "1px #FB6E3B", marginLeft: 0 }}
    //                 className="form-control mt-3 mr-5 form-btn"
    //                 onClick={handleSubmit}
    //               >
    //                 ເຂົ້າສູ່ລະບົບ
    //     </Button>
    //             </Form>
    //           )}
    //         </Formik>
    //       </Col>
    //     </Col>
    //   </Row>

    //   {/* </Container> */}
    // </div>
    <div>
    {width > 700 ? <div style={{ backgroundColor: "#FB6E3B", width: "100vw", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <div style={{ width: "40vw", backgroundColor: "#ffffff", height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <Formik
          initialValues={{ userId: "", password: "" }}
          validationSchema={Yup.object({
            userId: Yup.string().required("ກາລຸນາປ້ອນຊື່ຜູ້ໃຊ້"),
            password: Yup.string().required("ກາລຸນາປ້ອນລະຫັດຜ່ານ"),
          })}
          validate={values => {
            const errors = {};
            if (!values.userId) {
              errors.userId = 'ກາລຸນາປ້ອນຊື່ຜູ້ໃຊ້!';
            }
            if (!values.password) {
              errors.password = 'ກາລຸນາປ້ອນລະຫັດຜ່ານ!';
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
            <Form className="" style={{ width: "70%" }}>
              <div style={{ display: "flex", flexDirection: "column", width: "100%", justifyContent: "center", alignItems: "center" }}>
                <div style={{ textAlign: "center", paddingBottom: 45, display: 'flex' ,flexDirection: "column", }}>
                  <h4 style={{ fontWeight: 'bold', color: COLOR_APP, fontSize: 70 }}>A P P Z A P</h4>
                  <h4 style={{ fontWeight: 'bold', color: COLOR_APP, marginLeft: 24, fontSize: 30 }}>Lao Self Ordering</h4>
                  <h4 style={{ fontWeight: 'bold', color: COLOR_APP, marginLeft: 24, fontSize: 30 }}>ສໍາລັບຮ້ານອາຫານ</h4>
                </div>
                <div style={{ height: 45 }} />
                <div className="text-start" style={{ width: "100%", color: "#4B4A4A", fontSize: 20 }}>ຊື່ຜູ້ໃຊ້ລະບົບ</div>
                <Form.Control
                  type="text"
                  placeholder="ຊື່ຜູ້ໃຊ້..."
                  onChange={handleChange("userId")}
                  onBlur={handleBlur}
                  value={values.userId}
                  onKeyPress={event => {
                    if (event.key === 'Enter') {
                      handleSubmit()
                    }
                  }}
                />
                {errors.userId && <div className="text-start" style={{ width: "100%" }}><span style={{ fontSize: 12, color: "red" }}>{errors.userId}</span></div>}
                <div style={{ height: 10 }} />
                <div className="text-start" style={{ width: "100%", color: "#4B4A4A", fontSize: 20 }}>ລະຫັດຜ່ານ</div>
                <div style={{ border: "1px solid #ced4da", width: '100%', borderRadius: 4, display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Form.Control
                    type={isPasswordType ? "password" : "text"}
                    placeholder="ລະຫັດຜ່ານ..."
                    onChange={handleChange("password")}
                    onBlur={handleBlur}
                    value={values.password}
                    style={{ borderWidth: 0 }}
                    onKeyPress={event => {
                      if (event.key === 'Enter') {
                        handleSubmit()
                      }
                    }}
                  />
                  <FontAwesomeIcon onClick={() => setIsPasswordType(!isPasswordType)} style={{ float: 'right', marginRight: 8 }} icon={isPasswordType ? faEye : faEyeSlash} />
                </div>
                <div style={{ width: "100%", display: 'flex' }}>
                  {errors.password && <div className="text-start" style={{ width: "100%" }}><span style={{ fontSize: 12, color: "red" }}>{errors.password}</span></div>}
                  {/* <div className="text-end" style={{ width: "100%", color: "#4B4A4A", cursor: "pointer" }}><u>ລືມລະຫັດຜ່ານ ?</u></div> */}
                </div>
                <div style={{ height: 45 }} />
                <div style={{ textAlign: "center", fontWeight: "bold", color: "red", display: checkUser === false ? "none" : "" }}>ຊື່ຜູ້ໃຊ້ລະບົບ ຫຼື ຊື່ຜູ້ໃຊ້ລະບົບ ບໍ່ຖືກຕ້ອງ</div>
                <Button
                  style={{ backgroundColor: "#FB6E3B", border: "1px #FB6E3B", marginLeft: 0, width: "100%", fontSize: 18 }}
                  onClick={handleSubmit}
                >
                  ເຂົ້າສູ່ລະບົບ </Button>
                <div style={{ height: 50 }} />
                <a onClick={() => history.push('/privacy-policy')} style={{ cursor: "pointer" }}><u>ນະໂຍບາຍການນໍາໃຊ້</u></a>
                <div style={{ height: 40 }} />
                <div style={{
                  width: 75,
                  height: 75,
                  padding: 15,
                  backgroundColor: '#fff',
                  cursor: "pointer"
                }}>
                  <FontAwesomeIcon icon={faHeadset} style={{ color: "#422f90", fontSize: 60 }} />
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      <div style={{ padding: 40, width: "60vw", height: '100vh', backgroundColor: '#FB6E3B', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
        <Carousel interval={1500} style={{ width: "82%" }} prevIcon={false} nextIcon={false}>
          <Carousel.Item>
            <img
              className="d-block"
              src="https://lailaolink-files.s3-ap-southeast-1.amazonaws.com/lailaolink/186160612_134969411917600_9077972786270370315_n.jpg"
              alt="First slide"
              style={{ width: "100%" }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block"
              src="https://lailaolink-files.s3-ap-southeast-1.amazonaws.com/lailaolink/186160612_134969411917600_9077972786270370315_n.jpg"
              alt="First slide"
              style={{ width: "100%" }}
            />
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block"
              src="https://lailaolink-files.s3-ap-southeast-1.amazonaws.com/lailaolink/186160612_134969411917600_9077972786270370315_n.jpg"
              alt="First slide"
              style={{ width: "100%" }}
            />
          </Carousel.Item>
          
        </Carousel>
      </div>

      <Modal
        show={isLoading}
        keyboard={false}
        size="lg"
      > <div className="text-center" style={{ padding: 30 }}>
          <p style={{ fontSize: 30 }}>ກໍາລັງເຂົ້າສູ່ລະບົບ</p>
        </div>
        <AnimationLoading />
      </Modal>
    </div>
      :
      <div style={{ backgroundColor: "#fff", width: width, height: height, display: "flex", justifyContent: "center", alignItems: "center" }}>
        <Formik
          initialValues={{ userId: "", password: "" }}
          validate={values => {
            const errors = {};
            if (!values.userId) {
              errors.userId = 'ກາລຸນາປ້ອນຊື່ຜູ້ໃຊ້!';
            }
            if (!values.password) {
              errors.password = 'ກາລຸນາປ້ອນລະຫັດຜ່ານ!';
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
            <Form className="" style={{}}>
              <div style={{ textAlign: "center", paddingBottom: 35, display: 'flex' }}>
                <h4 style={{ fontWeight: 'bold', color: COLOR_APP }}>L A I L A O</h4>
                <h4 style={{ fontWeight: 'bold', color: COLOR_APP, marginLeft: 24 }}>C F</h4>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                <div className="text-start">
                  <label style={{ color: "#4B4A4A" }}>ຊື່ຜູ້ໃຊ້ລະບົບ</label>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <FormControl
                      id="inlineFormInputGroup1"
                      type="text"
                      placeholder="ຊື່ຜູ້ໃຊ້..."
                      onChange={handleChange("userId")}
                      onBlur={handleBlur}
                      value={values.userId}
                    />
                  </div>
                  {errors.userId && <span style={{ fontSize: 12, color: "red" }}>{errors.userId}</span>}
                </div>

                <div className="text-start">
                  <div style={{ height: 10 }}></div>
                  <label style={{ color: "#4B4A4A" }}>ລະຫັດຜ່ານ</label>
                  <div style={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <FormControl
                      id="inlineFormInputGroup1"
                      type="password"
                      placeholder="ລະຫັດຜ່ານ..."
                      onChange={handleChange("password")}
                      onBlur={handleBlur}
                      value={values.password}
                    />
                  </div>
                  {errors.password && <span style={{ fontSize: 12, color: "red" }}>{errors.password}</span>}
                </div>

                <div style={{ height: 28 }} />

                <div style={{ textAlign: "center", fontWeight: "bold", color: "red", display: checkUser === false ? "none" : "" }}>ຊື່ຜູ້ໃຊ້ລະບົບ ຫຼື ຊື່ຜູ້ໃຊ້ລະບົບ ບໍ່ຖືກຕ້ອງ</div>
                <Button
                  style={{ backgroundColor: COLOR_APP, border: COLOR_APP, marginLeft: 0, width: 150, color: "#fff" }}
                  onClick={handleSubmit}
                >
                  ເຂົ້າສູ່ລະບົບ </Button>

                <div style={{ height: 30 }} />
                <a onClick={() => history.push('/privacy-policy')} style={{ cursor: "pointer", color: "#FB6E3B" }}><u>ນະໂຍບາຍການນໍາໃຊ້</u></a>
                <div style={{ height: 50 }} />
              </div>
            </Form>
          )}
        </Formik>
      </div>}

    {/* Config Modal */}
    {popupDate && <Modal
      show={popupDate?.isPublished}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
        {width > 700 ? <h3>{popupDate?.title ?? ""}</h3> : <h5>{popupDate?.title ?? ""}</h5>}
      </Modal.Header>
      <Modal.Body style={{ padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: "100%" }}>
        {width > 700 ? <h5 style={{ textAlign: "center" }}>
          {popupDate?.detail ?? ""}
        </h5> : <h6 style={{ textAlign: "center" }}>
          {popupDate?.detail ?? ""}
        </h6>}
        <br />
        {popupDate?.animation && <Lottie
          options={{
            loop: true,
            path: popupDate?.animation,
          }}
          width={width > 700 ? 400 : width * 0.80} />}
      </Modal.Body>
    </Modal>}

  </div>


  );
}

export default Login;
