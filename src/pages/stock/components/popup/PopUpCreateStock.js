import React, { useState, useEffect } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Formik } from "formik";
import { COLOR_APP } from "../../../../constants";
import {
  PRESIGNED_URL,
  getLocalData,
  END_POINT_SEVER,
} from "../../../../constants/api";
import { successAdd, errorAdd } from "../../../../helpers/sweetalert";

export default function PopUpCreateStock({ onClose, open, callback }) {
  // state
  const [isOpened, setIsOpened] = useState(true);
  const [Categorys, setCategorys] = useState();
  const [namePhoto, setNamePhoto] = useState("");
  const [file, setFile] = useState();
  const [imageLoading, setImageLoading] = useState("");
  const [otherUnit, setOtherUnit] = useState(false);
  const handleUpload = async (event) => {
    // setImageLoading("");
    try {
      setFile(event.target.files[0]);
      let fileData = event.target.files[0];
      const responseUrl = await axios({
        method: "post",
        url: PRESIGNED_URL,
        data: {
          name: event.target.files[0].type,
        },
      });
      setNamePhoto(responseUrl.data);
      let afterUpload = await axios({
        method: "put",
        url: responseUrl.data.url,
        data: fileData,
        headers: {
          "Content-Type": " file/*; image/*",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "DELETE, POST, GET, OPTIONS",
          "Access-Control-Allow-Headers":
            "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With",
        },
        onUploadProgress: function (progressEvent) {
          var percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setImageLoading(percentCompleted);
        },
      });
    } catch (error) {
      console.log(error);
    }
  };
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
  const _createStock = async (values) => {
    const _localData = await getLocalData();
    if (_localData) {
      const data = await axios.post(
        `${END_POINT_SEVER}/v3/stock/create`,
        { ...values, storeId: _localData?.DATA?.storeId },
        {
          headers: {
            ..._localData?.TOKEN,
          },
        }
      );
      if (data.status < 300) {
        onClose();
        callback();
      }
    }
    return;
  };

  useEffect(() => {
    const getcategory = async () => {
      const _localData = await getLocalData();
      if (_localData) {
        await fetch(
          END_POINT_SEVER +
            `/v3/stock-categories?storeId=${_localData?.DATA?.storeId}&isDeleted=false`,
          {
            method: "GET",
          }
        )
          .then((response) => response.json())
          .then((json) => setCategorys(json));
      }
    };
    getcategory();
  }, []);

  return (
    <Modal show={open} onHide={onClose} /*backdrop="static"*/ keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>ສ້າງສະຕ໊ອກ</Modal.Title>
      </Modal.Header>
      <Formik
        initialValues={{
          sellPrice: 0,
          buyPrice: 0,
          // quantity: 0,
          limit: 0,
          isOpened: true,
          isDeleted: false,
          name: "",
          unit: "",
          stockCategoryId: "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "ກະລຸນາປ້ອນຊື່ອາຫານ...";
          }
          //   if (!values.price) {
          //     errors.price = "ກະລຸນາປ້ອນລາຄາ...";
          //   }
          if (!values.quantity) {
            errors.quantity = "ກະລຸນາປ້ອນ...";
          }
          if (!values.stockCategoryId) {
            errors.stockCategoryId = "ກະລຸນາປ້ອນ...";
          }
          if (!values.unit) {
            errors.unit = "ກະລຸນາປ້ອນ...";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          const fetchData = async () => {
            try {
              await _createStock(values);
              successAdd("ສ້າງສະຕ໊ອກສຳເລັດ");
            } catch (error) {
              console.log(error);
              errorAdd("ສ້າງສະຕ໊ອນບໍ່ສຳເລັດ");
            }
            setSubmitting(false);
          };
          fetchData();
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
            <Modal.Body>
              <Form.Group controlId="exampleForm.ControlSelect1">
                <Form.Label>ປະເພດສະຕ໊ອກ</Form.Label>
                <Form.Control
                  as="select"
                  name="stockCategoryId"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.stockCategoryId}
                  isInvalid={errors.stockCategoryId}
                >
                  <option selected={true} disabled={true} value="">
                    ເລືອກປະເພດສະຕ໊ອກ
                  </option>
                  {Categorys?.map((item, index) => {
                    return <option value={item?._id}>{item?.name}</option>;
                  })}
                </Form.Control>
              </Form.Group>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ຊື່ສະຕ໊ອກ</Form.Label>
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
                <Form.Label>ຈຳນວນສະຕ໊ອກ</Form.Label>
                <Form.Control
                  type="number"
                  name="quantity"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantity}
                  placeholder="ຈຳນວນສະຕ໊ອກ..."
                  isInvalid={errors?.quantity}
                />
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>ຫົວໜ່ວຍ</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => {
                    if (e.target.value != "other") {
                      setOtherUnit(false);
                      setFieldValue("unit", e.target.value);
                    } else {
                      setOtherUnit(true);
                    }
                  }}
                  // onBlur={handleBlur}
                  value={
                    ["ກຣາມ", "ໝັດ", "ແກ້ວ"].filter((e) => e == values.unit)
                      ?.length > 0
                      ? values.unit
                      : "other"
                  }
                  isInvalid={errors.unit}
                >
                  <option selected={true} disabled={true} value="">
                    ເລືອກຫົວໜ່ວຍ
                  </option>
                  {["ກຣາມ", "ໝັດ", "ແກ້ວ"].map((e, i) => (
                    <option value={e} key={i}>
                      {e}
                    </option>
                  ))}
                  <option value="other">ອື່ນໆ</option>
                </Form.Control>
                {otherUnit && (
                  <Form.Control
                    type="text"
                    name="unit"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.unit}
                    placeholder="ຫົວໜ່ວຍ..."
                    style={{
                      border:
                        errors.unit && touched.unit && errors.unit
                          ? "solid 1px red"
                          : "",
                      marginTop: 10,
                    }}
                  />
                )}
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
            </Modal.Body>
            <Modal.Footer>
              <Button variant="danger" onClick={onClose}>
                ຍົກເລີກ
              </Button>
              <Button
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#ffff",
                  border: 0,
                }}
                disabled={isSubmitting}
                onClick={handleSubmit}
              >
                ບັນທືກ
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
