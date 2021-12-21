import React, { useEffect, useState } from 'react'
import useReactRouter from "use-react-router";

import {
  Form,
  Row,
  Col,
  Button,
  Container,
  FormControl,
  InputGroup,
  Nav
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import Table from "react-bootstrap/Table";
import moment from 'moment';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { END_POINT } from '../../constants'
import AnimationLoading from "../../constants/loading"

const date = new moment().format("LL");
export default function HistoryDetail() {
  const { history, location, match } = useReactRouter();
  const newDate = new Date();
  const [startDate, setSelectedDateStart] = useState('2021-04-01')
  const [endDate, setSelectedDateEnd] = useState(moment(moment(newDate)).format("YYYY-MM-DD"))
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [findeByCode, setfindeByCode] = useState()
  useEffect(() => {
    _searchDate()
  }, [startDate && endDate])
  useEffect(() => {
    _searchDate()
  }, [findeByCode])
  useEffect(() => {
    _searchDate()
  }, [])
  const _searchDate = async () => {
    setIsLoading(true)
    const url = END_POINT + `/orders?status=CHECKOUT&checkout=true${match?.params?.id ? `&code=${match?.params?.id}` : ``}`;
    const _data = await fetch(url)
      .then(response => response.json())
      .then(response => {
        setData(response)
      })
    setIsLoading(false)
  }
  const _setSelectedDateStart = (item) => {
    setSelectedDateStart(item.target.value)
  }
  const _setSelectedDateEnd = (item) => {
    setSelectedDateEnd(item.target.value)
  }
  const _setSelectedCode = (item) => {
    setfindeByCode(item.target.value)
  }
  const [orderItemData, setOrderItemData] = useState()
  const [amount, setamount] = useState()
  const [amountArray, setAmountArray] = useState()
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

  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ height: 20 }}></div>
      <Container fluid>
        <div className="row ">
          <div className="col-sm-9">
            <Nav.Item>
              <h5 style={{ marginLeft: 30 }}><strong>ລາຍລະອຽດໂຕະ : {orderItemData && orderItemData[0]?.orderId?.table_id}</strong></h5>
            </Nav.Item>
          </div>
          <div className="col-sm-3">
            <Nav.Item>
              <h5 style={{ marginLeft: 30 }}><strong>ເລກໃບບີນ: {orderItemData ? orderItemData[0]?.code : ""}</strong></h5>
            </Nav.Item>
          </div>
        </div>
        {isLoading ? <AnimationLoading /> : <div>
          <Col xs={12}>
            <Table responsive className="table">
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
    </div>
  )
}
