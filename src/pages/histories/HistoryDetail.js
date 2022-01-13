import React, { useEffect, useRef, useState } from 'react'
import useReactRouter from "use-react-router";
import {
  Col,
  Container,
  Nav,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import Table from "react-bootstrap/Table";
// import moment from 'moment';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { END_POINT } from '../../constants'
import FeedbackOrder from "../table/components/FeedbackOrder";
import AnimationLoading from "../../constants/loading"
import { useStore } from "../../store";
import { BillForCheckOut } from '../bill/BillForCheckOut';
import ReactToPrint from 'react-to-print';
// import { warningAlert, successAdd } from "../../helpers/sweetalert";
// import { updateOrderItem } from "../../services/order";
import { getHeaders } from '../../services/auth';


export default function HistoryDetail() {
  const { match } = useReactRouter();
  const componentRef = useRef();

  const {
    selectedTable,
    setSelectedTable,
  } = useStore();

  const [feedbackOrderModal, setFeedbackOrderModal] = useState(false)
  const closeModalCallBack = () => setFeedbackOrderModal(false)

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [dataStore, setStore] = useState()

  useEffect(() => {
    _searchDate()
    setSelectedTable()
    getData()
  }, [])

  const _searchDate = async () => {
    setIsLoading(true)
    let header = await getHeaders();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': header.authorization
    }
    let _resData = await axios.get(END_POINT + `/v3/bills?code=` + match?.params?.id, {
      headers: headers
    })
    setData(_resData?.data)
    setIsLoading(false)
  }

  const [orderItemData, setOrderItemData] = useState()
  const [amount, setamount] = useState()
  useEffect(() => {
    let order_item = []
    let Allamount = 0
    if (data?.length > 0) {
      for (let i = 0; i < data[0]?.orderId?.length; i++) {
        if (data[0]?.orderId[i]?.status === "SERVED") {
            order_item.push(data[0]?.orderId[i])
            Allamount += data[0]?.orderId[i]?.price * data[0]?.orderId[i]?.quantity
          }
      }
    }
    setamount(Allamount)
    setOrderItemData(order_item)
  }, [data])

  const getData = async () => {
    await fetch(END_POINT + `/v3/store?id=${match?.params?.storeId}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setStore(json));
  }
  console.log("dataStore===>", dataStore);
  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ height: 20 }}></div>
      <Container fluid>
        <div className="row ">
          <div className="col-sm-12" style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
            <Nav.Item>
              <h5 style={{ marginLeft: 30 }}><strong>ລາຍລະອຽດໂຕະ : {orderItemData && orderItemData[0]?.orderId?.tableName}</strong></h5>
              <h5 style={{ marginLeft: 30 }}><strong>ເລກໃບບີນ: {orderItemData ? orderItemData[0]?.code : ""}</strong></h5>
              <h5 style={{ marginLeft: 30 }}><strong>ຜູ້ຮັບຜິດຊອບ : {orderItemData && orderItemData[0]?.createdBy?.firstname && orderItemData[0]?.createdBy?.lastname ? orderItemData[0]?.createdBy?.firstname + " " + orderItemData[0]?.createdBy?.lastname : ""}</strong></h5>
            </Nav.Item>
            <Nav.Item>
              <Button onClick={() => setFeedbackOrderModal(true)} variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 45 }}><FontAwesomeIcon icon={faCog} style={{ color: "#fff" }} /> ຈັດການບີນ</Button>
              <ReactToPrint
                trigger={() => <Button variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 45 }}><FontAwesomeIcon icon={faFileInvoice} style={{ color: "#fff" }} /> CheckBill</Button>}
                content={() => componentRef.current}
              />
              <div style={{ display: 'none' }}>
                <BillForCheckOut ref={componentRef} newData={data[0]} dataStore={dataStore} />
              </div>
            </Nav.Item>
          </div>
        </div>
        <div style={{ height: 20 }}></div>
        {isLoading ? <AnimationLoading /> : <div>
          <Col xs={12}>
            <Table hover responsive className="table">
              <thead style={{ backgroundColor: "#F1F1F1" }}>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ລະຫັດເຂົ້າລະບົບ</th>
                  <th>ຊື່ເມນູອາຫານ</th>
                  <th>ຈຳນວນ</th>
                  <th>ລາຄາ/ອັນ</th>
                  <th>ລາຄາລວມ</th>
                  <th>ວັນທີ</th>
                </tr>
              </thead>
              <tbody>
                {orderItemData?.map((item, index) => {
                  return (
                    <tr index={item}>
                      <td>{index + 1}</td>
                      <td>{item?.code}</td>
                      <td>{item?.name}</td>
                      <td>{item?.quantity}</td>
                      <td>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.price)}</td>
                      <td style={{ color: "green" }}><b>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.price * item?.quantity)} ກີບ</b></td>
                      <td>{new Date(item?.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )
                }
                )}
                <tr>
                  <td colSpan={5} style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>ຍອດລວມເງິນ : </td>
                  <td colSpan={3} style={{ color: "green" }}>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(amount)} .ກີບ</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </div>
        }
      </Container>

      {/* ================> modal =============> */}

      <FeedbackOrder
        data={orderItemData}
        tableData={selectedTable}
        searchDate={_searchDate}
        show={feedbackOrderModal}
        hide={closeModalCallBack}
      />

    </div>
  )
}