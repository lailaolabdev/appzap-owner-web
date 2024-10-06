import React, { useState, useEffect } from "react";
import { Spinner, Form, Button } from "react-bootstrap";
import { Formik } from "formik";
import axios from "axios";
import { COLOR_APP } from "../../../constants";
import { getLocalData, END_POINT_SEVER } from "../../../constants/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDoubleRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import PopUpAddMenuStocks from "../components/popup/PopUpAddMenuStocks";
import { getHeaders } from "../../../services/auth";

// ---------------------------------------------- //
export default function FormAddMenu() {
  // state
  const [popAddMenuStocks, setPopAddMenuStocks] = useState(false);
  const [stocks, setStocks] = useState([]);
  const [Categorys, setCategorys] = useState();
  const [namePhoto, setNamePhoto] = useState("");
  const [select, setSelect] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [loadStatus, setLoadStatus] = useState("");
  const [menuStocks, setMenuStocks] = useState([]);
  const [file, setFile] = useState();
  const [imageLoading, setImageLoading] = useState("");

  const ImageThumb = ({ image }) => {
    return (
      <img
        src={URL.createObjectURL(image)}
        alt={image.name}
        style={{
          borderRadius: "10%",
          height: 200,
          width: 200,
        }}
      />
    );
  };
  // functions
  const _createMenu = async (values) => {
    const _localData = await getLocalData();
    if (_localData) {
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
            isOpened: values?.isOpened,
            images: [namePhoto?.params?.Key],
            storeId: _localData?.DATA?.storeId,
          },
          headers: headers,
        });
        if (resData?.data) {
          // setMenus(resData?.data);
          // handleClose();
          // successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
        }
      } catch (err) {
        //   errorAdd("ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !");
      }
    }
  };
  const _createMenuStock = async (values) => {
    const _localData = await getLocalData();
    if (_localData) {
      let header = await getHeaders();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      try {
        const resData = await axios({
          method: "PUT",
          url: END_POINT_SEVER + "/v3/menu-and-menu-stock/update",
          data: {
            id: "62bbf9a0dcc3eb00202167b5",
            storeId: "61d8019f9d14fc92d015ee8e",
            data: {
              menuStock: [
                {
                  stockId: "62e7a68569239e002afa6cd5",
                  amount: 2,
                },
              ],
            },
          },
          headers: headers,
        });
        if (resData?.data) {
          // setMenus(resData?.data);
          // handleClose();
          // successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
        }
      } catch (err) {
        //   errorAdd("ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !");
      }
    }
  };
  const getCategory = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        const data = await axios.get(
          `${END_POINT_SEVER}/v3/categories?storeId=${_localData.DATA?.storeId}&isDeleted=false`
        );
        if (data.status < 300) {
          setLoadStatus("SUCCESS");
          setCategorys(data.data);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setLoadStatus("ERROR!!");
      setIsLoading(false);
      console.log("err:", err);
    }
  };
  const getStock = async () => {
    try {
      const _localData = await getLocalData();
      if (_localData) {
        setIsLoading(true);
        const data = await axios.get(
          `${END_POINT_SEVER}/v3/stocks?storeId=${_localData?.DATA?.storeId}&isDeleted=false`
        );
        if (data.status < 300) {
          setLoadStatus("SUCCESS");
          setStocks(data?.data?.stocks);
        }
        setIsLoading(false);
      }
    } catch (err) {
      setLoadStatus("ERROR!!");
      setIsLoading(false);
      console.log("err:", err);
    }
  };

  // ------------------------------------------------------------ //

  useEffect(() => {
    const getData = async () => {
      getCategory();
      getStock();
    };
    getData();
  }, []);
  // ------------------------------------------------------------ //

  return (
    <div style={{ padding: 10 }}>
      <Formik
        initialValues={{
          name: "",
          isOpened: true,
          quantity: "",
          categoryId: "",
          price: "",
          detail: "",
          unit: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
          }
          if (!values.price) {
            errors.price = "ກະລຸນາປ້ອນລາຄາ...";
          }
          if (!values.quantity) {
            errors.quantity = "ກະລຸນາປ້ອນ...";
          }
          if (!values.categoryId) {
            errors.categoryId = "ກະລຸນາປ້ອນ...";
          }
          if (!values.unit) {
            errors.unit = "ກະລຸນາປ້ອນ...";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          _createMenu(values);
          _createMenuStock(menuStocks);
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
          setFieldValue,
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit}>
            <div className="col-sm-12 center" style={{ textAlign: "center" }}>
              <input
                type="file"
                id="file-upload"
                // onChange={handleUpload}
                hidden
              />
              <label for="file-upload">
                <div
                  style={{
                    backgroundColor: "#E4E4E4E4",
                    height: 200,
                    width: 200,
                    borderRadius: "10%",
                    cursor: "pointer",
                    display: "flex",
                  }}
                >
                  {file ? (
                    <ImageThumb image={file} />
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        height: 200,
                        width: 200,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <p
                        style={{
                          color: "#fff",
                          fontSize: 80,
                          fontWeight: "bold",
                        }}
                      >
                        +
                      </p>
                    </div>
                  )}
                </div>
              </label>
              {/* progass */}
              {imageLoading ? (
                <div className="progress" style={{ height: 20 }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{
                      width: `${imageLoading}%`,
                      backgroundColor: COLOR_APP,
                    }}
                    aria-valuenow={imageLoading}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {imageLoading}%
                  </div>
                </div>
              ) : (
                <div style={{ height: 20 }} />
              )}
            </div>
            <Form.Group>
              <Form.Label>ລຳດັບ</Form.Label>
              <Form.Control
                type="text"
                name="sort"
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
                    errors.categoryId && touched.categoryId && errors.categoryId
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
            <div class="form-row">
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
                        defaultChecked={values.isOpened}
                        class="custom-control-input"
                        onChange={() => setFieldValue("isOpened", true)}
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
                        defaultChecked={!values.isOpened}
                        class="custom-control-input"
                        onChange={() => setFieldValue("isOpened", true)}
                      />
                      <label class="custom-control-label" for="off">
                        ປິດ
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
            <Form.Group controlId="exampleForm.ControlInput1">
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
            </Form.Group>
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

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              <div>
                <div style={{ textAlign: "center" }}>ສະຕ໊ອກທັງໝົດ</div>
                <div className="col-sm-12">
                  <table className="table table-hover">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">ຊື່ສິນຄ້າ</th>
                        <th scope="col">ໝວດໝູ່ສິນຄ້າ</th>
                        {/* <th scope='col'>ສະຖານະ</th> */}
                        <th scope="col">ຈຳນວນສະຕ໊ອກ</th>
                        <th scope="col">ຈັດການຂໍ້ມູນ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stocks?.map((data, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{data?.name}</td>
                            <td>{data?.stockCategoryId?.name}</td>
                            {/* <td
                              style={{
                                color: data?.isOpened ? "green" : "red",
                              }}>
                              {STATUS_MENU(data?.isOpened)}
                            </td> */}
                            <td
                              style={{
                                color: data?.quantity < 10 ? "red" : "green",
                              }}
                            >
                              {data?.quantity}
                            </td>
                            <td>
                              <FontAwesomeIcon
                                icon={faAngleDoubleRight}
                                style={{
                                  marginLeft: 20,
                                  color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setSelect(data);
                                  setPopAddMenuStocks(true);
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    {isLoading ? <Spinner animation="border" /> : ""}
                  </div>
                </div>
              </div>
              <div>
                <div style={{ textAlign: "center" }}>ສະຕ໊ອກທີຕ້ອງການ</div>
                <div className="col-sm-12">
                  <table className="table table-hover">
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">ຊື່ສິນຄ້າ</th>
                        <th scope="col">ໝວດໝູ່ສິນຄ້າ</th>
                        {/* <th scope='col'>ສະຖານະ</th> */}
                        <th scope="col">ຈຳນວນທີຕ້ອງການ</th>
                        <th scope="col">ຈັດການຂໍ້ມູນ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuStocks?.map((data, index) => {
                        return (
                          <tr>
                            <td>{index + 1}</td>
                            <td>{data?.name}</td>
                            <td>{data?.stockCategoryId?.name}</td>
                            {/* <td
                              style={{
                                color: data?.isOpened ? "green" : "red",
                              }}>
                              {STATUS_MENU(data?.isOpened)}
                            </td> */}
                            <td
                              style={{
                                color: data?.quantity < 10 ? "red" : "green",
                              }}
                            >
                              {data?.quantity}
                            </td>
                            <td>
                              <FontAwesomeIcon
                                icon={faTrash}
                                style={{
                                  marginLeft: 20,
                                  color: "red",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setMenuStocks((prev) => [
                                    ...prev.filter((e, i) => i != index),
                                  ]);
                                }}
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
            <Button variant="danger" onClick={() => {}}>
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
          </form>
        )}
      </Formik>
      {/* >>>>>>>>>>> popup >>>>>>>>>>>>>>>> */}
      <PopUpAddMenuStocks
        open={popAddMenuStocks}
        data={select}
        onClose={() => setPopAddMenuStocks(false)}
        onSubmit={(val) => {
          setMenuStocks((prev) => [...prev, val]);
        }}
      />
      {/* <<<<<<<<<<< popup <<<<<<<<<<<<<<<< */}
    </div>
  );
}
