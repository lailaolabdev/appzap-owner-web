import React, { useEffect, useState, useRef } from "react";
import OrderCheckOut from "../table/components/OrderCheckOut";

import { Col, Container, Nav, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import Table from "react-bootstrap/Table";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import { END_POINT, COLOR_APP } from "../../constants";
import AnimationLoading from "../../constants/loading";
import axios from "axios";
import BillForCheckOut from "../../components/bill/BillForCheckOut80";
import { STORE } from "../../constants/api";

import ReactToPrint from "react-to-print";
import { ComponentToPrint } from "./components/ToPrint";
import { useStore } from "../../store";
import { useLocation, useParams } from "react-router-dom";

// const date = new moment().format("LL");
export default function HistoriesCheckBill() {
  const location = useLocation();
  const params = useParams();
  const componentRef = useRef();
  const componentRefA = useRef();
  const { selectedTable, resetTableOrder } = useStore();
  const newDate = new Date();
  const [menuItemDetailModal, setMenuItemDetailModal] = useState(false);
  const [startDate, setSelectedDateStart] = useState("2021-04-01");
  const [endDate, setSelectedDateEnd] = useState(
    moment(moment(newDate)).format("YYYY-MM-DD")
  );
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [findeByCode, setfindeByCode] = useState();
  const [dataStore, setStore] = useState();

  useEffect(() => {
    _searchDate();
  }, [startDate && endDate]);
  useEffect(() => {
    _searchDate();
  }, [findeByCode]);
  useEffect(() => {
    _searchDate();
    getData();
  }, []);

  const getData = async () => {
    await fetch(STORE + `/?id=${params?.id}`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => setStore(json));
  };
  const _searchDate = async () => {
    setIsLoading(true);
    const url = END_POINT + `/orders/${location?.search}`;
    const _data = await fetch(url)
      .then((response) => response.json())
      .then((response) => {
        setData(response);
      });
    setIsLoading(false);
  };
  const [newData, setgetNewData] = useState();
  const [StatusMoney, setStatusMoney] = useState("");
  const [amountArray, setAmountArray] = useState();
  const [amount, setamount] = useState();

  useEffect(() => {
    let getId = [];
    for (let i = 0; i < data.length; i++) {
      for (let k = 0; k < data[i]?.order_item.length; k++) {
        getId.push(data[i]?.order_item[k]?._id);
      }
    }
    setAmountArray(getId);
    if (data[0]?.checkout === false && data[0]?.status === "CALLTOCHECKOUT") {
      setStatusMoney("ຍັງບໍ່ຊຳລະ");
    } else if (data[0]?.checkout === true && data[0]?.status === "CHECKOUT") {
      setStatusMoney("ຊຳລະສຳເລັດ");
    }
  }, [data]);
  useEffect(() => {
    const GetAmount = async () => {
      let amountAll = 0;
      const resData = await axios({
        method: "GET",
        url: END_POINT + `/orderItemArray/?id=${amountArray}`,
      });
      setgetNewData(resData?.data);
      for (let i = 0; i < resData?.data?.length; i++) {
        amountAll +=
          (await resData?.data[i]?.price) * resData?.data[i]?.quantity;
      }
      setamount(amountAll);
    };

    GetAmount();
  }, [amountArray]);
  // const _checkOut = async () => {
  //   document.getElementById('btnPrint').click();
  // }
  const _onClickMenuDetail = async () => {
    await setMenuItemDetailModal(true);
  };
  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ display: "none" }}>
        <ReactToPrint
          trigger={() => <button id="btnPrint">Print this out!</button>}
          content={() => componentRef.current}
        />
        <div>
          <ComponentToPrint
            ref={componentRef}
            userData={null}
            selectedMenu={newData}
            tableId={"03"}
            code={10000}
            StatusMoney={StatusMoney}
            amount={amount}
            billId={newData ? newData[0]?.code : "-"}
          />
          {/* <ComponentToPrint ref={componentRef} userData={userData} selectedMenu={newData} tableId={tableId} code={code} /> */}
        </div>
      </div>
      <div style={{ height: 10 }}></div>
      <Container fluid>
        <div className="row col-12">
          <Nav.Item className="row col-12">
            <h5 style={{ marginLeft: 30 }}>
              <strong>
                ປະຫວັດຂອງບີນ ( {newData ? newData[0]?.code : "-"} )
              </strong>
            </h5>
            <div className="col-sm-7"></div>
            <ReactToPrint
              trigger={() => (
                <Button
                  variant="light"
                  className="hover-me"
                  style={{
                    marginRight: 15,
                    backgroundColor: "#FB6E3B",
                    color: "#ffffff",
                    fontWeight: "bold",
                    height: 45,
                  }}
                >
                  <FontAwesomeIcon
                    icon={faFileInvoice}
                    style={{ color: "#fff" }}
                  />{" "}
                  CheckBill
                </Button>
              )}
              content={() => componentRefA.current}
            />
            <div style={{ display: "none" }}>
              <BillForCheckOut
                ref={componentRefA}
                newData={newData}
                dataStore={dataStore}
              />
            </div>
            <Button
              className="col-sm-1"
              style={{
                backgroundColor: COLOR_APP,
                color: "#ffff",
                border: 0,
                marginLeft: 10,
              }}
              onClick={() => _onClickMenuDetail()}
            >
              Checkout
            </Button>{" "}
          </Nav.Item>
        </div>
        <div style={{ height: 20 }}></div>
        {isLoading ? (
          <AnimationLoading />
        ) : (
          <div>
            <Col xs={12}>
              <Table hover responsive className="table" id="printMe">
                <thead style={{ backgroundColor: "#F1F1F1" }}>
                  <tr>
                    <th>ລຳດັບ</th>
                    <th>ຊື່ເມນູ</th>
                    <th>ຈຳນວນ</th>
                    <th>ລາຄາ</th>
                    <th>ລະຫັດ</th>
                    <th>ລະຫັດທີ່ສັ່ງ</th>
                    <th>ຍອດຂາຍ/ມື້</th>
                    <th>ວັນທີ</th>
                  </tr>
                </thead>
                <tbody>
                  {newData?.map((item, index) => {
                    return (
                      <tr index={item}>
                        <td>{index + 1}</td>
                        <td>
                          <b>{item?.name}</b>
                        </td>
                        <td>{item?.quantity}</td>
                        <td>
                          {new Intl.NumberFormat("ja-JP", {
                            currency: "JPY",
                          }).format(item?.price)}
                        </td>
                        <td>{item?.orderId?.table_id}</td>
                        <td>{item?.orderId?.code}</td>
                        <td style={{ color: "green" }}>
                          <b>
                            {new Intl.NumberFormat("ja-JP", {
                              currency: "JPY",
                            }).format(item?.price * item?.quantity)}{" "}
                            ກີບ
                          </b>
                        </td>
                        <td>
                          {moment(item?.createdAt).format(
                            "DD/MM/YYY ~ HH:mm a"
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td
                      colSpan={5}
                      style={{
                        color: "red",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      ຍອດລ້ວມເງິນ :{" "}
                    </td>
                    <td
                      colSpan={2}
                      style={{
                        color: StatusMoney === "ຍັງບໍ່ຊຳລະ" ? "red" : "green",
                      }}
                    >
                      {StatusMoney}
                    </td>
                    <td colSpan={4} style={{ color: "blue" }}>
                      {new Intl.NumberFormat("ja-JP", {
                        currency: "JPY",
                      }).format(amount)}{" "}
                      .ກິບ
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </div>
        )}
      </Container>
      <OrderCheckOut
        data={newData}
        tableData={selectedTable}
        show={menuItemDetailModal}
        resetTableOrder={resetTableOrder}
        hide={() => setMenuItemDetailModal(false)}
      />
    </div>
  );
}
