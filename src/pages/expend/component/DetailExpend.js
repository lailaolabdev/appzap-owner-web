import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import axios from "axios";

/**
 * component
 */
import { TitleComponent, ButtonComponent } from "../../../components";
import PopUpConfirmDeletion from "../../../components/popup/PopUpConfirmDeletion";

import {
  successAdd,
  errorAdd,
} from "../../../helpers/sweetalert";
/**
 * function
 */

import { getHeadersAccount } from "../../../services/auth";
import { moneyCurrency, convertPayment, formatDate,formatDateTime } from "../../../helpers";

/**
 * api
 */
import { END_POINT_SERVER_BUNSI } from "../../../constants/api";
/**
 * css
 */
import { Row, Col, Form, Spinner } from "react-bootstrap";

import {
  faArrowLeft,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

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
      let header = await getHeadersAccount();
      const headers = {
        "Content-Type": "application/json",
        Authorization: header.authorization,
      };
      await axios({
        method: "delete",
        url: `${END_POINT_SERVER_BUNSI}/api/v1/expend/${id}`,
        headers: headers,
      }).then(async () => {
        await successAdd("ລຶບສຳເລັດ");
        await navigate("/expends/limit/40/skip/1");
        await setIsLoading(false);
      });
    } catch (err) {
      errorAdd("ລຶບບໍ່ສຳເລັດ");
      console.log("err:::", err);
    }
  };

  function limitText(text, limit) {
    if (!text) {
      return ""; // Return an empty string if the text is undefined or null
    }
    if (text.length <= limit) {
      return text; // Return the original text if it's within the limit
    } else {
      // If the text is longer than the limit, truncate it and append '...'
      return text.slice(0, limit) + "...";
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <TitleComponent fontSize={"20px"} title="ລາຍລະອຽດ" />

      {isLoading ? (
        <div>
          <center>
            <Spinner animation="border" variant="warning" />
          </center>
        </div>
      ) : (
        expendData && (
          <Row>
          
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
                    <p style={{ fontWeight: 400 }}>{formatDateTime(expendData?.createdAt)}</p>
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
                    <p style={{ fontWeight: 400 }}>{formatDateTime(expendData?.updatedAt)}</p>
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
                 <ButtonComponent
                  title={"ກັບຄືນ"}
                  width="150px"
                  icon={faArrowLeft}
                  colorbg={"lightgray"}
                  handleClick={() => navigate(`/expends/limit/40/skip/1`)}
                  hoverbg={"gray"}
                /> 
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

            <Col xs={12} md={6}>
              <Form.Group>
                <Row>
                  {expendData?.expendImages.length > 0 ? (
                    expendData?.expendImages.map((item, index) => (
                      <Col xs="12" sm="3" md="6" key={index}>
                          <a href={
                              "https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/" +
                              item
                            }
                            target="_blank"
                            >
                        <div className="show-img-upload mb-2">
                        
                          <img
                            src={
                              "https://appzapimglailaolab.s3-ap-southeast-1.amazonaws.com/" +
                              item
                            }
                            alt={item}
                          />
                         
                        </div>
                        </a>
                      </Col>
                    ))
                  ) : ''}
                </Row>
              </Form.Group>
            </Col>


          </Row>
        )
      )}
      {/* </Container> */}

      <PopUpConfirmDeletion
        open={shoConfirmDelete}
        text={limitText(expendData?.detail, 50)}
        onClose={() => setShowConfirmDelete(false)}
        onSubmit={_confirmeDelete}
      />
    </div>
  );
}
