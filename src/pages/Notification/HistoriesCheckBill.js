import React, { useEffect, useState } from 'react'
import useReactRouter from "use-react-router";
import MenusItemDetail from '../table/components/MenusItemDetail'
import {
  Col,
  Container,
  Nav,
  Button
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import Table from "react-bootstrap/Table";
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { END_POINT, COLOR_APP } from '../../constants'
import AnimationLoading from "../../constants/loading"

const date = new moment().format("LL");
export default function HistoriesCheckBill() {
  const { history, location, match } = useReactRouter()
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
    const url = END_POINT + `/orders/${location?.search}&&status=CALLTOCHECKOUT&checkout=false`;
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
  let amount = 0
  let newData = []
  for (let i = 0; i < data.length; i++) {
    for (let k = 0; k < data[i]?.order_item.length; k++) {
      newData.push(data[i]?.order_item[k])
      amount += data[i]?.order_item[k]?.quantity * data[i]?.order_item[k]?.menu?.price
    }
  }
  return (
    <div style={{ minHeight: 400 }}>
      <div style={{ height: 10 }}></div>
      <Container fluid>
        <div className="row col-12">
          <Nav.Item className="row col-12">
            <h5 style={{ marginLeft: 30 }}><strong>ປະຫັວດຂອງບີນ ( {newData[0]?.code} )</strong></h5>
            <div className="col-sm-7"></div>
            <Button className="col-sm-1" style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0, }} >Print Bill</Button>{' '}
            <Button className="col-sm-1" style={{ backgroundColor: COLOR_APP, color: "#ffff", border: 0, marginLeft: 10 }}>Check out</Button>{' '}
          </Nav.Item>
        </div>
        <div style={{ height: 20 }}></div>
        {isLoading ? <AnimationLoading /> : <div>
          <Col xs={12}>
            <Table responsive class="table">
              <thead style={{ backgroundColor: "#F1F1F1" }}>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ຊື່ຜູ້ສັ່ງ</th>
                  <th>ຊື່ເມນູ</th>
                  <th>ຈຳນວນ</th>
                  <th>ລາຄາ</th>
                  <th>ເລກໂຕະ</th>
                  <th>ລະຫັດທີ່ສັງ</th>
                  <th>ຍອດຂາຍ/ມື້</th>
                  <th>ວັນທີ</th>
                </tr>
              </thead>
              <tbody>
                {newData?.map((item, index) => {
                  return (
                    <tr index={item}>
                      <td>{index + 1}</td>
                      <td><b>{item?.orderId?.customer_nickname}</b></td>
                      <td><b>{item?.menu?.name}</b></td>
                      <td>{item?.quantity}</td>
                      <td>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.menu?.price)}</td>
                      <td>{item?.orderId?.table_id}</td>
                      <td>{item?.orderId?.code}</td>
                      <td style={{ color: "green" }}><b>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.menu?.price * item?.quantity)} ກີບ</b></td>
                      <td>{new Date(item?.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )
                }
                )}
                <tr>
                  <td colSpan={5} style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>ຍອດລ້ວມເງິນ : </td>
                  <td colSpan={2}></td>
                  <td colSpan={4} style={{ color: "blue" }}>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(amount)} .ກິບ</td>
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
