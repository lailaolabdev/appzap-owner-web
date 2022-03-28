import React, { useState, useEffect } from 'react'
import moment from 'moment';
import axios from "axios";
import useReactRouter from "use-react-router"
import { Table, Modal, Button } from 'react-bootstrap'
import { END_POINT_SEVER } from '../../constants/api'
import { _statusCheckBill, orderStatus } from './../../helpers';

export default function DashboardFinance({ startDate, endDate }) {
  const { history, match } = useReactRouter()
  const [data, setData] = useState();
  const [disCountDataKib, setDisCountDataKib] = useState(0)
  const [disCountDataPercent, setDisCountDataPercent] = useState(0)
  const [moneyCash, setMoneyCash] = useState(0)
  const [moneyAon, setMoneyAon] = useState(0)
  const [show, setShow] = useState(false);
const [dataModale, setDataModale] = useState([])
  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    setShow(true)
    setDataModale(item)
  };
  useEffect(() => {
    _fetchFinanceData()
  }, [])
  useEffect(() => {
    _fetchFinanceData()
  }, [endDate, startDate])

  const _fetchFinanceData = async () => {
    const getDataDashBoard = await axios
      .get(END_POINT_SEVER + "/v3/dashboard/" + match?.params?.storeId + "/startTime/" + startDate + "/endTime/" + endDate, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
      })
    setData(getDataDashBoard?.data)
  }
  useEffect(() => {
    let _disCountDataKib = 0;
    let _disCountDataAon = 0;
    let _cash = 0;
    let _aon = 0;
    if (data?.checkOut?.length > 0) {
      for (let i = 0; i < data?.checkOut.length; i++) {
        if (data?.checkOut[i]?.discountType === "LAK") _disCountDataKib += data?.checkOut[i]?.discount
        if (data?.checkOut[i]?.discountType !== "LAK") _disCountDataAon += data?.checkOut[i]?.discount
        if (data?.checkOut[i]?.paymentMethod === "CASH") _cash += data?.checkOut[i]?.billAmount
        if (data?.checkOut[i]?.paymentMethod !== "CASH") _aon += data?.checkOut[i]?.billAmount
      }
    }
    setMoneyAon(_aon)
    setMoneyCash(_cash)
    setDisCountDataKib(_disCountDataKib)
    setDisCountDataPercent(_disCountDataAon)
  }, [data])

  const _countOrder = (item) => {
    let _countOrderCancel = 0
    let _countOrderSuccess = 0
    if (item?.length > 0) {
      for (let i = 0; i < item.length; i++) {
        if (item[i]?.status === "SERVED") _countOrderSuccess += item[i]?.quantity
        if (item[i]?.status === "CANCELED") _countOrderCancel += item[i]?.quantity
      }
    }
    return { _countOrderSuccess, _countOrderCancel }
  }
  return (
    <div style={{ padding: 0 }}>
      <div className="row">
        <div style={{ width: '100%', padding: 20 }}>
          <div>ຍອດລາຍຮັບເງີນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(data?.amount)} ກີບ</div>
          <div>ຍອດລວມສ່ວນຫຼຸດເປັນເງີນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(disCountDataKib)} ກີບ</div>
          <div>ຍອດລວມສ່ວນຫຼຸດເປັນເປີເຊັນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(disCountDataPercent)} %</div>
          <div>ຈ່າຍເງີນສົດ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(moneyCash)} ກີບ</div>
          <div>ຈ່າຍເງີນໂອນ : {new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(moneyAon)} ກີບ</div>
          <div style={{ height: 20 }}></div>
          <b>
            <div>ແຕ່ວັນທີ {startDate} ຫາວັນທີ {endDate}</div>
          </b>
          <div style={{ height: 10 }}></div>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>ໂຕະ</th>
                <th>ເລກໂຕະ</th>
                <th>ສວ່ນຫຼຸດ</th>
                <th>ລາຄາ / ບີນ</th>
                <th>ເສີບແລ້ວ / ຍົກເລີກ</th>
                <th>ສະຖານະຂອງໂຕະ</th>
                <th>ສະຖານະຂອງເງີນ</th>
                <th>ເວລາ</th>
              </tr>
            </thead>
            <tbody>
              {data?.checkOut?.map((item, index) =>
                <tr key={"finance-" + index} onClick={() => handleShow(item?.orderId)}>
                  <td>{index + 1}</td>
                  <td>{item?.tableId?.name ?? "-"}</td>
                  <td>{item?.code}</td>
                  <td>{item?.discountType === "LAK" ? new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.discount) + "ກີບ" : item?.discount + "%"}</td>
                  <td>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.billAmount)} ກີບ</td>
                  <td >
                    <div style={{ display:"flex", justifyContent: "center",flexDirection: "row" }}>
                      <p style={{ marginLeft: 5 }}>{_countOrder(item?.orderId)?._countOrderSuccess} </p> 
                      <p style={{ marginLeft: 5}}> / </p> 
                      <p style={{ color: _countOrder(item?.orderId)?._countOrderCancel > 0 ? "red":"",marginLeft:5}}> {_countOrder(item?.orderId)?._countOrderCancel}</p>
                    </div>
                  </td>
                  <td style={{
                    color:
                      item?.status === "CHECKOUT" ? "green" :
                        item?.status === "CALLTOCHECKOUT" ? "red" :
                          item?.status === "ACTIVE" ? "#00496e" : ""
                  }}>{_statusCheckBill(item?.status)}</td>
                  <td style={{
                    color:
                      item?.paymentMethod === "CASH" ? "#00496e" : "#fc8626"
                  }}>{item?.paymentMethod === "CASH" ? "ຈ່າຍເງີນສົດ" : "ຈ່າຍເງີນໂອນ"}</td>
                  <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
        <div style={{ width: '50%', padding: 20 }}>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>ລາຍການອາຫານ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>#</th>
                <th>ຊື່ເມນູ</th>
                <th>ຈຳນວນ</th>
                <th>ສະຖານະຂອງອາຫານ</th>
                <th>ລາຄາ</th>
                <th>ເວລາ</th>
              </tr>
            </thead>
            <tbody>
              {dataModale?.map((item, index) =>
                <tr key={1 + index}>
                  <td>{index + 1}</td>
                  <td>{item?.name ?? "-"}</td>
                  <td>{item?.quantity}</td>
                  <td style={{
                    color:
                      item?.status === "WAITING" ? "#2d00a8" :
                        item?.status === "DOING" ? "#c48a02" :
                          item?.status === "SERVED" ? "green" :
                            item?.status === "CART" ? "#00496e" :
                              item?.status === "FEEDBACK" ? "#00496e" : "#bd0d00"
                  }}>{orderStatus(item?.status)}</td>
                  <td>{new Intl.NumberFormat('ja-JP', { currency: 'JPY' }).format(item?.price)}</td>
                  <td>{moment(item?.createdAt).format("DD/MM/YYYY HH:mm")}</td>
                </tr>
              )}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            ປິດ
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
