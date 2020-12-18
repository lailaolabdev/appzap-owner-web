import React, {useEffect} from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Container,
  FormControl,
  InputGroup,
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
  const [width, setWidth] = React.useState(window.innerWidth);
  const breakpoint = 620;


  const { history } = useReactRouter();
  const _login = async ({ values }) => {
    const user = await axios.post(`${END_POINT}/login`, values);
    await localStorage.setItem(USER_KEY, JSON.stringify(user.data));
    await history.push("/orders/pagenumber/1");
  };

  return (
    <div style={{ backgroundColor: "#f1f1f1" }}>
      <Col className="col">
        <h1>
          Self Ordering
          </h1>
      </Col>
      <Container className="mt-5">

        <Row>
          <Col xs={6} md={2}></Col>
          <Col md={8} className="bg-light" style={{borderRadius: "10px"}}>


            <Col className="pb-5" >
              <Formik
                initialValues={{ username: "", password: "" }}
                validationSchema={Yup.object({
                  username: Yup.string().required("ກາລຸນາປ້ອນຊື່ຜູ້ໃຊ້"),
                  password: Yup.string().required("ກາລຸນາປ້ອນລະຫັດຜ່ານ"),
                })}
                onSubmit={async (values) => {
                  // TODO: send user data to server
                  await _login({ values });
                  console.log("23456789");
                  console.log(values);
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
                  <Form className="contain">
                    <h4 className="text-center text mt-3 mb-5">
                      ຍິນດີຕ້ອນຮັບ ກະລຸນາລ໊ອກອິນ
                    </h4>

                    <InputGroup className="form">
                      <InputGroup.Prepend>
                        <InputGroup.Text style={{ background: "#FB6E3B" }}>
                          <FontAwesomeIcon icon={faUser} color="white" />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        id="inlineFormInputGroup1"
                        type="text"
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


                    <Form.Label htmlFor="inlineFormInputGroup2" srOnly>
                      Password
        </Form.Label>
                    <InputGroup className="mt-3 form">
                      <InputGroup.Prepend>
                        <InputGroup.Text style={{ background: "#FB6E3B" }}>
                          <FontAwesomeIcon icon={faLock} color="white" style={{ background: "none" }} />
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <FormControl
                        // className="mt-3"
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

                    <Button
                      style={{ background: "#FB6E3B", border: "1px #FB6E3B" }}
                      className="form-control mt-5 form-btn"
                      onClick={handleSubmit}
                    >
                      ເຂົ້າສູ່ລະບົບ
        </Button>

                  </Form>
                )}
              </Formik>
            </Col>


          </Col>
          <Col xs={6} md={2}></Col>
        </Row>

      </Container>
    </div>

  );
}

export default Login;
