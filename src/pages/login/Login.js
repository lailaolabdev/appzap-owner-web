import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  FormControl,
  InputGroup,
  Image
} from "react-bootstrap";
import { Formik } from "formik";
import * as Yup from "yup";
import * as axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import useReactRouter from "use-react-router";

// style
import './login.css';

import { USER_KEY, END_POINT } from "../../constants";

function Login() {
  const { history } = useReactRouter();
  const [checkUser, setCheckUser] = useState(false);
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
    <div style={{ backgroundColor: "#FB6E3B", paddingTop: 160, paddingBottom: 200, paddingLeft: 280, paddingRight: 280 }}>
      {/* <Container> */}
      <Row>
        <Col xs={6} md={2}></Col>
        <Col md={8} className="bg-light" style={{ borderRadius: "10px" }}>
          <Col className="pb-5" >
            <Formik
              initialValues={{ userId: "", password: "" }}
              validationSchema={Yup.object({
                userId: Yup.string().required("ກາລຸນາປ້ອນຊື່ຜູ້ໃຊ້"),
                password: Yup.string().required("ກາລຸນາປ້ອນລະຫັດຜ່ານ"),
              })}
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
                <Form className="contain" style={{ paddingLeft: 130 }}>
                  <div style={{ textAlign: "center", paddingTop: 30 }}>
                    <Image src="https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/175875900_915432132566987_7559427731032625098_n.png" rounded style={{ height: 110, width: 110 }} />
                  </div>
                  <h5 className="text-center text mt-3 mb-3" style={{ fontWeight: "bold" }}>
                    ຍິນດີຕ້ອນຮັບ
                    </h5>
                  <label>ຊື່ຜູ້ໃຊ້ລະບົບ</label>
                  <InputGroup className="form" >
                    <FormControl
                      id="inlineFormInputGroup1"
                      type="text"
                      placeholder="ຊື່ຜູ້ໃຊ້"
                      onChange={handleChange("userId")}
                      onBlur={handleBlur}
                      isInvalid={!!errors.userId}
                      value={values.userId}
                    />

                    <Form.Control.Feedback type="invalid">
                      {touched.userId && errors.userId}
                    </Form.Control.Feedback>
                  </InputGroup>


                  <Form.Label htmlFor="inlineFormInputGroup2" srOnly>
                    Password
        </Form.Label>
                  <div style={{ height: 10 }}></div>
                  <label>ລະຫັດຜ່ານ</label>
                  <InputGroup className=" mb-3 form">
                    <FormControl
                      id="inlineFormInputGroup2"
                      placeholder="ລະຫັດຜ່ານ"
                      type="password"
                      onChange={handleChange("password")}
                      onBlur={handleBlur}
                      isInvalid={!!errors.password}
                      value={values.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {touched.password && errors.password}
                    </Form.Control.Feedback>
                  </InputGroup>
                  <div style={{ textAlign: "center", fontWeight: "bold", color: "red", display: checkUser === false ? "none" : "" }}>ຊື່ຜູ້ໃຊ້ລະບົບ ຫຼື ລະຫັດຜ່ານ ບໍ່ຖືກຕ້ອງ</div>
                  <Button
                    style={{ backgroundColor: "#FB6E3B", border: "1px #FB6E3B", marginLeft: 0 }}
                    className="form-control mt-3 mr-5 form-btn"
                    onClick={handleSubmit}
                  >
                    ເຂົ້າສູ່ລະບົບ
        </Button>
                </Form>
              )}
            </Formik>
          </Col>
        </Col>
      </Row>

      {/* </Container> */}
    </div>

  );
}

export default Login;
