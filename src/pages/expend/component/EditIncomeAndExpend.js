import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { NumericFormat } from "react-number-format";
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

import { faSave, faTrash } from "@fortawesome/free-solid-svg-icons";
import { COLOR_APP } from "../../../constants";
import { useTranslation } from "react-i18next";

export default function EditIncomeAndExpend() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [expendData, setExpendData] = useState(null);

  const [imageLoadingMany, setImageLoadingMany] = useState(0);
  const [imgArr, setImgArr] = useState([]);

  useEffect(() => {
    fetchExpend(id);
  }, [id]);

  useEffect(() => {
    if (expendData) setImgArr(expendData?.expendImages);
  }, [expendData]);

  //function()
  const fetchExpend = async (id) => {
    try {
      setIsLoading(true);
      let header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "get",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expend/${id}`,
        headers: headers,
      }).then((res) => {
        setExpendData(res.data);
        setIsLoading(false);
      });
    } catch (err) {
      console.log("err:::", err);
    }
  };

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
        method: "PUT",
        url: END_POINT_SERVER_BUNSI + `/api/v1/expend/${id}`,
        data: {
          ...data,
          accountId: _localData?.DATA?.storeId,
          platform: "APPZAPP",
          typeStatus: "EXPEND",
          expendImages: imgArr,
          updatedBy: _localData?.DATA?._id,
          updatedByName: _localData?.DATA?.firstname,
        },
        headers: headers,
      })
        .then(async () => {
          await setIsLoading(false);
          await successAdd(`${t('add_success')}`);
          await setSubmitting(false);
          await setImgArr([]);
          await navigate("/expends/limit/40/skip/1");
        })
        .catch(function (error) {
          errorAdd(`${t('add_fail')}`);
          setIsLoading(false);
          setSubmitting(false);
        });
    } catch (err) {
      console.log("err::::", err);
    }
  };

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
      <TitleComponent fontSize={"20px"} title={t('edit')} />
      {isLoading ? (
        <div>
          <center>
            <Spinner animation="border" variant="warning" />
          </center>
        </div>
      ) : (
        expendData && (
          <Formik
            initialValues={{
              dateExpend:
                moment(expendData?.dateExpend).format("YYYY-MM-DD") ??
                moment().format("YYYY-MM-DD"),
              detail: expendData?.detail ?? "",
              priceLAK: expendData?.priceLAK ?? "",
              priceUSD: expendData?.priceUSD ?? "",
              priceTHB: expendData?.priceTHB ?? "",
              priceCNY: expendData?.priceCNY ?? "",
              paidBy: expendData?.paidBy ?? "",
              paidTo: expendData?.paidTo ?? "",
              payment: expendData?.payment ?? "CASH",
              note: expendData?.note ?? "",
            }}
            validate={(values) => {
              const errors = {};
              if (!values.dateExpend) errors.dateExpend = "-";
              if (!values.detail) errors.detail = "-";
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
                            {t('paid_date')} <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="date"
                            onChange={handleChange}
                            name="dateExpend"
                            isInvalid={!!errors.dateExpend}
                            value={values.dateExpend}
                            style={{ width: 200 }}
                          />
                        </Form.Group>
                      </Col>

                      <Col xs={12} sm={12} md={6}>
                        <Form.Group>
                          <Form.Label>
                            {t('expence_type')} <span style={{ color: "red" }}>*</span>
                          </Form.Label>
                          <Form.Control
                            as="select"
                            name="type"
                            // isInvalid={!!errors.payment}
                            // value={values.payment}
                            onChange={handleChange}
                          >
                            <option value="INGREDIENT_FOOD">{t('ingredient_food')}</option>
                            <option value="INGREDIENT_DRINK">{t('ingredient_drink')}</option>
                            <option value="MAINTENANCE">{t('edit_restaurant')}</option>
                            <option value="MARKETING">{t('marketing')}</option>
                            <option value="SALARY">{t('staff_salary')}</option>
                            <option value="WELFARE">{t('welfare')}</option>
                            <option value="OPERATION">{t('operation_price')}</option>
                            <option value="OTHER">{t('other')}</option>
                            {/* <option value="OTHER">ອື່ນໆ</option> */}
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    </Row>



                    <Row>
                      <Col xs={12} sm={6} md={6}>
                        <Form.Group>
                          <Form.Label>{t('paid_by')}</Form.Label>
                          <Form.Control
                            type="text"
                            name="paidBy"
                            // isInvalid={!!errors.paidBy}
                            onChange={handleChange}
                            value={values.paidBy}
                            placeholder={t('fill_paid_by')}
                          />
                        </Form.Group>
                      </Col>
                      <Col xs={12} sm={6} md={6}>
                        <Form.Group>
                          <Form.Label>{t('reciver')}</Form.Label>
                          <Form.Control
                            type="text"
                            name="paidTo"
                            // isInvalid={!!errors.paidTo}
                            onChange={handleChange}
                            value={values.paidTo}
                            placeholder={t('fill_reciver')}
                          />
                        </Form.Group>
                      </Col>

                    </Row>

                    <Row>
                      <Col xs={12} sm={12} md={12}>
                        <Form.Group>
                          <Form.Label>{t('money_lak')}</Form.Label>
                          <NumericFormat
                            allowLeadingZeros
                            thousandSeparator=","
                            decimalScale={2}
                            allowNegative={false}
                            value={values.priceLAK}
                            type="text"
                            placeholder={t('print_money')}
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
                          <Form.Label>{t('money_thb')}</Form.Label>
                          <NumericFormat
                            allowLeadingZeros
                            thousandSeparator=","
                            decimalScale={2}
                            allowNegative={false}
                            value={values.priceTHB}
                            type="text"
                            placeholder={t('print_money_thb')}
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
                          <Form.Label>{t('money_usd')}</Form.Label>
                          <NumericFormat
                            allowLeadingZeros
                            thousandSeparator=","
                            decimalScale={2}
                            allowNegative={false}
                            value={values.priceUSD}
                            type="text"
                            placeholder={t('print_money_usd')}
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
                          <Form.Label>{t('money_cny')}</Form.Label>
                          <NumericFormat
                            allowLeadingZeros
                            thousandSeparator=","
                            decimalScale={2}
                            allowNegative={false}
                            value={values.priceCNY}
                            type="text"
                            placeholder={t('print_money_cny')}
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
                        {t('paid_method')} <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="select"
                        name="payment"
                        isInvalid={!!errors.payment}
                        value={values.payment}
                        onChange={handleChange}
                      >
                        <option value="">{t('chose_payment_method')}</option>
                        <option value="CASH">{t('cash')}</option>
                        <option value="TRANSFER">{t('transfer')}</option>
                        <option value="DEBT">{t('debt')}</option>
                        {/* <option value="OTHER">ອື່ນໆ</option> */}
                      </Form.Control>
                      <Form.Label>
                        {t('paid_detail')} <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        onChange={handleChange}
                        name="detail"
                        isInvalid={!!errors.detail}
                        value={values.detail}
                        placeholder={t('fill_paid_detail')}
                      />
                    </Form.Group>

                    <Form.Group>
                      <Form.Label>{t('note')}</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        name="note"
                        onChange={handleChange}
                        placeholder={t('note')}
                        value={values.note}
                      />
                    </Form.Group>


                    <Form.Group>
                      <Form.Label xs={12} sm="6">
                        {t('upload_bill_image')}
                      </Form.Label>

                      <Row>
                        <Col xs="12" sm="6" md="6">
                          <label style={{ width: "100%" }}>
                            <div className="box-upload-img">
                              {imageLoadingMany > 0 ? (
                                <Spinner
                                  animation="border"
                                  variant="secondary"
                                />
                              ) : (
                                <>
                                  + <br /> {t('click_upload')}
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
                      </Row>
                      {imgArr.length > 0
                        ? imgArr.map((item, index) => (
                          <Col xs="12" sm="6" md="6" key={index} style={{ margin: 3 }}>
                            <div className="show-img-upload">
                              <FontAwesomeIcon
                                icon={faTrash}
                                // className="delete-img"
                                onClick={() => _onDeleteImg(item)}
                                style={{ position: 'absolute', top: 5, right: 5, fontSize: 24, color: COLOR_APP, cursor: "pointer", zIndex: 999 }}
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
                    </Form.Group>
                  </Col>
                  {/* 
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
                        colorbg={"lightgray"}
                        handleClick={() => navigate("/expends/limit/40/skip/1", { replace: true })}
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
                  </Col> */}
                </Row>
                <div style={{ backgroundColor: "", height: 50, width: "100vw", position: "fixed", bottom: 30 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: 10,
                      marginTop: "2rem",
                    }}
                  >
                    <ButtonComponent
                      title={`${t('close')}`}
                      width="150px"
                      handleClick={() => navigate("/expends/limit/40/skip/1", { replace: true })}
                      colorbg={"lightgray"}
                      hoverbg={"gray"}
                    />
                    <ButtonComponent
                      type="button"
                      icon={faSave}
                      title={`${t('save')}`}
                      width="350px"
                      handleClick={() => handleSubmit()}
                      colorbg={"#fb6e3b"}
                      hoverbg={"orange"}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </form>
            )}
          </Formik>
        )
      )}
    </div>
  );
}
