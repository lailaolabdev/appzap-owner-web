import React, { useState, useEffect } from "react";
import { useParams,useNavigate } from "react-router-dom";

import { NumericFormat } from "react-number-format";
import axios from "axios";
import { Formik } from "formik";
import moment from "moment";

/**
 * component
 */
import { TitleComponent, ButtonComponent } from "../../../components";
import {
  successAdd,
  errorAdd,
} from "../../../helpers/sweetalert";
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
import {
  Row,
  Col,
  Form,
  ProgressBar,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {faTrash} from "@fortawesome/free-solid-svg-icons";


export default function EditIncomeAndExpend() {
  const navigate = useNavigate()
  const { id } = useParams();
  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [expendData, setExpendData] = useState(null);

  const [imageLoadingMany, setImageLoadingMany] = useState(0);
  const [imgArr, setImgArr] = useState([]);


  useEffect(()=>{
    fetchExpend(id)
  },[id])

  useEffect(()=>{
    if(expendData) setImgArr(expendData?.expendImages)
  },[expendData])



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
          expendImages:imgArr,
          updatedBy: _localData?.DATA?._id,
          updatedByName:_localData?.DATA?.firstname,
        },
        headers: headers,
      })
        .then(async() => {
         await successAdd("ເພີ່ມຂໍ້ມູນສຳເລັດ");
         await  setSubmitting(false);
         await setImgArr([])
         await navigate('/expends')
        })
        .catch(function (error) {
          errorAdd("ເພີ່ມຂໍ້ມູນບໍ່ສຳເລັດ !");
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
        let filnameData = imgArr?.filter((data) => data !== item)
        setImgArr(filnameData)
    }
  return (
    <div style={{ padding: 20 }}>

      <TitleComponent fontSize={"20px"} title="ແກ້ໄຂໍ້ມູນລາຍຈ່າຍ" />
      {isLoading ? (
        <div>
          <center>
            <Spinner animation="border" variant="warning" />
          </center>
        </div>
      ) : expendData && (
      <Formik
        initialValues={{
          dateExpend: moment(expendData?.dateExpend).format("YYYY-MM-DD") ?? moment().format("YYYY-MM-DD"),
          detail: expendData?.detail ?? "",
          priceLAK: expendData?.priceLAK ?? "",
          priceUSD: expendData?.priceUSD ?? "",
          priceTHB: expendData?.priceTHB ?? "",
          priceCNY: expendData?.priceCNY ?? "",
          paidBy:expendData?.paidBy ?? "",
          paidTo:expendData?.paidTo ?? "",
          payment: expendData?.payment ?? "",
          note: expendData?.note ?? "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.dateExpend) errors.dateExpend = "-";
          if (!values.detail) errors.detail = "-";
          if (!values.paidBy) errors.paidBy = "-";
          if (!values.paidTo) errors.paidTo = "-";
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
            <Col xs={12} md={6}>
                <Form.Group>
                  <Form.Label xs={12} sm="6">
                    ອັບໂຫລດຮູບໃບບິນ
                  </Form.Label>

                  <Row>
                    <Col xs="12" sm="3" md="6">
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
                          <Col xs="12" sm="3" md="6" key={index}>
                            <div className="show-img-upload">
                              <FontAwesomeIcon
                                icon={faTrash}
                                className="delete-img"
                                onClick={()=> _onDeleteImg(item)}
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
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>
                    ລາຍລະອຽດການຈ່າຍ <span style={{ color: "red" }}>*</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    onChange={handleChange}
                    name="detail"
                    isInvalid={!!errors.detail}
                    value={values.detail}
                    placeholder="ປ້ອນລາຍລະອຽດການຈ່າຍ"
                  />
                </Form.Group>

                <Row>
                  <Col xs={12} sm={4} md={4}>
                    <Form.Group>
                      <Form.Label>
                        ຜູ້ຈ່າຍ <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="paidBy"
                        isInvalid={!!errors.paidBy}
                        onChange={handleChange}
                        value={values.paidBy}
                        placeholder="ປ້ອນຊື່ຜູ້ຈ່າຍ..."
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4} md={4}>
                    <Form.Group>
                      <Form.Label>
                        ຜູ້ຮັບ <span style={{ color: "red" }}>*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="paidTo"
                        isInvalid={!!errors.paidTo}
                        onChange={handleChange}
                        value={values.paidTo}
                        placeholder="ປ້ອນຊື່ຜູ້ຮັບ...."
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={4} md={4}>
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
                        <option value="OTHER">ອື່ນໆ</option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col xs={12} sm={6} md={3}>
                    <Form.Group>
                      <Form.Label>ຈຳນວນເງິນກີບ</Form.Label>
                      <NumericFormat
                        allowLeadingZeros
                        thousandSeparator=","
                        decimalScale={2}
                        allowNegative={false}
                        value={values.priceLAK}
                        type="text"
                        placeholder="ຈຳນວນເງິນ"
                        customInput={Form.Control}
                        name="priceLAK"
                        onChange={handleChange}
                        size="small"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3}>
                    <Form.Group>
                      <Form.Label>ຈຳນວນເງິນບາດ</Form.Label>
                      <NumericFormat
                        allowLeadingZeros
                        thousandSeparator=","
                        decimalScale={2}
                        allowNegative={false}
                        value={values.priceTHB}
                        type="text"
                        placeholder="ຈຳນວນເງິນ"
                        name="priceTHB"
                        onChange={handleChange}
                        customInput={Form.Control}
                        size="small"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3}>
                    <Form.Group>
                      <Form.Label>ຈຳນວນເງິນໂດລາ</Form.Label>
                      <NumericFormat
                        allowLeadingZeros
                        thousandSeparator=","
                        decimalScale={2}
                        allowNegative={false}
                        value={values.priceUSD}
                        type="text"
                        placeholder="ຈຳນວນເງິນ"
                        name="priceUSD"
                        onChange={handleChange}
                        customInput={Form.Control}
                        size="small"
                      />
                    </Form.Group>
                  </Col>
                  <Col xs={12} sm={6} md={3}>
                    <Form.Group>
                      <Form.Label>ຈຳນວນເງິນຢວນ</Form.Label>
                      <NumericFormat
                        allowLeadingZeros
                        thousandSeparator=","
                        decimalScale={2}
                        allowNegative={false}
                        value={values.priceCNY}
                        type="text"
                        placeholder="ຈຳນວນເງິນ"
                        name="priceCNY"
                        onChange={handleChange}
                        customInput={Form.Control}
                        size="small"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group>
                  <Form.Label>ໝາຍເຫດ</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    name="note"
                    onChange={handleChange}
                    placeholder="ໝາຍເຫດ.."
                    value={values.note}
                  />
                </Form.Group>

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
                    handleClick={() => navigate('/expends')}
                    hoverbg={"gray"}
                  />
                  <ButtonComponent
                    type="button"
                    title={"ບັນທຶກ"}
                    width="150px"
                    handleClick={() => handleSubmit()}
                    colorbg={"darkorange"}
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
