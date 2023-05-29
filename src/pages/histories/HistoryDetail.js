import React, { useEffect, useRef, useState } from 'react'
import {
  Col,
  Container,
  Nav,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileInvoice } from "@fortawesome/free-solid-svg-icons";
import Table from "react-bootstrap/Table";
// import moment from 'moment';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { END_POINT } from '../../constants'
import FeedbackOrder from "../table/components/FeedbackOrder";
import AnimationLoading from "../../constants/loading"
import { useStore } from "../../store";
import  BillForCheckOut  from '../../components/bill/BillForCheckOut80';
import ReactToPrint from 'react-to-print';

import { getHeaders } from '../../services/auth';
import { useParams } from 'react-router-dom';
import { t } from 'i18next';


export default function HistoryDetail() {
  const params = useParams();
  const componentRef = useRef();

  const {
    selectedTable,
    setSelectedTable,
  } = useStore();

  const [feedbackOrderModal, setFeedbackOrderModal] = useState(false)
  const closeModalCallBack = () => setFeedbackOrderModal(false)

  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    _searchDate()
    setSelectedTable()
  }, [])

  const _searchDate = async () => {
    setIsLoading(true)
    let header = await getHeaders();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': header.authorization
    }
    let _resData = await axios.get(END_POINT + `/v3/bill-group/` + params?.id, {
      headers: headers
    })
    setData(_resData?.data)
    setIsLoading(false)
  }

  const [amount, setamount] = useState()
  useEffect(() => {
    let Allamount = 0
    if (data?.orderId?.length > 0) {
        for (let k = 0; k < data?.orderId?.length; k++) {
            Allamount += (data?.orderId[k]?.price * data?.orderId[k]?.quantity)
        }
        if (data?.discountType === "LAK") {
          Allamount = Allamount - data?.discount
        } else {
          Allamount = Allamount - (Allamount * data?.discount / 100)
        }
    }
    setamount(Allamount)
  }, [data])

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ height: 20 }}></div>
      <Container fluid>
        <div className="row ">
          <div className="col-sm-12" style={{ display: "flex", justifyContent: "space-between", alignItems: "end" }}>
            <Nav.Item>
              <h5 style={{ marginLeft: 30 }}><strong>ລາຍລະອຽດໂຕະ : {data?.tableId?.name}</strong></h5>
              <h5 style={{ marginLeft: 30 }}><strong>ເລກໃບບີນ: {data?.code}</strong></h5>
              <h5 style={{ marginLeft: 30 }}><strong>ຜູ້ຮັບຜິດຊອບ : {data?.orderId?.length > 0 ? data?.orderId[0]?.updatedBy?.firstname : ""} {data?.orderId?.length > 0 ? data?.orderId[0]?.updatedBy?.lastname:""}</strong></h5>
            </Nav.Item>
            <Nav.Item>
              {/* <Button onClick={() => setFeedbackOrderModal(true)} variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 45 }}><FontAwesomeIcon icon={faCog} style={{ color: "#fff" }} /> ຈັດການບີນ</Button> */}
              <ReactToPrint
                trigger={() => <Button variant="light" className="hover-me" style={{ marginRight: 15, backgroundColor: "#FB6E3B", color: "#ffffff", fontWeight: "bold", height: 45 }}><FontAwesomeIcon icon={faFileInvoice} style={{ color: "#fff" }} /> CheckBill</Button>}
                content={() => componentRef.current}
              />
              <div style={{ display: 'none' }}>
                <BillForCheckOut ref={componentRef} newData={data} dataStore={data?.storeId} />
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
                  <th>ຊື່ເມນູອາຫານ</th>
                  <th>ຈຳນວນ</th>
                  <th>ລາຄາ/ອັນ</th>
                  <th>ລາຄາລວມ</th>
                  <th>ວັນທີ</th>
                </tr>
              </thead>
              <tbody>
                {data?.orderId?.map((item, index) => {
                  return (
                    <tr index={item}>
                      <td>{index + 1}</td>
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
                  <td colSpan={5} style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>ສ່ວນຫຼຸດ : </td>
                  <td colSpan={3} style={{ color: "green" }}>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(data?.discount)} {data?.discountType === "LAK" ? "ກີບ" : "%"}</td>
                </tr>
                <tr>
                  <td colSpan={5} style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>{t('totalPrice2')} : </td>
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
        data={data?.orderId}
        tableData={selectedTable}
        searchDate={_searchDate}
        show={feedbackOrderModal}
        hide={closeModalCallBack}
      />

    </div>
  )
}