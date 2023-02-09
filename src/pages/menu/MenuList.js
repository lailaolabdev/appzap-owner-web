import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCubes,
  faEdit,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Form, Nav, Image } from "react-bootstrap";
import { BODY, COLOR_APP, URL_PHOTO_AW3 } from "../../constants";
import {
  MENUS,
  getLocalData,
  END_POINT_SEVER,
} from "../../constants/api";
import { moneyCurrency } from "../../helpers";
import { successAdd, errorAdd } from "../../helpers/sweetalert";
import profileImage from "../../image/profile.png";
import { getHeaders } from "../../services/auth";
import PopUpConfirmDeletion from "../../components/popup/PopUpConfirmDeletion";
import Upload from "../../components/Upload";
import { useNavigate, useParams } from "react-router-dom";

export default function MenuList() {
  const navigate = useNavigate();
  const params = useParams();

  const [genderData, setGenderData] = useState("FEMALE");
  const [isOpened, setIsOpened] = useState(true);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [getIdMenu, setGetIdMenu] = useState();
  const [qtyMenu, setQtyMenu] = useState(0);
  const [show4, setShow4] = useState(false);
  const handleClose4 = () => setShow4(false);
  const handleShow4 = (id) => {
    setGetIdMenu(id);
    setShow4(true);
  };

  const [getTokken, setgetTokken] = useState();
  const [filterName, setFilterName] = useState("");

  // =====> getCategory
  const [Categorys, setCategorys] = useState();
  const [Menus, setMenus] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const _localData = await getLocalData();
        if (_localData) {
          setgetTokken(_localData);
          getcategory(_localData?.DATA?.storeId);
          getMenu(_localData?.DATA?.storeId);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  
  const getcategory = async (id) => {
    try {
      await fetch(
        END_POINT_SEVER + `/v3/categories?storeId=${id}&isDeleted=false`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => setCategorys(json));
    } catch (err) {
      console.log(err);
    }
  };
  
  const getMenu = async (id) => {
    try {
      await fetch(MENUS + `/?isOpened=true&storeId=${id}`, {
        method: "GET",
      })
        .then((response) => response.json())
        .then((json) => setMenus(json));
    } catch (err) {
      console.log(err);
    }
  };
  const _menuList = () => {
    navigate(`/settingStore/menu/limit/40/page/1/${params?.id}`);
  };
  const _category = () => {
    navigate(`/settingStore/menu/category/limit/40/page/1/${params?.id}`);
  };
  // upload photo
  const [namePhoto, setNamePhoto] = useState("");
  const [file, setFile] = useState();
  const [imageLoading, setImageLoading] = useState();

  // lung jak upload leo pic ja ma so u nee

  // ======> create menu
  const _createMenu = async (values) => {
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    try {
      const resData = await axios({
        method: "POST",
        url: END_POINT_SEVER + "/v3/menu/create",
        data: {
          name: values?.name,
          quantity: values?.quantity,
          categoryId: values?.categoryId,
          price: values?.price,
          detail: values?.detail,
          unit: values?.unit,
          isOpened: isOpened,
          images: [...values?.images],
          storeId: getTokken?.DATA?.storeId,
        },
        headers: headers,
      });
      if (resData?.data) {
        setMenus(resData?.data);
        handleClose();
        successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !");
    }
  };
  // detele menu
  const [show3, setShow3] = useState(false);
  const handleClose3 = () => setShow3(false);
  const [dateDelete, setdateDelete] = useState("");
  const handleShow3 = (id, name) => {
    setdateDelete({ name, id });
    setShow3(true);
  };
  const _confirmeDelete = async () => {
    try {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      const resData = await axios({
        method: "DELETE",
        url: END_POINT_SEVER + `/v3/menu/delete/${dateDelete?.id}`,
        headers: headers,
      });
      if (resData?.data) {
        setMenus(resData?.data);
        handleClose3();
        successAdd("ການລົບຂໍ້ມູນສຳເລັດ");
      }
    } catch (err) {
      errorAdd("ການລົບຂໍ້ມູນບໍ່ສຳເລັດ !");
    }
  };
  // =======>
  // update
  const [show2, setShow2] = useState(false);
  const handleClose2 = () => setShow2(false);
  const [dataUpdate, setdataUpdate] = useState("");
  const handleShow2 = async (item) => {
    setdataUpdate(item);
    setShow2(true);
  };
  const _updateCategory = async (values) => {
    let header = await getHeaders();
    const headers = {
      "Content-Type": "application/json",
      Authorization: header.authorization,
    };
    const resData = await axios({
      method: "PUT",
      url: END_POINT_SEVER + `/v3/menu/update`,
      data: {
        id: dataUpdate?._id,
        data: {
          name: values?.name,
          name_en: values?.name_en,
          quantity: values?.quantity,
          categoryId: values?.categoryId,
          price: values?.price,
          detail: values?.detail,
          unit: values?.unit,
          isOpened: isOpened,
          images: [...values?.images],
        },
      },
      headers: headers,
    });
    if (resData?.data) {
      // setMenus(resData?.data);
      handleClose2();
      successAdd("ການແກ້ໄຂຂໍ້ມູນສຳເລັດ");
    }
  };
  const _updateQtyCategory = async (values) => {
    const resData = await axios({
      method: "PUT",
      url: END_POINT_SEVER + "/v3/menu-stock/update",
      data: {
        id: getIdMenu,
        data: {
          quantity: parseInt(qtyMenu),
        },
      },
    })
      .then(async function (response) {
        handleClose4();
        successAdd("ການເພີ່ມຈຳນວນສຳເລັດ");
        handleClose();
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch(function (error) {
        errorAdd("ການເພີ່ມຈຳນວນບໍ່ສຳເລັດ !");
      });
  };
  return (
    <div style={BODY}>
      <div>
        <Nav variant="tabs" defaultActiveKey="/settingStore/menu">
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
        <div style={{ display: "grid", gridTemplateColumns: "1fr 90px 190px" }}>
          <Form.Control
            type="text"
            placeholder="ຄົ້ນຫາຊື່ອາຫານ..."
            value={filterName}
            onChange={(e) => {
              setFilterName(e.target.value);
            }}
          />
          <div />
          <Button
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={handleShow}
          >
            ເພີ່ມເມນູອາຫານ
          </Button>
        </div>
        <div style={{ height: 20 }}></div>
        <div>
          <div className="col-sm-12" style={{ overflow: "auto" }}>
            <table className="table table-hover" style={{ minWidth: 700 }}>
              <thead className="thead-light">
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">ຮູບພາບ</th>
                  <th scope="col">ຊື່ປະເພດອາຫານ</th>
                  <th scope="col">ຊື່ອາຫານ</th>
                  <th scope="col">ລາຄາ</th>
                  {/* <th scope="col">ສະຖານະ</th> */}
                  {/* <th scope='col'>ຈຳນວນ</th> */}
                  <th scope="col">ໝາຍເຫດ</th>
                  <th scope="col">ຈັດການຂໍ້ມູນ</th>
                </tr>
              </thead>
              <tbody>
                {Menus?.filter((e) => e?.name?.startsWith(filterName)).map(
                  (data, index) => {
                    return (
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          {data?.images.length > 0 ? (
                            <center>
                              <Image
                                src={URL_PHOTO_AW3 + data?.images[0]}
                                width="150"
                                height="150"
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: "50%",
                                }}
                              />
                            </center>
                          ) : (
                            <center>
                              <Image
                                src={profileImage}
                                width="150"
                                height="150"
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: "50%",
                                }}
                              />
                            </center>
                          )}
                        </td>
                        <td>{data?.categoryId?.name}</td>
                        <td>{data?.name}</td>
                        <td>{moneyCurrency(data?.price)}</td>
                        <td>{data?.detail ? data?.detail : " "}</td>
                        <td>
                          <FontAwesomeIcon
                            icon={faEdit}
                            onClick={() => handleShow2(data)}
                            style={{ color: COLOR_APP, cursor: "pointer" }}
                          />
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            style={{
                              marginLeft: 20,
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() => handleShow3(data?._id, data?.name)}
                          />
                          <FontAwesomeIcon
                            icon={faCubes}
                            style={{
                              marginLeft: 20,
                              color: "red",
                              cursor: "pointer",
                            }}
                            onClick={() =>
                              navigate(
                                `/settingStore/menu/menu-stock/${data?._id}`
                              )
                            }
                          />
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* >>>>>>>>>>>>> popup >>>>>>>>>>>> */}
      <PopUpConfirmDeletion
        open={show3}
        text={dateDelete?.name}
        onClose={handleClose3}
        onSubmit={_confirmeDelete}
      />
      {/* add menu */}
      <Modal
        show={show}
        onHide={handleClose}
        // backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ເພີ່ມເມນູອາຫານ</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            name: "",
            quantity: 1,
            categoryId: "",
            price: "",
            detail: "",
            images: [],
            unit: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
            }
            if (!values.name_en) {
              errors.name_en = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
            }
            if (parseInt(values.price) < 0 || isNaN(parseInt(values.price))) {
              errors.price = "ກະລຸນາປ້ອນລາຄາ...";
            }
            if (!values.categoryId) {
              errors.categoryId = "ກະລຸນາປ້ອນ...";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            _createMenu(values);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <Upload
                  src={values?.images?.[0] || ""}
                  removeImage={() => setFieldValue("images", [])}
                  onChange={(e) => {
                    setFieldValue("images", [e.name]);
                  }}
                />
                <Form.Group>
                  <Form.Label>ລຳດັບ</Form.Label>
                  <Form.Control
                    type="number"
                    name="sort"
                    placeholder="ລຳດັບ"
                    value={values.sort}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ປະເພດອາຫານ</Form.Label>
                  <Form.Control
                    as="select"
                    name="categoryId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.categoryId}
                    style={{
                      border:
                        errors.categoryId &&
                        touched.categoryId &&
                        errors.categoryId
                          ? "solid 1px red"
                          : "",
                    }}
                  >
                    <option selected={true} disabled={true} value="">
                      ເລືອກປະເພດອາຫານ
                    </option>
                    {Categorys?.map((item, index) => {
                      return <option value={item?._id}>{item?.name}</option>;
                    })}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຊື່ອາຫານ</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder="ຊື່ອາຫານ..."
                    style={{
                      border:
                        errors.name && touched.name && errors.name
                          ? "solid 1px red"
                          : "",
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຊື່ອາຫານ (en)</Form.Label>
                  <Form.Control
                    type="text"
                    name="name_en"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name_en}
                    placeholder="ຊື່ອາຫານ..."
                    style={{
                      border:
                        errors.name_en && touched.name_en && errors.name_en
                          ? "solid 1px red"
                          : "",
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ລາຄາ</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.price}
                    placeholder="ລາຄາ..."
                    style={{
                      border:
                        errors.price && touched.price && errors.price
                          ? "solid 1px red"
                          : "",
                    }}
                  />
                </Form.Group>
                {/* <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຈຳນວນ</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.quantity}
                    placeholder="ລາຄາ..."
                    style={{
                      border:
                        errors.quantity && touched.quantity && errors.quantity
                          ? "solid 1px red"
                          : "",
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຫົວໜ່ວຍ</Form.Label>
                  <Form.Control
                    type="text"
                    name="unit"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.unit}
                    placeholder="ລາຄາ..."
                    style={{
                      border:
                        errors.unit && touched.unit && errors.unit
                          ? "solid 1px red"
                          : "",
                    }}
                  />
                </Form.Group> */}
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ໝາຍເຫດ</Form.Label>
                  <Form.Control
                    type="text"
                    name="detail"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.detail}
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
      {/* update menu */}
      <Modal
        show={show2}
        onHide={handleClose2}
        // backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>ອັບເດດເມນູອາຫານ</Modal.Title>
        </Modal.Header>
        <Formik
          initialValues={{
            name: dataUpdate?.name,
            images: dataUpdate?.images,
            quantity: dataUpdate?.quantity,
            sort: dataUpdate?.sort,
            categoryId: dataUpdate?.categoryId?._id,
            price: dataUpdate?.price,
            detail: dataUpdate?.detail,
            unit: dataUpdate?.unit,
          }}
          validate={(values) => {
            const errors = {};
            if (!values.name) {
              errors.name = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
            }
            if (parseInt(values.price) < 0 || isNaN(parseInt(values.price))) {
              errors.price = "ກະລຸນາປ້ອນລາຄາ...";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            const getData = async () => {
              await _updateCategory(values);
              const _localData = await getLocalData();
              if (_localData) {
                setgetTokken(_localData);
                // getcategory(_localData?.DATA?.storeId);
                getMenu(_localData?.DATA?.storeId);
              }
            };
            getData();
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            setFieldValue,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <Modal.Body>
                <Upload
                  src={values?.images?.[0] || ""}
                  removeImage={() => setFieldValue("images", [])}
                  onChange={(e) => {
                    setFieldValue("images", [e.name]);
                  }}
                />
                <Form.Group>
                  <Form.Label>ລຳດັບ</Form.Label>
                  <Form.Control
                    type="number"
                    name="sort"
                    placeholder="ລຳດັບ"
                    value={values.sort}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ປະເພດອາຫານ</Form.Label>
                  <Form.Control
                    as="select"
                    name="categoryId"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.categoryId}
                  >
                    <option selected={true} disabled={true}>
                      ເລືອກປະເພດອາຫານ
                    </option>
                    {Categorys?.map((item, index) => {
                      return <option value={item?._id}>{item?.name}</option>;
                    })}
                  </Form.Control>
                </Form.Group>
                {/* <div class="form-row">
                  <div class="col-3">
                    <div class="form-group">
                      <label>ສະຖານະເປີດ/ປິດ</label>
                    </div>
                  </div>
                  <div class="col-9">
                    <div class="form-row">
                      <div class="col">
                        <div class="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="open"
                            name="isOpened"
                            defaultChecked={dataUpdate?.isOpened ? true : false}
                            class="custom-control-input"
                            onChange={() => setIsOpened(true)}
                          />
                          <label class="custom-control-label" for="open">
                            ເປີດ
                          </label>
                        </div>
                        <div class="custom-control custom-radio custom-control-inline">
                          <input
                            type="radio"
                            id="off"
                            name="isOpened"
                            defaultChecked={
                              !dataUpdate?.isOpened ? true : false
                            }
                            class="custom-control-input"
                            onChange={() => setIsOpened(false)}
                          />
                          <label class="custom-control-label" for="off">
                            ປິດ
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Form.Group controlId="exampleForm.ControlSelect1">
                  <Form.Label>ສະຖານະ</Form.Label>
                  <Form.Control
                    as="select"
                    name="status"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.status}
                  >
                    <option selected={true} disabled={true}>
                      ເລືອກສະຖານະ
                    </option>
                    <option value="HAS">ເປີດ</option>
                    <option value="DONOT">ປິດ</option>
                  </Form.Control>
                </Form.Group> */}
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຊື່ອາຫານ</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                    placeholder="ຊື່ອາຫານ..."
                    style={{
                      border:
                        errors.name && touched.name && errors.name
                          ? "solid 1px red"
                          : "",
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ລາຄາ</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.price}
                    placeholder="ລາຄາ..."
                    style={{
                      border:
                        errors.price && touched.price && errors.price
                          ? "solid 1px red"
                          : "",
                    }}
                  />
                </Form.Group>
                {/* <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຈຳນວນ</Form.Label>
                  <Form.Control
                    type="number"
                    name="quantity"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.quantity}
                    placeholder="ລາຄາ..."
                    style={{
                      border:
                        errors.quantity && touched.quantity && errors.quantity
                          ? "solid 1px red"
                          : "",
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ຫົວໜ່ວຍ</Form.Label>
                  <Form.Control
                    type="text"
                    name="unit"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.unit}
                    placeholder="ລາຄາ..."
                    style={{
                      border:
                        errors.unit && touched.unit && errors.unit
                          ? "solid 1px red"
                          : "",
                    }}
                  />
                </Form.Group> */}
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label>ໝາຍເຫດ</Form.Label>
                  <Form.Control
                    type="text"
                    name="detail"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.detail}
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
      {/* add qty menu */}
      <Modal show={show4} onHide={handleClose4}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div style={{ textAlign: "center" }}>
            <div>ປ້ອນຈຳນວນສີນຄ້າ </div>
            <div style={{ height: 20 }}></div>
            <input
              type="number"
              className="form-control"
              onChange={(e) => setQtyMenu(e?.target?.value)}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type="button" variant="secondary" onClick={handleClose4}>
            ຍົກເລີກ
          </Button>
          <Button
            type="button"
            style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0 }}
            onClick={() => _updateQtyCategory()}
          >
            ຢືນຢັນການເພີ່ມ
          </Button>
        </Modal.Footer>
      </Modal>
      {/* <<<<<<<<<<<<<< popup <<<<<<<<<<<<<< */}
    </div>
  );
}
