import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Form, Nav } from "react-bootstrap";
import { BODY, COLOR_APP } from "../../constants";
import { CATEGORY, getLocalData, END_POINT_SEVER } from "../../constants/api";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import { getHeaders } from "../../services/auth";
import { useNavigate, useParams } from "react-router-dom";

export default function Categorylist() {
  const navigate = useNavigate();
  const params = useParams();
  const [getTokken, setgetTokken] = useState();

  // create
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // modal delete
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const [dateDelete, setdateDelete] = useState("");
  const handleShow3 = (id, name) => {
    setdateDelete({ name, id });
    setShow3(true);
  };
  // update
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [dataUpdate, setdataUpdate] = useState("");
  const [Categorys, setCategorys] = useState([]);

  const handleShow2 = async (item) => {
    setdataUpdate(item);
    setShow2(true);
  };
  // =======>
  const _confirmeDelete = async () => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      let _resData = await axios.delete(CATEGORY + `/${dateDelete?.id}`, {
        headers: headers,
      });
      if (_resData?.data) {
        setCategorys(_resData?.data);
        handleClose3();
        successAdd("ລົບຂໍ້ມູນສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ລົບຂໍ້ມູນບໍ່ສຳເລັດ !");
    }
  };
  const _createCategory = async (values) => {
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    const resData = await axios({
      method: "POST",
      url: END_POINT_SEVER + "/v3/category/create",
      data: {
        storeId: getTokken?.DATA?.storeId,
        name: values?.name,
        note: values?.note,
      },
      headers: headers,
    })
      .then(async function (response) {
        setCategorys(response?.data);
        handleClose();
        successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
      })
      .catch(function (error) {
        errorAdd("ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !");
      });
  };
  const _updateCategory = async (values) => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const resData = await axios.put(
        END_POINT_SEVER + `/v3/category/update`,
        {
          id: dataUpdate?._id,
          data: {
            name: values?.name,
            note: values?.note,
          },
        },
        {
          headers: headers,
        }
      );
      if (resData?.data) {
        setCategorys(resData?.data);
        setShow2(false);
        successAdd("ອັບເດດຂໍ້ມູນສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ອັບເດດຂໍ້ມູນບໍ່ສຳເລັດ !");
    }
  };
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        setgetTokken(_localData);
        getData(_localData?.DATA?.storeId);
      }
    };
    fetchData();
  }, []);

  const getData = async (id) => {
    setIsLoading(true);
    const _resCategory = await axios({
      method: "get",
      url: END_POINT_SEVER + `/v3/categories?isDeleted=false&storeId=${id}`,
    });
    setCategorys(_resCategory?.data);
    setIsLoading(false);
  };
  const _menuList = () => {
    navigate(`/settingStore/menu/limit/40/page/1/${params?.id}`);
  };
  const _category = () => {
    navigate(
      `/settingStore/menu/category/limit/40/page/1/${params?.id}`
    );
  };
  return (
    <div style={BODY}>
      <div>
        <Nav variant="tabs" defaultActiveKey="/settingStore/category">
          <Nav.Item>
            <Nav.Link eventKey="/settingStore/menu" onClick={() => _menuList()}>
              ເມນູອາຫານ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              eventKey="/settingStore/category"
              onClick={() => _category()}
            >
              ປະເພດອາຫານ
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
      <div style={{ backgroundColor: "#FAF9F7", padding: 20, borderRadius: 8 }}>
        <div className="col-sm-12 text-right">
          <Button
            className="col-sm-2"
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={handleShow}
          >
            ເພີ່ມປະເພດອາຫານ
          </Button>{" "}
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <div className="col-sm-12">
            <table className="table table-hover">
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ຊື່ປະເພດອາຫານ</th>
                  <th scope="col">ໝາຍເຫດ</th>
                  <th scope="col">ຈັດການຂໍ້ມູນ</th>
                </tr>
              </thead>
              <tbody>
                {Categorys &&
                  Categorys.map((data, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>{data?.name}</td>
                        <td>{data?.note}</td>
                        <td>
                          <FontAwesomeIcon
                            icon={faEdit}
                            style={{ color: COLOR_APP }}
                            onClick={() => handleShow2(data)}
                          />
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{ marginLeft: 20, color: "red" }}
                            onClick={() => handleShow3(data?._id, data?.name)}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Formik
          initialValues={{
            name: "",
            note: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "ກະລຸນາປ້ອນຊື່ປະເພດອາຫານ...";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            _createCategory(values);
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
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>ເພີ່ມປະເພດອາຫານ</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຊື່ປະເພດອາຫານ</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder="ຊື່ປະເພດອາຫານ..."
                  />
                </Form.Group>
                <div style={{ color: "red" }}>
                  {errors.name && touched.name && errors.name}
                </div>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ໝາຍເຫດ</Form.Label>
                  <Form.Control
                    type="text"
                    name="note"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.note}
                    placeholder="ໝາຍເຫດ..."
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose}>
                  ຍົກເລີກ
                </Button>
                <Button
                  style={{
                    backgroundColor: COLOR_APP,
                    color: "#ffff",
                    border: 0,
                  }}
                  onClick={() => handleSubmit()}
                >
                  ບັນທືກ
                </Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
      <Modal show={show2} onHide={handleClose2}>
        <Formik
          initialValues={{
            name: dataUpdate?.name,
            note: dataUpdate?.note,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "ກະລຸນາປ້ອນຊື່ປະເພດອາຫານ...";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            _updateCategory(values);
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
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Header closeButton>
                <Modal.Title>ເພີ່ມປະເພດອາຫານ</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ປະເພດອາຫານ</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder="ຊື່ປະເພດອາຫານ..."
                  />
                </Form.Group>
                <div style={{ color: "red" }}>
                  {errors.name && touched.name && errors.name}
                </div>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ໝາຍເຫດ</Form.Label>
                  <Form.Control
                    type="text"
                    name="note"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.note}
                    placeholder="ໝາຍເຫດ..."
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="danger" onClick={handleClose2}>
                  ຍົກເລີກ
                </Button>
                <Button
                  style={{
                    backgroundColor: COLOR_APP,
                    color: "#ffff",
                    border: 0,
                  }}
                  onClick={() => handleSubmit()}
                >
                  ບັນທືກ
                </Button>
              </Modal.Footer>
            </form>
          )}
        </Formik>
      </Modal>
      <Modal show={show3} onHide={handleClose3}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <div>ທ່ານຕ້ອງການລົບຂໍ້ມູນ? </div>
            <div style={{ color: "red" }}>{dateDelete?.name}</div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose3}>
            ຍົກເລີກ
          </Button>
          <Button
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => _confirmeDelete()}
          >
            ຢືນຢັນການລົບ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
