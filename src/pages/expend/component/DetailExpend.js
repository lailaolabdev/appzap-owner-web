import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { NumericFormat } from "react-number-format";
import axios from "axios";
import { Formik } from "formik";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";

/**
 * component
 */
import { TitleComponent, ButtonComponent } from "../../../components";
import PopUpConfirmDeletion from "../../../components/popup/PopUpConfirmDeletion";

import {
  successAdd,
  errorAdd,
  successDelete,
} from "../../../helpers/sweetalert";
/**
 * function
 */

import { getHeadersAccount } from "../../../services/auth";
import { moneyCurrency, convertPayment, formatDate } from "../../../helpers";

/**
 * api
 */
import { END_POINT_SERVER_BUNSI, getLocalData } from "../../../constants/api";
/**
 * css
 */
import { Row, Col, Form, Spinner } from "react-bootstrap";

import {
  faArrowLeft,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

// import { faClose, faSave } from "@fortawesome/free-solid-svg-icons";

export default function DetailExpend() {
  const navigate = useNavigate();
  const { id } = useParams();
  //useState
  const [isLoading, setIsLoading] = useState(false);
  const [expendData, setExpendData] = useState(null);
  const [shoConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    fetchExpend(id);
  }, [id]);

  //function()
  const fetchExpend = async (id) => {
    try {
      setIsLoading(true);
      const _localData = await getLocalData();
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
        console.log("res:::", res);
        setExpendData(res.data);
        setIsLoading(false);
      });
    } catch (err) {
      console.log("err:::", err);
    }
  };

  //_confirmeDelete
  const _confirmeDelete = async () => {
    try {
      await setIsLoading(true);
      await setShowConfirmDelete(false);
      const _localData = await getLocalData();
      let header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "delete",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expend/${id}`,
        headers: headers,
      }).then(async (res) => {
        await successAdd("ລຶບສຳເລັດ");
        await navigate("/expends");
        await setIsLoading(false);
      });
    } catch (err) {
      errorAdd("ລຶບບໍ່ສຳເລັດ");
      console.log("err:::", err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* <Breadcrumb>
        <Breadcrumb.Item href="#">ລົງບັນຊີຮັບ-ຈ່າຍ</Breadcrumb.Item>
        <Breadcrumb.Item active>ລາຍລະອຽດ</Breadcrumb.Item>
      </Breadcrumb> */}

      <TitleComponent fontSize={"20px"} title="ລາຍລະອຽດລາຍຈ່າຍ" />

      {isLoading ? (
        <div>
          <center>
            <Spinner animation="border" variant="warning" />
          </center>
        </div>
      ) : (
        expendData && (
          <Row>
            <Col xs={12} md={6}>
              <Form.Group>
                <Form.Label style={{ color: "gray" }}>
                  ອັບໂຫລດຮູບໃບບິນ
                </Form.Label>
                <Row>
                  {expendData?.expendImages.length > 0 ? (
                    expendData?.expendImages.map((item, index) => (
                      <Col xs="12" sm="3" md="6" key={index}>
                        <div className="show-img-upload mb-2">
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
                  ) : (
                    <div
                      style={{
                        fontWeight: 400,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      ບໍ່ມີຮູບບິນ
                    </div>
                  )}
                </Row>
              </Form.Group>
            </Col>
            <Col xs={12} sm={12} md={6}>
              <Form.Group>
                <Form.Label style={{ color: "gray" }}>ວັນທີຈ່າຍ</Form.Label>

                <p style={{ fontWeight: 400 }}>
                  {formatDate(expendData?.dateExpend)}
                </p>
              </Form.Group>

              <Form.Group>
                <Form.Label style={{ color: "gray" }}>
                  ລາຍລະອຽດການຈ່າຍ
                </Form.Label>
                <p style={{ fontWeight: 400 }}>{expendData?.detail}</p>
              </Form.Group>

              <Row>
                <Col xs={12} sm={4} md={4}>
                  <Form.Group>
                    <Form.Label style={{ color: "gray" }}>ຜູ້ຈ່າຍ</Form.Label>
                    <p style={{ fontWeight: 400 }}>{expendData?.paidBy}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={4} md={4}>
                  <Form.Group>
                    <Form.Label style={{ color: "gray" }}>ຜູ້ຮັບ</Form.Label>
                    <p style={{ fontWeight: 400 }}>{expendData?.paidTo}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={4} md={4}>
                  <Form.Group>
                    <Form.Label style={{ color: "gray" }}>
                      ຮູບແບບຈ່າຍ
                    </Form.Label>
                    <p style={{ fontWeight: 400 }}>
                      {convertPayment(expendData?.payment)}
                    </p>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} sm={6} md={3}>
                  <Form.Group>
                    <Form.Label style={{ color: "gray" }}>
                      ຈຳນວນເງິນກີບ
                    </Form.Label>
                    <p style={{ fontWeight: 400 }}>
                      {moneyCurrency(expendData?.priceLAK)}
                    </p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={3}>
                  <Form.Group>
                    <Form.Label style={{ color: "gray" }}>
                      ຈຳນວນເງິນບາດ
                    </Form.Label>
                    <p style={{ fontWeight: 400 }}>
                      {moneyCurrency(expendData?.priceTHB)}
                    </p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={3}>
                  <Form.Group>
                    <Form.Label style={{ color: "gray" }}>
                      ຈຳນວນເງິນໂດລາ
                    </Form.Label>
                    <p style={{ fontWeight: 400 }}>
                      {moneyCurrency(expendData?.priceUSD)}
                    </p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={3}>
                  <Form.Group>
                    <Form.Label style={{ color: "gray" }}>
                      ຈຳນວນເງິນຢວນ
                    </Form.Label>
                    <p style={{ fontWeight: 400 }}>
                      {moneyCurrency(expendData?.priceCNY)}
                    </p>
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group>
                <Form.Label style={{ color: "gray" }}>ໝາຍເຫດ</Form.Label>
                <p style={{ fontWeight: 400 }}>{expendData?.note}</p>
              </Form.Group>

              <Row>
                <Col xs={12} sm={6} md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: "gray" }}>ວັນທີສ້າງ</Form.Label>
                    <p style={{ fontWeight: 400 }}>{formatDate(expendData?.createdAt)}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: "gray" }}>ຜູ້ສ້າງ</Form.Label>
                    <p style={{ fontWeight: 400 }}>{expendData?.createdByName}</p>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col xs={12} sm={6} md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: "gray" }}>ວັນທີແກ້ໄຂ</Form.Label>
                    <p style={{ fontWeight: 400 }}>{formatDate(expendData?.updatedAt)}</p>
                  </Form.Group>
                </Col>
                <Col xs={12} sm={6} md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: "gray" }}>ຜູ້ແກ້ໄຂ</Form.Label>
                    <p style={{ fontWeight: 400 }}>{expendData?.updatedByName}</p>
                  </Form.Group>
                </Col>
              </Row>



              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 10,
                  marginTop: "2rem",
                }}
              >
                {/* <ButtonComponent
                  title={"ກັບຄືນ"}
                  width="150px"
                  icon={faArrowLeft}
                  colorbg={"lightgray"}
                  handleClick={() => navigate(`/expends`)}
                  hoverbg={"gray"}
                /> */}
                <ButtonComponent
                  type="button"
                  title={"ແກ້ໄຂ"}
                  width="150px"
                  icon={faEdit}
                  handleClick={() =>
                    navigate(`/edit-expend/${expendData?._id}`)
                  }
                  colorbg={"orange"}
                  hoverbg={"darkorange"}
                />
                <ButtonComponent
                  title={"ລຶບ"}
                  width="150px"
                  icon={faTrash}
                  colorbg={"#ff8585"}
                  handleClick={() => setShowConfirmDelete(true)}
                  hoverbg={"#ff2929"}
                />
              </div>
            </Col>
          </Row>
        )
      )}
      {/* </Container> */}

      <PopUpConfirmDeletion
        open={shoConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onSubmit={_confirmeDelete}
      />
    </div>
  );
}
