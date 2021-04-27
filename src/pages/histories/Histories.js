import React, { useEffect, useState } from 'react'
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
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { END_POINT } from '../../constants'
import AnimationLoading from "../../constants/loading"

const date = new moment().format("LL");
export default function History() {
  const newDate = new Date();
  const [startDate, setSelectedDateStart] = useState('2021-04-01')
  const [endDate, setSelectedDateEnd] = useState(moment(moment(newDate)).format("YYYY-MM-DD"))
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    _searchDate()
  }, [])
  useEffect(() => {
    _searchDate()
  }, [startDate && endDate])
  const _searchDate = async () => {
    setIsLoading(true)
    const url = END_POINT + `/orderItems?status=SERVED&&startDate=${startDate}&&endDate=${moment(moment(endDate).add(1, "days")).format("YYYY-MM-DD")}`;
    const _data = await fetch(url)
      .then(response => response.json())
      .then(response => {
        console.log("response: ", response)
        setData(response)
      })
    console.log("\n\n _data: ", _data)
    setIsLoading(false)
  }
  const _setSelectedDateStart = (item) => {
    setSelectedDateStart(item.target.value)
  }
  const _setSelectedDateEnd = (item) => {
    setSelectedDateEnd(item.target.value)
  }
  let amount = 0
  for (let i = 0; i < data?.length; i++) {
    amount += data[i]?.menu?.price
  }
  return (
    <div style={{ minHeight: 400 }}>
      <Container fluid>
        <div className="row mt-5">
          <Nav.Item>
            <h5><strong>ຍອດຂາຍ</strong></h5>
          </Nav.Item>
          <Nav.Item className="ml-auto row mr-5" style={{ paddingBottom: "3px" }}>
            <InputGroup>
              <div className="col-5">
                <label>ແຕ່ວັນທີ</label>
                <input type="date" class="form-control" value={startDate} onChange={(e) => _setSelectedDateStart(e)}></input>
              </div>
              <div className="col-5">
                <label>ຫາວັນທີ</label>
                <input type="date" class="form-control" value={endDate} onChange={(e) => _setSelectedDateEnd(e)}></input>
              </div>
            </InputGroup>
          </Nav.Item>
        </div>
        <div style={{ height: 20 }}></div>
        {isLoading ? <AnimationLoading /> : <div>
          <Col xs={12}>
            <Table responsive class="table">
              <thead style={{ backgroundColor: "#F1F1F1" }}>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ຊື່ເມນູ</th>
                  <th>ຈຳນວນ</th>
                  <th>ເລກໂຕະ</th>
                  <th>ລະຫັດທີ່ສັງ</th>
                  <th>ຍອດຂາຍ/ມື້</th>
                  <th>ວັນທີ</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((item, index) => {
                  return (
                    <tr index={item}>
                      <td>{index + 1}</td>
                      <td><b>{item?.menu?.name}</b></td>
                      <td>{item?.quantity}</td>
                      <td>{item?.orderId?.table_id}</td>
                      <td>{item?.orderId?.code}</td>
                      <td style={{ color: "green" }}><b>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.menu?.price * item?.quantity)} ກີບ</b></td>
                      <td>{new Date(item?.createdAt).toLocaleDateString()}</td>
                    </tr>
                  )
                }
                )}
                <tr>
                  <td colSpan={4} style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>ຍອດລ້ວມເງິນ : </td>
                  <td colSpan={3} style={{ color: "blue" }}>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(amount)} .ກິບ</td>
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
