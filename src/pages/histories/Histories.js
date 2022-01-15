import React, { useEffect, useState } from 'react'
import useReactRouter from "use-react-router"
import {
  Col,
  Container,
  InputGroup,
  Nav
} from "react-bootstrap";
import Table from "react-bootstrap/Table";
import moment from 'moment';
import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import { END_POINT } from '../../constants'
import AnimationLoading from "../../constants/loading"
import { getHeaders } from '../../services/auth';
export default function History() {
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
    let header = await getHeaders();
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': header.authorization
    }
    let _resData = await axios.get(END_POINT + `/v3/bills/?storeId=${match?.params?.id}&status=CHECKOUT&isCheckout=true&startDate=${startDate}&endDate=${endDate}`, {
      headers: headers
    })
    setData(_resData?.data)
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
  const [amount, setamount] = useState()
  
  useEffect(() => {
    let Allamount = 0
    if (data?.length > 0 || startDate || endDate) {
      for (let i = 0; i < data?.length; i++) {
        for (let k = 0; k < data[i]?.orderId?.length; k++) {
          if (data[i]?.orderId[k]?.status === "SERVED") {
            Allamount += (data[i]?.orderId[k]?.price * data[i]?.orderId[k]?.quantity)
          }
        }
        if (data[i]?.discountType === "LAK") {
          Allamount = Allamount - data[i]?.discount
        } else {
          Allamount = Allamount - (Allamount * data[i]?.discount / 100)
        }
      }
      setamount(Allamount)
    }
  }, [data, startDate, endDate])

  let _allmonny = (item) => {
    let total = 0
    for (let i = 0; i < item?.length; i++) {
      if (item[i]?.status === "SERVED") {
        total += item[i]?.price * item[i]?.quantity
      }
    }
    return total
  }
  let _allmonnyAndDiscount = (item, discount, discountType) => {
    let total = 0
    for (let i = 0; i < item?.length; i++) {
      if (item[i]?.status === "SERVED") {
        total += item[i]?.price * item[i]?.quantity
      }
    }
    if (discountType === "LAK") {
      total = total - discount
    } else {
      total = total - (total * discount / 100)
    }
    return total
  }
  const _historyDetail = (code) => history.push(`/histories/HistoryDetail/${code}/` + match?.params?.id)

  return (
    <div style={{ minHeight: 400 }}>
      <Container fluid>
        <div className="row mt-5">
          <Nav.Item>
            <h5 style={{ marginLeft: 30 }}><strong>ປະຫວັດການຂາຍ</strong></h5>
          </Nav.Item>
          <Nav.Item className="ml-auto row mr-5" style={{ paddingBottom: "3px" }}>
            <InputGroup>
              <div className="col">
                <label>ແຕ່ວັນທີ</label>
                <input type="date" className="form-control" value={startDate} onChange={(e) => _setSelectedDateStart(e)}></input>
              </div>
              <div className="col">
                <label>ຫາວັນທີ</label>
                <input type="date" className="form-control" value={endDate} onChange={(e) => _setSelectedDateEnd(e)}></input>
              </div>
            </InputGroup>
          </Nav.Item>
        </div>
        <div style={{ height: 20 }}></div>
        {isLoading ? <AnimationLoading /> : <div>
          <Col xs={12}>
            <Table hover responsive className="table">
              <thead style={{ backgroundColor: "#F1F1F1" }}>
                <tr>
                  <th>ລຳດັບ</th>
                  <th>ລະຫັດເຂົ້າລະບົບ</th>
                  <th>ໂຕະ</th>
                  <th>ລາຄາ/ບີນ</th>
                  <th>ສ່ວນຫຼຸດ</th>
                  <th>ເປັນເງີນ</th>
                  <th>ວັນທີ</th>
                </tr>
              </thead>
              <tbody>
                {data?.length > 0 && data?.map((item, index) => {
                  return (
                    <tr index={item} onClick={() => _historyDetail(item?.code)} style={{ cursor: 'pointer' }}>
                      <td>{index + 1}</td>
                      <td>{item?.code}</td>
                      <td>{item?.tableId?.name}</td>
                      <td><b>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(_allmonny(item?.orderId))} ກີບ</b></td>
                      <td>{item?.discount} {item?.discountType === "LAK" ? "ກີບ" : "%"}</td>
                      <td style={{ color: "green" }}><b>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(_allmonnyAndDiscount(item?.orderId, item?.discount, item?.discountType))} ກີບ</b></td>
                      <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                    </tr>
                  )
                }
                )}
                <tr>
                  <td colSpan={5} style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>ຍອດລວມເງິນ : </td>
                  <td colSpan={2} style={{ color: "blue" }}>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(amount)} .ກີບ</td>
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
