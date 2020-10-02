import React from "react"
import {
  Form,
  Row,
  Col,
  Button,
  Container,
  FormControl,
  InputGroup
} from "react-bootstrap"
import { Formik } from "formik"
import * as Yup from "yup"
import * as axios from 'axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons"
import useReactRouter from 'use-react-router'

import { USER_KEY } from "../../constants"

const LOGIN_URL = "http://localhost:7070/login"
function Login() {
  const { history } = useReactRouter();
  const _login = async ({ values }) => {
    const user = await axios.post(LOGIN_URL, values);
    await localStorage.setItem(USER_KEY, JSON.stringify(user.data));
    await history.push("/orders/pagenumber/1")
  }

  return (
    <Container>
      <Row>
        <Col xs={6} md={4}></Col>
        <Col xs={6} md={4}>
          <h3 style={{ margin: 60, textAlign: "center" }}>Self Ordering</h3>
          <h4 style={{ margin: 40, textAlign: "center" }}>
            ຍິນດີຕ້ອນຮັບ ກະລຸນາລ໊ອກອິນ
          </h4>
          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={Yup.object({
              username: Yup.string().required("ກາລຸນາປ້ອນຊື່ຜູ້ໃຊ້"),
              password: Yup.string().required("ກາລຸນາປ້ອນລະຫັດຜ່ານ")
            })}
            onSubmit={async (values) => {
              // TODO: send user data to server
              await _login({ values })
              console.log("23456789")
              console.log(values)
            }}
          >
            {({
              touched,
              handleBlur,
              handleChange,
              handleSubmit,
              errors,
              values
            }) => (
                <Form>
                  <div>
                    {/* <Form.Label htmlFor="inlineFormInputGroup" srOnly>
                    Username
                  </Form.Label> */}
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text style={{ background: "#2372A3" }}>
                          <FontAwesomeIcon icon={faUser} color="white" />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        id="inlineFormInputGroup1"
                        placeholder="ຊື່ຜູ້ໃຊ້"
                        onChange={handleChange("username")}
                        onBlur={handleBlur}
                        isInvalid={!!errors.username}
                        value={values.username}
                      />
                      <Form.Control.Feedback type="invalid">
                        {touched.username && errors.username}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </div>
                  <div style={{ marginTop: 24 }} />
                  <div>
                    <Form.Label htmlFor="inlineFormInputGroup2" srOnly>
                      Password
                  </Form.Label>
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text style={{ background: "#2372A3" }}>
                          <FontAwesomeIcon icon={faLock} color="white" />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        id="inlineFormInputGroup2"
                        placeholder="ລະຫັດຜ່ານ"
                        onChange={handleChange("password")}
                        onBlur={handleBlur}
                        isInvalid={!!errors.password}
                        value={values.password}
                      />
                      <Form.Control.Feedback type="invalid">
                        {touched.password && errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </div>
                  <div style={{ marginTop: 24 }} />
                  <div>
                    <Button
                      style={{ background: "#2372A3" }}
                      className="form-control"
                      onClick={handleSubmit}
                    >
                      ລ໊ອກອິນ
                  </Button>
                  </div>
                </Form>
              )}
          </Formik>
        </Col>
        <Col xs={6} md={4}></Col>
      </Row>
    </Container>
  )
}

export default Login
