import React, { useEffect, useRef, useState } from 'react'
import useReactRouter from "use-react-router";
import {
  Col,
  Container,
  Nav,
  Modal,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import Table from "react-bootstrap/Table";
import moment from 'moment';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { END_POINT } from '../../constants'
import FeedbackOrder from "../table/components/FeedbackOrder";
import AnimationLoading from "../../constants/loading"
import { useStore } from "../../store";
import { BillForCheckOut } from '../bill/BillForCheckOut';
import ReactToPrint from 'react-to-print';
import { warningAlert, successAdd } from "../../helpers/sweetalert";
import { updateOrderItem } from "../../services/order";


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
  }, [])
  const _searchDate = async () => {
    setIsLoading(true)
    const url = END_POINT + `/orders?status=CHECKOUT&checkout=true${match?.params?.id ? `&code=${match?.params?.id}` : ``}`;
    await fetch(url)
      .then(response => response.json())
      .then(response => {
        setData(response)
      })
    setIsLoading(false)
  }

  const [orderItemData, setOrderItemData] = useState()
  const [amount, setamount] = useState()
  useEffect(() => {
    let order_item = []
    let Allamount = 0
    for (let i = 0; i < data.length; i++) {
      for (let k = 0; k < data[i]?.order_item.length; k++) {
        if (data[i]?.order_item[k]?.status === "SERVED") {
          order_item.push(data[i]?.order_item[k])
          Allamount += data[i]?.order_item[k]?.price * data[i]?.order_item[k]?.quantity
        }
      }
    }
    setamount(Allamount)
    setOrderItemData(order_item)
  }, [data])

  const getData = async () => {
    await fetch(END_POINT + `/store/?id=${orderItemData[0]?.storeId}`, {
      method: "GET",
    }).then(response => response.json())
      .then(json => setStore(json));
  }
  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ height: 20 }}></div>
      <Container fluid>
        <div className="row ">
          <div className="col-sm-12" style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
            <Nav.Item>
              <h5 style={{ marginLeft: 30 }}><strong>ລາຍລະອຽດໂຕະ : {orderItemData && orderItemData[0]?.orderId?.table_id}</strong></h5>
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
                <BillForCheckOut ref={componentRef} newData={orderItemData} dataStore={dataStore} />
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