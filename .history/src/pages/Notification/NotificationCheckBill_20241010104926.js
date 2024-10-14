import React, { useEffect, useState } from "react";
import {
  Form,
  Row,
  Col,
  Button,
  Container,
  Image,
  InputGroup,
  Nav,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import Table from "react-bootstrap/Table";
import moment from "moment";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { END_POINT } from "../../constants";
import { _statusCheckBill } from "../../helpers/index";
import Sidenav from "../../layouts/SideNav";
import empty from "../../image/empty.png";
import { useNavigate, useParams } from "react-router-dom";
import { END_POINT_SEVER_BILL_ORDER } from "../../constants/api";

export default function NotificationCheckBill() {
  const navigate = useNavigate();
  const params = useParams();
  const [orderCallCheckOut, setorderCallCheckOut] = useState();
  const newDate = new Date();

  useEffect(() => {
    getData();
  }, []);
  const getData = async (tokken) => {
    await fetch(
      `${END_POINT_SEVER_BILL_ORDER}/orders/?storeId=${params?.id}&&status=CALLTOCHECKOUT`,
      {
        method: "GET",
        headers: tokken,
      }
    )
      .then((response) => response.json())
      .then((json) => setorderCallCheckOut(json));
  };
  const _checkbillTable = (item) => {
    navigate(`/checkBill/${params?.id}/historiesCheckBill/?code=${item}`);
  };
  return (
    <div style={{ minHeight: 400 }}>
      {orderCallCheckOut?.length > 0 ? (
        <Container fluid>
          <div className="row mt-5">
            <h5 style={{ marginLeft: 30 }}>
              <strong>ແຈ້ງເຕືອນOK checkBill</strong>
            </h5>
            <Nav.Item
              className="ml-auto row mr-5"
              style={{ paddingBottom: "3px" }}
            >
              <InputGroup></InputGroup>
            </Nav.Item>
          </div>
          <div style={{ height: 20 }}></div>
          <Col xs={12}>
            <Table hover responsive className="table">
              <thead style={{ backgroundColor: "#F1F1F1" }}>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ລະຫັດໂຕະ</th>
                  <th>ລະຫັດ</th>
                  <th>ສະຖານະ</th>
                  <th>ວັນເວລາ</th>
                </tr>
              </thead>
              <tbody>
                {orderCallCheckOut?.map((item, index) => {
                  return (
                    <tr
                      index={item}
                      onClick={() => _checkbillTable(item?.code)}
                    >
                      <td>{index + 1}</td>
                      <td>{item?.code}</td>
                      <td>{item?.table_id}</td>
                      <td
                        style={{
                          color:
                            item?.status === "CALLTOCHECKOUT"
                              ? "red"
                              : item?.status === "ACTIVE"
                              ? "blue"
                              : item?.status === "CHECKOUT"
                              ? "green"
                              : "",
                        }}
                      >
                        {_statusCheckBill(item?.status)}
                      </td>
                      <td>
                        {moment(item?.createdAt).format("DD-MM-YYYY HH:mm a")}{" "}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Container>
      ) : (
        <Image src={empty} alt="" width="100%" />
      )}
    </div>
  );
}
