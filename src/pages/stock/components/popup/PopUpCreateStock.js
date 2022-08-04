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

export default function PopUpCreateStock({ onClose, open, callback }) {
  // state
  const [isOpened, setIsOpened] = useState(true);
  const [Categorys, setCategorys] = useState();
  const [namePhoto, setNamePhoto] = useState("");
  const [file, setFile] = useState();
  const [imageLoading, setImageLoading] = useState("");
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
    <Modal show={open} onHide={onClose} backdrop='static' keyboard={false}>
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
          _createStock(values);
          //   _createMenu(values);
        }}>
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
              <div className='col-sm-12 center' style={{ textAlign: "center" }}>
                <input
                  type='file'
                  id='file-upload'
                  onChange={handleUpload}
                  hidden
                />
                <label for='file-upload'>
                  <div
                    style={{
                      backgroundColor: "#E4E4E4E4",
                      height: 200,
                      width: 200,
                      borderRadius: "10%",
                      cursor: "pointer",
                      display: "flex",
                    }}>
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
                        }}>
                        <p
                          style={{
                            color: "#fff",
                            fontSize: 80,
                            fontWeight: "bold",
                          }}>
                          +
                        </p>
                      </div>
                    )}
                  </div>
                </label>
                {/* progass */}
                {imageLoading ? (
                  <div className='progress' style={{ height: 20 }}>
                    <div
                      className='progress-bar'
                      role='progressbar'
                      style={{
                        width: `${imageLoading}%`,
                        backgroundColor: COLOR_APP,
                      }}
                      aria-valuenow={imageLoading}
                      aria-valuemin='0'
                      aria-valuemax='100'>
                      {imageLoading}%
                    </div>
                  </div>
                ) : (
                  <div style={{ height: 20 }} />
                )}
              </div>
              <Form.Group controlId='exampleForm.ControlSelect1'>
                <Form.Label>ປະເພດສະຕ໊ອກ</Form.Label>
                <Form.Control
                  as='select'
                  name='stockCategoryId'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.stockCategoryId}
                  isInvalid={errors.stockCategoryId}>
                  <option selected={true} disabled={true} value=''>
                    ເລືອກປະເພດສະຕ໊ອກ
                  </option>
                  {Categorys?.map((item, index) => {
                    return <option value={item?._id}>{item?.name}</option>;
                  })}
                </Form.Control>
              </Form.Group>
              <div class='form-row'>
                <div class='col-3'>
                  <div class='form-group'>
                    <label>ສະຖານະເປີດ/ປິດ</label>
                  </div>
                </div>
                <div class='col-9'>
                  <div class='form-row'>
                    <div class='col'>
                      <div class='custom-control custom-radio custom-control-inline'>
                        <input
                          type='radio'
                          id='open'
                          name='isOpened'
                          defaultChecked={values.isOpened}
                          class='custom-control-input'
                          onChange={() => setFieldValue("isOpened", true)}
                        />
                        <label class='custom-control-label' for='open'>
                          ເປີດ
                        </label>
                      </div>
                      <div class='custom-control custom-radio custom-control-inline'>
                        <input
                          type='radio'
                          id='off'
                          name='isOpened'
                          defaultChecked={!values.isOpened}
                          class='custom-control-input'
                          onChange={() => setFieldValue("isOpened", false)}
                        />
                        <label class='custom-control-label' for='off'>
                          ປິດ
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>ຊື່ສະຕ໊ອກ</Form.Label>
                <Form.Control
                  type='text'
                  name='name'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.name}
                  placeholder='ຊື່ອາຫານ...'
                  style={{
                    border:
                      errors.name && touched.name && errors.name
                        ? "solid 1px red"
                        : "",
                  }}
                />
              </Form.Group>

              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>ຈຳນວນ</Form.Label>
                <Form.Control
                  type='number'
                  name='quantity'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.quantity}
                  placeholder='ຈຳນວນ...'
                  style={{
                    border:
                      errors.quantity && touched.quantity && errors.quantity
                        ? "solid 1px red"
                        : "",
                  }}
                />
              </Form.Group>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>ຫົວໜ່ວຍ</Form.Label>
                <Form.Control
                  type='text'
                  name='unit'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.unit}
                  placeholder='ຫົວໜ່ວຍ...'
                  style={{
                    border:
                      errors.unit && touched.unit && errors.unit
                        ? "solid 1px red"
                        : "",
                  }}
                />
              </Form.Group>
              <Form.Group controlId='exampleForm.ControlInput1'>
                <Form.Label>ໝາຍເຫດ</Form.Label>
                <Form.Control
                  type='text'
                  name='detail'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.detail}
                  placeholder='ໝາຍເຫດ...'
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='danger' onClick={onClose}>
                ຍົກເລີກ
              </Button>
              <Button
                style={{
                  backgroundColor: COLOR_APP,
                  color: "#ffff",
                  border: 0,
                }}
                onClick={handleSubmit}>
                ບັນທືກ
              </Button>
            </Modal.Footer>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
