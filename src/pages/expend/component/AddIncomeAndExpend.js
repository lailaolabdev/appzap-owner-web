import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik } from "formik";
import moment from "moment";

/**
 * component
 */
import { TitleComponent, ButtonComponent } from "../../../components";
import { successAdd, errorAdd } from "../../../helpers/sweetalert";
/**
 * function
 */

import { getHeadersAccount } from "../../../services/auth";

/**
 * api
 */
import {
  END_POINT_SERVER_BUNSI,
  getLocalData,
  PRESIGNED_URL,
} from "../../../constants/api";

/**
 * css
 */
import { Row, Col, Form, ProgressBar, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function AddIncomeAndExpend() {
  const navigate = useNavigate();

  const [imageLoadingMany, setImageLoadingMany] = useState(0);
  const [imgArr, setImgArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const createExpend = async (data, setSubmitting) => {
    try {
      setIsLoading(true);
      const _localData = await getLocalData();

      let header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };

      await axios({
        method: "POST",
        url: END_POINT_SERVER_BUNSI + "/api/v1/expend",
        data: {
          ...data,
          accountId: _localData?.DATA?.storeId,
          platform: "APPZAPP",
          typeStatus: "EXPEND",
          expendImages: imgArr,
          createdBy: _localData?.DATA?._id,
          createdByName: _localData?.DATA?.firstname,
        },
        headers: headers,
      })
        .then(async (response) => {
          await setIsLoading(false);
          await successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
          await setSubmitting(false);
          await setImgArr([]);
          await navigate("/expends/limit/40/skip/1");
        })
        .catch(function (error) {
          errorAdd("ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !");
          setIsLoading(false);
          setSubmitting(false);
        });
    } catch (err) {
      console.log("err::::", err);
    }
  };

  const imgExample =
    "https://png.pngtree.com/thumb_back/fh260/back_our/20190623/ourmid/pngtree-summer-fresh-blue-sky-and-grass-close-to-nature-background-image_242538.jpg";

  const handleUploadMany = async (event) => {
    try {
      let fileData = event.target.files[0];

      const responseUrl = await axios({
        method: "post",
        url: PRESIGNED_URL,
        data: {
          name: event.target.files[0].type,
        },
      });

      if (!responseUrl.data?.error) {
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
            setImageLoadingMany(percentCompleted);
          },
        });

        const url = afterUpload.config.url.split("?")[0];
        const splitName = url.split("/");
        const name = splitName[splitName.length - 1];

        let newArray = [...imgArr, name];
        setImgArr(newArray);
        setImageLoadingMany(0);
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  //delete file
  const _onDeleteImg = (item) => {
    let filnameData = imgArr?.filter((data) => data !== item);
    setImgArr(filnameData);
  };
  return (
    <div style={{ padding: 20 }}>
      <TitleComponent fontSize={"20px"} title="ລົງບັນຊີລາຍຈ່າຍປະຈຳວັນ" />

      {isLoading ? (
        <div>
          <center>
            <Spinner animation="border" variant="warning" />
          </center>
        </div>
      ) : (
        <Formik
          initialValues={{
            dateExpend: moment().format("YYYY-MM-DD"),
            detail: "",
            priceLAK: 0,
            priceUSD: 0,
            priceTHB: 0,
            priceCNY: 0,
            paidBy: "",
            paidTo: "",
            payment: "CASH",
            note: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.dateExpend) errors.dateExpend = "-";
            if (!values.detail) errors.detail = "-";
            // if (!values.paidBy) errors.paidBy = "-";
            // if (!values.paidTo) errors.paidTo = "-";
            if (!values.payment) errors.payment = "-";

            return errors;
          }}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            let _priceLAK = values.priceLAK.toString();
            let priceLAK = parseInt(_priceLAK.replaceAll(",", ""));
            let _priceUSD = values.priceUSD.toString();
            let priceUSD = parseInt(_priceUSD.replaceAll(",", ""));
            let _priceTHB = values.priceTHB.toString();
            let priceTHB = parseInt(_priceTHB.replaceAll(",", ""));
            let _priceCNY = values.priceCNY.toString();
            let priceCNY = parseInt(_priceCNY.replaceAll(",", ""));

            let _data = {
              ...values,
              priceLAK: priceLAK,
              priceUSD: priceUSD,
              priceTHB: priceTHB,
              priceCNY: priceCNY,
            };
            await resetForm();
            await createExpend(_data, setSubmitting);
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
          }) => (
            <form onSubmit={handleSubmit}>
              <Row>
                <Col xs={12} sm={12} md={6}>
                  <Row>
                    <Col xs={12} sm={12} md={6}>
                      <Form.Group>
                        <Form.Label>
                          ວັນທີຈ່າຍ <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="date"
                          onChange={handleChange}
                          name="dateExpend"
                          isInvalid={!!errors.dateExpend}
                          value={values.dateExpend}
                          // style={{ width: 300 }}
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} sm={12} md={6}>
                      <Form.Group>
                        <Form.Label>
                          ຮູບແບບຈ່າຍ <span style={{ color: "red" }}>*</span>
                        </Form.Label>
                        <Form.Control
                          as="select"
                          name="payment"
                          isInvalid={!!errors.payment}
                          value={values.payment}
                          onChange={handleChange}
                        >
                          <option value="">ເລືອກຮູບແບບຈ່າຍ</option>
                          <option value="CASH">ເງິນສົດ</option>
                          <option value="TRANSFER">ເງິນໂອນ</option>
                          {/* <option value="OTHER">ອື່ນໆ</option> */}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} sm={6} md={6}>
                      <Form.Group>
                        <Form.Label>ຜູ້ຈ່າຍ</Form.Label>
                        <Form.Control
                          type="text"
                          name="paidBy"
                          // isInvalid={!!errors.paidBy}
                          onChange={handleChange}
                          value={values.paidBy}
                          placeholder="ປ້ອນຊື່ຜູ້ຈ່າຍ..."
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={6} md={6}>
                      <Form.Group>
                        <Form.Label>ຜູ້ຮັບ</Form.Label>
                        <Form.Control
                          type="text"
                          name="paidTo"
                          // isInvalid={!!errors.paidTo}
                          onChange={handleChange}
                          value={values.paidTo}
                          placeholder="ປ້ອນຊື່ຜູ້ຮັບ...."
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col xs={12} sm={12} md={12}>
                      <Form.Group>
                        <Form.Label>ເງິນກີບ</Form.Label>
                        <NumericFormat
                          allowLeadingZeros
                          thousandSeparator=","
                          decimalScale={2}
                          allowNegative={false}
                          // value={values.priceLAK}
                          type="text"
                          placeholder="ພິມເງິນກີບ..."
                          customInput={Form.Control}
                          name="priceLAK"
                          onChange={handleChange}
                          size="small"
                          className='inputMoney'
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={12}>
                      <Form.Group>
                        <Form.Label>ເງິນບາດ</Form.Label>
                        <NumericFormat
                          allowLeadingZeros
                          thousandSeparator=","
                          decimalScale={2}
                          allowNegative={false}
                          // value={values.priceTHB}
                          type="text"
                          placeholder="ພິມເງິນບາດ..."
                          name="priceTHB"
                          onChange={handleChange}
                          customInput={Form.Control}
                          size="small"
                          className='inputMoney'
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={12}>
                      <Form.Group>
                        <Form.Label>ເງິນໂດລາ</Form.Label>
                        <NumericFormat
                          allowLeadingZeros
                          thousandSeparator=","
                          decimalScale={2}
                          allowNegative={false}
                          // value={values.priceUSD}
                          type="text"
                          placeholder="ພິມເງິນໂດລາ..."
                          name="priceUSD"
                          onChange={handleChange}
                          customInput={Form.Control}
                          size="small"
                          className='inputMoney'
                        />
                      </Form.Group>
                    </Col>
                    <Col xs={12} sm={12} md={12}>
                      <Form.Group>
                        <Form.Label>ເງິນຢວນ</Form.Label>
                        <NumericFormat
                          allowLeadingZeros
                          thousandSeparator=","
                          decimalScale={2}
                          allowNegative={false}
                          // value={values.priceCNY}
                          type="text"
                          placeholder="ພິມເງິນຢວນ..."
                          name="priceCNY"
                          onChange={handleChange}
                          customInput={Form.Control}
                          size="small"
                          className='inputMoney'
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>

                <Col xs={12} md={6}>
                  <Form.Group>
                    <Form.Label>
                      ລາຍລະອຽດການຈ່າຍ <span style={{ color: "red" }}>*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      onChange={handleChange}
                      name="detail"
                      isInvalid={!!errors.detail}
                      value={values.detail}
                      placeholder="ປ້ອນລາຍລະອຽດການຈ່າຍ"
                    />
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>ໝາຍເຫດ</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="note"
                      onChange={handleChange}
                      placeholder="ໝາຍເຫດ.."
                      value={values.note}
                    />
                  </Form.Group>

                  <Form.Group>
                    <Form.Label xs={12} sm="3">
                      ອັບໂຫລດຮູບໃບບິນ
                    </Form.Label>

                    <Row>
                      <Col xs="12" sm="6" md="6">
                        <label style={{ width: "100%" }}>
                          <div className="box-upload-img">
                            {imageLoadingMany > 0 ? (
                              <Spinner animation="border" variant="secondary" />
                            ) : (
                              <>
                                + <br /> ຄລິກເພື່ອອັບໂຫລດ
                              </>
                            )}
                          </div>
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={(e) => handleUploadMany(e)}
                            accept=".png, .jpeg, .jpg, .mp4"
                          />
                          {imageLoadingMany > 0 ? (
                            <ProgressBar
                              variant="success"
                              style={{ height: 5 }}
                              now={imageLoadingMany}
                            />
                          ) : (
                            ""
                          )}
                        </label>
                      </Col>
                      {imgArr.length > 0
                        ? imgArr.map((item, index) => (
                            <Col xs="12" sm="6" md="6" key={index}>
                              <div className="show-img-upload">
                                <FontAwesomeIcon
                                  icon={faTrash}
                                  className="delete-img"
                                  onClick={() => _onDeleteImg(item)}
                                />
                                <img
                                  src={
                                    "https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/" +
                                    item
                                  }
                                  alt={item}
                                />
                              </div>
                            </Col>
                          ))
                        : ""}
                    </Row>
                  </Form.Group>


                </Col>

               

                <Col xs={12} md={12}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 10,
                      marginTop: "2rem",
                    }}
                  >
                    <ButtonComponent
                      title={"ປິດອອກ"}
                      width="150px"
                      handleClick={() => navigate("/expends/limit/40/skip/1")}
                      colorbg={"lightgray"}
                      hoverbg={"gray"}
                    />
                    <ButtonComponent
                      type="button"
                      title={"ບັນທຶກ"}
                      width="150px"
                      handleClick={() => handleSubmit()}
                      colorbg={"#fb6e3b"}
                      hoverbg={"orange"}
                      disabled={isSubmitting}
                    />
                  </div>
                </Col>
              </Row>
            </form>
          )}
        </Formik>
      )}
    </div>
  );
}
